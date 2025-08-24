"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { EditRecommendationDialog } from "@/components/edit-recommendation-dialog"
import type { Recommendation } from "@/lib/types"

interface RecommendationsListProps {
  recommendations: Recommendation[]
}

export function RecommendationsList({ recommendations }: RecommendationsListProps) {
  const [editingRecommendation, setEditingRecommendation] = useState<Recommendation | null>(null)

  const groupedRecommendations = recommendations.reduce(
    (acc, rec) => {
      if (!acc[rec.assessment_type]) {
        acc[rec.assessment_type] = []
      }
      acc[rec.assessment_type].push(rec)
      return acc
    },
    {} as Record<string, Recommendation[]>,
  )

  const getAssessmentTitle = (type: string): string => {
    switch (type) {
      case "epworth":
        return "Epworth Sleepiness Scale"
      case "stop_bang":
        return "STOP-BANG Assessment"
      case "psqi":
        return "Pittsburgh Sleep Quality Index"
      case "combined":
        return "Combined Assessment"
      default:
        return type
    }
  }

  const getSeverityColor = (severity: string): string => {
    switch (severity) {
      case "low":
        return "bg-green-500"
      case "moderate":
        return "bg-yellow-500"
      case "high":
        return "bg-orange-500"
      case "severe":
        return "bg-red-500"
      default:
        return "bg-[#B2A4D4]"
    }
  }

  return (
    <div className="space-y-8">
      {Object.entries(groupedRecommendations).map(([assessmentType, recs]) => (
        <Card key={assessmentType} className="bg-[#DEDFFA]/10 border-[#B2A4D4]/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-[#F7E5C8]">{getAssessmentTitle(assessmentType)}</CardTitle>
            <CardDescription className="text-[#B2A4D4]">
              {recs.length} recommendation{recs.length !== 1 ? "s" : ""} configured
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recs.map((recommendation) => (
                <div
                  key={recommendation.id}
                  className="flex items-start justify-between p-4 bg-[#221F3C]/50 rounded-lg"
                >
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <h4 className="font-semibold text-white">{recommendation.title}</h4>
                      <Badge className={`${getSeverityColor(recommendation.severity_level)} text-white`}>
                        {recommendation.severity_level}
                      </Badge>
                      {recommendation.score_range_min !== null && recommendation.score_range_max !== null && (
                        <Badge variant="outline" className="border-[#B2A4D4] text-[#B2A4D4]">
                          Score: {recommendation.score_range_min}-{recommendation.score_range_max}
                        </Badge>
                      )}
                    </div>
                    <p className="text-[#B2A4D4] text-sm leading-relaxed">{recommendation.description}</p>
                  </div>
                  <Button
                    onClick={() => setEditingRecommendation(recommendation)}
                    variant="outline"
                    size="sm"
                    className="border-[#B2A4D4] text-[#B2A4D4] hover:bg-[#B2A4D4]/10 bg-transparent ml-4"
                  >
                    Edit
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Edit Dialog */}
      {editingRecommendation && (
        <EditRecommendationDialog
          recommendation={editingRecommendation}
          onClose={() => setEditingRecommendation(null)}
          onSave={() => {
            setEditingRecommendation(null)
            // Refresh the page to show updated data
            window.location.reload()
          }}
        />
      )}
    </div>
  )
}
