// ts-nocheck
"use client";
import React, { useState, useRef, useEffect } from "react";
import { RadioGroup } from "@headlessui/react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import {
  useUpdateChatbotMutation,
  useGetChatbotByIdQuery,
} from "@/src/hooks/useChatbot";
import {
  Loader2,
  Send,
  BotIcon,
  ImageIcon,
} from "lucide-react";

const tones = [
  { name: "Professional", value: "professional" },
  { name: "Friendly", value: "friendly" },
  { name: "Casual", value: "casual" },
];

const EditChatbot = () => {
  const params = useParams();
  const chatbotId = params?.id ? Number(params.id) : undefined;

  // API Hooks
  const { data: chatbotData, isLoading: isFetching } = useGetChatbotByIdQuery(chatbotId!, {
    skip: !chatbotId,
  });
  const [updateChatbot, { isLoading }] = useUpdateChatbotMutation();

  // Form State
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [industry, setIndustry] = useState("");
  const [language, setLanguage] = useState("English");
  const [tone, setTone] = useState("Friendly");
  const [welcomeMessage, setWelcomeMessage] = useState("");
  const [businessHoursStart, setBusinessHoursStart] = useState("");
  const [businessHoursEnd, setBusinessHoursEnd] = useState("");
  const [isActive, setIsActive] = useState(true);

  // Colors
  const [windowBgColor, setWindowBgColor] = useState("#ffffff");
  const [userBubbleColor, setUserBubbleColor] = useState("#e2e8f0");
  const [botBubbleColor, setBotBubbleColor] = useState("#1e40af");
  const [primaryColor, setPrimaryColor] = useState("#133242");
  const [botTextColor, setBotTextColor] = useState("#ffffff");
  const [userTextColor, setUserTextColor] = useState("#000000");

  // Logo
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoUrl, setLogoUrl] = useState<string>("");

  // Message preview
  const [message, setMessage] = useState("");

  // Pre-fill data when chatbot loads
  useEffect(() => {
    if (chatbotData) {
      setName(chatbotData.name || "");
      setDescription(chatbotData.description || "");
      setIndustry(chatbotData.industry || "");
      setLanguage(chatbotData.language || "English");
      setTone(chatbotData.personality_tone || "Friendly");
      setWelcomeMessage(chatbotData.welcome_message || "");
      setBusinessHoursStart(chatbotData.business_hours_start || "");
      setBusinessHoursEnd(chatbotData.business_hours_end || "");
      setIsActive(chatbotData.is_active ?? true);

      // Fix for double-encoded color_scheme
      if (chatbotData.color_scheme) {
        try {
          const parsed =
            typeof chatbotData.color_scheme === "string"
              ? JSON.parse(chatbotData.color_scheme)
              : chatbotData.color_scheme;

          if (parsed && typeof parsed === "object") {
            setPrimaryColor(parsed.primary || "#133242");
            setBotTextColor(parsed.botTextColor || "#ffffff");
            setUserTextColor(parsed.userTextColor || "#000000");
          }
        } catch (err) {
          console.warn("Failed to parse color_scheme:", chatbotData.color_scheme);
        }
      }

      setUserBubbleColor(chatbotData.user_bubble_color || "#e2e8f0");
      setBotBubbleColor(chatbotData.bot_bubble_color || "#1e40af");
      setWindowBgColor(chatbotData.window_background_color || "#ffffff");

      if (chatbotData.logo_url) {
        setLogoUrl(chatbotData.logo_url);
        setLogoPreview(chatbotData.logo_url);
      }
    }
  }, [chatbotData]);


  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = ["image/png", "image/jpg", "image/jpeg"];
      if (!validTypes.includes(file.type)) {
        toast.error("Please upload a valid image (PNG, JPG, JPEG)");
        return;
      }
      const previewUrl = URL.createObjectURL(file);
      setLogoPreview(previewUrl);
      setLogoFile(file);
    }
  };

  const handleSend = () => {
    if (!message.trim()) return;
    setMessage("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!chatbotId) {
      toast.error("Chatbot ID is required");
      return;
    }

    const chatbotForm = {
      name,
      description,
      personality_tone: tone,
      industry,
      language,
      welcome_message: welcomeMessage,
      business_hours_start: businessHoursStart,
      business_hours_end: businessHoursEnd,
      is_active: isActive,
      color_scheme: JSON.stringify({
        primary: primaryColor,
        botTextColor,
        userTextColor,
      }),
      theme: "default",
      logo_url: logoUrl || "",
      user_bubble_color: userBubbleColor,
      bot_bubble_color: botBubbleColor,
      window_background_color: windowBgColor,
    };


    const formData = new FormData();
    console.log("Updating chatbot with data:", JSON.stringify(chatbotForm, null, 2));
    formData.append("chatbot_form", JSON.stringify(chatbotForm));


    if (logoFile) {
      formData.append("logo", logoFile);
    }

    try {
      await updateChatbot({
        chatbotId,
        body: chatbotForm,
      }).unwrap();
      toast.success("Chatbot updated successfully");
    } catch (error) {
      console.error("Error updating chatbot:", error);
      toast.error("Error updating chatbot");
    }
  };

  if (isFetching) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin w-6 h-6" />
        <span className="ml-2">Loading chatbot data...</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* ... (First form section for Basic Setup remains the same) ... */}
      <div className="flex-col space-y-6 items-center w-full justify-between ">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">Chatbot Creation Process</h2>
          <p className="text-gray-500 text-sm">Follow these steps to create your chatbot from start to finish</p>
        </div>
      </div>
      {/* Form Section */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
          {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          </div> */}
          {/* <div className="flex items-center gap-2 mt-2">
            <input
              type="checkbox"
              checked={isActive}
              onChange={e => setIsActive(e.target.checked)}
              id="isActive"
              className="form-checkbox"
            />
            <label htmlFor="isActive" className="text-sm text-gray-700">Active</label>
          </div> */}
        </div>
        {/* Right Side Avatar & Personality */}
        <div className="space-y-4">

          {/* <h3 className="text-sm font-semibold text-gray-700">Bot Avatar & Personality</h3> */}
          <div>
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Upload Logo (PNG, JPG, JPEG)
              </label>
              <div
                className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-primary transition-all cursor-pointer bg-white shadow-sm"
                onClick={() => document.getElementById('logoInput')?.click()}
              >
                {logoPreview ? (
                  <img
                    src={logoPreview}
                    alt="Logo Preview"
                    className="h-20 w-20 object-contain rounded-full shadow-md"
                  />
                ) : (
                  <div className="flex flex-col items-center text-gray-400">
                    <ImageIcon className="w-8 h-8 mb-2" />
                    <p className="text-sm">Click to upload image</p>
                    <p className="text-xs mt-1">PNG, JPG, JPEG only</p>
                  </div>
                )}
              </div>
              <input
                id="logoInput"
                type="file"
                accept=".png,.jpg,.jpeg"
                onChange={handleLogoChange}
                className="hidden"
              />
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
      </div>

      <div className="grid md:grid-cols-2 grid-cols-1 w-full  bg-white border border-gray-200 rounded-xl shadow-sm p-6 gap-6">
        <div className="w-full space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Testing & Preview</h3>

          <div
            className="border rounded-xl overflow-hidden shadow"
            style={{ backgroundColor: windowBgColor }}
          >
            {/* Chat Header */}
            <div
              className="text-white p-4 flex items-center space-x-3"
              style={{ backgroundColor: primaryColor }}
            >
              <div className="bg-white/20 p-1.5 rounded-full">
                <BotIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-medium">Customer Support Bot</p>
                <p className="text-xs text-white/80">Online</p>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="p-4 space-y-4 h-64 overflow-y-auto text-sm">
              {/* Bot Message */}
              <div className="flex items-start space-x-2">
                <BotIcon className="w-4 h-4 mt-0.5" style={{ color: primaryColor }} />
                <div
                  className="border rounded-md px-3 py-2 max-w-md"
                  style={{ backgroundColor: botBubbleColor, borderColor: "#e5e7eb", color: botTextColor }}
                >
                  Hello! How can I help you today?
                </div>
              </div>

              {/* User Message */}
              <div className="flex justify-end">
                <div
                  className="text-white rounded-md px-3 py-2 max-w-md"
                  style={{ backgroundColor: userBubbleColor, color: userTextColor, borderColor: "#e5e7eb" }}
                >
                  What are your business hours?
                </div>
              </div>

              {/* Bot Response */}
              <div className="flex items-start space-x-2">
                <BotIcon className="w-4 h-4 mt-0.5" style={{ color: primaryColor }} />
                <div
                  className="border rounded-md px-3 py-2 max-w-md"
                  style={{ backgroundColor: botBubbleColor, borderColor: "#e5e7eb", color: botTextColor }}
                >
                  We&apos;re open Monday to Friday, 9 AM to 6 PM EST. Is there anything specific I can help you with?
                </div>
              </div>
            </div>

            {/* Chat Input */}
            <div className="flex items-center p-3 border-t bg-white">
              <input
                type="text"
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault(); // ⬅️ stop form submit
                    handleSend();       // ⬅️ instead, trigger preview send
                  }
                }}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2"
              />

              <button
                onClick={handleSend}
                className="text-white px-4 py-2 rounded-r-md flex items-center justify-center"
                style={{ backgroundColor: primaryColor }}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-xl">
          {[
            {
              label: "Window Background Color",
              description: "Sets the background color of your chatbot window.",
              value: windowBgColor,
              setter: setWindowBgColor,
            },
            {
              label: "Primary Theme Color",
              description: "Highlights buttons and important elements.",
              value: primaryColor,
              setter: setPrimaryColor,
            },
            {
              label: "User Bubble Color",
              description: "Color of messages sent by the user.",
              value: userBubbleColor,
              setter: setUserBubbleColor,
            },
            {
              label: "Bot Bubble Color",
              description: "Color of messages sent by the bot.",
              value: botBubbleColor,
              setter: setBotBubbleColor,
            },
            {
              label: "Bot Text Color",
              description: "Color of messages text sent by the bot.",
              value: botTextColor,
              setter: setBotTextColor,
            },
            {
              label: "User Text Color",
              description: "Color of messages text sent by the user.",
              value: userTextColor,
              setter: setUserTextColor,
            },
          ].map(({ label, description, value, setter }) => (
            <div
              key={label}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gray-50 dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 transition hover:shadow-md"
            >
              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-800 dark:text-white">
                  {label}
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
              </div>

              <div className="flex items-center gap-3 mt-2 sm:mt-0">
                <div
                  className="w-8 h-8 rounded-full border border-gray-300 shadow-inner"
                  style={{ backgroundColor: value }}
                ></div>
                <input
                  type="color"
                  value={value}
                  onChange={e => setter(e.target.value)}
                  className="w-14 h-10 cursor-pointer rounded-md border border-gray-300 dark:border-gray-600 shadow-sm transition-all hover:scale-105 focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>
            </div>
          ))}
        </div>
        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="mt-6 px-6 py-2 bg-primary hover:bg-primary/80 text-white rounded-md font-semibold transition"
          >
            {isLoading ? "Updating..." : "Update Chatbot"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default EditChatbot;