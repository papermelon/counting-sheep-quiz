"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import type { User } from "@supabase/supabase-js"

export function AuthNav() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    // Get initial user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      setIsLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
      setIsLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (isLoading) {
    return null
  }

  return (
    <div className="flex items-center gap-4">
      {user ? (
        <>
          <span className="text-[#B2A4D4] text-sm">Welcome, {user.email}</span>
          <Button
            asChild
            variant="outline"
            size="sm"
            className="border-[#B2A4D4] text-[#B2A4D4] hover:bg-[#B2A4D4]/10 bg-transparent"
          >
            <Link href="/dashboard">Dashboard</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="sm"
            className="border-[#B2A4D4] text-[#B2A4D4] hover:bg-[#B2A4D4]/10 bg-transparent"
          >
            <Link href="/account">Account</Link>
          </Button>
        </>
      ) : (
        <>
          <Button
            asChild
            variant="outline"
            size="sm"
            className="border-[#B2A4D4] text-[#B2A4D4] hover:bg-[#B2A4D4]/10 bg-transparent"
          >
            <Link href="/auth/login">Sign In</Link>
          </Button>
          <Button asChild size="sm" className="bg-[#F7E5C8] hover:bg-[#F7E5C8]/80 text-[#221F3C] font-semibold">
            <Link href="/auth/signup">Sign Up</Link>
          </Button>
        </>
      )}
    </div>
  )
}
