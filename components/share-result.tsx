"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"
import { generateReferralCode } from "@/lib/referrals"
import type { AssessmentResult } from "@/lib/types"

interface ShareResultProps {
  result: AssessmentResult
}

export function ShareResult({ result }: ShareResultProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [shareUrl, setShareUrl] = useState<string>("")
  const [referralCode, setReferralCode] = useState<string>("")
  const [copied, setCopied] = useState(false)

  const generateShareableLink = async () => {
    setIsGenerating(true)
    const supabase = createClient()

    try {
      // Generate referral code
      const newReferralCode = generateReferralCode()

      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser()

      // Save referral code to database
      if (user) {
        const { error } = await supabase.from("referral_codes").insert({
          code: newReferralCode,
          created_by: user.id,
        })

        if (error) throw error
      }

      // Create shareable URL
      const baseUrl = window.location.origin
      const shareableUrl = `${baseUrl}/shared/${result.id}?ref=${newReferralCode}`

      setShareUrl(shareableUrl)
      setReferralCode(newReferralCode)
    } catch (error) {
      console.error("Error generating shareable link:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Failed to copy:", error)
    }
  }

  const shareOnSocial = (platform: string) => {
    const text = `I just completed a sleep assessment on Counting Sheep! Check out the results and take your own assessment.`
    const url = shareUrl

    switch (platform) {
      case "twitter":
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`)
        break
      case "facebook":
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`)
        break
      case "linkedin":
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&title=${encodeURIComponent("Sleep Assessment Results")}&summary=${encodeURIComponent(text)}`,
        )
        break
    }
  }

  const getAssessmentTitle = (type: string): string => {
    switch (type) {
      case "epworth":
        return "Epworth Sleepiness Scale"
      case "stop_bang":
        return "STOP-BANG Assessment"
      case "psqi":
        return "Pittsburgh Sleep Quality Index"
      default:
        return "Sleep Assessment"
    }
  }

  return (
    <Card className="bg-[#DEDFFA]/10 border-[#B2A4D4]/20 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-[#F7E5C8]">Share Your Results</CardTitle>
        <CardDescription className="text-[#B2A4D4]">
          Share your {getAssessmentTitle(result.assessment_type)} results and help others discover their sleep health
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!shareUrl ? (
          <div className="text-center">
            <p className="text-[#B2A4D4] mb-4">
              Generate a shareable link to your results. Others can view your assessment outcome and take their own
              assessment using your referral code.
            </p>
            <Button
              onClick={generateShareableLink}
              disabled={isGenerating}
              className="bg-[#F7E5C8] hover:bg-[#F7E5C8]/80 text-[#221F3C] font-semibold"
            >
              {isGenerating ? "Generating..." : "Generate Shareable Link"}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Shareable URL */}
            <div className="space-y-2">
              <Label className="text-white">Shareable Link</Label>
              <div className="flex gap-2">
                <Input value={shareUrl} readOnly className="bg-[#221F3C] border-[#B2A4D4] text-white text-sm" />
                <Button
                  onClick={copyToClipboard}
                  variant="outline"
                  className="border-[#B2A4D4] text-[#B2A4D4] hover:bg-[#B2A4D4]/10 bg-transparent"
                >
                  {copied ? "Copied!" : "Copy"}
                </Button>
              </div>
            </div>

            {/* Referral Code */}
            <div className="space-y-2">
              <Label className="text-white">Your Referral Code</Label>
              <div className="flex gap-2">
                <Input
                  value={referralCode}
                  readOnly
                  className="bg-[#221F3C] border-[#B2A4D4] text-white font-mono text-lg text-center"
                />
              </div>
              <p className="text-sm text-[#B2A4D4]">
                Others can use this code when taking assessments to show they were referred by you.
              </p>
            </div>

            {/* Social Sharing */}
            <div className="space-y-3">
              <Label className="text-white">Share on Social Media</Label>
              <div className="flex gap-3">
                <Button
                  onClick={() => shareOnSocial("twitter")}
                  size="sm"
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  Twitter
                </Button>
                <Button
                  onClick={() => shareOnSocial("facebook")}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Facebook
                </Button>
                <Button
                  onClick={() => shareOnSocial("linkedin")}
                  size="sm"
                  className="bg-blue-700 hover:bg-blue-800 text-white"
                >
                  LinkedIn
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
