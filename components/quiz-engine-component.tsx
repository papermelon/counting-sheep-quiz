"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { QuizEngine, type QuizEngineConfig, type QuizEngineProgress, type QuizEngineQuestion } from "@/lib/quiz-engine"

interface QuizEngineComponentProps {
  config: QuizEngineConfig
  onComplete?: (result: any) => void
  onBack?: () => void
}

export function QuizEngineComponent({ config, onComplete, onBack }: QuizEngineComponentProps) {
  const [engine] = useState(
    () =>
      new QuizEngine({
        ...config,
        onComplete: onComplete || config.onComplete,
      }),
  )

  const [progress, setProgress] = useState<QuizEngineProgress | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState<QuizEngineQuestion | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Initialize engine and load progress
  useEffect(() => {
    const initializeEngine = async () => {
      try {
        const initialProgress = await engine.initialize()
        setProgress(initialProgress)
        setCurrentQuestion(engine.getCurrentQuestion())
      } catch (error) {
        console.error("Error initializing quiz engine:", error)
      } finally {
        setIsLoading(false)
      }
    }

    initializeEngine()
  }, [engine])

  // Handle progress updates
  const handleProgressUpdate = (newProgress: QuizEngineProgress) => {
    setProgress(newProgress)
    setCurrentQuestion(engine.getCurrentQuestion())
  }

  // Handle answer change
  const handleAnswerChange = async (value: any) => {
    if (!currentQuestion) return

    try {
      await engine.setAnswer(currentQuestion.id, value)
      handleProgressUpdate(engine.getProgress())
    } catch (error) {
      console.error("Error setting answer:", error)
    }
  }

  // Handle next question
  const handleNext = async () => {
    try {
      // If the current question is unanswered but the previous one had an answer
      // and the option sets are identical in length/order, carry forward the same index.
      if (!engine.isCurrentQuestionAnswered()) {
        const current = engine.getCurrentQuestion()
        if (current && progress) {
          const prevIndex = progress.currentQuestion - 1
          const prevQuestionId = prevIndex >= 0 ? Object.keys(progress.answers)[prevIndex] : undefined
          const prevAnswer = prevQuestionId ? progress.answers[prevQuestionId] : undefined
          const prevQuestion = prevIndex >= 0 ? (engine as any).config.questions[prevIndex] : undefined
          if (
            prevAnswer !== undefined &&
            prevQuestion &&
            Array.isArray(prevQuestion.options) &&
            Array.isArray(current.options) &&
            prevQuestion.options.length === current.options.length
          ) {
            // Carry forward by matching option index
            const prevIdx = prevQuestion.options.findIndex((o: any) => String(o.value) === String(prevAnswer))
            if (prevIdx >= 0 && current.options[prevIdx]) {
              await engine.setAnswer(current.id, current.options[prevIdx].value)
              handleProgressUpdate(engine.getProgress())
            }
          }
        }
      }
      const hasNext = await engine.nextQuestion()
      if (hasNext) {
        handleProgressUpdate(engine.getProgress())
      } else {
        // Submit quiz
        await handleSubmit()
      }
    } catch (error) {
      console.error("Error moving to next question:", error)
    }
  }

  // Handle previous question
  const handlePrevious = async () => {
    try {
      await engine.previousQuestion()
      handleProgressUpdate(engine.getProgress())
    } catch (error) {
      console.error("Error moving to previous question:", error)
    }
  }

  // Handle quiz submission
  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const result = await engine.submit()
      if (onComplete) {
        onComplete(result)
      }
    } catch (error) {
      console.error("Error submitting quiz:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#221F3C] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F7E5C8] mx-auto mb-4"></div>
          <p className="text-[#B2A4D4]">Loading quiz...</p>
        </div>
      </div>
    )
  }

  if (!progress || !currentQuestion) {
    return (
      <div className="min-h-screen bg-[#221F3C] text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#B2A4D4]">Quiz not found</p>
        </div>
      </div>
    )
  }

  const progressPercentage = ((progress.currentQuestion + 1) / progress.totalQuestions) * 100
  const currentAnswer = progress.answers[currentQuestion.id]
  const canProceed = engine.isCurrentQuestionAnswered()
  const isFirst = progress.currentQuestion === 0
  const isLast = progress.currentQuestion === progress.totalQuestions - 1

  return (
    <div className="min-h-screen bg-[#221F3C] text-white">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-semibold text-[#F7E5C8]">{config.title}</h1>
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
                Question {progress.currentQuestion + 1} of {progress.totalQuestions}
              </span>
              <span>{Math.round(progressPercentage)}% Complete</span>
            </div>
            <Progress value={progressPercentage} className="h-2 bg-[#B2A4D4]/20" />
          </div>

          {/* Progress Dots */}
          <div className="flex justify-center mt-4 space-x-2">
            {Array.from({ length: progress.totalQuestions }, (_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  i < progress.currentQuestion
                    ? "bg-[#F7E5C8]" // Completed
                    : i === progress.currentQuestion
                      ? "bg-[#B2A4D4] ring-2 ring-[#B2A4D4]/50" // Current
                      : "bg-[#B2A4D4]/30" // Upcoming
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="bg-[#DEDFFA]/10 rounded-lg p-6 backdrop-blur-sm border border-[#B2A4D4]/20">
          {isSubmitting ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F7E5C8] mx-auto mb-4"></div>
              <p className="text-[#B2A4D4]">Processing your assessment...</p>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Question */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-[#F7E5C8] leading-relaxed">{currentQuestion.prompt}</h2>

                {/* Answer Options */}
                <div className="space-y-4">
                  {currentQuestion.question_type === "radio" && (
                    <RadioGroup
                      value={currentAnswer?.toString()}
                      onValueChange={handleAnswerChange}
                      className="space-y-3"
                    >
                      {currentQuestion.options.map((option) => (
                        <div key={option.value.toString()} className="flex items-center space-x-3">
                          <RadioGroupItem
                            value={option.value.toString()}
                            id={`${currentQuestion.id}-${option.value}`}
                            className="border-[#B2A4D4] text-[#B2A4D4]"
                          />
                          <Label
                            htmlFor={`${currentQuestion.id}-${option.value}`}
                            className="text-white cursor-pointer flex-1 leading-relaxed"
                          >
                            {option.label}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  )}

                  {currentQuestion.question_type === "select" && (
                    <Select value={currentAnswer?.toString()} onValueChange={handleAnswerChange}>
                      <SelectTrigger className="w-full bg-[#221F3C] border-[#B2A4D4] text-white">
                        <SelectValue placeholder="Select an option..." />
                      </SelectTrigger>
                      <SelectContent className="bg-[#221F3C] border-[#B2A4D4]">
                        {currentQuestion.options.map((option) => (
                          <SelectItem
                            key={option.value.toString()}
                            value={option.value.toString()}
                            className="text-white hover:bg-[#B2A4D4]/20"
                          >
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </div>

              {/* Navigation */}
              <div className="flex justify-between pt-6">
                <Button
                  onClick={handlePrevious}
                  disabled={isFirst}
                  variant="outline"
                  className="border-[#B2A4D4] text-[#B2A4D4] hover:bg-[#B2A4D4]/10 bg-transparent disabled:opacity-50"
                >
                  Previous
                </Button>

                <Button
                  onClick={handleNext}
                  disabled={!canProceed}
                  className="bg-[#F7E5C8] hover:bg-[#F7E5C8]/80 text-[#221F3C] font-semibold disabled:opacity-50"
                >
                  {isLast ? "Complete Assessment" : "Next"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
