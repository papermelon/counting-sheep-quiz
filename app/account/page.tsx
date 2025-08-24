import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { AccountActions } from "@/components/account-actions"
import { LinkAnonymousResults } from "@/components/link-anonymous-results"

export default async function AccountPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  // Get user's assessment count
  const { data: results, count } = await supabase
    .from("assessment_results")
    .select("*", { count: "exact" })
    .eq("user_id", user.id)

  const assessmentCount = count || 0

  return (
    <div className="min-h-screen bg-[#221F3C] text-white">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold mb-4 text-[#F7E5C8]">My Account</h1>
            <p className="text-[#B2A4D4] text-lg">Manage your sleep health profile</p>
          </div>
          <Button asChild className="bg-[#B2A4D4] hover:bg-[#B2A4D4]/80 text-[#221F3C] font-semibold">
            <Link href="/">Take Assessment</Link>
          </Button>
        </div>

        <div className="grid gap-8">
          {/* Profile Information */}
          <Card className="bg-[#DEDFFA]/10 border-[#B2A4D4]/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-[#F7E5C8]">Profile Information</CardTitle>
              <CardDescription className="text-[#B2A4D4]">Your account details and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-[#B2A4D4]">Email Address</label>
                  <p className="text-white mt-1">{user.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-[#B2A4D4]">Member Since</label>
                  <p className="text-white mt-1">{new Date(user.created_at).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-[#B2A4D4]">Total Assessments</label>
                  <p className="text-white mt-1">{assessmentCount}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-[#B2A4D4]">Account Status</label>
                  <p className="text-green-400 mt-1">Active</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Link Anonymous Results */}
          <LinkAnonymousResults userId={user.id} />

          {/* Quick Actions */}
          <Card className="bg-[#DEDFFA]/10 border-[#B2A4D4]/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-[#F7E5C8]">Quick Actions</CardTitle>
              <CardDescription className="text-[#B2A4D4]">Manage your sleep health journey</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <Button asChild className="bg-[#F7E5C8] hover:bg-[#F7E5C8]/80 text-[#221F3C] font-semibold">
                  <Link href="/results">View All Results</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="border-[#B2A4D4] text-[#B2A4D4] hover:bg-[#B2A4D4]/10 bg-transparent"
                >
                  <Link href="/">Take New Assessment</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Account Actions */}
          <AccountActions />
        </div>
      </div>
    </div>
  )
}
