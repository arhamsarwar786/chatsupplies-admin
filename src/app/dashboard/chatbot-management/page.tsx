import ChatbotCards from '@/src/components/chatbot/chatbot-cards'
import ChatbotTable from '@/src/components/chatbot/chatbot-table'
import { DashboardHeader } from "@/src/components/layout/dashboard-header"
import React from 'react'

const page = () => {
  return (
   <div>
      <DashboardHeader
              title="Chatbot Management"
            description="Create, manage and monitor your chatbots"
            buttonText="Create Chatbot"
            />
     <div className='flex md:p-5 p-4 flex-col gap-8'>
        <ChatbotTable/>
        <ChatbotCards/>
    </div>
   </div>
  )
}

export default page