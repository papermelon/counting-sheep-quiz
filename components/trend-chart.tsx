"use client"

import { Line, LineChart, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface TrendChartProps {
  data: Array<{
    id: string
    quiz_id: string
    score: number
    created_at: string
    quizzes: {
      slug: string
      title: string
      max_score: number
    }
  }>
}

export function TrendChart({ data }: TrendChartProps) {
  // Group data by quiz type and format for chart
  const chartData = data.reduce((acc: any[], item) => {
    const date = new Date(item.created_at).toLocaleDateString()
    const existingEntry = acc.find((entry) => entry.date === date)

    if (existingEntry) {
      existingEntry[item.quizzes.slug] = item.score
    } else {
      acc.push({
        date,
        [item.quizzes.slug]: item.score,
        fullDate: item.created_at,
      })
    }

    return acc
  }, [])

  // Sort by date
  chartData.sort((a, b) => new Date(a.fullDate).getTime() - new Date(b.fullDate).getTime())

  const chartConfig = {
    epworth: {
      label: "Epworth",
      color: "#F7E5C8",
    },
    stopbang: {
      label: "STOP-BANG",
      color: "#B2A4D4",
    },
    psqi: {
      label: "PSQI",
      color: "#DEDFFA",
    },
  }

  return (
    <ChartContainer config={chartConfig} className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#B2A4D4/20" />
          <XAxis dataKey="date" stroke="#DEDFFA" fontSize={12} />
          <YAxis stroke="#DEDFFA" fontSize={12} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Legend />
          <Line
            type="monotone"
            dataKey="epworth"
            stroke="var(--color-epworth)"
            strokeWidth={2}
            dot={{ fill: "var(--color-epworth)", strokeWidth: 2, r: 4 }}
            connectNulls={false}
          />
          <Line
            type="monotone"
            dataKey="stopbang"
            stroke="var(--color-stopbang)"
            strokeWidth={2}
            dot={{ fill: "var(--color-stopbang)", strokeWidth: 2, r: 4 }}
            connectNulls={false}
          />
          <Line
            type="monotone"
            dataKey="psqi"
            stroke="var(--color-psqi)"
            strokeWidth={2}
            dot={{ fill: "var(--color-psqi)", strokeWidth: 2, r: 4 }}
            connectNulls={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
