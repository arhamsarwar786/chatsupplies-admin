"use client"
import ChatbotSetup from "@/src/components/chatbot/chatbot-setup"
import { DashboardHeader } from "@/src/components/layout/dashboard-header"



export default function ChatbotSetupForm() {

  return (
    <>
     <DashboardHeader
                  title="Chatbot Creation"
                description="Create, manage and monitor your chatbots"
                />
                <div className="w-full flex md:p-5 p-4 flex-col gap-8">
    <ChatbotSetup/>
    </div>
    </>

  )
}
