// components/platform-usage-trends.tsx
import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { TrendingUp } from 'lucide-react'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/src/components/ui/card'

const chartData = [
  { month: 'Jan', interactions: 45 },
  { month: 'Feb', interactions: 53 },
  { month: 'Mar', interactions: 48 },
  { month: 'Apr', interactions: 62 },
  { month: 'May', interactions: 58 },
  { month: 'Jun', interactions: 69 },
]

export const PlatformUsageTrends = () => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Platform Usage Trends</CardTitle>
      </CardHeader>

      <CardContent className="h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}K`}
              domain={[40, 75]}
              width={40}
            />
            <Tooltip
              contentStyle={{ borderRadius: '8px', borderColor: '#e5e7eb' }}
              labelStyle={{ color: '#6b7280' }}
              formatter={(value: number) => [`${value}K`, 'Interactions']}
            />
            <Line
              type="monotone"
              dataKey="interactions"
              stroke="#4f46e5"
              strokeWidth={3}
              dot={{ r: 5, stroke: '#4f46e5', strokeWidth: 2, fill: '#4f46e5' }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>

      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-1">
            <div className="flex items-center gap-2 font-medium leading-none">
              Trending up by 5.2% this month <TrendingUp className="h-4 w-4 text-green-600" />
            </div>
            <div className="text-muted-foreground">January – June 2024</div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
