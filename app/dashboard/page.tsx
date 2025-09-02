import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { TrendChart } from "@/components/trend-chart"
import { ShareButton } from "@/components/share-button"
import { Clock, TrendingUp, RefreshCw } from "lucide-react"

interface QuizSubmission {
  id: string
  quiz_id: string
  score: number
  interpretation: string
  created_at: string
  quiz: {
    slug: string
    title: string
    max_score: number
  }
}

function getScoreBadgeVariant(score: number, maxScore: number, quizSlug: string) {
  const percentage = (score / maxScore) * 100

  if (quizSlug === "epworth") {
    if (score <= 10) return { variant: "default" as const, label: "Normal" }
    if (score <= 12) return { variant: "secondary" as const, label: "Mild" }
    if (score <= 15) return { variant: "destructive" as const, label: "Moderate" }
    return { variant: "destructive" as const, label: "Severe" }
  }

  if (quizSlug === "stopbang") {
    if (score <= 2) return { variant: "default" as const, label: "Low Risk" }
    if (score <= 4) return { variant: "secondary" as const, label: "Intermediate" }
    return { variant: "destructive" as const, label: "High Risk" }
  }

  if (quizSlug === "psqi") {
    if (score <= 5) return { variant: "default" as const, label: "Good Quality" }
    return { variant: "destructive" as const, label: "Poor Quality" }
  }

  return { variant: "outline" as const, label: "Completed" }
}

export default async function DashboardPage() {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return (
      <div className="min-h-screen bg-[#221F3C] text-white flex items-center justify-center p-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-4xl md:text-6xl font-bold text-[#B2A4D4] mb-4">
              Your Sleep Dashboard
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Sign up and log in to access your personalized sleep assessment dashboard
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-[#B2A4D4]/20 to-[#8B7BB8]/20 border-[#B2A4D4]/30 backdrop-blur-sm rounded-2xl p-8 mb-8">
            <h2 className="text-2xl font-semibold text-[#B2A4D4] mb-4">
              What You'll Get:
            </h2>
            <div className="text-left space-y-3 text-gray-300">
              <div className="flex items-start space-x-3">
                <span className="text-[#B2A4D4] text-xl">📊</span>
                <span>Visual charts showing your sleep health trends over time</span>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-[#B2A4D4] text-xl">🎯</span>
                <span>Latest scores from all your sleep assessments</span>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-[#B2A4D4] text-xl">📈</span>
                <span>Track improvements and identify patterns</span>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-[#B2A4D4] text-xl">🔄</span>
                <span>Quick retake options for regular monitoring</span>
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

  // Get latest scores using RPC
  const { data: latestScores, error: latestError } = await supabase.rpc("get_my_latest_scores").select(`
      id,
      quiz_id,
      score,
      interpretation,
      created_at,
      quizzes!inner(slug, title, max_score)
    `)

  // Get historical data for trends
  const { data: historicalData, error: historyError } = await supabase.rpc("get_my_quiz_history").select(`
      id,
      quiz_id,
      score,
      created_at,
      quizzes!inner(slug, title, max_score)
    `)

  if (latestError || historyError) {
    console.error("Dashboard error:", latestError || historyError)
  }

  const quizTypes = [
    { slug: "epworth", title: "Epworth Sleepiness Scale", description: "Daytime sleepiness assessment" },
    { slug: "stopbang", title: "STOP-BANG", description: "Sleep apnea risk screening" },
    { slug: "psqi", title: "Pittsburgh Sleep Quality Index", description: "Overall sleep quality evaluation" },
  ]

  return (
    <div className="min-h-screen bg-[#221F3C] text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Sleep Assessment Dashboard</h1>
          <p className="text-[#B2A4D4]">Track your sleep health progress over time</p>
        </div>

        {/* Latest Scores Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {quizTypes.map((quiz) => {
            const latestScore = latestScores?.find((score: any) => score.quizzes.slug === quiz.slug)
            const badge = latestScore
              ? getScoreBadgeVariant(latestScore.score, latestScore.quizzes.max_score, quiz.slug)
              : null

            return (
              <Card key={quiz.slug} className="bg-[#6C68A0] border-[#B2A4D4]/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-white">{quiz.title}</CardTitle>
                  <CardDescription className="text-[#DEDFFA]">{quiz.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  {latestScore ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-2xl font-bold text-white">
                            {latestScore.score}/{latestScore.quizzes.max_score}
                          </div>
                          <Badge variant={badge!.variant} className="mt-1">
                            {badge!.label}
                          </Badge>
                        </div>
                        <div className="text-right text-sm text-[#DEDFFA]">
                          <Clock className="w-4 h-4 inline mr-1" />
                          {new Date(latestScore.created_at).toLocaleDateString()}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button asChild size="sm" variant="outline" className="flex-1 bg-transparent">
                          <Link href={`/quiz/${quiz.slug}`}>
                            <RefreshCw className="w-4 h-4 mr-1" />
                            Retake
                          </Link>
                        </Button>
                        <ShareButton resultId={latestScore.id} size="sm" />
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-[#DEDFFA] mb-4">No assessment completed yet</p>
                      <Button asChild size="sm" className="bg-[#F7E5C8] text-[#221F3C] hover:bg-[#F7E5C8]/90">
                        <Link href={`/quiz/${quiz.slug}`}>Take Assessment</Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Historical Trends */}
        {historicalData && historicalData.length > 0 && (
          <Card className="bg-[#6C68A0] border-[#B2A4D4]/20 mb-8">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Score Trends
              </CardTitle>
              <CardDescription className="text-[#DEDFFA]">Your assessment scores over time</CardDescription>
            </CardHeader>
            <CardContent>
              <TrendChart data={historicalData} />
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <Card className="bg-[#6C68A0] border-[#B2A4D4]/20">
          <CardHeader>
            <CardTitle className="text-white">Quick Actions</CardTitle>
            <CardDescription className="text-[#DEDFFA]">Manage your sleep assessments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <Button asChild variant="outline" className="h-auto p-4 bg-transparent">
                <Link href="/results" className="flex flex-col items-center text-center">
                  <Clock className="w-6 h-6 mb-2" />
                  <span className="font-medium">View All Results</span>
                  <span className="text-sm text-muted-foreground">See your complete assessment history</span>
                </Link>
              </Button>

              <Button asChild variant="outline" className="h-auto p-4 bg-transparent">
                <Link href="/" className="flex flex-col items-center text-center">
                  <RefreshCw className="w-6 h-6 mb-2" />
                  <span className="font-medium">Take New Assessment</span>
                  <span className="text-sm text-muted-foreground">Start a fresh sleep evaluation</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
