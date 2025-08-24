import { createClient } from "@/lib/supabase/client"
import { getDefaultRecommendations } from "./recommendations"
import { getOrCreateSessionId } from "@/lib/session"

export interface QuizEngineQuestion {
  id: string
  prompt: string
  question_type: "radio" | "select" | "checkbox"
  options: Array<{
    value: string | number
    label: string
    score?: number
  }>
  required: boolean
}

export interface QuizEngineProgress {
  quizId: string
  currentQuestion: number
  totalQuestions: number
  answers: Record<string, any>
  referralCode?: string
  startedAt: Date
  updatedAt: Date
}

export interface QuizEngineConfig {
  slug: string
  title: string
  description?: string
  questions: QuizEngineQuestion[]
  onProgress?: (progress: QuizEngineProgress) => void
  onComplete?: (result: any) => void
  persistProgress?: boolean
}

export class QuizEngine {
  private config: QuizEngineConfig
  private progress: QuizEngineProgress
  private supabase = createClient()
  private sessionId = getOrCreateSessionId()
  private quizData: { id: string; slug: string; title: string; max_score: number } | null = null

  constructor(config: QuizEngineConfig) {
    this.config = config
    this.progress = {
      quizId: config.slug,
      currentQuestion: 0,
      totalQuestions: config.questions.length,
      answers: {},
      startedAt: new Date(),
      updatedAt: new Date(),
    }
  }

  // Initialize quiz and load saved progress
  async initialize(): Promise<QuizEngineProgress> {
    await this.loadQuizData()
    if (this.config.persistProgress) {
      await this.loadProgress()
    }
    return this.progress
  }

  private async loadQuizData(): Promise<void> {
    try {
      // Some seeds use 'stopbang' (no underscore). Normalize to DB slug.
      const dbSlug = this.config.slug === "stop_bang" ? "stopbang" : this.config.slug
      const { data, error } = await this.supabase
        .from("quizzes")
        .select("id, slug, title, max_score")
        .eq("slug", dbSlug)
        .single()

      if (error) throw error
      this.quizData = data
    } catch (error) {
      console.error("Error loading quiz data:", error)
      throw new Error(`Quiz "${this.config.slug}" not found in database`)
    }
  }

  // Load progress from localStorage or Supabase
  private async loadProgress(): Promise<void> {
    try {
      // Try to get authenticated user first
      const {
        data: { user },
      } = await this.supabase.auth.getUser()

      if (user) {
        // Load from Supabase for authenticated users
        const { data } = await this.supabase
          .from("quiz_progress")
          .select("*")
          .eq("quiz_id", this.config.slug)
          .eq("user_id", user.id)
          .single()

        if (data) {
          this.progress = {
            quizId: data.quiz_id,
            currentQuestion: data.current_question,
            totalQuestions: this.config.questions.length,
            answers: data.answers || {},
            referralCode: data.referral_code,
            startedAt: new Date(data.started_at),
            updatedAt: new Date(data.updated_at),
          }
        }
      } else {
        // Load from localStorage for anonymous users
        const saved = localStorage.getItem(`quiz_progress_${this.config.slug}`)
        if (saved) {
          const parsed = JSON.parse(saved)
          this.progress = {
            ...this.progress,
            ...parsed,
            startedAt: new Date(parsed.startedAt),
            updatedAt: new Date(parsed.updatedAt),
          }
        }
      }
    } catch (error) {
      console.error("Error loading quiz progress:", error)
    }
  }

  // Save progress to localStorage or Supabase
  private async saveProgress(): Promise<void> {
    if (!this.config.persistProgress) return

    this.progress.updatedAt = new Date()

    try {
      const {
        data: { user },
      } = await this.supabase.auth.getUser()

      if (user) {
        // Save to Supabase for authenticated users
        await this.supabase.from("quiz_progress").upsert({
          quiz_id: this.progress.quizId,
          user_id: user.id,
          current_question: this.progress.currentQuestion,
          answers: this.progress.answers,
          referral_code: this.progress.referralCode,
          updated_at: this.progress.updatedAt.toISOString(),
        })
      } else {
        // Save to localStorage for anonymous users
        localStorage.setItem(
          `quiz_progress_${this.config.slug}`,
          JSON.stringify({
            ...this.progress,
            startedAt: this.progress.startedAt.toISOString(),
            updatedAt: this.progress.updatedAt.toISOString(),
          }),
        )
      }
    } catch (error) {
      console.error("Error saving quiz progress:", error)
    }
  }

