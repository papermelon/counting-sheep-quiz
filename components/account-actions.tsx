"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function AccountActions() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSignOut = async () => {
    setIsLoading(true)
    const supabase = createClient()

    try {
      await supabase.auth.signOut()
      router.push("/")
    } catch (error) {
      console.error("Error signing out:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="bg-[#DEDFFA]/10 border-[#B2A4D4]/20 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-[#F7E5C8]">Account Actions</CardTitle>
        <CardDescription className="text-[#B2A4D4]">Manage your account settings</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={handleSignOut}
            disabled={isLoading}
            variant="outline"
            className="border-red-400 text-red-400 hover:bg-red-400/10 bg-transparent"
          >
            {isLoading ? "Signing out..." : "Sign Out"}
          </Button>
        </div>
        <p className="text-sm text-[#B2A4D4]">
          Need help? Contact our support team or visit our help center for assistance with your account.
        </p>
      </CardContent>
    </Card>
  )
}
