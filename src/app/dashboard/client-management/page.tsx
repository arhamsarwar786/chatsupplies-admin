'use client'

import ClientCards from '@/src/components/client/client-cards'
import ClientTable from '@/src/components/client/client-table'
import { DashboardHeader } from "@/src/components/layout/dashboard-header"
import React from 'react'
import { useRouter } from "next/navigation"

const Page = () => {
  const router = useRouter()

  const handleCreateClient = () => {
    router.push("/dashboard/client-management/create-client")
  }

  return (
    <>
      <DashboardHeader
        title="Client Management Flow"
        description="Complete process to add clients, link chatbots, and setup payments"
        buttonText="Create Client"
        onButtonClick={handleCreateClient}
      />
      <div className="md:p-5 p-4 flex flex-col gap-8">
        <ClientCards />
        <ClientTable />
      </div>  
    </>
  )
}

export default Page