// @ts-nocheck
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
  Settings,
  ChevronUp,
  ChevronDown,
  Upload,
  FileText,
  CheckCircle,
  Trash,
  Palette,
  MessageSquare, // Added MessageSquare import
  Check, // Added Check import
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
  const { data: chatbotData, isLoading: isFetching } = useGetChatbotByIdQuery(
    chatbotId!,
    {
      skip: !chatbotId,
    }
  );
  const [updateChatbot, { isLoading }] = useUpdateChatbotMutation();

  // Form State
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [industry, setIndustry] = useState("");
  const [language, setLanguage] = useState("English");
  // Correctly initialize tone state with a value from the `tones` array's `value` property
  const [tone, setTone] = useState("friendly");
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

  // Placeholder for uploaded files to fix the reference error in the summary section
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);

  // Section toggling
  const [openSections, setOpenSections] = useState({
    appearance: true,
    preview: true, // Added a default state for the preview section
  });

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section as keyof typeof prev],
    }));
  };

  // Pre-fill data when chatbot loads
  useEffect(() => {
    if (chatbotData) {
      setName(chatbotData.name || "");
      setDescription(chatbotData.description || "");
      setIndustry(chatbotData.industry || "");
      setLanguage(chatbotData.language || "English");
      // Set the tone state using the 'value' from the tones array, not the 'name'
      const initialTone =
        tones.find((t) => t.value === chatbotData.personality_tone)?.value ||
        "friendly";
      setTone(initialTone);

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
      personality_tone: tone, // The value of tone is now correct
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

    try {
      const result = await updateChatbot({
        chatbotId,
        body: chatbotForm,
      });

      // Check if the mutation was successful
      if ('data' in result) {
        toast.success("Chatbot updated successfully");
      } else if ('error' in result) {
        console.error("Error updating chatbot:", result.error);
        toast.error("Error updating chatbot");
      }
    } catch (error) {
      console.error("Unexpected error updating chatbot:", error);
      toast.error("Error updating chatbot");
    }
  };

  // Added a placeholder function to fix reference error
  const resetForm = () => {
    // Implement form reset logic here
    console.log("Form reset initiated");
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
      <div className="flex-col space-y-6 items-center w-full justify-between ">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">Edit Chatbot</h2>
          <p className="text-gray-500 text-sm">Update your chatbot settings</p>
        </div>
      </div>

      {/* Basic Information Section */}
      <div className="bg-white w-full rounded-xl shadow-md border border-gray-200 overflow-hidden mb-6">
        <div className="flex items-center justify-between p-5 bg-gray-50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-card rounded-lg">
              <Settings className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800">
              Basic Information
            </h2>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Chatbot Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Customer Support Bot"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What does your chatbot do?"
                rows={3}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Industry <span className="text-red-500">*</span>
                </label>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  required
                >
                  <option value="">Select Industry</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Finance">Finance</option>
                  <option value="Education">Education</option>
                  <option value="E-commerce">E-commerce</option>
                  <option value="Technology">Technology</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Language <span className="text-red-500">*</span>
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  required
                >
                  <option value="English">English</option>
                  <option value="French">French</option>
                  <option value="Spanish">Spanish</option>
                  <option value="German">German</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Welcome Message <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={welcomeMessage}
                onChange={(e) => setWelcomeMessage(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Upload Logo
              </label>
              <div
                className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-400 transition-all cursor-pointer bg-white"
                onClick={() => document.getElementById("logoInput")?.click()}
              >
                {logoPreview ? (
                  <div className="text-center">
                    <img
                      src={logoPreview}
                      alt="Logo Preview"
                      className="h-24 w-24 object-contain rounded-lg mx-auto shadow-md"
                    />
                    <p className="text-sm text-blue-600 mt-2">
                      Click to change image
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-gray-400">
                    <div className="p-3 bg-blue-50 rounded-full mb-3">
                      <Upload className="w-6 h-6 text-blue-500" />
                    </div>
                    <p className="text-sm font-medium">Click to upload logo</p>
                    <p className="text-xs mt-1">PNG, JPG, JPEG (Max 5MB)</p>
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Personality Tone
              </label>
              <RadioGroup value={tone} onChange={setTone} className="grid grid-cols-1 gap-2">
                {tones.map((item) => (
                  <RadioGroup.Option
                    key={item.value}
                    value={item.value}
                    className={({ active, checked }) =>
                      `border rounded-lg p-3 cursor-pointer transition-all ${checked ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                      }`
                    }
                  >
                    {({ active, checked }) => (
                      <div className="flex items-center">
                        <div
                          className={`h-4 w-4 rounded-full border flex items-center justify-center mr-3 ${checked ? "border-blue-500 bg-blue-500" : "border-gray-400"
                          }`}
                        >
                          {checked && (
                            <div className="h-2 w-2 rounded-full bg-white"></div>
                          )}
                        </div>
                        <p className="font-medium text-gray-800">{item.name}</p>
                      </div>
                    )}
                  </RadioGroup.Option>
                ))}
              </RadioGroup>
            </div>
          </div>
        </div>
      </div>

      {/* Appearance Section */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        <div
          className="flex items-center justify-between p-5 bg-gray-50 cursor-pointer"
          onClick={() => toggleSection("appearance")}
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Palette className="w-5 h-5 text-purple-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800">
              Appearance & Styling
            </h2>
          </div>
          {openSections.appearance ? (
            <ChevronUp className="text-gray-500" />
          ) : (
            <ChevronDown className="text-gray-500" />
          )}
        </div>

        {openSections.appearance && (
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-5 w-full">
              {[
                {
                  label: "Primary Color",
                  description: "Header, buttons, and accents",
                  value: primaryColor,
                  setter: setPrimaryColor,
                },
                {
                  label: "Window Background",
                  description: "Chat window background color",
                  value: windowBgColor,
                  setter: setWindowBgColor,
                },
                {
                  label: "User Bubble Color",
                  description: "Color of messages sent by users",
                  value: userBubbleColor,
                  setter: setUserBubbleColor,
                },
                {
                  label: "Bot Bubble Color",
                  description: "Color of messages sent by the bot",
                  value: botBubbleColor,
                  setter: setBotBubbleColor,
                },
                {
                  label: "User Text Color",
                  description: "Text color in user messages",
                  value: userTextColor,
                  setter: setUserTextColor,
                },
                {
                  label: "Bot Text Color",
                  description: "Text color in bot messages",
                  value: botTextColor,
                  setter: setBotTextColor,
                },
              ].map(({ label, description, value, setter }) => (
                <div
                  key={label}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-800 mb-1">
                      {label}
                    </label>
                    <p className="text-xs text-gray-500">{description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded-full border border-gray-300 shadow-sm"
                      style={{ backgroundColor: value }}
                    ></div>
                    <input
                      type="color"
                      value={value}
                      onChange={(e) => setter(e.target.value)}
                      className="w-8 h-8 cursor-pointer rounded-md border border-gray-300 shadow-sm"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Live Preview */}
            <div className="space-y-4 w-full">
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Live Preview
              </h3>
              <div
                className="border flex flex-col justify-between rounded-xl overflow-hidden shadow-lg w-full h-[450px]"
                style={{ backgroundColor: windowBgColor }}
              >
                <div>
                  {/* Chat Header */}
                  <div
                    className="text-white p-4 flex items-center space-x-3"
                    style={{ backgroundColor: primaryColor }}
                  >
                    {logoPreview ? (
                      <img
                        src={logoPreview}
                        alt="Logo"
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="bg-white/20 p-1.5 rounded-full">
                        <BotIcon className="w-5 h-5 text-white" />
                      </div>
                    )}
                    <div>
                      <p className="font-medium">
                        {name || "Customer Support"}
                      </p>
                      <p className="text-xs text-white/80">Online</p>
                    </div>
                  </div>

                  {/* Chat Messages */}
                  <div className="p-4 space-y-4 h-64 overflow-y-auto">
                    {/* Bot Message */}
                    <div className="flex items-start space-x-2">
                      {logoPreview ? (
                        <img
                          src={logoPreview}
                          alt="Logo"
                          className="w-6 h-6 rounded-full mt-0.5 object-cover"
                        />
                      ) : (
                        <BotIcon
                          className="w-5 h-5 mt-0.5"
                          style={{ color: primaryColor }}
                        />
                      )}
                      <div
                        className="rounded-lg px-3 py-2 max-w-xs"
                        style={{
                          backgroundColor: botBubbleColor,
                          color: botTextColor,
                        }}
                      >
                        {welcomeMessage}
                      </div>
                    </div>

                    {/* User Message */}
                    <div className="flex justify-end">
                      <div
                        className="rounded-lg px-3 py-2 max-w-xs"
                        style={{
                          backgroundColor: userBubbleColor,
                          color: userTextColor,
                        }}
                      >
                        What are your business hours?
                      </div>
                    </div>

                    {/* Bot Response */}
                    <div className="flex items-start space-x-2">
                      {logoPreview ? (
                        <img
                          src={logoPreview}
                          alt="Logo"
                          className="w-6 h-6 rounded-full mt-0.5 object-cover"
                        />
                      ) : (
                        <BotIcon
                          className="w-5 h-5 mt-0.5"
                          style={{ color: primaryColor }}
                        />
                      )}
                      <div
                        className="rounded-lg px-3 py-2 max-w-xs"
                        style={{
                          backgroundColor: botBubbleColor,
                          color: botTextColor,
                        }}
                      >
                        We're open Monday to Friday, 9 AM to 6 PM EST.
                      </div>
                    </div>
                  </div>
                </div>

                {/* Chat Input */}
                <div className="flex items-center p-3 border-t  bg-white">
                  <input
                    type="text"
                    placeholder="Type your message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault(); // stop form submission
                        handleSend(); // just send preview message
                      }
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Final Preview Section */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden mt-6">
        <div
          className="flex items-center justify-between p-5 bg-gray-50 cursor-pointer"
          onClick={() => toggleSection("preview")}
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              <MessageSquare className="w-5 h-5 text-amber-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800">
              Preview & Create
            </h2>
          </div>
          {openSections.preview ? (
            <ChevronUp className="text-gray-500" />
          ) : (
            <ChevronDown className="text-gray-500" />
          )}
        </div>

        {openSections.preview && (
          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
              <div className="flex-1 space-y-4">
                <h3 className="text-lg font-medium text-gray-800">
                  Chatbot Summary
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-medium">{name || "Not specified"}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500">Industry</p>
                    <p className="font-medium">{industry || "Not specified"}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500">Personality</p>
                    {/* Display the tone name, not the value */}
                    <p className="font-medium">
                      {tones.find((t) => t.value === tone)?.name || "N/A"}
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500">Training Files</p>
                    <p className="font-medium">
                      {uploadedFiles.length} PDF(s)
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full md:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition flex items-center justify-center shadow-md ${!isLoading ? "cursor-pointer" : "cursor-not-allowed"
                    }`}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="animate-spin w-5 h-5 mr-2 cursor-pointer" />
                        Updating Chatbot...
                      </>
                    ) : (
                      <>
                        <Check className="w-5 h-5 mr-2 cursor-pointer" />
                        Update Chatbot
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={resetForm}
                    className="mt-3 text-sm text-gray-500 hover:text-gray-700 transition cursor-pointer"
                  >
                    Reset form
                  </button>
                </div>
              </div>

              <div className="w-full md:w-96">
                <h3 className="text-lg font-medium text-gray-800 mb-4">
                  Final Preview
                </h3>
                <div
                  className="border rounded-xl overflow-hidden shadow-lg mx-auto"
                  style={{
                    backgroundColor: windowBgColor,
                    maxWidth: "320px",
                    transform: "scale(0.9)",
                    transformOrigin: "top",
                  }}
                >
                  {/* Chat Header */}
                  <div
                    className="text-white p-4 flex items-center space-x-3"
                    style={{ backgroundColor: primaryColor }}
                  >
                    {logoPreview ? (
                      <img
                        src={logoPreview}
                        alt="Logo"
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="bg-white/20 p-1.5 rounded-full">
                        <BotIcon className="w-5 h-5 text-white" />
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-sm">
                        {name || "Customer Support"}
                      </p>
                      <p className="text-xs text-white/80">Online</p>
                    </div>
                  </div>

                  {/* Chat Messages */}
                  <div className="p-3 space-y-3 h-56 overflow-y-auto">
                    {/* Bot Message */}
                    <div className="flex items-start space-x-2">
                      {logoPreview ? (
                        <img
                          src={logoPreview}
                          alt="Logo"
                          className="w-5 h-5 rounded-full mt-0.5 object-cover"
                        />
                      ) : (
                        <BotIcon
                          className="w-4 h-4 mt-0.5"
                          style={{ color: primaryColor }}
                        />
                      )}
                      <div
                        className="rounded-lg px-3 py-2 text-sm max-w-xs"
                        style={{
                          backgroundColor: botBubbleColor,
                          color: botTextColor,
                        }}
                      >
                        {welcomeMessage}
                      </div>
                    </div>

                    {/* User Message */}
                    <div className="flex justify-end">
                      <div
                        className="rounded-lg px-3 py-2 text-sm max-w-xs"
                        style={{
                          backgroundColor: userBubbleColor,
                          color: userTextColor,
                        }}
                      >
                        Hi, how can you help me?
                      </div>
                    </div>

                    {/* Bot Response */}
                    <div className="flex items-start space-x-2">
                      {logoPreview ? (
                        <img
                          src={logoPreview}
                          alt="Logo"
                          className="w-5 h-5 rounded-full mt-0.5 object-cover"
                        />
                      ) : (
                        <BotIcon
                          className="w-4 h-4 mt-0.5"
                          style={{ color: primaryColor }}
                        />
                      )}
                      <div
                        className="rounded-lg px-3 py-2 text-sm max-w-xs"
                        style={{
                          backgroundColor: botBubbleColor,
                          color: botTextColor,
                        }}
                      >
                        I can answer questions about our products and services.
                      </div>
                    </div>
                  </div>

                  {/* Chat Input */}
                  <div className="flex items-center p-2 border-t bg-white">
                    <input
                      type="text"
                      placeholder="Type your message..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault(); // stop form submission
                          handleSend(); // just send preview message
                        }
                      }}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />

                    <button
                      className="text-white px-3 py-1.5 rounded-r-lg flex items-center justify-center text-sm"
                      style={{ backgroundColor: primaryColor }}
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </form>
  );
};

export default EditChatbot;