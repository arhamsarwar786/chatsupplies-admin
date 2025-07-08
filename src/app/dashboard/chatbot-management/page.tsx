import ChatbotCards from '@/src/components/chatbot/chatbot-cards'
import ChatbotTable from '@/src/components/chatbot/chatbot-table'
import React from 'react'

const page = () => {
  return (
    <div className='flex flex-col gap-8'>
        <ChatbotTable/>
        <ChatbotCards/>
    </div>
  )
}

export default page