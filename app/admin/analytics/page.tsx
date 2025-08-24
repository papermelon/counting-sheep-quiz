import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { AnalyticsCharts } from "@/components/analytics-charts"

export default async function AnalyticsPage() {
  const supabase = await createClient()

  // Check if user is authenticated
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  // Get analytics data
  const { data: assessmentData } = await supabase
    .from("assessment_results")
    .select("assessment_type, score, created_at, referral_code")
    .order("created_at", { ascending: false })

  const { data: referralData } = await supabase
    .from("referral_codes")
    .select("code, usage_count, created_at")
    .order("usage_count", { ascending: false })

  return (
    <div className="min-h-screen bg-[#221F3C] text-white">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold mb-4 text-[#F7E5C8]">Analytics Dashboard</h1>
            <p className="text-[#B2A4D4] text-lg">Detailed insights and performance metrics</p>
          </div>
          <Button
            asChild
            variant="outline"
            className="border-[#B2A4D4] text-[#B2A4D4] hover:bg-[#B2A4D4]/10 bg-transparent"
          >
            <Link href="/admin">Back to Dashboard</Link>
          </Button>
        </div>

        {/* Analytics Charts */}
        <AnalyticsCharts assessmentData={assessmentData || []} referralData={referralData || []} />
      </div>
    </div>
  )
}
