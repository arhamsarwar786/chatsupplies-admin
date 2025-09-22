// @ts-nocheck
"use client";
import React, { useState, useEffect, useRef } from "react";
import { RadioGroup } from "@headlessui/react";
import { useCreateChatbotMutation } from "@/src/hooks/useChatbot";
import { useSelector } from "react-redux";
import { useSearchParams } from 'next/navigation';
import { toast } from "sonner";
import { useSearchClientsQuery } from "@/src/hooks/useClients";
import axios from "axios";
import { CheckCircle, Loader2, Trash, Send, BotIcon, ImageIcon, Check, ChevronDown, ChevronUp, Upload, Palette, Settings, FileText, MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation"; // Add this import at the top
import Reset from "./set"
import useExitPrompt from "./restriction";
const tones = [
  { name: "Professional", value: "professional", description: "Formal and business-appropriate" },
  { name: "Friendly", value: "friendly", description: "Warm and approachable" },
  { name: "Casual", value: "casual", description: "Relaxed and informal" },
];

interface UploadedFile {
  name: string;
  status: "uploaded" | "processing";
}


const ChatbotSetup = () => {
  const [createChatbot, { isLoading }] = useCreateChatbotMutation();
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showCreateConfirm, setShowCreateConfirm] = useState(false);
  const { markDirty } = useExitPrompt();
  const role = useSelector((state: RootState) => state.authSlice.role);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmail, setSelectedEmail] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { data: clientResults = [] } = useSearchClientsQuery(
    { query: searchTerm },
    { skip: searchTerm.length < 2 } // skip search unless input is at least 2 chars
  );
  const [progress] = useState(65);
  const [message, setMessage] = useState("");

  // Add state for form validation
  const [formErrors, setFormErrors] = useState({
    name: false,
    description: false,
    industry: false,
    logo: false
  });
  const handleSend = () => {
    if (!message.trim()) return;
    setMessage("");
  };

  // File Upload Refs and States
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoUrl, setLogoUrl] = useState<string>("");

  // Collapsible sections
  const [openSections, setOpenSections] = useState({
    basic: true,
    training: true,
    appearance: true,
    preview: true
  });

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // 1. Add state for the new checkbox
  const [includePdf, setIncludePdf] = useState(false);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = ['image/png', 'image/jpg', 'image/jpeg'];
      if (!validTypes.includes(file.type)) {
        toast.error('Please upload a valid image (PNG, JPG, JPEG)');
        return;
      }

      const previewUrl = URL.createObjectURL(file);
      setLogoPreview(previewUrl);
      setLogoFile(file);
      setLogoUrl(previewUrl);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const maxFileSize = 10 * 1024 * 1024; // 10 MB in bytes

    if (file) {
      // Check file type first
      if (file.type !== 'application/pdf') {
        toast.error('Please upload a PDF file only');
        return;
      }

      // Now, check the file size
      if (file.size > maxFileSize) {
        toast.error('File size exceeds the 10MB limit.');
        return;
      }

      // If both checks pass, proceed with setting the file and updating state
      setPdfFile(file);
      setUploadedFiles([
        ...uploadedFiles,
        { name: file.name, status: "uploaded" },
      ]);
    }
  };


  // Form State
  const [windowBgColor, setWindowBgColor] = useState("#ffffff");
  const [userBubbleColor, setUserBubbleColor] = useState("#e2e8f0");
  const [botBubbleColor, setBotBubbleColor] = useState("#1e40af");
  const [primaryColor, setPrimaryColor] = useState("#3b82f6");
  const [botTextColor, setBotTextColor] = useState("#ffffff");
  const [userTextColor, setUserTextColor] = useState("#000000");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [industry, setIndustry] = useState("");
  const [language, setLanguage] = useState("English");
  const [tone, setTone] = useState("Friendly");
  const [botAvatar, setBotAvatar] = useState("");
  const [welcomeMessage, setWelcomeMessage] = useState(
    "Hi! I'm here to help you with any questions..."
  );
  const [businessHoursStart, setBusinessHoursStart] = useState("default");
  const [businessHoursEnd, setBusinessHoursEnd] = useState("default");
  const [isActive, setIsActive] = useState(true);

  const resetForm = () => {
    setName("");
    setDescription("");
    setIndustry("");
    setLanguage("English");
    setTone("Friendly");
    setBotAvatar("");
    setWelcomeMessage("Hi! I'm here to help you with any questions...");
    setBusinessHoursStart("default");
    setBusinessHoursEnd("default");
    setIsActive(true);
    setWindowBgColor("#ffffff");
    setUserBubbleColor("#e2e8f0");
    setBotBubbleColor("#1e40af");
    setPrimaryColor("#3b82f6");
    setBotTextColor("#ffffff");
    setUserTextColor("#000000");
    setLogoPreview(null);
    setLogoFile(null);
    setLogoUrl("");
    setPdfFile(null);
    setUploadedFiles([]);
    setIncludePdf(true);
    setMessage("");
  };
  const searchParams = useSearchParams();
  const [clientEmail, setClientEmail] = useState('');

  useEffect(() => {
    const emailFromQuery = searchParams.get('clientEmail');
    if (emailFromQuery) {
      setSelectedEmail(emailFromQuery);
      setSearchTerm(emailFromQuery);
    }
  }, [searchParams]);

  const validateForm = () => {
    const errors = {
      name: !name.trim(),
      description: !description.trim(),
      industry: !industry.trim(),
      logo: !logoFile
    };

    setFormErrors(errors);

    // Return true if there are no errors
    return !Object.values(errors).some(error => error);
  };

  const [showLoadingOverlay, setShowLoadingOverlay] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validate form before submission
    if (!validateForm()) {
      toast.error("Please fill in all required fields");
      // Open the basic section if it's closed to show the errors
      if (!openSections.basic) {
        setOpenSections(prev => ({ ...prev, basic: true }));
      }
      return;
    }
    setShowLoadingOverlay(true); // Show loading overlay
    const chatbotForm = {
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
      color_scheme: JSON.stringify({
        primary: primaryColor,
        botTextColor,
        userTextColor
      }),
      theme: "default",
      logo_url: logoUrl || "",
      user_bubble_color: userBubbleColor,
      bot_bubble_color: botBubbleColor,
      window_background_color: windowBgColor,
    };

    const formData = new FormData();
    formData.append("chatbot_form", JSON.stringify(chatbotForm));

    if (includePdf && pdfFile) {
      formData.append("files", pdfFile);
    }
    if (selectedEmail) {
      formData.append("client_email", selectedEmail);
    }
    if (logoFile) {
      formData.append("logo", logoFile);
    }
    try {
      const result = await createChatbot(formData).unwrap();
      toast.success("Chatbot created successfully");
      resetForm();
      console.log("Chatbot creation result:", result);
      setShowLoadingOverlay(false); // Hide loading overlay
      window.location.href = "/dashboard/chatbot-management";
    } catch (error: any) {
      setShowLoadingOverlay(false); // Hide loading overlay
      const errorMessage =
        error?.data?.detail ||
        error?.data?.message ||
        "Error creating chatbot";

      toast.error(errorMessage);

      console.error("Error creating chatbot:", error);
    }
  };

  const handleRemoveFile = (index: number) => {
    setUploadedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index))
  }


  return (
    <div className="w-full relative">
       <input
      value={name}
      onChange={(e) => {
        setName(e.target.value);
        markDirty(); // Mark form as dirty whenever input changes
      }}
    />
      {/* Loading Overlay */}
      {showLoadingOverlay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center"
          style={{
            backdropFilter: "blur(8px)",
            backgroundColor: "rgba(0,0,0,0.35)"
          }}>
          <div className="flex flex-col items-center">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
            <span className="text-lg font-semibold text-white">Creating Chatbot...</span>
          </div>
        </div>
      )}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create Your Chatbot</h1>
          <p className="text-gray-600 mt-2">Follow these steps to build your custom AI assistant</p>
        </div>
        {role === "super_admin" && (
          <div className="w-full max-w-md mt-4">
            <div className="relative">
              <input
                type="text"
                placeholder="🔍 Search client by email..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setSelectedEmail(e.target.value); // Sync with selected email
                  setIsDropdownOpen(true);
                }}
                className="border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 rounded-lg p-2.5 w-full shadow-sm"
              />

              {/* Dropdown results */}
              {isDropdownOpen && searchTerm.length >= 2 && clientResults?.length > 0 && (
                <ul className="absolute z-20 bg-white border border-gray-200 shadow-lg mt-1 w-full rounded-lg overflow-hidden max-h-60 overflow-y-auto">
                  {clientResults.map((client: any) => (
                    <li
                      key={client.id}
                      className="px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-800 cursor-pointer transition-colors"
                      onClick={() => {
                        setSelectedEmail(client.email);
                        setSearchTerm(client.email);
                        setIsDropdownOpen(false);
                      }}
                    >
                      <span className="font-medium">{client.first_name}</span>{" "}
                      <span className="text-gray-500">({client.email})</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Show selected email */}
            {/* {selectedEmail && (
      <div className="mt-3 text-sm text-purple-700 bg-purple-50 p-2 rounded-md shadow-sm border border-purple-200">
        <span className="font-medium">Selected:</span> {selectedEmail}
      </div>
    )} */}
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Setup Section */}
        <div className="bg-white w-full rounded-xl shadow-md border border-gray-200 overflow-hidden">
          <div
            className="flex items-center justify-between p-5 bg-gray-50 cursor-pointer"
            onClick={() => toggleSection('basic')}
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-card rounded-lg">
                <Settings className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Basic Information</h2>
            </div>
            {openSections.basic ? <ChevronUp className="text-gray-500" /> : <ChevronDown className="text-gray-500" />}
          </div>

          {openSections.basic && (
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Chatbot Name <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => {
                      setName(e.target.value);
                      // Clear error when user starts typing
                      if (formErrors.name) {
                        setFormErrors(prev => ({ ...prev, name: false }));
                      }
                    }}
                    placeholder="e.g., Customer Support Bot"
                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${formErrors.name ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-300'
                      }`}
                    required
                  />
                  {formErrors.name && (
                    <p className="text-red-500 text-xs mt-1">Chatbot name is required</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description <span className="text-red-500">*</span></label>
                  <textarea
                    value={description}
                    onChange={e => {
                      setDescription(e.target.value);
                      // Clear error when user starts typing
                      if (formErrors.description) {
                        setFormErrors(prev => ({ ...prev, description: false }));
                      }
                    }}
                    placeholder="What does your chatbot do?"
                    rows={3}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${formErrors.description ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-300'
                      }`}
                    required
                  />
                  {formErrors.description && (
                    <p className="text-red-500 text-xs mt-1">Description is required</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Industry <span className="text-red-500">*</span></label>
                    <select
                      value={industry}
                      onChange={e => {
                        setIndustry(e.target.value);
                        // Clear error when user selects an option
                        if (formErrors.industry) {
                          setFormErrors(prev => ({ ...prev, industry: false }));
                        }
                      }}
                      className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-blue-500 transition ${formErrors.industry ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-300'
                        }`}
                      required
                    >
                      <option value="">Select Industry</option>
                      <option value="Healthcare">Healthcare</option>
                      <option value="Finance">Finance</option>
                      <option value="Education">Education</option>
                      <option value="E-commerce">E-commerce</option>
                      <option value="Technology">Technology</option>
                    </select>
                    {formErrors.industry && (
                      <p className="text-red-500 text-xs mt-1">Industry is required</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Language <span className="text-red-500">*</span></label>
                    <select
                      value={language}
                      onChange={e => setLanguage(e.target.value)}
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Welcome Message <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={welcomeMessage}
                    onChange={e => setWelcomeMessage(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  />
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Upload Logo <span className="text-red-500">*</span></label>
                  <div
                    className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 hover:border-blue-400 transition-all cursor-pointer bg-white ${formErrors.logo ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-300'
                      }`}
                    onClick={() => document.getElementById('logoInput')?.click()}
                  >
                    {logoPreview ? (
                      <div className="text-center">
                        <img
                          src={logoPreview}
                          alt="Logo Preview"
                          className="h-24 w-24 object-contain rounded-lg mx-auto shadow-md"
                        />
                        <p className="text-sm text-blue-600 mt-2">Click to change image</p>
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
                  {formErrors.logo && (
                    <p className="text-red-500 text-xs mt-1">Logo is required</p>
                  )}
                  <input
                    id="logoInput"
                    type="file"
                    accept=".png,.jpg,.jpeg"
                    onChange={handleLogoChange}
                    className="hidden"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Personality Tone</label>
                  <div className="grid grid-cols-1 gap-2">
                    {tones.map((item) => (
                      <div
                        key={item.value}
                        className={`border rounded-lg p-3 cursor-pointer transition-all ${tone === item.name ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}
                        onClick={() => setTone(item.name)}
                      >
                        <div className="flex items-center">
                          <div className={`h-4 w-4 rounded-full border flex items-center justify-center mr-3 ${tone === item.name ? 'border-blue-500 bg-blue-500' : 'border-gray-400'}`}>
                            {tone === item.name && <div className="h-2 w-2 rounded-full bg-white"></div>}
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">{item.name}</p>
                            <p className="text-xs text-gray-500">{item.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Training Data Section */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
          <div
            className="flex items-center justify-between p-5 bg-gray-50 cursor-pointer"
            onClick={() => toggleSection('training')}
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <FileText className="w-5 h-5 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Training Data</h2>
            </div>
            {openSections.training ? <ChevronUp className="text-gray-500" /> : <ChevronDown className="text-gray-500" />}
          </div>

          {openSections.training && (
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-5">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="includePdf"
                    checked={includePdf}
                    onChange={(e) => setIncludePdf(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="includePdf" className="text-sm font-medium text-gray-700">
                    Add PDF documents to knowledge base
                  </label>
                </div>

                <div
                  className={`mt-4 border-2 border-dashed rounded-lg p-8 text-center transition-all ${includePdf
                    ? "cursor-pointer border-gray-300 hover:border-blue-400 bg-white"
                    : "cursor-not-allowed bg-gray-100 border-gray-200 text-gray-400"
                    }`}
                  onClick={() => includePdf && document.getElementById('pdfInput')?.click()}
                >
                  <input
                    id="pdfInput"
                    type="file"
                    className="hidden"
                    accept=".pdf"
                    onChange={handleFileSelect}
                    disabled={!includePdf}
                  />
                  <div className="flex flex-col items-center space-y-3">
                    <div className="p-3 bg-blue-50 rounded-full">
                      <Upload className="w-6 h-6 text-blue-500" />
                    </div>
                    <p className="font-medium">Drag & drop PDF or click to browse</p>
                    <p className="text-sm text-gray-500">Supports PDF only (Max 10MB)</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-700">Uploaded Files</h3>

                {uploadedFiles.length > 0 ? (
                  <ul className="space-y-3">
                    {uploadedFiles.map((file, index) => (
                      <li
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center space-x-2">
                          <FileText className="w-4 h-4 text-blue-500" />
                          <span className="text-sm font-medium truncate max-w-xs">{file.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {file.status === "uploaded" ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          ) : (
                            <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemoveFile(index)}
                            className="text-gray-400 hover:text-red-500 transition"
                          >
                            <Trash className="w-4 h-4" />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No files uploaded yet</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Appearance Section */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
          <div
            className="flex items-center justify-between p-5 bg-gray-50 cursor-pointer"
            onClick={() => toggleSection('appearance')}
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Palette className="w-5 h-5 text-purple-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Appearance & Styling</h2>
            </div>
            {openSections.appearance ? <ChevronUp className="text-gray-500" /> : <ChevronDown className="text-gray-500" />}
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
                        onChange={e => setter(e.target.value)}
                        className="w-8 h-8 cursor-pointer rounded-md border border-gray-300 shadow-sm"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Live Preview */}
              <div className="space-y-4 w-full">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Live Preview</h3>
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
                        <img src={logoPreview} alt="Logo" className="w-8 h-8 rounded-full object-cover" />
                      ) : (
                        <div className="bg-white/20 p-1.5 rounded-full">
                          <BotIcon className="w-5 h-5 text-white" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium">{name || "Customer Support"}</p>
                        <p className="text-xs text-white/80">Online</p>
                      </div>
                    </div>

                    {/* Chat Messages */}
                    <div className="p-4 space-y-4 h-64 overflow-y-auto">
                      {/* Bot Message */}
                      <div className="flex items-start space-x-2">
                        {logoPreview ? (
                          <img src={logoPreview} alt="Logo" className="w-6 h-6 rounded-full mt-0.5 object-cover" />
                        ) : (
                          <BotIcon className="w-5 h-5 mt-0.5" style={{ color: primaryColor }} />
                        )}
                        <div
                          className="rounded-lg px-3 py-2 max-w-xs"
                          style={{ backgroundColor: botBubbleColor, color: botTextColor }}
                        >
                          {welcomeMessage}
                        </div>
                      </div>

                      {/* User Message */}
                      <div className="flex justify-end">
                        <div
                          className="rounded-lg px-3 py-2 max-w-xs"
                          style={{ backgroundColor: userBubbleColor, color: userTextColor }}
                        >
                          What are your business hours?
                        </div>
                      </div>

                      {/* Bot Response */}
                      <div className="flex items-start space-x-2">
                        {logoPreview ? (
                          <img src={logoPreview} alt="Logo" className="w-6 h-6 rounded-full mt-0.5 object-cover" />
                        ) : (
                          <BotIcon className="w-5 h-5 mt-0.5" style={{ color: primaryColor }} />
                        )}
                        <div
                          className="rounded-lg px-3 py-2 max-w-xs"
                          style={{ backgroundColor: botBubbleColor, color: botTextColor }}
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
                          handleSend();       // just send preview message
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
        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
          <div
            className="flex items-center justify-between p-5 bg-gray-50 cursor-pointer"
            onClick={() => toggleSection('preview')}
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <MessageSquare className="w-5 h-5 text-amber-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Preview & Create</h2>
            </div>
            {openSections.preview ? <ChevronUp className="text-gray-500" /> : <ChevronDown className="text-gray-500" />}
          </div>

          {openSections.preview && (
            <div className="p-6">
              <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                <div className="flex-1 space-y-4">
                  <h3 className="text-lg font-medium text-gray-800">Chatbot Summary</h3>

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
                      <p className="font-medium">{tone}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500">Training Files</p>
                      <p className="font-medium">{uploadedFiles.length} PDF(s)</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className={`w-full md:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition flex items-center justify-center shadow-md ${!isLoading ? "cursor-pointer" : "cursor-not-allowed"}`}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="animate-spin w-5 h-5 mr-2 cursor-pointer" />
                          Creating Chatbot...
                        </>
                      ) : (
                        <>
                          <Check className="w-5 h-5 mr-2 cursor-pointer" />
                          Create Chatbot
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowResetConfirm(true)}
                      className="mt-3 text-sm text-gray-500 hover:text-gray-700 transition cursor-pointer"
                    >
                      Reset form
                    </button>
                    <Reset
                      isOpen={showResetConfirm}
                      onCancel={() => setShowResetConfirm(false)}
                      onConfirm={() => {
                        resetForm();
                        setShowResetConfirm(false);
                      }}
                    />


                  </div>
                </div>

                <div className="w-full md:w-96">
                  <h3 className="text-lg font-medium text-gray-800 mb-4">Final Preview</h3>
                  <div
                    className="border rounded-xl overflow-hidden shadow-lg mx-auto"
                    style={{
                      backgroundColor: windowBgColor,
                      maxWidth: '320px',
                      transform: 'scale(0.9)',
                      transformOrigin: 'top'
                    }}
                  >
                    {/* Chat Header */}
                    <div
                      className="text-white p-4 flex items-center space-x-3"
                      style={{ backgroundColor: primaryColor }}
                    >
                      {logoPreview ? (
                        <img src={logoPreview} alt="Logo" className="w-8 h-8 rounded-full object-cover" />
                      ) : (
                        <div className="bg-white/20 p-1.5 rounded-full">
                          <BotIcon className="w-5 h-5 text-white" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-sm">{name || "Customer Support"}</p>
                        <p className="text-xs text-white/80">Online</p>
                      </div>
                    </div>

                    {/* Chat Messages */}
                    <div className="p-3 space-y-3 h-56 overflow-y-auto">
                      {/* Bot Message */}
                      <div className="flex items-start space-x-2">
                        {logoPreview ? (
                          <img src={logoPreview} alt="Logo" className="w-5 h-5 rounded-full mt-0.5 object-cover" />
                        ) : (
                          <BotIcon className="w-4 h-4 mt-0.5" style={{ color: primaryColor }} />
                        )}
                        <div
                          className="rounded-lg px-3 py-2 text-sm max-w-xs"
                          style={{ backgroundColor: botBubbleColor, color: botTextColor }}
                        >
                          {welcomeMessage}
                        </div>
                      </div>

                      {/* User Message */}
                      <div className="flex justify-end">
                        <div
                          className="rounded-lg px-3 py-2 text-sm max-w-xs"
                          style={{ backgroundColor: userBubbleColor, color: userTextColor }}
                        >
                          Hi, how can you help me?
                        </div>
                      </div>

                      {/* Bot Response */}
                      <div className="flex items-start space-x-2">
                        {logoPreview ? (
                          <img src={logoPreview} alt="Logo" className="w-5 h-5 rounded-full mt-0.5 object-cover" />
                        ) : (
                          <BotIcon className="w-4 h-4 mt-0.5" style={{ color: primaryColor }} />
                        )}
                        <div
                          className="rounded-lg px-3 py-2 text-sm max-w-xs"
                          style={{ backgroundColor: botBubbleColor, color: botTextColor }}
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
                            handleSend();       // just send preview message
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
    </div>
  );
};

export default ChatbotSetup;