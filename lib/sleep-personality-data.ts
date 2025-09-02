export interface SleepPersonalityQuiz {
  id: string
  title: string
  description: string
  likert: {
    min: number
    max: number
    labels: Record<string, string>
  }
  questions: Array<{
    id: number
    text: string
    polarity: 'morning' | 'evening'
    weight: number
    tags?: string[]
  }>
  categories: Array<{
    id: string
    name: string
    emoji: string
    range: {
      min: number
      max: number
    }
  }>
}

export const sleepPersonalityQuiz: SleepPersonalityQuiz = {
  "id": "counting-sheep-chronotype-v1",
  "title": "What Kind of Sleeper Are You?",
  "description": "20 quick statements. Rate how much you agree. We'll map you to a chronotype.",
  "likert": {
    "min": 1,
    "max": 5,
    "labels": {
      "1": "Strongly Disagree",
      "2": "Disagree",
      "3": "Neutral",
      "4": "Agree",
      "5": "Strongly Agree"
    }
  },
  "questions": [
    {
      "id": 1,
      "text": "Even if I don't have to, I'm the kind who wakes up at sunrise.",
      "polarity": "morning",
      "weight": 1
    },
    {
      "id": 2,
      "text": "If I need to sleep early, I'll still be tossing around forever.",
      "polarity": "evening",
      "weight": 1
    },
    {
      "id": 3,
      "text": "Mornings are when my brain is sharpest and brightest.",
      "polarity": "morning",
      "weight": 1
    },
    {
      "id": 4,
      "text": "I'd call myself more of an "early bird" than a "night owl."",
      "polarity": "morning",
      "weight": 1
    },
    {
      "id": 5,
      "text": "Waking up leaves me refreshed and ready to go.",
      "polarity": "morning",
      "weight": 1
    },
    {
      "id": 6,
      "text": "My weekend sleep schedule looks nothing like my weekday one.",
      "polarity": "evening",
      "weight": 0.5
    },
    {
      "id": 7,
      "text": "Sometimes I skip plans or events because I just can't stay up late.",
      "polarity": "morning",
      "weight": 1
    },
    {
      "id": 8,
      "text": "I feel a burst of energy in the evening, not the morning.",
      "polarity": "evening",
      "weight": 1
    },
    {
      "id": 9,
      "text": "Staying awake past 1 am is pretty normal for me.",
      "polarity": "evening",
      "weight": 1
    },
    {
      "id": 10,
      "text": "My eyelids always get heavy in the afternoon.",
      "polarity": "evening",
      "weight": 1
    },
    {
      "id": 11,
      "text": "If I had to do my best work, I'd pick the afternoon or evening.",
      "polarity": "evening",
      "weight": 1
    },
    {
      "id": 12,
      "text": "I keep hitting snooze (even when I know I shouldn't).",
      "polarity": "evening",
      "weight": 1
    },
    {
      "id": 13,
      "text": "I fall asleep in random places — bus rides, couches, anywhere.",
      "polarity": "evening",
      "weight": 1
    },
    {
      "id": 14,
      "text": "People around me say I'm definitely a "night person."",
      "polarity": "evening",
      "weight": 1
    },
    {
      "id": 15,
      "text": "If my alarm says 6 or 7 am, I'll be grumpy about it.",
      "polarity": "evening",
      "weight": 1
    },
    {
      "id": 16,
      "text": "Being late to school/work because I overslept has happened before.",
      "polarity": "evening",
      "weight": 1
    },
    {
      "id": 17,
      "text": "As soon as I wake up, I feel fully alert (no warm-up needed).",
      "polarity": "morning",
      "weight": 1
    },
    {
      "id": 18,
      "text": "If nobody stopped me, I'd probably sleep till noon.",
      "polarity": "evening",
      "weight": 1
    },
    {
      "id": 19,
      "text": "I feel at my best in the late afternoon or evening.",
      "polarity": "evening",
      "weight": 1
    },
    {
      "id": 20,
      "text": "Falling asleep at 1 am (or later) is super common for me.",
      "polarity": "evening",
      "weight": 1
    }
  ],
  "categories": [
    { "id": "night-owl", "name": "Night Owl", "emoji": "🌙", "range": { "min": 0, "max": 24 } },
    { "id": "late-hummingbird", "name": "Late Hummingbird", "emoji": "🌌", "range": { "min": 25, "max": 43 } },
    { "id": "balanced-hummingbird", "name": "Balanced Hummingbird", "emoji": "🐦", "range": { "min": 44, "max": 68 } },
    { "id": "early-hummingbird", "name": "Early Hummingbird", "emoji": "☀️", "range": { "min": 69, "max": 86 } },
    { "id": "morning-lark", "name": "Morning Lark", "emoji": "🌄", "range": { "min": 87, "max": 100 } }
  ]
}

export function calculateSleepPersonalityScore(answers: Record<number, number>): {
  rawScore: number
  normalizedScore: number
  category: typeof sleepPersonalityQuiz.categories[0]
} {
  let rawScore = 0
  
  // Calculate raw score
  sleepPersonalityQuiz.questions.forEach(question => {
    const answer = answers[question.id]
    if (answer) {
      let score = answer
      
      // Reverse score for evening questions
      if (question.polarity === 'evening') {
        score = 6 - answer
      }
      
      // Apply weight
      score *= question.weight
      rawScore += score
    }
  })
  
  // Calculate min and max possible scores
  const minScore = sleepPersonalityQuiz.questions.reduce((min, q) => {
    const qMin = q.polarity === 'evening' ? 1 : 1
    return min + (qMin * q.weight)
  }, 0)
  
  const maxScore = sleepPersonalityQuiz.questions.reduce((max, q) => {
    const qMax = q.polarity === 'evening' ? 5 : 5
    return max + (qMax * q.weight)
  }, 0)
  
  // Normalize to 0-100
  const normalizedScore = Math.round(((rawScore - minScore) / (maxScore - minScore)) * 100)
  
  // Find matching category
  const category = sleepPersonalityQuiz.categories.find(cat => 
    normalizedScore >= cat.range.min && normalizedScore <= cat.range.max
  ) || sleepPersonalityQuiz.categories[2] // Default to balanced
  
  return {
    rawScore,
    normalizedScore,
    category
  }
}
