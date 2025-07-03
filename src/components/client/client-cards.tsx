'use client'

import { Card, CardContent } from "@/src/components/ui/card"
import { Users, UserCheck, CreditCard, Bot } from "lucide-react"

const stats = [
  {
    title: "Total Clients",
    value: 247,
    icon: <Users className="w-6 h-6 text-blue-600" />,
    color: "bg-blue-100 text-blue-900"
  },
  {
    title: "Active Clients",
    value: 189,
    icon: <UserCheck className="w-6 h-6 text-green-600" />,
    color: "bg-green-100 text-green-900"
  },
  {
    title: "Payment Verified",
    value: 156,
    icon: <CreditCard className="w-6 h-6 text-emerald-600" />,
    color: "bg-emerald-100 text-emerald-900"
  },
  {
    title: "Total Chatbots",
    value: 423,
    icon: <Bot className="w-6 h-6 text-purple-600" />,
    color: "bg-purple-100 text-purple-900"
  },
]

export default function ClientCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <Card key={i}>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-gray-600">{stat.title}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
            <div className={`p-3 rounded-md ${stat.color}`}>
              {stat.icon}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
