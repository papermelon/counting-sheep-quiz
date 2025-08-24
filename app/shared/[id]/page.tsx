import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

interface SharedResultPageProps {
  params: {
    id: string
  }
  searchParams: {
    ref?: string
  }
}

export default async function SharedResultPage({ params, searchParams }: SharedResultPageProps) {
  const supabase = await createClient()

  // Get the assessment result
  const { data: result, error } = await supabase.from("assessment_results").select("*").eq("id", params.id).single()

  if (error || !result) {
    redirect("/")
  }

  // Get the recommendation
  const { data: recommendation } = await supabase
    .from("recommendations")
    .select("*")
    .eq("assessment_type", result.assessment_type)
    .lte("score_range_min", result.score)
    .gte("score_range_max", result.score)
    .single()

  // Track referral if provided
  const referralCode = searchParams.ref
  if (referralCode) {
    // Update referral usage count
    await supabase
      .from("referral_codes")
      .update({ usage_count: supabase.raw("usage_count + 1") })
      .eq("code", referralCode)
  }

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

  const getScoreColor = (severity: string): string => {
    switch (severity) {
      case "low":
        return "text-green-400"
      case "moderate":
        return "text-yellow-400"
      case "high":
        return "text-orange-400"
      case "severe":
        return "text-red-400"
      default:
        return "text-[#B2A4D4]"
    }
  }

  const getMaxScore = (type: string): number => {
    switch (type) {
      case "epworth":
        return 24
      case "stop_bang":
        return 8
      case "psqi":
        return 21
      default:
        return 100
    }
  }

  const maxScore = getMaxScore(result.assessment_type)
  const scorePercentage = (result.score / maxScore) * 100

  return (
    <div className="min-h-screen bg-[#221F3C] text-white">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <Link href="/" className="text-2xl font-bold text-[#F7E5C8] hover:text-[#F7E5C8]/80 mb-4 inline-block">
            Counting Sheep
          </Link>
          <h1 className="text-4xl font-bold mb-4 text-[#F7E5C8]">Shared Assessment Results</h1>
          <p className="text-[#B2A4D4] text-lg">{getAssessmentTitle(result.assessment_type)}</p>
          {referralCode && <Badge className="mt-4 bg-[#F7E5C8] text-[#221F3C]">Referred by: {referralCode}</Badge>}
        </div>

        {/* Score Card */}
        <Card className="bg-[#DEDFFA]/10 border-[#B2A4D4]/20 backdrop-blur-sm mb-8">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-[#F7E5C8]">
              Score: {result.score}/{maxScore}
            </CardTitle>
            <CardDescription className="text-[#B2A4D4]">
              Completed on {new Date(result.created_at).toLocaleDateString()}
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

            {/* Interpretation */}
            {recommendation && (
              <div className="space-y-4">
                <h3 className={`text-xl font-semibold ${getScoreColor(recommendation.severity_level)}`}>
                  {recommendation.title}
                </h3>
                <p className="text-white leading-relaxed">{recommendation.description}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Call to Action */}
        <Card className="bg-[#F7E5C8]/10 border-[#F7E5C8]/20 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-[#F7E5C8]">Take Your Own Assessment</CardTitle>
            <CardDescription className="text-[#B2A4D4]">
              Discover your sleep health with our scientifically-backed assessments
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-white">
              Ready to learn about your own sleep patterns? Take the same assessment and get personalized insights into
              your sleep health.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="bg-[#F7E5C8] hover:bg-[#F7E5C8]/80 text-[#221F3C] font-semibold">
                <Link href={`/quiz/${result.assessment_type}${referralCode ? `?ref=${referralCode}` : ""}`}>
                  Take {getAssessmentTitle(result.assessment_type)}
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-[#B2A4D4] text-[#B2A4D4] hover:bg-[#B2A4D4]/10 bg-transparent"
              >
                <Link href={`/${referralCode ? `?ref=${referralCode}` : ""}`}>View All Assessments</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
