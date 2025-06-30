"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/src/components/dashboard/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Users, ShoppingCart, DollarSign, Activity } from "lucide-react"
import { CardSection } from "@/src/components/dashboard/dashboard-card"
import { UserInteractions } from "@/src/components/dashboard/dashboard-userinteractions"
import { TopClients } from "@/src/components/dashboard/dashboard-topclient"
import { PlatformUsageTrends } from "@/src/components/dashboard/dashboard-chart"
import { ClientDistributionChart } from "@/src/components/dashboard/dashboard-clientdistribution"

export default function DashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userEmail, setUserEmail] = useState("")
  const router = useRouter()

  useEffect(() => {
    const authStatus = localStorage.getItem("isAuthenticated")
    const email = localStorage.getItem("userEmail")

    if (authStatus === "true" && email) {
      setIsAuthenticated(true)
      setUserEmail(email)
    } else {
      router.push("/")
    }
  }, [router])

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <DashboardLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <CardSection/>
          <div className="grid grid-cols-1 md:grid-cols-2  gap-4">
        <PlatformUsageTrends/>
        <ClientDistributionChart/>
            </div>
       <div className="grid grid-cols-1 md:grid-cols-2  gap-4">
         <UserInteractions/>
        <TopClients/>
       </div>
    
      </div>
    </DashboardLayout>
  )
}
