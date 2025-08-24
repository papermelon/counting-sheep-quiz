import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface AdminStatsProps {
  totalAssessments: number
  totalUsers: number
  totalReferrals: number
}

export function AdminStats({ totalAssessments, totalUsers, totalReferrals }: AdminStatsProps) {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      <Card className="bg-[#DEDFFA]/10 border-[#B2A4D4]/20 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-[#B2A4D4]">Total Assessments</CardTitle>
          <div className="w-8 h-8 bg-[#F7E5C8]/20 rounded-full flex items-center justify-center">
            <span className="text-lg">📊</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-[#F7E5C8]">{totalAssessments.toLocaleString()}</div>
          <p className="text-xs text-[#B2A4D4]">Completed assessments</p>
        </CardContent>
      </Card>

      <Card className="bg-[#DEDFFA]/10 border-[#B2A4D4]/20 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-[#B2A4D4]">Registered Users</CardTitle>
          <div className="w-8 h-8 bg-[#F7E5C8]/20 rounded-full flex items-center justify-center">
            <span className="text-lg">👥</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-[#F7E5C8]">{totalUsers.toLocaleString()}</div>
          <p className="text-xs text-[#B2A4D4]">Active user accounts</p>
        </CardContent>
      </Card>

      <Card className="bg-[#DEDFFA]/10 border-[#B2A4D4]/20 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-[#B2A4D4]">Referral Codes</CardTitle>
          <div className="w-8 h-8 bg-[#F7E5C8]/20 rounded-full flex items-center justify-center">
            <span className="text-lg">🔗</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-[#F7E5C8]">{totalReferrals.toLocaleString()}</div>
          <p className="text-xs text-[#B2A4D4]">Generated referral codes</p>
        </CardContent>
      </Card>
    </div>
  )
}
