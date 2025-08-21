"use client"
import React from 'react'
import { DashboardHeader } from "@/src/components/layout/dashboard-header"
import EditClientForm from '@/src/components/client/edit-client'


const page = () => {
    return (
        <>
            <DashboardHeader
                title="Edit Client"
                description="Complete process to add clients, link chatbots, and setup payments"
                buttonText="Start Flow"
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