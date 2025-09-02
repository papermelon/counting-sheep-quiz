import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AuthNav } from "@/components/auth-nav"
import { Footer } from "@/components/footer"
import { SleepPersonalityQuiz } from "@/components/sleep-personality-quiz"
import { ResponsiveLogo } from "@/components/responsive-logo"
import { createClient } from "@/lib/supabase/server"

export default async function HomePage() {
  const supabase = await createClient()
  
  // Get user if authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen bg-[#221F3C] text-white">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex justify-between items-center mb-8 md:mb-12">
          <ResponsiveLogo />
          <AuthNav />
        </div>

        <div className="text-center mb-20">
          <h1 className="text-4xl md:text-6xl font-bold mb-8 text-[#F7E5C8] font-sans">Sweet Dreams Start Here</h1>
          <p className="text-xl text-[#B2A4D4] mb-10 max-w-4xl mx-auto leading-relaxed font-sans">
            Discover your sleep health with our comprehensive, scientifically-backed assessments. Take the guesswork out
            of sleep wellness with personalized insights and actionable recommendations.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-[#B2A4D4] hover:bg-[#B2A4D4]/80 text-[#221F3C] font-semibold px-8 py-4 text-lg transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              <Link href="#assessments">Start Your Sleep Journey</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-[#B2A4D4] text-[#B2A4D4] hover:bg-[#B2A4D4]/10 bg-transparent px-8 py-4 text-lg transition-all duration-300 hover:scale-105"
            >
              <Link href="/results">View Past Results</Link>
            </Button>
          </div>
        </div>

        {/* Sleep Personality Quiz - Featured */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-[#F7E5C8] font-sans">Discover Your Sleep Personality</h2>
            <p className="text-[#B2A4D4] text-lg max-w-3xl mx-auto">
              Take our fun personality quiz to discover your chronotype and get personalized sleep insights!
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto mb-16">
            <SleepPersonalityQuiz />
          </div>
        </div>

        {/* Other Sleep Assessments */}
        <div id="assessments" className="mb-20">
          <h2 className="text-4xl font-bold text-center mb-4 text-[#F7E5C8] font-sans">Clinical Sleep Assessments</h2>
          <p className="text-center text-[#B2A4D4] mb-12 text-lg">
            Professional evaluations for specific sleep concerns
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-[#DEDFFA]/10 border-[#B2A4D4]/20 backdrop-blur-sm hover:bg-[#DEDFFA]/20 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-[#B2A4D4]/20 group cursor-pointer">
              <CardHeader className="relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-[#F7E5C8]/10 rounded-full -translate-y-10 translate-x-10 group-hover:scale-150 transition-transform duration-700"></div>
                <CardTitle className="text-[#F7E5C8] text-2xl font-sans group-hover:text-[#F7E5C8] transition-colors">
                  Epworth Sleepiness Scale
                </CardTitle>
                <CardDescription className="text-[#B2A4D4] text-base">
                  Measures daytime sleepiness and likelihood of falling asleep in various situations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-sm text-white/80 space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-[#F7E5C8] rounded-full"></span>
                    <p>8 questions</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-[#F7E5C8] rounded-full"></span>
                    <p>5-10 minutes</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-[#F7E5C8] rounded-full"></span>
                    <p>Identifies excessive daytime sleepiness</p>
                  </div>
                </div>
                <Button
                  asChild
                  className="w-full bg-[#F7E5C8] hover:bg-[#F7E5C8]/80 text-[#221F3C] font-semibold transition-all duration-300 group-hover:shadow-lg"
                >
                  <Link href="/quiz/epworth">Take Epworth Assessment</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-[#DEDFFA]/10 border-[#B2A4D4]/20 backdrop-blur-sm hover:bg-[#DEDFFA]/20 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-[#B2A4D4]/20 group cursor-pointer">
              <CardHeader className="relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-[#F7E5C8]/10 rounded-full -translate-y-10 translate-x-10 group-hover:scale-150 transition-transform duration-700"></div>
                <CardTitle className="text-[#F7E5C8] text-2xl font-sans group-hover:text-[#F7E5C8] transition-colors">
                  STOP-BANG
                </CardTitle>
                <CardDescription className="text-[#B2A4D4] text-base">
                  Screening tool for obstructive sleep apnea risk assessment
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-sm text-white/80 space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-[#F7E5C8] rounded-full"></span>
                    <p>8 questions</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-[#F7E5C8] rounded-full"></span>
                    <p>3-5 minutes</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-[#F7E5C8] rounded-full"></span>
                    <p>Evaluates sleep apnea risk</p>
                  </div>
                </div>
                <Button
                  asChild
                  className="w-full bg-[#F7E5C8] hover:bg-[#F7E5C8]/80 text-[#221F3C] font-semibold transition-all duration-300 group-hover:shadow-lg"
                >
                  <Link href="/quiz/stop_bang">Take STOP-BANG Assessment</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-[#DEDFFA]/10 border-[#B2A4D4]/20 backdrop-blur-sm hover:bg-[#DEDFFA]/20 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-[#B2A4D4]/20 group cursor-pointer">
              <CardHeader className="relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-[#F7E5C8]/10 rounded-full -translate-y-10 translate-x-10 group-hover:scale-150 transition-transform duration-700"></div>
                <CardTitle className="text-[#F7E5C8] text-2xl font-sans group-hover:text-[#F7E5C8] transition-colors">
                  Pittsburgh Sleep Quality Index
                </CardTitle>
                <CardDescription className="text-[#B2A4D4] text-base">
                  Comprehensive evaluation of sleep quality and disturbances
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-sm text-white/80 space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-[#F7E5C8] rounded-full"></span>
                    <p>19 questions</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-[#F7E5C8] rounded-full"></span>
                    <p>10-15 minutes</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-[#F7E5C8] rounded-full"></span>
                    <p>Assesses overall sleep quality</p>
                  </div>
                </div>
                <Button
                  asChild
                  className="w-full bg-[#F7E5C8] hover:bg-[#F7E5C8]/80 text-[#221F3C] font-semibold transition-all duration-300 group-hover:shadow-lg"
                >
                  <Link href="/quiz/psqi">Take PSQI Assessment</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-[#F7E5C8] font-sans">Why Choose Our Assessments?</h2>
          <p className="text-[#B2A4D4] mb-12 text-lg">Trusted by thousands for accurate sleep health insights</p>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="space-y-6 group">
              <div className="w-20 h-20 bg-[#B2A4D4]/20 rounded-full flex items-center justify-center mx-auto group-hover:bg-[#B2A4D4]/30 transition-all duration-300 group-hover:scale-110">
                <span className="text-3xl">🔬</span>
              </div>
              <h3 className="text-2xl font-semibold text-[#F7E5C8] font-sans">Scientifically Validated</h3>
              <p className="text-[#B2A4D4] text-base leading-relaxed">
                All assessments are based on clinically validated tools used by healthcare professionals worldwide
              </p>
            </div>
            <div className="space-y-6 group">
              <div className="w-20 h-20 bg-[#B2A4D4]/20 rounded-full flex items-center justify-center mx-auto group-hover:bg-[#B2A4D4]/30 transition-all duration-300 group-hover:scale-110">
                <span className="text-3xl">🔒</span>
              </div>
              <h3 className="text-2xl font-semibold text-[#F7E5C8] font-sans">Privacy First</h3>
              <p className="text-[#B2A4D4] text-base leading-relaxed">
                Take assessments anonymously or create an account to save and track your results over time
              </p>
            </div>
            <div className="space-y-6 group">
              <div className="w-20 h-20 bg-[#B2A4D4]/20 rounded-full flex items-center justify-center mx-auto group-hover:bg-[#B2A4D4]/30 transition-all duration-300 group-hover:scale-110">
                <span className="text-3xl">📊</span>
              </div>
              <h3 className="text-2xl font-semibold text-[#F7E5C8] font-sans">Detailed Insights</h3>
              <p className="text-[#B2A4D4] text-base leading-relaxed">
                Get comprehensive results with personalized recommendations and actionable insights
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
