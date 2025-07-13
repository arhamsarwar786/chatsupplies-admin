"use client";
import ChatbotCards from '@/src/components/chatbot/chatbot-cards'
import ChatbotTable from '@/src/components/chatbot/chatbot-table'
import { DashboardHeader } from "@/src/components/layout/dashboard-header"
import { useRouter } from "next/navigation"
import React from 'react'

const page = () => {
  const router = useRouter()

    const handleCreateChatbot = () => {
      router.push("/dashboard/chatbot-management/create-chatbot")
    }
  return (
   <div>
      <DashboardHeader
              title="Chatbot Management"
            description="Create, manage and monitor your chatbots"
            buttonText="Create Chatbot"
            onButtonClick={handleCreateChatbot}
            />
     <div className='flex md:p-5 p-4 flex-col gap-8'>
        <ChatbotTable/>
        <ChatbotCards/>
    </div>
   </div>
  )
}

export default page