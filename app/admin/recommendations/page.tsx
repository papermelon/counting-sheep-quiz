import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { RecommendationsList } from "@/components/recommendations-list"

export default async function RecommendationsPage() {
  const supabase = await createClient()

  // Check if user is authenticated
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  // Get all recommendations
  const { data: recommendations, error: recError } = await supabase
    .from("recommendations")
    .select("*")
    .order("assessment_type")
    .order("score_range_min")

  if (recError) {
    console.error("Error fetching recommendations:", recError)
  }

  return (
    <div className="min-h-screen bg-[#221F3C] text-white">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold mb-4 text-[#F7E5C8]">Manage Recommendations</h1>
            <p className="text-[#B2A4D4] text-lg">Edit assessment recommendations and scoring interpretations</p>
          </div>
          <div className="flex gap-4">
            <Button asChild className="bg-[#F7E5C8] hover:bg-[#F7E5C8]/80 text-[#221F3C] font-semibold">
              <Link href="/admin/recommendations/new">Add New Recommendation</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-[#B2A4D4] text-[#B2A4D4] hover:bg-[#B2A4D4]/10 bg-transparent"
            >
              <Link href="/admin">Back to Dashboard</Link>
            </Button>
          </div>
        </div>

        {/* Recommendations List */}
        <RecommendationsList recommendations={recommendations || []} />
      </div>
    </div>
  )
}
