"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { Recommendation } from "@/lib/types"

interface EditRecommendationDialogProps {
  recommendation: Recommendation
  onClose: () => void
  onSave: () => void
}

export function EditRecommendationDialog({ recommendation, onClose, onSave }: EditRecommendationDialogProps) {
  const [formData, setFormData] = useState({
    title: recommendation.title,
    description: recommendation.description,
    severity_level: recommendation.severity_level,
    score_range_min: recommendation.score_range_min?.toString() || "",
    score_range_max: recommendation.score_range_max?.toString() || "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSave = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClient()

      const updateData = {
        title: formData.title,
        description: formData.description,
        severity_level: formData.severity_level,
        score_range_min: formData.score_range_min ? Number.parseInt(formData.score_range_min) : null,
        score_range_max: formData.score_range_max ? Number.parseInt(formData.score_range_max) : null,
        updated_at: new Date().toISOString(),
      }

      const { error } = await supabase.from("recommendations").update(updateData).eq("id", recommendation.id)

      if (error) throw error

      onSave()
    } catch (error) {
      console.error("Error updating recommendation:", error)
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="bg-[#221F3C] border-[#B2A4D4]/20 text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-[#F7E5C8]">Edit Recommendation</DialogTitle>
          <DialogDescription className="text-[#B2A4D4]">
            Update the recommendation details for {recommendation.assessment_type} assessment
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-white">
              Title
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="bg-[#221F3C] border-[#B2A4D4] text-white"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-white">
              Description
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="bg-[#221F3C] border-[#B2A4D4] text-white min-h-24"
            />
          </div>

          {/* Severity Level */}
          <div className="space-y-2">
            <Label className="text-white">Severity Level</Label>
            <Select
              value={formData.severity_level}
              onValueChange={(value) => setFormData({ ...formData, severity_level: value as any })}
            >
              <SelectTrigger className="bg-[#221F3C] border-[#B2A4D4] text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#221F3C] border-[#B2A4D4]">
                <SelectItem value="low" className="text-white hover:bg-[#B2A4D4]/20">
                  Low
                </SelectItem>
                <SelectItem value="moderate" className="text-white hover:bg-[#B2A4D4]/20">
                  Moderate
                </SelectItem>
                <SelectItem value="high" className="text-white hover:bg-[#B2A4D4]/20">
                  High
                </SelectItem>
                <SelectItem value="severe" className="text-white hover:bg-[#B2A4D4]/20">
                  Severe
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Score Range */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="score_min" className="text-white">
                Min Score
              </Label>
              <Input
                id="score_min"
                type="number"
                value={formData.score_range_min}
                onChange={(e) => setFormData({ ...formData, score_range_min: e.target.value })}
                className="bg-[#221F3C] border-[#B2A4D4] text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="score_max" className="text-white">
                Max Score
              </Label>
              <Input
                id="score_max"
                type="number"
                value={formData.score_range_max}
                onChange={(e) => setFormData({ ...formData, score_range_max: e.target.value })}
                className="bg-[#221F3C] border-[#B2A4D4] text-white"
              />
            </div>
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}
        </div>

        <DialogFooter>
          <Button
            onClick={onClose}
            variant="outline"
            className="border-[#B2A4D4] text-[#B2A4D4] hover:bg-[#B2A4D4]/10 bg-transparent"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isLoading}
            className="bg-[#F7E5C8] hover:bg-[#F7E5C8]/80 text-[#221F3C] font-semibold"
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
