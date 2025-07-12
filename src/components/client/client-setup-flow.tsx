// components/client/ClientSetupFlow.tsx
"use client"

import { UserPlus, Bot, CreditCard, CheckCircle } from "lucide-react"
import { cn } from "@/src/lib/utils"

type Step = {
  id: number
  title: string
  subtitle: string
  icon: React.ReactNode
  isActive: boolean
}

const steps: Step[] = [
  {
    id: 1,
    title: "Step 1",
    subtitle: "Add Client",
    icon: <UserPlus className="w-6 h-6 text-white" />,
    isActive: true,
  },
  {
    id: 2,
    title: "Step 2",
    subtitle: "Link Chatbot",
    icon: <Bot className="w-6 h-6 text-white" />,
    isActive: false,
  },
  {
    id: 3,
    title: "Step 3",
    subtitle: "Setup Payment",
    icon: <CreditCard className="w-6 h-6 text-white" />,
    isActive: false,
  },
  {
    id: 4,
    title: "Step 4",
    subtitle: "Activate",
    icon: <CheckCircle className="w-6 h-6 text-white" />,
    isActive: false,
  },
]

export default function ClientSetupFlow() {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Complete Client Setup Flow</h2>
      <div className="flex items-center justify-between gap-2 overflow-x-auto">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center text-center space-y-2">
              <div
                className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center",
                  step.isActive ? "bg-indigo-600" : "bg-gray-300"
                )}
              >
                {step.icon}
              </div>
              <div className="text-sm font-semibold">{step.title}</div>
              <div className="text-xs text-gray-500">{step.subtitle}</div>
            </div>
            {index < steps.length - 1 && (
              <div className="mx-2">
                <ArrowRight />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function ArrowRight() {
  return (
    <svg
      className="w-5 h-5 text-gray-400"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  )
}
