// Google Analytics 4 Configuration
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_TRACKING_ID!, {
      page_location: url,
    })
  }
}

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({ action, category, label, value }: {
  action: string
  category: string
  label?: string
  value?: number
}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  }
}

// Custom events for your sleep quiz
export const trackQuizStart = (quizType: string) => {
  event({
    action: 'quiz_start',
    category: 'engagement',
    label: quizType,
  })
}

export const trackQuizComplete = (quizType: string, score?: number) => {
  event({
    action: 'quiz_complete',
    category: 'engagement',
    label: quizType,
    value: score,
  })
}

export const trackQuizShare = (quizType: string, result?: string) => {
  event({
    action: 'quiz_share',
    category: 'engagement',
    label: `${quizType}_${result}`,
  })
}

export const trackButtonClick = (buttonName: string, location: string) => {
  event({
    action: 'button_click',
    category: 'engagement',
    label: `${buttonName}_${location}`,
  })
}

export const trackPageView = (pageName: string) => {
  event({
    action: 'page_view',
    category: 'navigation',
    label: pageName,
  })
}

export const trackUserSignup = (method: string) => {
  event({
    action: 'sign_up',
    category: 'user',
    label: method,
  })
}

export const trackUserLogin = (method: string) => {
  event({
    action: 'login',
    category: 'user',
    label: method,
  })
}

// Declare gtag for TypeScript
declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event',
      targetId: string,
      config?: Record<string, any>
    ) => void
  }
}
