// Core types for the Counting Sheep app

export type AssessmentType = "epworth" | "stop_bang" | "psqi"

export interface QuizQuestion {
  id: string
  question: string
  type: "radio" | "checkbox" | "select"
  options: QuizOption[]
  required?: boolean
}

export interface QuizOption {
  value: string | number
  label: string
  score?: number
}

export interface AssessmentResult {
  id: string
  user_id?: string
  session_id: string
  assessment_type: AssessmentType
  score: number
  interpretation: string
  answers: Record<string, any>
  created_at: string
  referral_code?: string
}

export interface Recommendation {
  id: string
  assessment_type: AssessmentType | "combined"
  score_range_min?: number
  score_range_max?: number
  title: string
  description: string
  severity_level: "low" | "moderate" | "high" | "severe"
}

export interface QuizProgress {
  currentQuestion: number
  totalQuestions: number
  answers: Record<string, any>
  startTime: Date
}
