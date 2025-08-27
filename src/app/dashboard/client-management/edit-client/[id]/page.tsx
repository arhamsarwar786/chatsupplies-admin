"use client"
import React from 'react'
import { DashboardHeader } from "@/src/components/layout/dashboard-header"
import EditClientForm from '@/src/components/client/edit-client'
import { useRouter } from "next/navigation"

const page = () => {
      const router = useRouter()
          const handleBackToClient = () => {
        router.push("/dashboard/client-management")
      }
    return (
        <>
            <DashboardHeader
                title="Edit Client"
                description="Complete process to add clients, link chatbots, and setup payments"
                 buttonText="Back to Clients"
        onButtonClick={handleBackToClient}
            />
            <div className="md:p-5 p-4 flex flex-col gap-8">
                {/* <ClientSetupFlow /> */}
                <EditClientForm />
                {/* <LinkChatbotForm/>
                <SetupPaymentForm/> */}
            </div>
        </>
    )
}

export default page