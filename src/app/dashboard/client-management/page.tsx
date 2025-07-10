'use client'
import ClientCards from '@/src/components/client/client-cards'
import ClientTable from '@/src/components/client/client-table'
import { DashboardHeader } from "@/src/components/layout/dashboard-header"
import React, { use } from 'react'

const page = () => {
  return (
   <>
         <DashboardHeader
                     title="Client Management Flow"
                   description="Complete process to add clients, link chatbots, and setup payments"
                   buttonText="Create Client"
                   />
             <div className=' flex  flex-col gap-8'>
      <ClientCards/>
      <ClientTable/>
    </div>
</>

  )
}
export default page