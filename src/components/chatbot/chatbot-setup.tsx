"use client";
import React from 'react'
import { useState } from "react"
import { RadioGroup } from "@headlessui/react"


const tones = [
  { name: "Professional", value: "professional" },
  { name: "Friendly", value: "friendly" },
  { name: "Casual", value: "casual" },
]

const ChatbotSetup = () => {
   const [tone, setTone] = useState("professional")
  return (
<div >
      {/* Progress Stepper */}
      <div className="flex-col space-y-6 items-center w-full justify-between ">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Chatbot Creation Process</h2>
          <p className="text-gray-500 text-sm">Follow these steps to create your chatbot from start to finish</p>
        </div>
           {/* Step Indicator */}
      <div className="flex items-center space-x-8 mb-8">
        <div className="flex flex-col items-center text-indigo-600 font-medium">
          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-indigo-600 text-white">1</div>
          <span className="mt-1 text-xs">Setup</span>
        </div>
        <div className="w-8 h-1 bg-indigo-300 rounded" />
        <div className="flex flex-col items-center text-gray-400">
          <div className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300">2</div>
          <span className="mt-1 text-xs">Training</span>
        </div>
        <div className="w-8 h-1 bg-gray-200 rounded" />
        <div className="flex flex-col items-center text-gray-400">
          <div className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300">3</div>
          <span className="mt-1 text-xs">Testing</span>
        </div>
        <div className="w-8 h-1 bg-gray-200 rounded" />
        <div className="flex flex-col items-center text-gray-400">
          <div className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300">4</div>
          <span className="mt-1 text-xs">Deploy</span>
        </div>
      </div>
      </div>
      {/* Form Section */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Side Form */}
        <div className="md:col-span-2 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Basic Setup & Configuration</h3>

          <div>
            <label className="text-sm font-medium text-gray-700">Chatbot Name</label>
            <input
              type="text"
              placeholder="Enter chatbot name"
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Description</label>
            <textarea
              placeholder="Describe your chatbot's purpose"
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Industry</label>
              <select className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option>Select Industry</option>
                <option>Healthcare</option>
                <option>Finance</option>
                <option>Education</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Language</label>
              <select className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option>English</option>
                <option>French</option>
                <option>Urdu</option>
              </select>
            </div>
          </div>
        </div>

        {/* Right Side Avatar & Personality */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-700">Bot Avatar & Personality</h3>
          <div className="flex gap-3">
            {/* Dummy avatars */}
            <div className="w-14 h-14 bg-indigo-100 rounded-lg flex items-center justify-center border-2 border-indigo-500">
              🤖
            </div>
            <div className="w-14 h-14 bg-green-100 rounded-lg flex items-center justify-center border">
              🧑‍💼
            </div>
            <div className="w-14 h-14 bg-purple-100 rounded-lg flex items-center justify-center border">
              😊
            </div>
          </div>

          <RadioGroup value={tone} onChange={setTone}>
            <RadioGroup.Label className="text-sm font-medium text-gray-700">Personality Tone</RadioGroup.Label>
            <div className="mt-2 space-y-1">
              {tones.map((item) => (
                <RadioGroup.Option key={item.value} value={item.value}>
                  {({ checked }) => (
                    <div className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        checked={checked}
                        onChange={() => {}}
                        className="form-radio text-indigo-600"
                      />
                      <span className="text-sm text-gray-800">{item.name}</span>
                    </div>
                  )}
                </RadioGroup.Option>
              ))}
            </div>
          </RadioGroup>
        </div>
      </div>
    </div>
  )
}

export default ChatbotSetup