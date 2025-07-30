'use client'

import { Button } from "@/src/components/ui/button"
import { Checkbox } from "@/src/components/ui/checkbox"
import { Label } from "@/src/components/ui/label"
import { Textarea } from "@/src/components/ui/textarea"
import { Input } from "@/src/components/ui/input"
import { Bot } from "lucide-react"
import { useState } from "react"

const chatbots = [
  {
    id: 1,
    name: "Customer Support Bot",
    description: "General customer service",
    color: "bg-blue-100",
    checked: false,
  },
  {
    id: 2,
    name: "Sales Assistant Bot",
    description: "Product recommendations & sales",
    color: "bg-green-100",
    checked: true,
  },
  {
    id: 3,
    name: "Technical Support Bot",
    description: "Technical issue resolution",
    color: "bg-orange-100",
    checked: true,
  },
]

const languages = ["English", "Spanish", "French"]

export default function LinkChatbotForm() {
  const [selectedBots, setSelectedBots] = useState<number[]>([2, 3])
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(["English"])
  const [botName, setBotName] = useState("TechCorp Assistant")
  const [welcomeMsg, setWelcomeMsg] = useState("Hi! I'm here to help you with any questions...")
  const [businessHours, setBusinessHours] = useState({
    start: "08:59",
    end: "17:00",
  })

  const toggleBot = (id: number) => {
    setSelectedBots((prev) =>
      prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]
    )
  }

  const toggleLanguage = (lang: string) => {
    setSelectedLanguages((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
    )
  }

  const handleSubmit = () => {
    // console.log({
    //   selectedBots,
    //   botName,
    //   welcomeMsg,
    //   businessHours,
    //   selectedLanguages,
    // })
  }

  return (
    <div className="rounded-xl border shadow-sm overflow-hidden bg-white">
      <div className="bg-fuchsia-600 text-white px-6 py-4 flex items-center gap-2">
        <Bot className="w-5 h-5" />
        <h3 className="font-semibold text-lg">Step 2: Link Chatbot to Client</h3>
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Side: Chatbot List */}
        <div>
          <h4 className="font-medium mb-4">Available Chatbots</h4>
          <div className="space-y-3">
            {chatbots.map((bot) => (
              <div
                key={bot.id}
                className={`flex justify-between items-center border rounded-lg px-4 py-3 ${bot.color}`}
              >
                <div>
                  <div className="font-medium">{bot.name}</div>
                  <div className="text-sm text-gray-600">{bot.description}</div>
                </div>
                <Checkbox
                  checked={selectedBots.includes(bot.id)}
                  onCheckedChange={() => toggleBot(bot.id)}
                />
              </div>
            ))}

            <div className="border-dashed border-2 rounded-lg text-center text-sm text-gray-500 py-3 cursor-pointer">
              + Create New Chatbot
            </div>
          </div>
        </div>

        {/* Right Side: Chatbot Config */}
        <div>
          <h4 className="font-medium mb-4">Chatbot Configuration</h4>
          <div className="space-y-4">
            <div>
              <Label>Bot Name</Label>
              <Input value={botName} onChange={(e) => setBotName(e.target.value)} />
            </div>

            <div>
              <Label>Welcome Message</Label>
              <Textarea
                value={welcomeMsg}
                onChange={(e) => setWelcomeMsg(e.target.value)}
                placeholder="Hi! I'm here to help you with any questions..."
              />
            </div>

            <div>
              <Label>Business Hours</Label>
              <div className="flex items-center gap-4">
                <Input
                  type="time"
                  value={businessHours.start}
                  onChange={(e) => setBusinessHours((prev) => ({ ...prev, start: e.target.value }))}
                />
                <Input
                  type="time"
                  value={businessHours.end}
                  onChange={(e) => setBusinessHours((prev) => ({ ...prev, end: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <Label>Supported Languages</Label>
              <div className="space-y-2 mt-2">
                {languages.map((lang) => (
                  <div key={lang} className="flex items-center space-x-2">
                    <Checkbox
                      id={lang}
                      checked={selectedLanguages.includes(lang)}
                      onCheckedChange={() => toggleLanguage(lang)}
                    />
                    <Label htmlFor={lang}>{lang}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-end gap-4 px-6 pt-4 pb-6 border-t">
        <Button variant="outline">Back</Button>
        <Button onClick={handleSubmit}>Link Chatbot & Continue</Button>
      </div>
    </div>
  )
}
