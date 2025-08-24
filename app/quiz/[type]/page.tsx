"use client"

import { useEffect, useState, use as reactUse } from "react"
import { useRouter } from "next/navigation"
import { QuizEngineComponent } from "@/components/quiz-engine-component"
import { ReferralInput } from "@/components/referral-input"
import { getQuizQuestions } from "@/lib/quiz-data"
import { getReferralFromUrl } from "@/lib/referrals"
import type { AssessmentType } from "@/lib/types"
import type { QuizEngineConfig } from "@/lib/quiz-engine"

interface QuizPageProps {
  params: Promise<{
    type: string
  }>
}

export default function QuizPage({ params }: QuizPageProps) {
  const router = useRouter()
  const { type } = reactUse(params)
  const assessmentType = type as AssessmentType
  const [quizConfig, setQuizConfig] = useState<QuizEngineConfig | null>(null)
  const [referralCode, setReferralCode] = useState<string | null>(null)
  const [showReferralInput, setShowReferralInput] = useState(false)

  // Initialize quiz configuration
  useEffect(() => {
    // Validate assessment type
    if (!["epworth", "stop_bang", "psqi"].includes(assessmentType)) {
      router.push("/")
      return
    }

    // Check for referral code from URL
    const urlReferral = getReferralFromUrl()
    if (urlReferral) {
      setReferralCode(urlReferral)
    }

    // Get quiz questions and create config
    const questions = getQuizQuestions(assessmentType)
    if (questions.length === 0) {
      router.push("/")
      return
    }

    const getAssessmentTitle = (type: AssessmentType): string => {
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

    // Convert questions to quiz engine format
    const engineQuestions = questions.map((q) => ({
      id: q.id,
      prompt: q.question,
      question_type: q.type as "radio" | "select" | "checkbox",
      options: q.options.map((opt) => ({
        value: opt.value,
        label: opt.label,
        score: opt.score,
      })),
      required: q.required || true,
    }))

    setQuizConfig({
      slug: assessmentType,
      title: getAssessmentTitle(assessmentType),
      questions: engineQuestions,
      persistProgress: true,
    })
  }, [assessmentType, router])

  const handleComplete = (result: any) => {
    router.push(`/results/${result.id}`)
  }

  const handleBack = () => {
    router.push("/")
  }

  const handleReferralSubmit = (code: string) => {
    setReferralCode(code)
    setShowReferralInput(false)
  }

  if (!quizConfig) {
    return (
      <div className="min-h-screen bg-[#221F3C] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F7E5C8] mx-auto mb-4"></div>
          <p className="text-[#B2A4D4]">Loading assessment...</p>
        </div>
      </div>
    )
  }

  // Show referral input before quiz starts
  if (showReferralInput && !referralCode) {
    return (
      <div className="min-h-screen bg-[#221F3C] text-white">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-semibold text-[#F7E5C8]">{quizConfig.title}</h1>
              <button onClick={handleBack} className="text-[#B2A4D4] hover:text-[#F7E5C8] transition-colors">
                ← Back
              </button>
            </div>
          </div>

          <div className="bg-[#DEDFFA]/10 rounded-lg p-6 backdrop-blur-sm border border-[#B2A4D4]/20">
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-xl font-semibold text-[#F7E5C8] mb-2">Ready to start?</h2>
                <p className="text-[#B2A4D4]">
                  This assessment will take about 5-10 minutes to complete. Your progress will be automatically saved.
                </p>
              </div>

              <ReferralInput onReferralChange={handleReferralSubmit} />

              <div className="text-center">
                <button
                  onClick={() => setShowReferralInput(false)}
                  className="text-[#B2A4D4] hover:text-[#F7E5C8] transition-colors text-sm"
                >
                  Skip and continue →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <QuizEngineComponent
      config={{
        ...quizConfig,
        onProgress: (progress) => {
          // Set referral code in engine if we have one
          if (referralCode && quizConfig) {
            // This would be handled by the engine internally
          }
        },
      }}
      onComplete={handleComplete}
      onBack={handleBack}
    />
  )
}
