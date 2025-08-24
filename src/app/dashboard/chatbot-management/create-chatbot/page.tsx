"use client"
import ChatbotSetup from "@/src/components/chatbot/chatbot-setup"
import { DashboardHeader } from "@/src/components/layout/dashboard-header"
import { Suspense } from 'react';
export default function ChatbotSetupForm() {

  return (
    <>
     <DashboardHeader
                  title="Chatbot Creation"
                description="Create, manage and monitor your chatbots"
                />
                <div className="w-full flex md:p-5 p-4 flex-col gap-8">
   <Suspense fallback={<div>Loading...</div>}>
  <ChatbotSetup />
</Suspense>
    </div>
    </>

  )
}
