// Quiz questions and scoring logic for all three assessments

import type { QuizQuestion, AssessmentType } from "./types"

export const EPWORTH_QUESTIONS: QuizQuestion[] = [
  {
    id: "sitting_reading",
    question: "How likely are you to doze off or fall asleep while sitting and reading?",
    type: "radio",
    options: [
      { value: 0, label: "Would never doze", score: 0 },
      { value: 1, label: "Slight chance of dozing", score: 1 },
      { value: 2, label: "Moderate chance of dozing", score: 2 },
      { value: 3, label: "High chance of dozing", score: 3 },
    ],
    required: true,
  },
  {
    id: "watching_tv",
    question: "How likely are you to doze off or fall asleep while watching TV?",
    type: "radio",
    options: [
      { value: 0, label: "Would never doze", score: 0 },
      { value: 1, label: "Slight chance of dozing", score: 1 },
      { value: 2, label: "Moderate chance of dozing", score: 2 },
      { value: 3, label: "High chance of dozing", score: 3 },
    ],
    required: true,
  },
  {
    id: "sitting_inactive",
    question: "How likely are you to doze off while sitting inactive in a public place (theater, meeting)?",
    type: "radio",
    options: [
      { value: 0, label: "Would never doze", score: 0 },
      { value: 1, label: "Slight chance of dozing", score: 1 },
      { value: 2, label: "Moderate chance of dozing", score: 2 },
      { value: 3, label: "High chance of dozing", score: 3 },
    ],
    required: true,
  },
  {
    id: "passenger_car",
    question: "How likely are you to doze off as a passenger in a car for an hour without a break?",
    type: "radio",
    options: [
      { value: 0, label: "Would never doze", score: 0 },
      { value: 1, label: "Slight chance of dozing", score: 1 },
      { value: 2, label: "Moderate chance of dozing", score: 2 },
      { value: 3, label: "High chance of dozing", score: 3 },
    ],
    required: true,
  },
  {
    id: "lying_down",
    question: "How likely are you to doze off when lying down to rest in the afternoon?",
    type: "radio",
    options: [
      { value: 0, label: "Would never doze", score: 0 },
      { value: 1, label: "Slight chance of dozing", score: 1 },
      { value: 2, label: "Moderate chance of dozing", score: 2 },
      { value: 3, label: "High chance of dozing", score: 3 },
    ],
    required: true,
  },
  {
    id: "sitting_talking",
    question: "How likely are you to doze off while sitting and talking to someone?",
    type: "radio",
    options: [
      { value: 0, label: "Would never doze", score: 0 },
      { value: 1, label: "Slight chance of dozing", score: 1 },
      { value: 2, label: "Moderate chance of dozing", score: 2 },
      { value: 3, label: "High chance of dozing", score: 3 },
    ],
    required: true,
  },
  {
    id: "after_lunch",
    question: "How likely are you to doze off while sitting quietly after lunch without alcohol?",
    type: "radio",
    options: [
      { value: 0, label: "Would never doze", score: 0 },
      { value: 1, label: "Slight chance of dozing", score: 1 },
      { value: 2, label: "Moderate chance of dozing", score: 2 },
      { value: 3, label: "High chance of dozing", score: 3 },
    ],
    required: true,
  },
  {
    id: "in_car_traffic",
    question: "How likely are you to doze off in a car while stopped for a few minutes in traffic?",
    type: "radio",
    options: [
      { value: 0, label: "Would never doze", score: 0 },
      { value: 1, label: "Slight chance of dozing", score: 1 },
      { value: 2, label: "Moderate chance of dozing", score: 2 },
      { value: 3, label: "High chance of dozing", score: 3 },
    ],
    required: true,
  },
]

