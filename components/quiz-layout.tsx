"use client"

import type { ReactNode } from "react"
import { Progress } from "@/components/ui/progress"

interface QuizLayoutProps {
  children: ReactNode
  title: string
  currentStep: number
  totalSteps: number
  onBack?: () => void
}

export function QuizLayout({ children, title, currentStep, totalSteps, onBack }: QuizLayoutProps) {
  const progressPercentage = (currentStep / totalSteps) * 100

  return (
    <div className="min-h-screen bg-[#221F3C] text-white">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-semibold text-[#F7E5C8]">{title}</h1>
            {onBack && (
              <button onClick={onBack} className="text-[#B2A4D4] hover:text-[#F7E5C8] transition-colors">
                ← Back
              </button>
            )}
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-[#B2A4D4]">
              <span>
                Question {currentStep} of {totalSteps}
              </span>
              <span>{Math.round(progressPercentage)}% Complete</span>
            </div>
            <Progress value={progressPercentage} className="h-2 bg-[#B2A4D4]/20" />
          </div>
        </div>

        {/* Content */}
        <div className="bg-[#DEDFFA]/10 rounded-lg p-6 backdrop-blur-sm border border-[#B2A4D4]/20">{children}</div>
      </div>
    </div>
  )
}
