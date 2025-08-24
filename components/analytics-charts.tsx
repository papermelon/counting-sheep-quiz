"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

interface AnalyticsChartsProps {
  assessmentData: any[]
  referralData: any[]
}

export function AnalyticsCharts({ assessmentData, referralData }: AnalyticsChartsProps) {
  // Process assessment type distribution
  const assessmentTypeData = assessmentData.reduce(
    (acc, result) => {
      acc[result.assessment_type] = (acc[result.assessment_type] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const typeChartData = Object.entries(assessmentTypeData).map(([type, count]) => ({
    name: type.toUpperCase(),
    value: count,
  }))

  // Process score distribution for each assessment type
  const scoreDistribution = {
    epworth: { low: 0, moderate: 0, high: 0, severe: 0 },
    stop_bang: { low: 0, moderate: 0, high: 0 },
    psqi: { low: 0, moderate: 0, high: 0 },
  }

  assessmentData.forEach((result) => {
    const { assessment_type, score } = result
    if (assessment_type === "epworth") {
      if (score <= 7) scoreDistribution.epworth.low++
      else if (score <= 9) scoreDistribution.epworth.moderate++
      else if (score <= 15) scoreDistribution.epworth.high++
      else scoreDistribution.epworth.severe++
    } else if (assessment_type === "stop_bang") {
      if (score <= 2) scoreDistribution.stop_bang.low++
      else if (score <= 4) scoreDistribution.stop_bang.moderate++
      else scoreDistribution.stop_bang.high++
    } else if (assessment_type === "psqi") {
      if (score <= 5) scoreDistribution.psqi.low++
      else if (score <= 10) scoreDistribution.psqi.moderate++
      else scoreDistribution.psqi.high++
    }
  })

  // Top referral codes
  const topReferrals = referralData
    .filter((ref) => ref.usage_count > 0)
    .slice(0, 10)
    .map((ref) => ({
      code: ref.code,
      usage: ref.usage_count,
    }))

  const COLORS = ["#F7E5C8", "#B2A4D4", "#DEDFFA", "#221F3C"]

  return (
    <div className="space-y-8">
      {/* Assessment Type Distribution */}
      <Card className="bg-[#DEDFFA]/10 border-[#B2A4D4]/20 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-[#F7E5C8]">Assessment Type Distribution</CardTitle>
          <CardDescription className="text-[#B2A4D4]">Breakdown of completed assessments by type</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={typeChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {typeChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#221F3C",
                    border: "1px solid #B2A4D4",
                    borderRadius: "8px",
                    color: "#FFFFFF",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Top Referral Codes */}
      {topReferrals.length > 0 && (
        <Card className="bg-[#DEDFFA]/10 border-[#B2A4D4]/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-[#F7E5C8]">Top Performing Referral Codes</CardTitle>
            <CardDescription className="text-[#B2A4D4]">Most successful referral codes by usage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topReferrals}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#B2A4D4" opacity={0.2} />
                  <XAxis dataKey="code" stroke="#B2A4D4" fontSize={12} tick={{ fill: "#B2A4D4" }} />
                  <YAxis stroke="#B2A4D4" fontSize={12} tick={{ fill: "#B2A4D4" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#221F3C",
                      border: "1px solid #B2A4D4",
                      borderRadius: "8px",
                      color: "#FFFFFF",
                    }}
                    labelStyle={{ color: "#F7E5C8" }}
                  />
                  <Bar dataKey="usage" fill="#F7E5C8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary Statistics */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="bg-[#DEDFFA]/10 border-[#B2A4D4]/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-[#F7E5C8]">Total Referrals Used</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">
              {referralData.reduce((sum, ref) => sum + ref.usage_count, 0)}
            </div>
            <p className="text-[#B2A4D4] text-sm">Successful referral conversions</p>
          </CardContent>
        </Card>

        <Card className="bg-[#DEDFFA]/10 border-[#B2A4D4]/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-[#F7E5C8]">Average Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">
              {assessmentData.length > 0
                ? (assessmentData.reduce((sum, result) => sum + result.score, 0) / assessmentData.length).toFixed(1)
                : "0"}
            </div>
            <p className="text-[#B2A4D4] text-sm">Across all assessments</p>
          </CardContent>
        </Card>

        <Card className="bg-[#DEDFFA]/10 border-[#B2A4D4]/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-[#F7E5C8]">Completion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{assessmentData.length > 0 ? "100%" : "0%"}</div>
            <p className="text-[#B2A4D4] text-sm">Assessment completion rate</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
