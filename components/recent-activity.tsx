import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { AssessmentResult } from "@/lib/types"

interface RecentActivityProps {
  recentResults: AssessmentResult[]
}

export function RecentActivity({ recentResults }: RecentActivityProps) {
  const getAssessmentTitle = (type: string): string => {
    switch (type) {
      case "epworth":
        return "Epworth"
      case "stop_bang":
        return "STOP-BANG"
      case "psqi":
        return "PSQI"
      default:
        return type
    }
  }

  const getScoreBadge = (type: string, score: number) => {
    let severity = "low"
    let color = "bg-green-500"

    switch (type) {
      case "epworth":
        if (score > 15) {
          severity = "severe"
          color = "bg-red-500"
        } else if (score > 9) {
          severity = "high"
          color = "bg-orange-500"
        } else if (score > 7) {
          severity = "moderate"
          color = "bg-yellow-500"
        }
        break
      case "stop_bang":
        if (score > 4) {
          severity = "high"
          color = "bg-red-500"
        } else if (score > 2) {
          severity = "moderate"
          color = "bg-yellow-500"
        }
        break
      case "psqi":
        if (score > 10) {
          severity = "high"
          color = "bg-red-500"
        } else if (score > 5) {
          severity = "moderate"
          color = "bg-yellow-500"
        }
        break
    }

    return <Badge className={`${color} text-white`}>{score}</Badge>
  }

  return (
    <Card className="bg-[#DEDFFA]/10 border-[#B2A4D4]/20 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-[#F7E5C8]">Recent Activity</CardTitle>
        <CardDescription className="text-[#B2A4D4]">Latest assessment completions</CardDescription>
      </CardHeader>
      <CardContent>
        {recentResults.length === 0 ? (
          <p className="text-[#B2A4D4] text-center py-8">No recent activity</p>
        ) : (
          <div className="space-y-4">
            {recentResults.map((result) => (
              <div key={result.id} className="flex items-center justify-between p-4 bg-[#221F3C]/50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div>
                    <p className="font-medium text-white">{getAssessmentTitle(result.assessment_type)}</p>
                    <p className="text-sm text-[#B2A4D4]">
                      {result.user_id ? "Registered User" : "Anonymous"} •{" "}
                      {new Date(result.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  {result.referral_code && (
                    <Badge variant="outline" className="border-[#F7E5C8] text-[#F7E5C8]">
                      Ref: {result.referral_code}
                    </Badge>
                  )}
                  {getScoreBadge(result.assessment_type, result.score)}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
