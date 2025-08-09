"use client";
import EditChatbot from '@/src/components/chatbot/edit-chatbot';
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
              title="Update Chatbot"
            description="update, manage and monitor your chatbots"
            // buttonText="Update Chatbot"
            // onButtonClick={handleCreateChatbot}
            />
     <div className='flex md:p-5 p-4 flex-col gap-8'>
        <EditChatbot/>
    </div>
   </div>
  )
}

export default page