export const STOP_BANG_QUESTIONS: QuizQuestion[] = [
  {
    id: "snoring",
    question: "Do you snore loudly (louder than talking or loud enough to be heard through closed doors)?",
    type: "radio",
    options: [
      { value: "yes", label: "Yes", score: 1 },
      { value: "no", label: "No", score: 0 },
    ],
    required: true,
  },
  {
    id: "tired",
    question: "Do you often feel tired, fatigued, or sleepy during daytime?",
    type: "radio",
    options: [
      { value: "yes", label: "Yes", score: 1 },
      { value: "no", label: "No", score: 0 },
    ],
    required: true,
  },
  {
    id: "observed",
    question: "Has anyone observed you stop breathing during your sleep?",
    type: "radio",
    options: [
      { value: "yes", label: "Yes", score: 1 },
      { value: "no", label: "No", score: 0 },
    ],
    required: true,
  },
  {
    id: "pressure",
    question: "Do you have or are you being treated for high blood pressure?",
    type: "radio",
    options: [
      { value: "yes", label: "Yes", score: 1 },
      { value: "no", label: "No", score: 0 },
    ],
    required: true,
  },
  {
    id: "bmi",
    question: "Is your BMI more than 35 kg/m²?",
    type: "radio",
    options: [
      { value: "yes", label: "Yes", score: 1 },
      { value: "no", label: "No", score: 0 },
    ],
    required: true,
  },
  {
    id: "age",
    question: "Are you older than 50 years?",
    type: "radio",
    options: [
      { value: "yes", label: "Yes", score: 1 },
      { value: "no", label: "No", score: 0 },
    ],
    required: true,
  },
  {
    id: "neck",
    question: "Is your neck circumference greater than 40 cm (15.75 inches)?",
    type: "radio",
    options: [
      { value: "yes", label: "Yes", score: 1 },
      { value: "no", label: "No", score: 0 },
    ],
    required: true,
  },
  {
    id: "gender",
    question: "Are you male?",
    type: "radio",
    options: [
      { value: "yes", label: "Yes", score: 1 },
      { value: "no", label: "No", score: 0 },
    ],
    required: true,
  },
]

