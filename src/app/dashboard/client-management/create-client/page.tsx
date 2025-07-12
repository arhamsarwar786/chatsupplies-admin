"use client"
import React from 'react'
import { DashboardHeader } from "@/src/components/layout/dashboard-header"
import ClientSetupFlow from '@/src/components/client/client-setup-flow'
import AddNewClientForm from '@/src/components/client/add-new-client-form'
import LinkChatbotForm from '@/src/components/client/link-chatbot-form'
import SetupPaymentForm from '@/src/components/client/setup-payment'


const page = () => {
    return (
        <>
            <DashboardHeader
                title="Client Management Flow"
                description="Complete process to add clients, link chatbots, and setup payments"
                buttonText="Start Flow"
            />
            <div className="md:p-5 p-4 flex flex-col gap-8">
                <ClientSetupFlow />
                <AddNewClientForm />
                <LinkChatbotForm/>
                <SetupPaymentForm/>
            </div>
        </>
    )
}

export default page