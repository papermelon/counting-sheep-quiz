"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getReferralFromUrl, validateReferralCode, clearReferralCode } from "@/lib/referrals"

interface ReferralInputProps {
  onReferralChange: (code: string | null) => void
}

export function ReferralInput({ onReferralChange }: ReferralInputProps) {
  const [referralCode, setReferralCode] = useState<string>("")
  const [isValid, setIsValid] = useState<boolean | null>(null)
  const [hasUrlReferral, setHasUrlReferral] = useState(false)

  useEffect(() => {
    // Check for referral code from URL or localStorage
    const urlReferral = getReferralFromUrl()
    if (urlReferral) {
      setReferralCode(urlReferral)
      setIsValid(true)
      setHasUrlReferral(true)
      onReferralChange(urlReferral)
    }
  }, [onReferralChange])

  const handleReferralChange = (value: string) => {
    const upperValue = value.toUpperCase()
    setReferralCode(upperValue)

    if (upperValue === "") {
      setIsValid(null)
      onReferralChange(null)
    } else if (validateReferralCode(upperValue)) {
      setIsValid(true)
      onReferralChange(upperValue)
    } else {
      setIsValid(false)
      onReferralChange(null)
    }
  }

  const clearReferral = () => {
    setReferralCode("")
    setIsValid(null)
    setHasUrlReferral(false)
    clearReferralCode()
    onReferralChange(null)
  }

  return (
    <Card className="bg-[#DEDFFA]/10 border-[#B2A4D4]/20 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-[#F7E5C8] text-lg">Referral Code</CardTitle>
        <CardDescription className="text-[#B2A4D4]">
          {hasUrlReferral
            ? "You were referred by someone! The referral code has been automatically applied."
            : "Have a referral code? Enter it here to show who referred you."}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="referral" className="text-white">
            Referral Code (Optional)
          </Label>
          <div className="flex gap-2">
            <Input
              id="referral"
              value={referralCode}
              onChange={(e) => handleReferralChange(e.target.value)}
              placeholder="Enter 8-character code"
              maxLength={8}
              className={`bg-[#221F3C] border-[#B2A4D4] text-white font-mono text-center ${
                isValid === false ? "border-red-400" : isValid === true ? "border-green-400" : ""
              }`}
              disabled={hasUrlReferral}
            />
            {hasUrlReferral && (
              <Button
                onClick={clearReferral}
                variant="outline"
                size="sm"
                className="border-[#B2A4D4] text-[#B2A4D4] hover:bg-[#B2A4D4]/10 bg-transparent"
              >
                Clear
              </Button>
            )}
          </div>
          {isValid === false && <p className="text-red-400 text-sm">Please enter a valid 8-character referral code</p>}
          {isValid === true && (
            <p className="text-green-400 text-sm">
              {hasUrlReferral ? "Referral code applied from link" : "Valid referral code"}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
