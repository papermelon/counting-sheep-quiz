"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import type { AssessmentResult } from "@/lib/types"

interface ResultsChartProps {
  resultsByType: Record<string, AssessmentResult[]>
}

export function ResultsChart({ resultsByType }: ResultsChartProps) {
  // Prepare data for the chart
  const prepareChartData = () => {
    const allDates = new Set<string>()

    // Collect all unique dates
    Object.values(resultsByType).forEach((results) => {
      results.forEach((result) => {
        allDates.add(new Date(result.created_at).toISOString().split("T")[0])
      })
    })

    const sortedDates = Array.from(allDates).sort()

    return sortedDates.map((date) => {
      const dataPoint: any = { date: new Date(date).toLocaleDateString() }

      Object.entries(resultsByType).forEach(([type, results]) => {
        // Find the most recent result for this date
        const dayResults = results.filter((r) => new Date(r.created_at).toISOString().split("T")[0] === date)

        if (dayResults.length > 0) {
          // Get the latest result for this day
          const latestResult = dayResults.sort(
            (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
          )[0]

          dataPoint[type] = latestResult.score
        }
      })

      return dataPoint
    })
  }

  const chartData = prepareChartData()

  const getLineColor = (type: string) => {
    switch (type) {
      case "epworth":
        return "#F7E5C8"
      case "stop_bang":
        return "#B2A4D4"
      case "psqi":
        return "#DEDFFA"
      default:
        return "#B2A4D4"
    }
  }

  const getAssessmentName = (type: string) => {
    switch (type) {
      case "epworth":
        return "Epworth (Sleepiness)"
      case "stop_bang":
        return "STOP-BANG (Apnea Risk)"
      case "psqi":
        return "PSQI (Sleep Quality)"
      default:
        return type
    }
  }

  if (chartData.length === 0) {
    return (
      <div className="text-center py-8 text-[#B2A4D4]">
        <p>No data available for chart visualization</p>
      </div>
    )
  }

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#B2A4D4" opacity={0.2} />
          <XAxis dataKey="date" stroke="#B2A4D4" fontSize={12} tick={{ fill: "#B2A4D4" }} />
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
          <Legend wrapperStyle={{ color: "#B2A4D4" }} />
          {Object.keys(resultsByType).map((type) => (
            <Line
              key={type}
              type="monotone"
              dataKey={type}
              stroke={getLineColor(type)}
              strokeWidth={2}
              dot={{ fill: getLineColor(type), strokeWidth: 2, r: 4 }}
              name={getAssessmentName(type)}
              connectNulls={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