  // Get current question
  getCurrentQuestion(): QuizEngineQuestion | null {
    return this.config.questions[this.progress.currentQuestion] || null
  }

  // Get current progress
  getProgress(): QuizEngineProgress {
    return { ...this.progress }
  }

  // Set answer for current question
  async setAnswer(questionId: string, value: any): Promise<void> {
    this.progress.answers[questionId] = value
    await this.saveProgress()

    if (this.config.onProgress) {
      this.config.onProgress(this.getProgress())
    }
  }

  // Move to next question
  async nextQuestion(): Promise<boolean> {
    if (this.progress.currentQuestion < this.progress.totalQuestions - 1) {
      this.progress.currentQuestion++
      await this.saveProgress()

      if (this.config.onProgress) {
        this.config.onProgress(this.getProgress())
      }
      return true
    }
    return false
  }

  // Move to previous question
  async previousQuestion(): Promise<boolean> {
    if (this.progress.currentQuestion > 0) {
      this.progress.currentQuestion--
      await this.saveProgress()

      if (this.config.onProgress) {
        this.config.onProgress(this.getProgress())
      }
      return true
    }
    return false
  }

  // Check if current question is answered
  isCurrentQuestionAnswered(): boolean {
    const currentQuestion = this.getCurrentQuestion()
    if (!currentQuestion) return false

    const answer = this.progress.answers[currentQuestion.id]
    return answer !== undefined && answer !== null && answer !== ""
  }

  // Calculate total score
  calculateScore(): number {
    let totalScore = 0

    this.config.questions.forEach((question) => {
      const answer = this.progress.answers[question.id]
      if (answer !== undefined) {
        // Coerce both stored answer and option values to strings for comparison
        const normalizedAnswer = String(answer)
        const option = question.options.find((opt) => String(opt.value) === normalizedAnswer)
        if (option && option.score !== undefined) {
          totalScore += option.score
        }
      }
    })

    return totalScore
  }

  // Submit completed quiz
  async submit(): Promise<any> {
    try {
      if (!this.quizData) {
        throw new Error("Quiz data not loaded")
      }

      const score = this.calculateScore()
      const {
        data: { user },
      } = await this.supabase.auth.getUser()

      const { data: recommendations } = await this.supabase
        .from("recommendation_rules")
        .select("*")
        .eq("quiz_slug", this.config.slug)
        .lte("min_score", score)
        .gte("max_score", score)
        .maybeSingle()

      // Fallback to sensible defaults if no rule row is present
      const fallback = getDefaultRecommendations(this.config.slug, score)
      const interpretation = recommendations?.tips?.[0] || fallback?.tips?.[0] || "Assessment completed successfully."

      const { data: result, error } = await this.supabase
        .from("quiz_submissions")
        .insert({
          quiz_id: this.quizData.id, // Use UUID instead of slug
          user_id: user?.id || null,
          session_id: user ? null : this.sessionId,
          score,
          interpretation,
          answers: this.progress.answers,
          referral_code: this.progress.referralCode,
          shared_token: crypto.randomUUID(),
        })
        .select()
        .single()

      if (error) throw error

      // Clear progress after successful submission
      await this.clearProgress()

      if (this.config.onComplete) {
        this.config.onComplete(result)
      }

      return result
    } catch (error) {
      console.error("Error submitting quiz:", error)
      throw error
    }
  }

  // Clear saved progress
  async clearProgress(): Promise<void> {
    try {
      const {
        data: { user },
      } = await this.supabase.auth.getUser()

      if (user) {
        await this.supabase.from("quiz_progress").delete().eq("quiz_id", this.progress.quizId).eq("user_id", user.id)
      } else {
        localStorage.removeItem(`quiz_progress_${this.config.slug}`)
      }
    } catch (error) {
      console.error("Error clearing quiz progress:", error)
    }
  }

  // Set referral code
  setReferralCode(code: string): void {
    this.progress.referralCode = code
  }
}
