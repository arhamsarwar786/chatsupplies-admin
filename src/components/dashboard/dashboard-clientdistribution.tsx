// components/client-distribution-chart.tsx
import React from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"

import { Card, CardHeader, CardTitle, CardContent } from "@/src/components/ui/card"

const data = [
  { name: "Startup", value: 20, color: "#f59e0b" },     // orange-500
  { name: "SMB", value: 30, color: "#10b981" },         // green-500
  { name: "Enterprise", value: 50, color: "#6366f1" },  // indigo-500
]

export const ClientDistributionChart = () => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Client Distribution</CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col md:flex-row items-center justify-center gap-8">
        <div className="h-[200px] w-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius={0}
                outerRadius="100%"
                stroke="white"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => [`${value}%`, "Segment"]}
                contentStyle={{ borderRadius: "8px", borderColor: "#e5e7eb" }}
                labelStyle={{ color: "#6b7280" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="space-y-3 min-w-[160px]">
          {data.map((entry) => (
            <div key={entry.name} className="flex items-center justify-between text-sm font-medium">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
                <span>{entry.name}</span>
              </div>
              <span>{entry.value}%</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
