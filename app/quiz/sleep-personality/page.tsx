import { SleepPersonalityQuiz } from "@/components/sleep-personality-quiz"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function SleepPersonalityPage() {
  return (
    <div className="min-h-screen bg-[#221F3C] text-white">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Button
            asChild
            variant="ghost"
            className="text-[#B2A4D4] hover:text-[#F7E5C8] mb-6"
          >
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </Button>
          
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4 text-[#F7E5C8] font-sans">
              Sleep Personality Quiz
            </h1>
            <p className="text-[#B2A4D4] text-lg">
              Discover your chronotype and get personalized sleep insights
            </p>
          </div>
        </div>

        {/* Quiz Component */}
        <SleepPersonalityQuiz />
      </div>
    </div>
  )
}
