"use client"
import ChatbotSetup from "@/src/components/chatbot/chatbot-setup"
import { DashboardHeader } from "@/src/components/layout/dashboard-header"
import { Suspense } from 'react';
import { useRouter } from "next/navigation"
export default function ChatbotSetupForm() {
      const router = useRouter()
        const handleBackToChatbot = () => {
      router.push("/dashboard/chatbot-management")
    }

  return (
    <>
     <DashboardHeader
                  title="Chatbot Creation"
                description="Create, manage and monitor your chatbots"
                   buttonText="Back to Chatbots"
        onButtonClick={handleBackToChatbot}
                />
                <div className="w-full flex md:p-5 p-4 flex-col gap-8">
   <Suspense fallback={<div>Loading...</div>}>
  <ChatbotSetup />
</Suspense>
    </div>
    </>

  )
}
