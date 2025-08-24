import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function CheckEmailPage() {
  return (
    <div className="min-h-screen bg-[#221F3C] text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold text-[#F7E5C8] hover:text-[#F7E5C8]/80">
            Counting Sheep
          </Link>
        </div>

        <Card className="bg-[#DEDFFA]/10 border-[#B2A4D4]/20 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-[#F7E5C8]/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📧</span>
            </div>
            <CardTitle className="text-2xl text-[#F7E5C8]">Check Your Email</CardTitle>
            <CardDescription className="text-[#B2A4D4]">
              We've sent you a confirmation link to complete your registration
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-white leading-relaxed">
              Please check your email and click the confirmation link to activate your account. You can then sign in and
              start tracking your sleep assessments.
            </p>
            <div className="space-y-3">
              <Button asChild className="w-full bg-[#F7E5C8] hover:bg-[#F7E5C8]/80 text-[#221F3C] font-semibold">
                <Link href="/auth/login">Back to Sign In</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="w-full border-[#B2A4D4] text-[#B2A4D4] hover:bg-[#B2A4D4]/10 bg-transparent"
              >
                <Link href="/">Continue as Guest</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
