"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { getOrCreateSessionId } from "@/lib/session"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface LinkAnonymousResultsProps {
  userId: string
}

export function LinkAnonymousResults({ userId }: LinkAnonymousResultsProps) {
  const [anonymousResults, setAnonymousResults] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLinking, setIsLinking] = useState(false)

  useEffect(() => {
    checkForAnonymousResults()
  }, [])

  const checkForAnonymousResults = async () => {
    const sessionId = getOrCreateSessionId()
    const supabase = createClient()

    try {
      const { data, error } = await supabase
        .from("assessment_results")
        .select("*")
        .eq("session_id", sessionId)
        .is("user_id", null)

      if (!error && data) {
        setAnonymousResults(data)
      }
    } catch (error) {
      console.error("Error checking anonymous results:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const linkResults = async () => {
    setIsLinking(true)
    const supabase = createClient()
    const sessionId = getOrCreateSessionId()

    try {
      const { error } = await supabase
        .from("assessment_results")
        .update({ user_id: userId })
        .eq("session_id", sessionId)
        .is("user_id", null)

      if (!error) {
        setAnonymousResults([])
        // Show success message or refresh page
        window.location.reload()
      }
    } catch (error) {
      console.error("Error linking results:", error)
    } finally {
      setIsLinking(false)
    }
  }

  if (isLoading) {
    return null
  }

  if (anonymousResults.length === 0) {
    return null
  }

  return (
    <Card className="bg-[#F7E5C8]/10 border-[#F7E5C8]/20 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-[#F7E5C8]">Link Previous Results</CardTitle>
        <CardDescription className="text-[#B2A4D4]">
          We found {anonymousResults.length} assessment{anonymousResults.length > 1 ? "s" : ""} from before you signed
          up
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-white">
          Would you like to link your previous anonymous assessment results to your account? This will allow you to
          track your progress over time.
        </p>
        <div className="flex gap-4">
          <Button
            onClick={linkResults}
            disabled={isLinking}
            className="bg-[#F7E5C8] hover:bg-[#F7E5C8]/80 text-[#221F3C] font-semibold"
          >
            {isLinking ? "Linking..." : "Link Results"}
          </Button>
          <Button
            onClick={() => setAnonymousResults([])}
            variant="outline"
            className="border-[#B2A4D4] text-[#B2A4D4] hover:bg-[#B2A4D4]/10 bg-transparent"
          >
            Skip
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
