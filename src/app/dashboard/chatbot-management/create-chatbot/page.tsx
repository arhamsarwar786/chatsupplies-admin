"use client"
import ChatbotSetup from "@/src/components/chatbot/chatbot-setup"
import TestingPreviewSection from "@/src/components/chatbot/chatbot-testing"
import TrainingSection from "@/src/components/chatbot/chatbot-training"
import { DashboardHeader } from "@/src/components/layout/dashboard-header"



export default function ChatbotSetupForm() {

  return (
    <>
     <DashboardHeader
                  title="Chatbot Creation"
                description="Create, manage and monitor your chatbots"
                buttonText="Create Chatbot"
                />
                <div className="w-full flex md:p-5 p-4 flex-col gap-8">
    <ChatbotSetup/>
    <TrainingSection/>
    <TestingPreviewSection/>
    </div>
    </>

  )
}
