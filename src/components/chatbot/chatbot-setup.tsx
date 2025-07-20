"use client";
import React, { useState } from "react";
import { RadioGroup } from "@headlessui/react";
import { useCreateChatbotMutation } from "@/src/hooks/useChatbot";
import { toast } from "sonner";

const tones = [
  { name: "Professional", value: "professional" },
  { name: "Friendly", value: "friendly" },
  { name: "Casual", value: "casual" },
];

const ChatbotSetup = () => {
  const [createChatbot, { isLoading }] = useCreateChatbotMutation();

  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [industry, setIndustry] = useState("string");
  const [language, setLanguage] = useState("English");
  const [tone, setTone] = useState("Friendly");
  const [botAvatar, setBotAvatar] = useState("string");
  const [welcomeMessage, setWelcomeMessage] = useState("Hi! I'm here to help you with any questions...");
  const [businessHoursStart, setBusinessHoursStart] = useState("string");
  const [businessHoursEnd, setBusinessHoursEnd] = useState("string");
  const [isActive, setIsActive] = useState(true);

  // Avatar selection handler (for demo, just set string value)
  const handleAvatarSelect = (avatar: string) => setBotAvatar(avatar);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createChatbot({
        name,
        description,
        personality_tone: tone,
        bot_avatar: botAvatar,
        industry,
        language,
        welcome_message: welcomeMessage,
        business_hours_start: businessHoursStart,
        business_hours_end: businessHoursEnd,
        is_active: isActive,
      }).unwrap();
      toast.success("Chatbot created successfully!");
      // Optionally reset form fields here
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to create chatbot.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Progress Stepper */}
      <div className="flex-col space-y-6 items-center w-full justify-between ">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">Chatbot Creation Process</h2>
          <p className="text-gray-500 text-sm">Follow these steps to create your chatbot from start to finish</p>
        </div>
           {/* Step Indicator */}
      {/* <div className="flex items-center space-x-8 mb-8">
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
      </div> */}
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
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Enter chatbot name"
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Describe your chatbot's purpose"
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Industry</label>
              <select
                value={industry}
                onChange={e => setIndustry(e.target.value)}
                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              >
                <option value="string">Select Industry</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Finance">Finance</option>
                <option value="Education">Education</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Language</label>
              <select
                value={language}
                onChange={e => setLanguage(e.target.value)}
                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              >
                <option value="English">English</option>
                <option value="French">French</option>
                <option value="Urdu">Urdu</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Welcome Message</label>
            <input
              type="text"
              value={welcomeMessage}
              onChange={e => setWelcomeMessage(e.target.value)}
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Business Hours Start</label>
              <input
                type="text"
                value={businessHoursStart}
                onChange={e => setBusinessHoursStart(e.target.value)}
                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Business Hours End</label>
              <input
                type="text"
                value={businessHoursEnd}
                onChange={e => setBusinessHoursEnd(e.target.value)}
                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <input
              type="checkbox"
              checked={isActive}
              onChange={e => setIsActive(e.target.checked)}
              id="isActive"
              className="form-checkbox"
            />
            <label htmlFor="isActive" className="text-sm text-gray-700">Active</label>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-md font-semibold hover:bg-indigo-700 transition"
          >
            {isLoading ? "Creating..." : "Create Chatbot"}
          </button>
        </div>
        {/* Right Side Avatar & Personality */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-700">Bot Avatar & Personality</h3>
          <div className="flex gap-3">
            <button
              type="button"
              className={`w-14 h-14 bg-indigo-100 rounded-lg flex items-center justify-center border-2 ${botAvatar === "🤖" ? "border-indigo-500" : "border-transparent"}`}
              onClick={() => handleAvatarSelect("🤖")}
            >
              🤖
            </button>
            <button
              type="button"
              className={`w-14 h-14 bg-green-100 rounded-lg flex items-center justify-center border-2 ${botAvatar === "🧑‍💼" ? "border-green-500" : "border-transparent"}`}
              onClick={() => handleAvatarSelect("🧑‍💼")}
            >
              🧑‍💼
            </button>
            <button
              type="button"
              className={`w-14 h-14 bg-purple-100 rounded-lg flex items-center justify-center border-2 ${botAvatar === "😊" ? "border-purple-500" : "border-transparent"}`}
              onClick={() => handleAvatarSelect("😊")}
            >
              😊
            </button>
          </div>
          <RadioGroup value={tone} onChange={setTone}>
            <RadioGroup.Label className="text-sm font-medium text-gray-700">Personality Tone</RadioGroup.Label>
            <div className="mt-2 space-y-1">
              {tones.map((item) => (
                <RadioGroup.Option key={item.value} value={item.name}>
                  {({ checked }) => (
                    <div className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        checked={tone === item.name}
                        onChange={() => setTone(item.name)}
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
    </form>
  );
};

export default ChatbotSetup;