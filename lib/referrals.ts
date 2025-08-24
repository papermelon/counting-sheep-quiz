// Referral code utilities
export function generateReferralCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let result = ""
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

export function validateReferralCode(code: string): boolean {
  return /^[A-Z0-9]{8}$/.test(code)
}

export function getReferralFromUrl(): string | null {
  if (typeof window === "undefined") return null

  const urlParams = new URLSearchParams(window.location.search)
  const ref = urlParams.get("ref")

  if (ref && validateReferralCode(ref)) {
    // Store in localStorage for later use
    localStorage.setItem("counting-sheep-referral", ref)
    return ref
  }

  // Check if we have a stored referral code
  return localStorage.getItem("counting-sheep-referral")
}

export function clearReferralCode(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem("counting-sheep-referral")
}
