import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, CheckCircle, Info, RefreshCw, Save, Share2 } from "lucide-react"
import Link from "next/link"
import { ShareResult } from "@/components/share-result"
import { getDefaultRecommendations } from "@/lib/recommendations"

interface ResultPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function ResultPage({ params }: ResultPageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: submission, error } = await supabase
    .from("quiz_submissions")
    .select(`
      *,
      quizzes (
        slug,
        title,
        description,
        max_score
      )
    `)
    .eq("id", id)
    .single()

  if (error || !submission) {
    redirect("/")
  }

  const quizSlug = submission.quizzes?.slug || (submission as any).quiz_slug || "epworth"
  const normalizedSlug = quizSlug === "stopbang" ? "stop_bang" : quizSlug

  const { data: recommendation } = await supabase
    .from("recommendation_rules")
    .select("*")
    .eq("quiz_slug", quizSlug)
    .lte("min_score", submission.score)
    .gte("max_score", submission.score)
    .single()

  const fallback = getDefaultRecommendations(normalizedSlug, submission.score)

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const getScoreBand = (quizSlug: string, score: number): { label: string; color: string; icon: any } => {
    switch (quizSlug) {
      case "epworth":
        if (score <= 10) return { label: "Normal", color: "bg-green-500", icon: CheckCircle }
        if (score <= 12) return { label: "Mild Excessive Sleepiness", color: "bg-yellow-500", icon: Info }
        if (score <= 15) return { label: "Moderate Excessive Sleepiness", color: "bg-orange-500", icon: AlertTriangle }
        return { label: "Severe Excessive Sleepiness", color: "bg-red-500", icon: AlertTriangle }

      case "stopbang":
        if (score <= 2) return { label: "Low Risk", color: "bg-green-500", icon: CheckCircle }
        if (score <= 4) return { label: "Intermediate Risk", color: "bg-yellow-500", icon: Info }
        return { label: "High Risk", color: "bg-red-500", icon: AlertTriangle }

      case "psqi":
        if (score <= 5) return { label: "Good Sleep Quality", color: "bg-green-500", icon: CheckCircle }
        return { label: "Poor Sleep Quality", color: "bg-red-500", icon: AlertTriangle }

      default:
        return { label: "Assessment Complete", color: "bg-[#B2A4D4]", icon: Info }
    }
  }

  const scoreBand = getScoreBand(normalizedSlug, submission.score)
  const maxScore = submission.quizzes?.max_score || 100
  const scorePercentage = (submission.score / maxScore) * 100

  return (
    <div className="min-h-screen bg-[#221F3C] text-white">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-[#F7E5C8]">Assessment Results</h1>
          <p className="text-[#B2A4D4] text-lg">{submission.quizzes?.title}</p>
        </div>

        <div className="space-y-8">
          {/* Score Card */}
          <Card className="bg-[#DEDFFA]/10 border-[#B2A4D4]/20 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-[#F7E5C8] mb-4">
                Your Score: {submission.score}/{maxScore}
              </CardTitle>

              <div className="flex justify-center mb-4">
                <Badge
                  className={`${scoreBand.color} text-white px-4 py-2 text-lg font-semibold flex items-center gap-2`}
                >
                  <scoreBand.icon className="w-5 h-5" />
                  {scoreBand.label}
                </Badge>
              </div>

              <CardDescription className="text-[#B2A4D4]">
                Completed on {new Date(submission.created_at).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Score Bar */}
              <div className="mb-6">
                <div className="w-full bg-[#221F3C] rounded-full h-4 mb-2">
                  <div
                    className="bg-gradient-to-r from-[#B2A4D4] to-[#F7E5C8] h-4 rounded-full transition-all duration-500"
                    style={{ width: `${scorePercentage}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm text-[#B2A4D4]">
                  <span>0</span>
                  <span>{maxScore}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {(recommendation?.tips || fallback?.tips) && (
            <Card className="bg-[#DEDFFA]/10 border-[#B2A4D4]/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-[#F7E5C8] flex items-center gap-2">
                  <Info className="w-6 h-6" />
                  {recommendation?.title || fallback?.title || "Recommendations"}
                </CardTitle>
                <CardDescription className="text-[#B2A4D4]">
                  Personalized tips based on your assessment results
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(recommendation?.tips || fallback?.tips || []).map((tip: string, index: number) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-4 bg-[#221F3C]/30 rounded-lg border border-[#B2A4D4]/10"
                    >
                      <div className="w-6 h-6 rounded-full bg-[#B2A4D4] text-[#221F3C] flex items-center justify-center text-sm font-bold mt-0.5">
                        {index + 1}
                      </div>
                      <p className="text-white leading-relaxed">{tip}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="bg-[#F7E5C8]/10 border-[#F7E5C8]/20 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-[#F7E5C8] mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-[#F7E5C8] mb-2">Important Disclaimer</h3>
                  <p className="text-white text-sm leading-relaxed">
                    This assessment is for educational purposes only and should not replace professional medical advice.
                    If you have concerns about your sleep health, please consult with a qualified healthcare provider or
                    sleep specialist for proper evaluation and treatment.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Share Results */}
          <ShareResult result={submission} />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Button
              asChild
              className="bg-[#B2A4D4] hover:bg-[#B2A4D4]/80 text-[#221F3C] font-semibold flex items-center gap-2"
            >
              <Link href={`/quiz/${submission.quiz_slug}`}>
                <RefreshCw className="w-4 h-4" />
                Retake Quiz
              </Link>
            </Button>

            {!user ? (
              <Button
                asChild
                variant="outline"
                className="border-[#F7E5C8] text-[#F7E5C8] hover:bg-[#F7E5C8]/10 bg-transparent flex items-center gap-2"
              >
                <Link href="/auth/login">
                  <Save className="w-4 h-4" />
                  Save Result
                </Link>
              </Button>
            ) : (
              <Button
                asChild
                variant="outline"
                className="border-[#B2A4D4] text-[#B2A4D4] hover:bg-[#B2A4D4]/10 bg-transparent flex items-center gap-2"
              >
                <Link href="/results">
                  <Save className="w-4 h-4" />
                  View All Results
                </Link>
              </Button>
            )}

            <Button
              asChild
              variant="outline"
              className="border-[#DEDFFA] text-[#DEDFFA] hover:bg-[#DEDFFA]/10 bg-transparent flex items-center gap-2"
            >
              <Link href="/">
                <Share2 className="w-4 h-4" />
                Take Another Quiz
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
