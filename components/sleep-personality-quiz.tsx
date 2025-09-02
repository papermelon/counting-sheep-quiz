"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { sleepPersonalityQuiz, calculateSleepPersonalityScore } from "@/lib/sleep-personality-data"
import { sleepPersonalityRecommendations } from "@/lib/sleep-personality-recommendations"
import { trackQuizStart, trackQuizComplete, trackQuizShare } from "@/lib/analytics"
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
    const newAnswers = { ...quizState.answers, [sleepPersonalityQuiz.questions[quizState.currentQuestion - 1].id]: answer }
    
    if (quizState.currentQuestion === sleepPersonalityQuiz.questions.length) {
      // Quiz complete, calculate result
      const result = calculateSleepPersonalityScore(newAnswers)
      trackQuizComplete('sleep-personality', result.normalizedScore)
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
    return sleepPersonalityRecommendations[categoryId as keyof typeof sleepPersonalityRecommendations]
  }

  if (quizState.isComplete && quizState.result) {
    const recommendations = getRecommendations(quizState.result.category.id)
    
    return (
      <div className="space-y-6">
        {/* Main Result Card */}
        <Card className="bg-gradient-to-br from-[#B2A4D4]/20 to-[#8B7BB8]/20 border-[#B2A4D4]/30 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="text-6xl mb-4">{quizState.result.category.emoji}</div>
            <CardTitle className="text-3xl text-[#241E40] mb-2">
              {quizState.result.category.name}
            </CardTitle>
            <CardDescription className="text-xl text-[#241E40]">
              Score: {quizState.result.normalizedScore}/100
            </CardDescription>
            <p className="text-[#241E40] text-lg font-medium mt-2">
              {recommendations.tagline}
            </p>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-[#241E40] text-base leading-relaxed mb-6">
              {recommendations.summary}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={() => {
                  trackQuizShare('sleep-personality', quizState.result.category.name)
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

        {/* Quick Action Card */}
        <Card className="bg-gradient-to-br from-[#F7E5C8]/20 to-[#E8D5B5]/20 border-[#F7E5C8]/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-[#241E40] text-xl">Your Sleep Card</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-[#241E40] mb-2">Best Window</h4>
                <p className="text-[#241E40] text-sm">{recommendations.share_card.best_window}</p>
              </div>
              <div>
                <h4 className="font-semibold text-[#241E40] mb-2">Power-Ups</h4>
                <p className="text-[#241E40] text-sm">{recommendations.share_card.power_ups}</p>
              </div>
              <div>
                <h4 className="font-semibold text-[#241E40] mb-2">Watch-Outs</h4>
                <p className="text-[#241E40] text-sm">{recommendations.share_card.watch_outs}</p>
              </div>
              <div>
                <h4 className="font-semibold text-[#241E40] mb-2">Do This Tonight</h4>
                <p className="text-[#241E40] text-sm">{recommendations.share_card.do_tonight}</p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-[#241E40] mb-2">Morning Boost</h4>
              <p className="text-[#241E40] text-sm">{recommendations.share_card.morning_boost}</p>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Recommendations */}
        <Card className="bg-gradient-to-br from-[#B2A4D4]/10 to-[#8B7BB8]/10 border-[#B2A4D4]/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-[#241E40] text-xl">Your Personalized Sleep Plan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Ideal Schedule */}
            <div>
              <h4 className="font-semibold text-[#241E40] mb-3">Ideal Schedule</h4>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-[#241E40]">Sleep Window:</span>
                  <p className="text-[#241E40]">Sleep {recommendations.ideal.sleep_window.start} • Wake {recommendations.ideal.sleep_window.end}</p>
                </div>
                <div>
                  <span className="font-medium text-[#241E40]">Wind Down:</span>
                  <p className="text-[#241E40]">{recommendations.ideal.wind_down}</p>
                </div>
                <div>
                  <span className="font-medium text-[#241E40]">Focus Peaks:</span>
                  <p className="text-[#241E40]">{recommendations.ideal.focus_peaks.join(", ")}</p>
                </div>
                <div>
                  <span className="font-medium text-[#241E40]">Exercise Time:</span>
                  <p className="text-[#241E40]">{recommendations.ideal.exercise_time}</p>
                </div>
                <div>
                  <span className="font-medium text-[#241E40]">Caffeine Cutoff:</span>
                  <p className="text-[#241E40]">{recommendations.ideal.caffeine_cutoff}</p>
                </div>
                <div>
                  <span className="font-medium text-[#241E40]">Light Anchor:</span>
                  <p className="text-[#241E40]">{recommendations.ideal.light_anchor}</p>
                </div>
              </div>
            </div>

            {/* Evening Rituals */}
            <div>
              <h4 className="font-semibold text-[#241E40] mb-3">Evening Rituals</h4>
              <ul className="space-y-2">
                {recommendations.rituals.map((ritual, index) => (
                  <li key={index} className="text-[#241E40] text-sm flex items-start">
                    <span className="text-[#B2A4D4] mr-2">•</span>
                    {ritual}
                  </li>
                ))}
              </ul>
            </div>

            {/* Watch Outs */}
            <div>
              <h4 className="font-semibold text-[#241E40] mb-3">Watch Outs</h4>
              <ul className="space-y-2">
                {recommendations.watch_outs.map((watchOut, index) => (
                  <li key={index} className="text-[#241E40] text-sm flex items-start">
                    <span className="text-[#B2A4D4] mr-2">⚠️</span>
                    {watchOut}
                  </li>
                ))}
              </ul>
            </div>

            {/* Micro Habits */}
            <div>
              <h4 className="font-semibold text-[#241E40] mb-3">Micro Habits</h4>
              <ul className="space-y-2">
                {recommendations.micro_habits.map((habit, index) => (
                  <li key={index} className="text-[#241E40] text-sm flex items-start">
                    <span className="text-[#B2A4D4] mr-2">✨</span>
                    {habit}
                  </li>
                ))}
              </ul>
            </div>

            {/* Weekly Challenge */}
            <div className="bg-gradient-to-r from-[#B2A4D4]/20 to-[#8B7BB8]/20 rounded-lg p-4">
              <h4 className="font-semibold text-[#241E40] mb-2">Weekly Challenge</h4>
              <p className="text-[#241E40] text-sm">{recommendations.weekly_challenge}</p>
            </div>
          </CardContent>
        </Card>
      </div>
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
            onClick={() => {
              trackQuizStart('sleep-personality')
              setQuizState({ currentQuestion: 1, answers: {}, isComplete: false })
            }}
            size="lg"
            className="bg-[#F7E5C8] hover:bg-[#F7E5C8]/80 text-[#221F3C] font-semibold px-8 py-4 text-lg transition-all duration-300 hover:scale-105 hover:shadow-lg"
          >
            Start Quiz
          </Button>
        </CardContent>
      </Card>
    )
  }

  const currentQuestion = sleepPersonalityQuiz.questions[quizState.currentQuestion - 1]
  const progress = (quizState.currentQuestion / sleepPersonalityQuiz.questions.length) * 100

  return (
    <Card className="bg-gradient-to-br from-[#B2A4D4]/20 to-[#8B7BB8]/20 border-[#B2A4D4]/30 backdrop-blur-sm">
      <CardHeader className="text-center">
        <div className="mb-4">
          <div className="text-sm text-[#B2A4D4] mb-2">
            Question {quizState.currentQuestion} of {sleepPersonalityQuiz.questions.length}
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
