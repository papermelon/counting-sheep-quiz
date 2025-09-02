import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ResultsChart } from "@/components/results-chart"
import { CombinedInsights } from "@/components/combined-insights"

export default async function ResultsPage() {
  const supabase = await createClient()

  // Get user if authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Check if user is authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-[#221F3C] text-white flex items-center justify-center p-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-4xl md:text-6xl font-bold text-[#B2A4D4] mb-4">
              Track Your Sleep Journey
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Sign up and log in to view your past quiz results and track changes over time
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-[#B2A4D4]/20 to-[#8B7BB8]/20 border-[#B2A4D4]/30 backdrop-blur-sm rounded-2xl p-8 mb-8">
            <h2 className="text-2xl font-semibold text-[#B2A4D4] mb-4">
              Why Create an Account?
            </h2>
            <div className="text-left space-y-3 text-gray-300">
              <div className="flex items-start space-x-3">
                <span className="text-[#B2A4D4] text-xl">📊</span>
                <span>Track your sleep patterns and improvements over time</span>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-[#B2A4D4] text-xl">🔒</span>
                <span>Keep your results private and secure</span>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-[#B2A4D4] text-xl">📈</span>
                <span>Compare results across different assessments</span>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-[#B2A4D4] text-xl">💡</span>
                <span>Get personalized recommendations based on your history</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <Button
              asChild
              size="lg"
              className="bg-[#B2A4D4] text-[#2F2B4F] hover:bg-[#B2A4D4]/90 px-8 py-4 text-lg transition-all duration-300 hover:scale-105"
            >
              <Link href="/auth/signup">Create Account</Link>
            </Button>
            <div>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-[#B2A4D4] text-[#B2A4D4] hover:bg-[#B2A4D4]/10 bg-transparent px-8 py-4 text-lg transition-all duration-300 hover:scale-105"
              >
                <Link href="/auth/login">Already have an account? Log in</Link>
              </Button>
            </div>
            <div className="mt-6">
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white"
              >
                <Link href="/">← Back to Home</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Fetch all results for this authenticated user only
  const { data: results, error } = await supabase
    .from("quiz_submissions")
    .select(
      `
      *,
      quizzes (
        slug,
        title,
        max_score
      )
    `,
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching results:", error)
  }

  const assessmentResults = (results || []).map((r: any) => {
    const rawSlug = r.quizzes?.slug || r.quiz_slug || "epworth"
    const normalizedSlug = rawSlug === "stopbang" ? "stop_bang" : rawSlug
    return {
      id: r.id,
      assessment_type: normalizedSlug,
      created_at: r.created_at,
      score: r.score,
      interpretation: r.interpretation,
    }
  })

  const getAssessmentTitle = (type: string): string => {
    switch (type) {
      case "epworth":
        return "Epworth Sleepiness Scale"
      case "stop_bang":
        return "STOP-BANG Assessment"
      case "psqi":
        return "Pittsburgh Sleep Quality Index"
      default:
        return "Sleep Assessment"
    }
  }

  const getScoreColor = (type: string, score: number): string => {
    switch (type) {
      case "epworth":
        if (score <= 7) return "bg-green-500"
        if (score <= 9) return "bg-yellow-500"
        if (score <= 15) return "bg-orange-500"
        return "bg-red-500"
      case "stop_bang":
        if (score <= 2) return "bg-green-500"
        if (score <= 4) return "bg-yellow-500"
        return "bg-red-500"
      case "psqi":
        if (score <= 5) return "bg-green-500"
        if (score <= 10) return "bg-yellow-500"
        return "bg-red-500"
      default:
        return "bg-[#B2A4D4]"
    }
  }

  const getSeverityLabel = (type: string, score: number): string => {
    switch (type) {
      case "epworth":
        if (score <= 7) return "Normal"
        if (score <= 9) return "Mild"
        if (score <= 15) return "Moderate"
        return "Severe"
      case "stop_bang":
        if (score <= 2) return "Low Risk"
        if (score <= 4) return "Intermediate Risk"
        return "High Risk"
      case "psqi":
        if (score <= 5) return "Good"
        if (score <= 10) return "Moderate"
        return "Poor"
      default:
        return "Unknown"
    }
  }

  // Group results by assessment type for analytics
  const resultsByType = assessmentResults.reduce(
    (acc, result) => {
      if (!acc[result.assessment_type]) {
        acc[result.assessment_type] = []
      }
      acc[result.assessment_type].push(result)
      return acc
    },
    {} as Record<string, any[]>,
  )

  return (
    <div className="min-h-screen bg-[#221F3C] text-white">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold mb-4 text-[#F7E5C8]">Sleep Assessment Dashboard</h1>
            <p className="text-[#B2A4D4] text-lg">
              {user ? "Your complete sleep health overview" : "Your anonymous assessment results"}
            </p>
          </div>
          <Button asChild className="bg-[#B2A4D4] hover:bg-[#B2A4D4]/80 text-[#221F3C] font-semibold">
            <Link href="/">Take New Assessment</Link>
          </Button>
        </div>

        {assessmentResults.length === 0 ? (
          /* Empty State */
          <Card className="bg-[#DEDFFA]/10 border-[#B2A4D4]/20 backdrop-blur-sm text-center py-12">
            <CardContent>
              <div className="space-y-4">
                <div className="w-24 h-24 bg-[#B2A4D4]/20 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-4xl">😴</span>
                </div>
                <h3 className="text-2xl font-semibold text-[#F7E5C8]">No Assessments Yet</h3>
                <p className="text-[#B2A4D4] max-w-md mx-auto">
                  Start your sleep health journey by taking one of our scientifically-backed assessments.
                </p>
                <Button asChild className="bg-[#F7E5C8] hover:bg-[#F7E5C8]/80 text-[#221F3C] font-semibold">
                  <Link href="/">Get Started</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {/* Combined Insights */}
            <CombinedInsights results={assessmentResults} />

            {/* Charts Section */}
            {Object.keys(resultsByType).length > 0 && (
              <Card className="bg-[#DEDFFA]/10 border-[#B2A4D4]/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-[#F7E5C8]">Assessment Trends</CardTitle>
                  <CardDescription className="text-[#B2A4D4]">
                    Track your sleep health progress over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResultsChart resultsByType={resultsByType} />
                </CardContent>
              </Card>
            )}

            {/* Individual Results */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-[#F7E5C8]">Assessment History</h2>
              <div className="grid gap-6">
                {assessmentResults.map((result) => (
                  <Card
                    key={result.id}
                    className="bg-[#DEDFFA]/10 border-[#B2A4D4]/20 backdrop-blur-sm hover:bg-[#DEDFFA]/20 transition-colors"
                  >
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-[#F7E5C8] text-xl">
                            {getAssessmentTitle(result.assessment_type)}
                          </CardTitle>
                          <CardDescription className="text-[#B2A4D4]">
                            Completed on{" "}
                            {new Date(result.created_at).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </CardDescription>
                        </div>
                        <Badge className={`${getScoreColor(result.assessment_type, result.score)} text-white`}>
                          {getSeverityLabel(result.assessment_type, result.score)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center">
                        <div className="space-y-2">
                          <div className="text-2xl font-bold text-white">
                            Score: {result.score}/
                            {result.assessment_type === "epworth"
                              ? "24"
                              : result.assessment_type === "stop_bang"
                                ? "8"
                                : "21"}
                          </div>
                          <p className="text-[#B2A4D4] text-sm max-w-md">{result.interpretation}</p>
                        </div>
                        <Button
                          asChild
                          variant="outline"
                          className="border-[#B2A4D4] text-[#B2A4D4] hover:bg-[#B2A4D4]/10 bg-transparent"
                        >
                          <Link href={`/results/${result.id}`}>View Details</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
