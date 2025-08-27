"use client"
import React from 'react'
import { DashboardHeader } from "@/src/components/layout/dashboard-header"
import AddNewClientForm from '@/src/components/client/add-new-client-form'
import { useRouter } from "next/navigation"


const page = () => {
    const router = useRouter()
      const handleBackToClient = () => {
    router.push("/dashboard/client-management")
  }
    return (
        <>
            <DashboardHeader
                title="Client Management Flow"
                description="Complete process to add clients, link chatbots, and setup payments"
                buttonText="Back to Clients"
        onButtonClick={handleBackToClient}

            />
            <div className="md:p-5 p-4 flex flex-col gap-8">
                {/* <ClientSetupFlow /> */}
                <AddNewClientForm />
                {/* <LinkChatbotForm/>
                <SetupPaymentForm/> */}
            </div>
        </>
    )
}

export default page