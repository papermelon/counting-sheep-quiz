"use client"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { QuizQuestion } from "@/lib/types"

interface QuizQuestionProps {
  question: QuizQuestion
  value?: any
  onChange: (questionId: string, value: any) => void
  onNext: () => void
  onPrevious?: () => void
  isFirst: boolean
  isLast: boolean
  canProceed: boolean
}

export function QuizQuestionComponent({
  question,
  value,
  onChange,
  onNext,
  onPrevious,
  isFirst,
  isLast,
  canProceed,
}: QuizQuestionProps) {
  const handleValueChange = (newValue: any) => {
    onChange(question.id, newValue)
  }

  return (
    <div className="space-y-8">
      {/* Question */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-[#F7E5C8] leading-relaxed">{question.question}</h2>

        {/* Answer Options */}
        <div className="space-y-4">
          {question.type === "radio" && (
            <RadioGroup value={value?.toString()} onValueChange={handleValueChange} className="space-y-3">
              {question.options.map((option) => (
                <div key={option.value.toString()} className="flex items-center space-x-3">
                  <RadioGroupItem
                    value={option.value.toString()}
                    id={`${question.id}-${option.value}`}
                    className="border-[#B2A4D4] text-[#B2A4D4]"
                  />
                  <Label
                    htmlFor={`${question.id}-${option.value}`}
                    className="text-white cursor-pointer flex-1 leading-relaxed"
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          )}

          {question.type === "select" && (
            <Select value={value?.toString()} onValueChange={handleValueChange}>
              <SelectTrigger className="w-full bg-[#221F3C] border-[#B2A4D4] text-white">
                <SelectValue placeholder="Select an option..." />
              </SelectTrigger>
              <SelectContent className="bg-[#221F3C] border-[#B2A4D4]">
                {question.options.map((option) => (
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
          onClick={onPrevious}
          disabled={isFirst}
          variant="outline"
          className="border-[#B2A4D4] text-[#B2A4D4] hover:bg-[#B2A4D4]/10 bg-transparent disabled:opacity-50"
        >
          Previous
        </Button>

        <Button
          onClick={onNext}
          disabled={!canProceed}
          className="bg-[#F7E5C8] hover:bg-[#F7E5C8]/80 text-[#221F3C] font-semibold disabled:opacity-50"
        >
          {isLast ? "Complete Assessment" : "Next"}
        </Button>
      </div>
    </div>
  )
}
