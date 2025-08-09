"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { CardSection } from "@/src/components/dashboard/dashboard-card"
import { UserInteractions } from "@/src/components/dashboard/dashboard-userinteractions"
import { TopClients } from "@/src/components/dashboard/dashboard-topclient"
import { PlatformUsageTrends } from "@/src/components/dashboard/dashboard-chart"
import { ClientDistributionChart } from "@/src/components/dashboard/dashboard-clientdistribution"
import { useSelector } from "react-redux"
import { RootState } from "@/src/store/store"
import { DashboardHeader } from "@/src/components/layout/dashboard-header"

export default function DashboardPage() {
  const token = useSelector((state: RootState) => state.authSlice.token)
  const router = useRouter()

  useEffect(() => {

    if (!token) {
      router.push("/")
    }
  }, [token])



  return (
   
      <>
        <DashboardHeader
          title="Dashboard Overview"
        description="Here’s a summary of your recent activity"
        // buttonText="Add New"
        />
        <div className="flex-1 space-y-4 p-4 md:p-5">
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
  </>
  )
}
