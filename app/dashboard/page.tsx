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
    redirect("/auth/login")
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
