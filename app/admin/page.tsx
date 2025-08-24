import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { AdminStats } from "@/components/admin-stats"
import { RecentActivity } from "@/components/recent-activity"

export default async function AdminPage() {
  const supabase = await createClient()

  // Check if user is authenticated (basic admin check)
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  // Get basic statistics
  const [{ count: totalAssessments }, { count: totalUsers }, { count: totalReferrals }, { data: recentResults }] =
    await Promise.all([
      supabase.from("assessment_results").select("*", { count: "exact", head: true }),
      supabase.from("profiles").select("*", { count: "exact", head: true }),
      supabase.from("referral_codes").select("*", { count: "exact", head: true }),
      supabase.from("assessment_results").select("*").order("created_at", { ascending: false }).limit(10),
    ])

  return (
    <div className="min-h-screen bg-[#221F3C] text-white">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold mb-4 text-[#F7E5C8]">Admin Dashboard</h1>
            <p className="text-[#B2A4D4] text-lg">Manage Counting Sheep assessments and recommendations</p>
          </div>
          <div className="flex gap-4">
            <Button asChild className="bg-[#B2A4D4] hover:bg-[#B2A4D4]/80 text-[#221F3C] font-semibold">
              <Link href="/admin/recommendations">Manage Recommendations</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-[#B2A4D4] text-[#B2A4D4] hover:bg-[#B2A4D4]/10 bg-transparent"
            >
              <Link href="/">Back to App</Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-8">
          {/* Statistics Overview */}
          <AdminStats
            totalAssessments={totalAssessments || 0}
            totalUsers={totalUsers || 0}
            totalReferrals={totalReferrals || 0}
          />

          {/* Recent Activity */}
          <RecentActivity recentResults={recentResults || []} />

          {/* Quick Actions */}
          <Card className="bg-[#DEDFFA]/10 border-[#B2A4D4]/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-[#F7E5C8]">Quick Actions</CardTitle>
              <CardDescription className="text-[#B2A4D4]">Common administrative tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <Button asChild className="bg-[#F7E5C8] hover:bg-[#F7E5C8]/80 text-[#221F3C] font-semibold">
                  <Link href="/admin/recommendations">Edit Recommendations</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="border-[#B2A4D4] text-[#B2A4D4] hover:bg-[#B2A4D4]/10 bg-transparent"
                >
                  <Link href="/admin/analytics">View Analytics</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="border-[#B2A4D4] text-[#B2A4D4] hover:bg-[#B2A4D4]/10 bg-transparent"
                >
                  <Link href="/admin/referrals">Manage Referrals</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
