"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { sleepPersonalityQuiz, calculateSleepPersonalityScore } from "@/lib/sleep-personality-data"
import { Share2, RotateCcw, Download } from "lucide-react"

interface QuizState {
  currentQuestion: number
  answers: Record<number, number>
  isComplete: boolean
  result?: {
    rawScore: number
    normalizedScore: number
    category: any
  }
}

export function SleepPersonalityQuiz() {
  const [quizState, setQuizState] = useState<QuizState>(() => {
    // Try to restore quiz state from localStorage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sleep-personality-quiz-state')
      if (saved) {
        try {
          return JSON.parse(saved)
        } catch (e) {
          console.log('Failed to parse saved quiz state')
        }
      }
    }
    
    return {
      currentQuestion: 0,
      answers: {},
      isComplete: false
    }
  })

  // Save quiz state to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('sleep-personality-quiz-state', JSON.stringify(quizState))
    }
  }, [quizState])

  const startQuiz = () => {
    setQuizState({
      currentQuestion: 0,
      answers: {},
      isComplete: false
    })
  }

  const answerQuestion = (answer: number) => {
    const newAnswers = { ...quizState.answers, [sleepPersonalityQuiz.questions[quizState.currentQuestion].id]: answer }
    
    if (quizState.currentQuestion === sleepPersonalityQuiz.questions.length - 1) {
      // Quiz complete, calculate result
      const result = calculateSleepPersonalityScore(newAnswers)
      setQuizState({
        currentQuestion: 0,
        answers: newAnswers,
        isComplete: true,
        result
      })
    } else {
      // Move to next question
      setQuizState({
        ...quizState,
        currentQuestion: quizState.currentQuestion + 1,
        answers: newAnswers
      })
    }
  }

  const getRecommendations = (categoryId: string) => {
    const recommendations = {
      "night-owl": "You're most productive in the evening! Try to schedule important tasks after 6 PM and avoid early morning meetings. Consider using blue light filters in the evening to help with sleep.",
      "late-hummingbird": "You have a slight evening preference. You can adapt to different schedules but perform best in the late afternoon. Try to maintain consistent sleep times.",
      "balanced-hummingbird": "You're flexible with your sleep schedule! You can adapt to both early and late schedules. Focus on getting consistent sleep duration rather than specific times.",
      "early-hummingbird": "You have a slight morning preference. You're most alert in the early hours. Try to schedule important tasks before noon and avoid late-night activities.",
      "morning-lark": "You're a true early bird! You're most productive in the morning hours. Take advantage of your early energy and try to wind down early in the evening."
    }
    return recommendations[categoryId as keyof typeof recommendations] || recommendations.balanced
  }

  if (quizState.isComplete && quizState.result) {
    return (
      <Card className="bg-gradient-to-br from-[#B2A4D4]/20 to-[#8B7BB8]/20 border-[#B2A4D4]/30 backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="text-6xl mb-4">{quizState.result.category.emoji}</div>
          <CardTitle className="text-3xl text-[#241E40] mb-2">
            {quizState.result.category.name}
          </CardTitle>
          <CardDescription className="text-xl text-[#241E40]">
            Score: {quizState.result.normalizedScore}/100
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-[#241E40] text-center text-lg leading-relaxed">
            {getRecommendations(quizState.result.category.id)}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={() => {
                // Share functionality - you can implement this later
                navigator.share?.({
                  title: `I'm a ${quizState.result.category.name}!`,
                  text: `Take the Sleep Personality Quiz and discover your chronotype!`,
                  url: window.location.href
                }).catch(() => {
                  // Fallback: copy to clipboard
                  navigator.clipboard.writeText(`I'm a ${quizState.result.category.name}! Take the Sleep Personality Quiz at ${window.location.href}`)
                })
              }}
              className="bg-[#F7E5C8] hover:bg-[#F7E5C8]/80 text-[#221F3C] font-semibold"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share Result
            </Button>
            <Button
              onClick={startQuiz}
              variant="outline"
              className="border-[#F7E5C8] text-[#F7E5C8] hover:bg-[#F7E5C8]/10"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Retake Quiz
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (quizState.currentQuestion === 0 && Object.keys(quizState.answers).length === 0 && !quizState.isComplete) {
    // Landing page
    return (
      <Card className="bg-[#B2A4D4] border-[#B2A4D4]/30 backdrop-blur-sm hover:bg-[#B2A4D4]/90 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-[#B2A4D4]/20">
        <CardHeader className="text-center">
          <div className="text-6xl mb-4">🐑</div>
          <CardTitle className="text-3xl text-[#2F2B4F] mb-2">
            {sleepPersonalityQuiz.title}
          </CardTitle>
          <CardDescription className="text-xl text-[#241E40]">
            {sleepPersonalityQuiz.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Button
            onClick={() => setQuizState({ currentQuestion: 0, answers: {}, isComplete: false })}
            size="lg"
            className="bg-[#F7E5C8] hover:bg-[#F7E5C8]/80 text-[#221F3C] font-semibold px-8 py-4 text-lg transition-all duration-300 hover:scale-105 hover:shadow-lg"
          >
            Start Quiz
          </Button>
        </CardContent>
      </Card>
    )
  }

  const currentQuestion = sleepPersonalityQuiz.questions[quizState.currentQuestion]
  const progress = ((quizState.currentQuestion + 1) / sleepPersonalityQuiz.questions.length) * 100

  return (
    <Card className="bg-gradient-to-br from-[#B2A4D4]/20 to-[#8B7BB8]/20 border-[#B2A4D4]/30 backdrop-blur-sm">
      <CardHeader className="text-center">
        <div className="mb-4">
          <div className="text-sm text-[#B2A4D4] mb-2">
            Question {quizState.currentQuestion + 1} of {sleepPersonalityQuiz.questions.length}
          </div>
          <Progress value={progress} className="h-2 bg-[#B2A4D4]/20" />
        </div>
        <CardTitle className="text-xl text-[#241E40] leading-relaxed">
          {currentQuestion.text}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-3">
          {Object.entries(sleepPersonalityQuiz.likert.labels).map(([value, label]) => (
            <Button
              key={value}
              onClick={() => answerQuestion(parseInt(value))}
              variant="outline"
              className="border-[#B2A4D4]/30 text-[#B2A4D4] hover:bg-[#B2A4D4]/10 hover:border-[#B2A4D4] transition-all duration-200 h-auto py-4 text-left justify-start"
            >
              <span className="font-semibold mr-3 text-lg">{value}.</span>
              <span className="text-base">{label}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
