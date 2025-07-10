import React from 'react'
import { DashboardHeader } from "@/src/components/layout/dashboard-header"

const page = () => {
  return (
     <>
            <DashboardHeader
                        title="Dashboard Overview"
                      description="Here’s a summary of your recent activity"
                      buttonText="Add New"
                      />
    <div>page</div>
    </>
  )
}

export default page