export const PSQI_QUESTIONS: QuizQuestion[] = [
  {
    id: "bedtime",
    question: "During the past month, what time have you usually gone to bed at night?",
    type: "select",
    options: [
      { value: "before_9pm", label: "Before 9:00 PM" },
      { value: "9pm_10pm", label: "9:00 PM - 10:00 PM" },
      { value: "10pm_11pm", label: "10:00 PM - 11:00 PM" },
      { value: "11pm_12am", label: "11:00 PM - 12:00 AM" },
      { value: "after_12am", label: "After 12:00 AM" },
    ],
    required: true,
  },
  {
    id: "sleep_latency",
    question: "During the past month, how long (in minutes) has it usually taken you to fall asleep each night?",
    type: "radio",
    options: [
      { value: 0, label: "≤15 minutes", score: 0 },
      { value: 1, label: "16-30 minutes", score: 1 },
      { value: 2, label: "31-60 minutes", score: 2 },
      { value: 3, label: ">60 minutes", score: 3 },
    ],
    required: true,
  },
  {
    id: "wake_time",
    question: "During the past month, what time have you usually gotten up in the morning?",
    type: "select",
    options: [
      { value: "before_5am", label: "Before 5:00 AM" },
      { value: "5am_6am", label: "5:00 AM - 6:00 AM" },
      { value: "6am_7am", label: "6:00 AM - 7:00 AM" },
      { value: "7am_8am", label: "7:00 AM - 8:00 AM" },
      { value: "after_8am", label: "After 8:00 AM" },
    ],
    required: true,
  },
  {
    id: "sleep_duration",
    question: "During the past month, how many hours of actual sleep did you get at night?",
    type: "radio",
    options: [
      { value: 0, label: ">7 hours", score: 0 },
      { value: 1, label: "6-7 hours", score: 1 },
      { value: 2, label: "5-6 hours", score: 2 },
      { value: 3, label: "<5 hours", score: 3 },
    ],
    required: true,
  },
  {
    id: "cannot_sleep_30min",
    question:
      "During the past month, how often have you had trouble sleeping because you cannot get to sleep within 30 minutes?",
    type: "radio",
    options: [
      { value: 0, label: "Not during the past month", score: 0 },
      { value: 1, label: "Less than once a week", score: 1 },
      { value: 2, label: "Once or twice a week", score: 2 },
      { value: 3, label: "Three or more times a week", score: 3 },
    ],
    required: true,
  },
  {
    id: "wake_middle_night",
    question:
      "During the past month, how often have you had trouble sleeping because you wake up in the middle of the night or early morning?",
    type: "radio",
    options: [
      { value: 0, label: "Not during the past month", score: 0 },
      { value: 1, label: "Less than once a week", score: 1 },
      { value: 2, label: "Once or twice a week", score: 2 },
      { value: 3, label: "Three or more times a week", score: 3 },
    ],
    required: true,
  },
  {
    id: "bathroom",
    question:
      "During the past month, how often have you had trouble sleeping because you have to get up to use the bathroom?",
    type: "radio",
    options: [
      { value: 0, label: "Not during the past month", score: 0 },
      { value: 1, label: "Less than once a week", score: 1 },
      { value: 2, label: "Once or twice a week", score: 2 },
      { value: 3, label: "Three or more times a week", score: 3 },
    ],
    required: true,
  },
  {
    id: "breathe_comfortably",
    question: "During the past month, how often have you had trouble sleeping because you cannot breathe comfortably?",
    type: "radio",
    options: [
      { value: 0, label: "Not during the past month", score: 0 },
      { value: 1, label: "Less than once a week", score: 1 },
      { value: 2, label: "Once or twice a week", score: 2 },
      { value: 3, label: "Three or more times a week", score: 3 },
    ],
    required: true,
  },
  {
    id: "cough_snore",
    question: "During the past month, how often have you had trouble sleeping because you cough or snore loudly?",
    type: "radio",
    options: [
      { value: 0, label: "Not during the past month", score: 0 },
      { value: 1, label: "Less than once a week", score: 1 },
      { value: 2, label: "Once or twice a week", score: 2 },
      { value: 3, label: "Three or more times a week", score: 3 },
    ],
    required: true,
  },
  {
    id: "too_cold",
    question: "During the past month, how often have you had trouble sleeping because you feel too cold?",
    type: "radio",
    options: [
      { value: 0, label: "Not during the past month", score: 0 },
      { value: 1, label: "Less than once a week", score: 1 },
      { value: 2, label: "Once or twice a week", score: 2 },
      { value: 3, label: "Three or more times a week", score: 3 },
    ],
    required: true,
  },
  {
    id: "too_hot",
    question: "During the past month, how often have you had trouble sleeping because you feel too hot?",
    type: "radio",
    options: [
      { value: 0, label: "Not during the past month", score: 0 },
      { value: 1, label: "Less than once a week", score: 1 },
      { value: 2, label: "Once or twice a week", score: 2 },
      { value: 3, label: "Three or more times a week", score: 3 },
    ],
    required: true,
  },
  {
    id: "bad_dreams",
    question: "During the past month, how often have you had trouble sleeping because you had bad dreams?",
    type: "radio",
    options: [
      { value: 0, label: "Not during the past month", score: 0 },
      { value: 1, label: "Less than once a week", score: 1 },
      { value: 2, label: "Once or twice a week", score: 2 },
      { value: 3, label: "Three or more times a week", score: 3 },
    ],
    required: true,
  },
  {
    id: "pain",
    question: "During the past month, how often have you had trouble sleeping because you have pain?",
    type: "radio",
    options: [
      { value: 0, label: "Not during the past month", score: 0 },
      { value: 1, label: "Less than once a week", score: 1 },
      { value: 2, label: "Once or twice a week", score: 2 },
      { value: 3, label: "Three or more times a week", score: 3 },
    ],
    required: true,
  },
  {
    id: "sleep_quality",
    question: "During the past month, how would you rate your sleep quality overall?",
    type: "radio",
    options: [
      { value: 0, label: "Very good", score: 0 },
      { value: 1, label: "Fairly good", score: 1 },
      { value: 2, label: "Fairly bad", score: 2 },
      { value: 3, label: "Very bad", score: 3 },
    ],
    required: true,
  },
  {
    id: "sleep_medication",
    question:
      "During the past month, how often have you taken medicine to help you sleep (prescribed or over the counter)?",
    type: "radio",
    options: [
      { value: 0, label: "Not during the past month", score: 0 },
      { value: 1, label: "Less than once a week", score: 1 },
      { value: 2, label: "Once or twice a week", score: 2 },
      { value: 3, label: "Three or more times a week", score: 3 },
    ],
    required: true,
  },
  {
    id: "stay_awake",
    question:
      "During the past month, how often have you had trouble staying awake while driving, eating meals, or engaging in social activity?",
    type: "radio",
    options: [
      { value: 0, label: "Not during the past month", score: 0 },
      { value: 1, label: "Less than once a week", score: 1 },
      { value: 2, label: "Once or twice a week", score: 2 },
      { value: 3, label: "Three or more times a week", score: 3 },
    ],
    required: true,
  },
  {
    id: "enthusiasm",
    question:
      "During the past month, how much of a problem has it been for you to keep up enthusiasm to get things done?",
    type: "radio",
    options: [
      { value: 0, label: "No problem at all", score: 0 },
      { value: 1, label: "Only a very slight problem", score: 1 },
      { value: 2, label: "Somewhat of a problem", score: 2 },
      { value: 3, label: "A very big problem", score: 3 },
    ],
    required: true,
  },
]

export function getQuizQuestions(assessmentType: AssessmentType): QuizQuestion[] {
  switch (assessmentType) {
    case "epworth":
      return EPWORTH_QUESTIONS
    case "stop_bang":
      return STOP_BANG_QUESTIONS
    case "psqi":
      return PSQI_QUESTIONS
    default:
      return []
  }
}

export function calculateScore(assessmentType: AssessmentType, answers: Record<string, any>): number {
  const questions = getQuizQuestions(assessmentType)
  let totalScore = 0

  questions.forEach((question) => {
    const answer = answers[question.id]
    if (answer !== undefined) {
      const option = question.options.find((opt) => opt.value === answer)
      if (option && option.score !== undefined) {
        totalScore += option.score
      }
    }
  })

  return totalScore
}
