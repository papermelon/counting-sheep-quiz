"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { AssessmentResult } from "@/lib/types"

interface CombinedInsightsProps {
  results: AssessmentResult[]
}

export function CombinedInsights({ results }: CombinedInsightsProps) {
  // Get latest result for each assessment type
  const latestResults = results.reduce(
    (acc, result) => {
      if (
        !acc[result.assessment_type] ||
        new Date(result.created_at) > new Date(acc[result.assessment_type].created_at)
      ) {
        acc[result.assessment_type] = result
      }
      return acc
    },
    {} as Record<string, AssessmentResult>,
  )

  const assessmentTypes = Object.keys(latestResults)

  if (assessmentTypes.length === 0) {
    return null
  }

  // Calculate overall sleep health score
  const calculateOverallScore = (): { score: number; level: string; color: string } => {
    let totalConcern = 0
    let maxConcern = 0

    Object.values(latestResults).forEach((result) => {
      switch (result.assessment_type) {
        case "epworth":
          totalConcern += Math.min(result.score / 24, 1) * 100
          maxConcern += 100
          break
        case "stop_bang":
          totalConcern += Math.min(result.score / 8, 1) * 100
          maxConcern += 100
          break
        case "psqi":
          totalConcern += Math.min(result.score / 21, 1) * 100
          maxConcern += 100
          break
      }
    })

    const concernPercentage = maxConcern > 0 ? (totalConcern / maxConcern) * 100 : 0
    const healthScore = Math.round(100 - concernPercentage)

    if (healthScore >= 80) return { score: healthScore, level: "Excellent", color: "bg-green-500" }
    if (healthScore >= 60) return { score: healthScore, level: "Good", color: "bg-yellow-500" }
    if (healthScore >= 40) return { score: healthScore, level: "Fair", color: "bg-orange-500" }
    return { score: healthScore, level: "Needs Attention", color: "bg-red-500" }
  }

  const overallHealth = calculateOverallScore()

  // Generate combined recommendations
  const getCombinedRecommendations = (): string[] => {
    const recommendations: string[] = []
    const hasHighEpworth = latestResults.epworth && latestResults.epworth.score > 10
    const hasHighStopBang = latestResults.stop_bang && latestResults.stop_bang.score > 3
    const hasHighPSQI = latestResults.psqi && latestResults.psqi.score > 10

    if (hasHighEpworth && hasHighStopBang) {
      recommendations.push(
        "Consider consulting a sleep specialist for comprehensive evaluation of potential sleep disorders.",
      )
    }

    if (hasHighPSQI) {
      recommendations.push("Focus on improving sleep hygiene and bedroom environment for better sleep quality.")
    }

    if (hasHighEpworth) {
      recommendations.push("Monitor daytime sleepiness and avoid driving when feeling drowsy.")
    }

    if (hasHighStopBang) {
      recommendations.push("Discuss sleep apnea screening with your healthcare provider.")
    }

    if (recommendations.length === 0) {
      recommendations.push("Continue maintaining good sleep habits and monitor any changes in sleep patterns.")
    }

    return recommendations
  }

  const recommendations = getCombinedRecommendations()

  return (
    <Card className="bg-[#DEDFFA]/10 border-[#B2A4D4]/20 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-[#F7E5C8] text-2xl">Overall Sleep Health</CardTitle>
        <CardDescription className="text-[#B2A4D4]">
          Combined insights from your {assessmentTypes.length} assessment{assessmentTypes.length > 1 ? "s" : ""}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Score */}
        <div className="text-center space-y-4">
          <div className="relative w-32 h-32 mx-auto">
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r="50"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className="text-[#B2A4D4]/20"
              />
              <circle
                cx="60"
                cy="60"
                r="50"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={`${(overallHealth.score / 100) * 314} 314`}
                className="text-[#F7E5C8] transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#F7E5C8]">{overallHealth.score}</div>
                <div className="text-xs text-[#B2A4D4]">out of 100</div>
              </div>
            </div>
          </div>
          <Badge className={`${overallHealth.color} text-white text-lg px-4 py-2`}>{overallHealth.level}</Badge>
        </div>

        {/* Assessment Breakdown */}
        <div className="grid md:grid-cols-3 gap-4">
          {Object.entries(latestResults).map(([type, result]) => {
            const getAssessmentName = (type: string) => {
              switch (type) {
                case "epworth":
                  return "Daytime Sleepiness"
                case "stop_bang":
                  return "Sleep Apnea Risk"
                case "psqi":
                  return "Sleep Quality"
                default:
                  return type
              }
            }

            const getMaxScore = (type: string) => {
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

            const maxScore = getMaxScore(type)
            const percentage = (result.score / maxScore) * 100

            return (
              <div key={type} className="bg-[#221F3C]/50 rounded-lg p-4 space-y-3">
                <h4 className="font-semibold text-[#F7E5C8]">{getAssessmentName(type)}</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#B2A4D4]">Score</span>
                    <span className="text-white">
                      {result.score}/{maxScore}
                    </span>
                  </div>
                  <div className="w-full bg-[#B2A4D4]/20 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-[#B2A4D4] to-[#F7E5C8] h-2 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="text-xs text-[#B2A4D4]">
                    {new Date(result.created_at).toLocaleDateString("en-US", { timeZone: "UTC" })}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Recommendations */}
        <div className="space-y-4">
          <h4 className="font-semibold text-[#F7E5C8]">Personalized Recommendations</h4>
          <ul className="space-y-2">
            {recommendations.map((recommendation, index) => (
              <li key={index} className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-[#F7E5C8] rounded-full mt-2 flex-shrink-0" />
                <span className="text-[#B2A4D4] leading-relaxed">{recommendation}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
