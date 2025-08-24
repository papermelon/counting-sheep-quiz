// Session management for anonymous users
export function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return ""

  const sessionKey = "counting-sheep-session"
  let sessionId = localStorage.getItem(sessionKey)

  if (!sessionId) {
    sessionId = `anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    localStorage.setItem(sessionKey, sessionId)
  }

  return sessionId
}

export function clearSession(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem("counting-sheep-session")
}
