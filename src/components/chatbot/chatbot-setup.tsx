// @ts-nocheck
"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { RadioGroup } from "@headlessui/react";
import { useCreateChatbotMutation } from "@/src/hooks/useChatbot";
import { useSelector } from "react-redux";
import { useSearchParams } from 'next/navigation';
import { toast } from "sonner";
import { useSearchClientsQuery } from "@/src/hooks/useClients";
import axios from "axios";
import { CheckCircle, Loader2, Trash, Send, BotIcon, ImageIcon, Check, ChevronDown, ChevronUp, Upload, Palette, Settings, FileText, MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import Reset from "./set"
import useExitPrompt from "./restriction";
import ConfirmationPopup from "./confirmationPopup";
import LivePreview from "./live-preview"

interface UploadedFile {
  name: string;
  status: "uploaded" | "processing";
}

// --- DEBOUNCE UTILITY FUNCTION ---
/**
 * Returns a function that delays invoking func until after wait milliseconds have elapsed 
 * since the last time the debounced function was invoked.
 */
const debounce = (func, delay) => {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
};
// ----------------------------------


const ChatbotSetup = () => {
  const [createChatbot, { isLoading }] = useCreateChatbotMutation();
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showCreateConfirm, setShowCreateConfirm] = useState(false);
  const { showPrompt, confirmLeave, cancelLeave, markDirty } = useExitPrompt();
  const role = useSelector((state: RootState) => state.authSlice.role);
  
  // 1. State for immediate input value
  const [searchInput, setSearchInput] = useState('');
  
  // 2. State for the actual search term (triggers API call)
  const [searchTerm, setSearchTerm] = useState('');
  
  const [selectedEmail, setSelectedEmail] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  // Add search status state
  const [searchStatus, setSearchStatus] = useState<'idle' | 'loading' | 'success' | 'not_found' | 'error'>('idle');
  
  // 3. Debounced function to update the actual searchTerm
  const debouncedSetSearchTerm = useCallback(
    debounce((value) => {
      // Only set the search term if it meets the minimum length to avoid initial empty search
      if (value.length >= 1) {
        setSearchTerm(value);
      } else {
        setSearchTerm(''); // Clear term if typing less than min length
      }
    }, 500), // 500ms debounce delay
    []
  );

  const { data: clientResults = [], error: searchError } = useSearchClientsQuery(
    { query: searchTerm },
    // Skip query if searchTerm is empty or too short (controlled by debounced function)
    { skip: searchTerm.length < 1 } 
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

  // Add state for the new checkbox
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
  const [windowBgColor, setWindowBgColor] = useState("#800000");
  const [userBubbleColor, setUserBubbleColor] = useState("#e2e8f0");
  const [botBubbleColor, setBotBubbleColor] = useState("#1e40af");
  const [primaryColor, setPrimaryColor] = useState("#3b82f6");
  const [botTextColor, setBotTextColor] = useState("#ffffff");
  const [userTextColor, setUserTextColor] = useState("#000000");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [industry, setIndustry] = useState("");
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
    setSearchStatus('idle');
  };
  const searchParams = useSearchParams();
  const [clientEmail, setClientEmail] = useState('');

  // 4. Update useEffect to use searchInput and searchTerm for initialization
  useEffect(() => {
    const emailFromQuery = searchParams.get('clientEmail');
    if (emailFromQuery) {
      setSelectedEmail(emailFromQuery);
      setSearchInput(emailFromQuery); // Initialize immediate input state
      setSearchTerm(emailFromQuery); // Initialize API trigger state
      setSearchStatus('success');
    }
  }, [searchParams]);

  // 5. Input change handler that uses debounce
  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setSearchInput(value); // Update immediate input state
    setSelectedEmail(value); // Sync with selected email
    setIsDropdownOpen(true);
    markDirty();

    // Call the debounced function. It will handle the minimum length check internally 
    // before updating searchTerm
    debouncedSetSearchTerm(value);
    
    // Immediate visual feedback: show loading spinner as soon as typing starts
    if (value.length > 0) {
        setSearchStatus('loading');
    } else {
        setSearchStatus('idle');
    }
  };


  // Add useEffect to handle search status updates based on query results
  useEffect(() => {
    if (searchTerm.length >= 1) {
      // Check for loading via query (if useSearchClientsQuery provided isFetching, that'd be better)
      // For now, rely on result presence/absence
      
      // If results are available and match the current active search term
      if (clientResults && clientResults.length > 0) {
        setSearchStatus("success");
      } 
      // If search completed and found nothing
      else if (clientResults && clientResults.length === 0) {
        setSearchStatus("not_found");
      }
    } 
    
    // Handle error state separately
    if (searchError) {
      setSearchStatus('error');
    } 
    // If the input is active but the debounce hasn't triggered an API call yet
    // or if the search term is below the minimum length but the user is typing
    else if (searchInput.length > 0 && searchStatus !== 'success' && searchStatus !== 'not_found') {
       setSearchStatus("loading");
    } else if (searchInput.length === 0) {
       setSearchStatus("idle");
    }

  }, [clientResults, searchError, searchTerm, searchInput, searchStatus]);


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
      industry,
      bot_avatar: botAvatar,
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
    if (role === "super_admin" && selectedEmail) {
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

  // create Chatbot button disable condition
  const isFormComplete =
    name.trim() !== "" &&
    description.trim() !== "" &&
    industry.trim() !== "" &&
    welcomeMessage.trim() !== "" &&
    !!logoFile &&
    (role === "super_admin" ? selectedEmail.trim() !== "" : true);




  return (
    <>

      <div className="w-full relative">
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
                {/* Search Icon on the left */}
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  🔍
                </div>

                <input
                  type="text"
                  placeholder="Search client by email..."
                  // Use the immediate input state for value
                  value={searchInput} 
                  // Use the new debounced input handler
                  onChange={handleSearchInputChange} 
                  className="border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 rounded-lg p-2.5 w-full shadow-sm pl-10 pr-10" // Added padding for icons
                />

                {/* Loading indicator */}
                {/* Show loading when user is typing (length > 0) and the final status isn't yet reached */}
                {searchStatus === 'loading' && searchInput.length > 0 && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
                  </div>
                )}


                {/* Success state - user selected from dropdown */}
                {searchStatus === 'success' && selectedEmail && searchInput === selectedEmail && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <Check className="w-4 h-4 text-green-500" />
                  </div>
                )}

                {/* Not found state - search completed but no results (uses current input length) */}
                {searchStatus === 'not_found' && searchInput.length >= 1 && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <span className="text-gray-400 text-sm">No results</span>
                  </div>
                )}

                {/* Error state */}
                {searchStatus === 'error' && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <span className="text-red-400 text-sm">Error</span>
                  </div>
                )}

                {/* ✅ Confirmation Modal must be outside handlers */}
                <ConfirmationPopup
                  open={showPrompt}
                  onConfirm={confirmLeave}
                  onCancel={cancelLeave}
                />
                {/* Dropdown results - Only show if open, input is long enough, and results exist */}
                {isDropdownOpen && searchInput.length >= 1 && clientResults?.length > 0 && (
                  <ul className="absolute z-20 bg-white border border-gray-200 shadow-lg mt-1 w-full rounded-lg overflow-hidden max-h-60 overflow-y-auto">
                    {clientResults.map((client: any) => (
                      <li
                        key={client.id}
                        className="px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-800 cursor-pointer transition-colors"
                        onClick={() => {
                          setSelectedEmail(client.email);
                          setSearchInput(client.email); // Set input field value
                          setSearchTerm(client.email); // Set API trigger value
                          setIsDropdownOpen(false);
                          setSearchStatus('success'); // Set success when user selects
                          markDirty();
                        }}
                      >
                        <span className="font-medium">{client.first_name}</span>{" "}
                        <span className="text-gray-500">({client.email})</span>
                      </li>
                    ))}

                    {/* ✅ Modal belongs outside event handlers */}
                    <ConfirmationPopup
                      open={showPrompt}
                      onConfirm={confirmLeave}
                      onCancel={cancelLeave}
                    />
                  </ul>

                )}
              </div>
              {/* Status message below search input */}
              <div className="mt-1">
                {searchStatus === 'loading' && searchInput.length >= 1 && (
                  <p className="text-xs text-blue-600">Searching clients...</p>
                )}
                {searchStatus === 'not_found' && searchInput.length >= 1 && (
                  <p className="text-xs text-amber-600">No clients found with that email</p>
                )}
                {searchStatus === 'error' && (
                  <p className="text-xs text-red-600">Search failed. Please try again.</p>
                )}
                {searchStatus === 'success' && selectedEmail && searchInput === selectedEmail && (
                  <p className="text-xs text-green-600">Client selected: {selectedEmail}</p>
                )}
              </div>
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
                        markDirty();
                        // Clear error when user starts typing
                        if (formErrors.name) {
                          setFormErrors(prev => ({ ...prev, name: false }));
                        }
                      }}
                      placeholder="e.g., Customer Support Bot"
                      className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${formErrors.name ? "border-red-500 ring-2 ring-red-200" : "border-gray-300"
                        }`}
                      required

                    />
                    {/* Modal moved OUTSIDE the input */}
                    <ConfirmationPopup
                      open={showPrompt}
                      onConfirm={confirmLeave}
                      onCancel={cancelLeave}
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
                        markDirty();
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
                    <div className="w-full md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Industry <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={industry}
                        onChange={(e) => {
                          setIndustry(e.target.value);
                          markDirty();

                          if (formErrors.industry) {
                            setFormErrors((prev) => ({ ...prev, industry: false }));
                          }
                        }}
                        className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${formErrors.industry
                          ? "border-red-500 ring-2 ring-red-200"
                          : "border-gray-300"
                          }`}
                        required
                      >
                        <option value="">Select Industry</option>
                        <option value="Healthcare">Healthcare</option>
                        <option value="Finance">Finance</option>
                        <option value="Education">Education</option>
                        <option value="E-commerce">E-commerce</option>
                        <option value="Technology">Technology</option>
                        <option value="Other">Other</option>
                      </select>

                      {/* Popup correctly placed outside */}
                      <ConfirmationPopup
                        open={showPrompt}
                        onConfirm={confirmLeave}
                        onCancel={cancelLeave}
                      />
                      {formErrors.industry && (
                        <p className="text-red-500 text-xs mt-1">Industry is required</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Welcome Message <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={welcomeMessage}
                      onChange={(e) => {
                        setWelcomeMessage(e.target.value);
                        markDirty(); // mark form as dirty
                      }}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    />
                    <ConfirmationPopup
                      open={showPrompt}
                      onConfirm={confirmLeave}
                      onCancel={cancelLeave}
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
                      onChange={(e) => {
                        markDirty(); // mark form as dirty
                        handleLogoChange(e);
                      }}
                      className="hidden"
                    />

                    <ConfirmationPopup
                      open={showPrompt}
                      onConfirm={confirmLeave}
                      onCancel={cancelLeave}
                    />
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
                      onChange={(e) => {
                        setIncludePdf(e.target.checked);
                        markDirty(); // mark form as dirty
                      }}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <ConfirmationPopup
                      open={showPrompt}
                      onConfirm={confirmLeave}
                      onCancel={cancelLeave}
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
                      onChange={(e) => {
                        handleFileSelect(e);
                        markDirty(); // mark form as dirty
                      }}
                      disabled={!includePdf}
                    />
                    <ConfirmationPopup
                      open={showPrompt}
                      onConfirm={confirmLeave}
                      onCancel={cancelLeave}
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
                {/* Live Preview - Using the separate component */}
                <LivePreview
                  primaryColor={primaryColor}
                  windowBgColor={windowBgColor}
                  botBubbleColor={botBubbleColor}
                  botTextColor={botTextColor}
                  userBubbleColor={userBubbleColor}
                  userTextColor={userTextColor}
                  name={name}
                  welcomeMessage={welcomeMessage}
                  logoPreview={logoPreview}
                  message={message}
                  setMessage={setMessage}
                  handleSend={handleSend}
                />
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
                        <p className="text-sm text-gray-500">Training Files</p>
                        <p className="font-medium">{uploadedFiles.length} PDF(s)</p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-200 flex items-center justify-start gap-3">
                      <button
                        type="submit"
                        disabled={!isFormComplete || isLoading}
                        className={`w-full md:w-auto px-6 py-3 text-white rounded-lg font-medium transition flex items-center justify-center shadow-md ${!isFormComplete || isLoading
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
                          }`}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="animate-spin w-5 h-5 mr-2" />
                            Creating Chatbot...
                          </>
                        ) : (
                          <>
                            <Check className="w-5 h-5 mr-2" />
                            Create Chatbot
                          </>
                        )}
                      </button>


                      <button
                        type="button"
                        onClick={() => setShowResetConfirm(true)}
                        className="px-6 py-3 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium transition cursor-pointer shadow-sm"
                      >
                        Reset
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
                    {/* Final Preview matching Live Preview design */}
                    <LivePreview
                      primaryColor={primaryColor}
                      windowBgColor={windowBgColor}
                      botBubbleColor={botBubbleColor}
                      botTextColor={botTextColor}
                      userBubbleColor={userBubbleColor}
                      userTextColor={userTextColor}
                      name={name}
                      welcomeMessage={welcomeMessage}
                      logoPreview={logoPreview}
                      message={message}
                      setMessage={setMessage}
                      handleSend={handleSend}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </form>
      </div>
    </>
  );
};

export default ChatbotSetup;