"use client"

import { Send, BotIcon } from "lucide-react"
import { useState } from "react"

export default function TestingPreviewSection() {
  const [message, setMessage] = useState("")

  const handleSend = () => {
    if (!message.trim()) return
    // You could add message to a chat history array here
    setMessage("")
  }

  return (
  
      <div className="flex bg-white border border-gray-200 rounded-xl shadow-sm p-6 gap-6 grid-cols-1 md:grid-cols-2">
        
        {/* Left - Chat Preview */}
        <div className="md:col-span-2 w-[50%] space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Testing & Preview</h3>

          <div className="border rounded-xl overflow-hidden">
            {/* Chat Header */}
            <div className="bg-indigo-600 text-white p-4 flex items-center space-x-3">
              <div className="bg-white/20 p-1.5 rounded-full">
                <BotIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-medium">Customer Support Bot</p>
                <p className="text-xs text-white/80">Online</p>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="bg-gray-50 p-4 space-y-4 h-64 overflow-y-auto text-sm">
              {/* Bot Message */}
              <div className="flex items-start space-x-2">
                <BotIcon className="w-4 h-4 mt-0.5 text-indigo-600" />
                <div className="bg-white border border-gray-200 rounded-md px-3 py-2 max-w-md">
                  Hello! How can I help you today?
                </div>
              </div>

              {/* User Message */}
              <div className="flex justify-end">
                <div className="bg-indigo-600 text-white rounded-md px-3 py-2 max-w-md">
                  What are your business hours?
                </div>
              </div>

              {/* Bot Response */}
              <div className="flex items-start space-x-2">
                <BotIcon className="w-4 h-4 mt-0.5 text-indigo-600" />
                <div className="bg-white border border-gray-200 rounded-md px-3 py-2 max-w-md">
                  We&apos;re open Monday to Friday, 9 AM to 6 PM EST. Is there anything specific I can help you with?
                </div>
              </div>
            </div>

            {/* Chat Input */}
            <div className="flex items-center p-3 border-t">
              <input
                type="text"
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                onClick={handleSend}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-r-md"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right - Test Scenarios */}
        <div className="space-y-4 w-[50%]">
          <h4 className="text-sm font-medium text-gray-700">Test Scenarios</h4>
          {[
            { title: "Product Information", desc: "Test product-related queries" },
            { title: "Order Support", desc: "Test order tracking and support" },
            { title: "General FAQ", desc: "" },
          ].map((scenario, idx) => (
            <div
              key={idx}
              className="p-4 border border-gray-200 rounded-md hover:shadow-sm cursor-pointer transition"
            >
              <p className="font-medium text-gray-800">{scenario.title}</p>
              {scenario.desc && <p className="text-sm text-gray-500">{scenario.desc}</p>}
            </div>
          ))}
        </div>
      </div>
  )
}
