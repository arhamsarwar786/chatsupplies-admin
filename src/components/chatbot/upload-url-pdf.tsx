"use client";
import React, { useState } from "react";
import { Play, Loader } from "lucide-react"; // Removed Square icon, added below
import { // Removed unused component
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Checkbox } from "@/src/components/ui/checkbox";
import {
  useUploadUrlMutation,
  useUploadRequirementMutation,
} from "@/src/hooks/useTraining";
import { toast } from "sonner";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// =========================================================================
// 🛑 CUSTOM SVG COMPONENT
// =========================================================================

/**
 * Custom SVG icon component for the Stop button, loading the image from the public folder.
 * Assumes 'stop-icon.svg' is available in the public directory.
 */
const StopSvgIcon = ({ className }: { className?: string }) => (
  <img
    src="/stop.svg" // 👈 Assumes 'stop-icon.svg' in the /public folder
    alt="Stop"
    className={className || "h-4 w-4"}
    style={{ filter: 'invert(100%) sepia(100%) saturate(0%) hue-rotate(270deg) brightness(100%) contrast(100%)' }} // Example to ensure SVG is visible on a red button, adjust as needed
  />
);

// =========================================================================
// 🛑 STOP CRAWLING LOGIC
// =========================================================================

// Placeholder for external data refetch (Simulates updating the chatbot status)
const refetch = () => {
  console.log("Simulating refetch to update external chatbot status...");
  // In a real app, this would be a call to invalidate/refetch query data.
};

const stopCrawling = async (chatbotId: number): Promise<void> => {
  // Retrieve authentication data from localStorage
  const token = localStorage.getItem("token");
  const apikey = localStorage.getItem("apikey");

  const headers: HeadersInit = {
    'Content-Type': 'application/x-www-form-urlencoded',
  };

  if (apikey) {
    headers['api-key'] = apikey;
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const body = new URLSearchParams();
  body.append('chatbot_id', chatbotId.toString());

  try {
    const response = await fetch('https://api.chatsupplies.com/training/crawl/stop', {
      method: 'POST',
      headers: headers,
      body: body.toString(), // Send the form data string
    });

    if (!response.ok) {
      let errorMessage = 'Failed to stop crawling';
      try {
        const errorData = await response.json();
        errorMessage = errorData.detail || errorData.message || errorMessage;
      } catch (e) {
        // Ignore if JSON parsing fails, use generic message
      }
      throw new Error(errorMessage);
    }

    // Success case handled by the caller
  } catch (error) {
    console.error('Error stopping crawling:', error);
    throw error;
  }
};

const StopCrawlingButton = ({
  chatbotId,
  status,
  onStopSuccess,
  // 🛑 NEW PROPS for local control
  isLocalProcess,
  stopLocalProcess,
}: {
  chatbotId: number;
  status: string;
  onStopSuccess?: () => void;
  // 🛑 NEW PROPS
  isLocalProcess: boolean;
  stopLocalProcess: () => void;
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const isExternalCrawling = status === "in_progress" || status === "scraping";

  // 🛑 Logic updated to handle both local and external stopping
  const handleStopCrawling = async () => {
    if (isLocalProcess) {
      // Stop the local process immediately
      stopLocalProcess();
      toast.info("Discovery/Scraping process manually stopped.");
      return;
    }

    if (!isExternalCrawling) return; // Should not happen if rendered correctly

    setIsLoading(true);
    try {
      await stopCrawling(chatbotId);
      toast.success("Crawling stopped successfully! Status will update shortly.");
      onStopSuccess?.();
    } catch (error) {
      let errorMessage = "Failed to stop crawling.";
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'object' && error !== null && (error as any).message) {
        errorMessage = (error as any).message;
      }
      toast.error(errorMessage);
      console.error("Stop crawling error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 🛑 Modified className for better integration inside the URL input field
  const buttonText = isLocalProcess ? "Stop Discovery" : (isLoading ? "Stopping..." : "Stop Crawling");

  // 🛑 UPDATED: Use the custom SVG or the Loader icon
  const buttonIcon = isLoading ? Loader : StopSvgIcon;

  const buttonColor = isLocalProcess ? "destructive" : "destructive";

  return (
    <Button
      onClick={handleStopCrawling}
      disabled={isLoading && isExternalCrawling}
      variant={buttonColor}
      // 🛑 MODIFIED: Adjusted size for a cleaner look when placed inside the input container
      className="px-2 h-8 flex items-center justify-center mr-1"
    >
      {/* Show icon and text when external or loading, only icon when local for space */}
      {isExternalCrawling || isLoading || isLocalProcess ? (
        <>
          {/* 🛑 Use buttonIcon (StopSvgIcon or Loader) */}
          {React.createElement(buttonIcon, { className: "h-4 w-4" })}
          <span className="ml-1 text-xs truncate hidden sm:inline">{buttonText}</span>
        </>
      ) : (
        <>
          {/* 🛑 Use buttonIcon (StopSvgIcon) */}
          {React.createElement(buttonIcon, { className: "h-4 w-4" })}
        </>
      )}
    </Button>

  );
};

// =========================================================================
// 🧰 HELPER FUNCTIONS (Retained from original code)
// =========================================================================

// Helper function to safely extract page URL from different response formats
const extractPageUrl = (page: any): string | null => {
  if (typeof page === 'string') {
    return page;
  }
  if (typeof page === 'object' && page !== null) {
    if (page.url && typeof page.url === 'string') return page.url;
    if (page.link && typeof page.link === 'string') return page.link;
    if (page.href && typeof page.href === 'string') return page.href;
    if (page.location && typeof page.location === 'string') return page.location;

    for (const key in page) {
      if (typeof page[key] === 'string' && page[key].startsWith('http')) {
        return page[key];
      }
    }
  }
  return null;
};

// Helper function to safely format page display name
const formatPageDisplayName = (url: string): string => {
  try {
    if (!url || typeof url !== 'string') return 'Unknown Page';

    const withoutProtocol = url.replace(/^https?:\/\//, '');
    const path = withoutProtocol.split('/').slice(1).join('/');
    return path || 'Home';
  } catch (error) {
    console.error('Error formatting page name:', error);
    return 'Unknown Page';
  }
};

// =========================================================================
// 💻 MAIN COMPONENT (UploadUrlWithPDF)
// =========================================================================

const UploadUrlWithPDF = ({
  chatbotId,
  status, // The external chatbot status (e.g., 'in_progress', 'ready')
  client_email,
}: {
  chatbotId: number;
  status: string;
  client_email: string;
}) => {
  const [url, setUrl] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [crawlingStarted, setCrawlingStarted] = useState(false);
  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const [uploadUrl, { isLoading }] = useUploadUrlMutation();
  const [uploadRequirement, { isLoading: isUploadingPDF }] =
    useUploadRequirementMutation();

  // 🔹 Page discovery state
  const [discoveredPages, setDiscoveredPages] = useState<string[]>([]);
  const [selectedPages, setSelectedPages] = useState<string[]>([]);
  const [loadingPages, setLoadingPages] = useState(false);
  const [scrapingLoading, setScrapingLoading] = useState(false);

  // 🔹 Check if the external chatbot status indicates active crawling/processing
  const isChatbotCrawling = status === "in_progress" || status === "scraping";

  // 🛑 NEW: Check if any local discovery or scraping is running
  const isLocalProcessing = loadingPages || scrapingLoading;

  // 🛑 NEW: Combined state to determine if the stop button should replace the URL input
  const showStopButtonInInput = isChatbotCrawling || isLocalProcessing;

  // New function to reset the modal state to "previous state" (initial view)
  const handleStopCrawlingSuccess = () => {
    // 1. Reset all discovery/scraping states
    setUrl("");
    setAgreed(false);
    setFiles([]);
    setDiscoveredPages([]);
    setSelectedPages([]);
    setLoadingPages(false);
    setScrapingLoading(false);
    setCrawlingStarted(false);

    // 2. Simulate refetch to update the parent component's status
    refetch();
  };

  // 🛑 NEW: Function to stop local processes
  const stopLocalProcess = () => {
    setLoadingPages(false);
    setScrapingLoading(false);
  };


  // =========================================================================
  // ✅ RE-IMPLEMENTED MISSING FUNCTIONS (FIXES ERRORS)
  // =========================================================================

  // Handle file input (Re-implemented handleFileChange)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      const newFiles = Array.from(e.target.files);
      const validFiles = newFiles.filter(
        (file) => file.type === "application/pdf" && file.size <= MAX_FILE_SIZE
      );
      const oversizedFiles = newFiles.filter(
        (file) => file.type === "application/pdf" && file.size > MAX_FILE_SIZE
      );

      oversizedFiles.forEach((file) =>
        toast.error(`'${file.name}' exceeds the 10MB PDF limit.`)
      );

      if (validFiles.length === 0) {
        e.target.value = "";
        return;
      }

      const updatedFiles = [...files, ...validFiles].filter(
        (file, index, self) => index === self.findIndex((f) => f.name === file.name)
      );

      setFiles(updatedFiles);
      e.target.value = "";
    }
  };

  // Original upload flow (URL required, PDFs optional) - Re-implemented handleUpload
  const handleUpload = async () => {
    if (!url || !agreed) return;
    try {
      await uploadUrl({ chatbot_id: chatbotId, url, client_email }).unwrap();

      if (files.length > 0) {
        const formData = new FormData();
        files.forEach((file) => formData.append("files", file));
        formData.append("chatbot_id", String(chatbotId));
        await uploadRequirement(formData).unwrap();
      }

      toast.success("Crawling started successfully!");
      setUrl("");
      setAgreed(false);
      setFiles([]);
      setCrawlingStarted(true);

      setTimeout(() => setCrawlingStarted(false), 30000);
      setTimeout(() => setOpen(false), 1500);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to start crawling.");
    }
  };

  // Discover pages API - Re-implemented handleDiscoverPages
  const handleDiscoverPages = async () => {
    if (!url) return toast.error("Enter a valid URL first");

    try {
      setLoadingPages(true);

      const token = localStorage.getItem("token");
      const apikey = localStorage.getItem("apikey");

      const headers: HeadersInit = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'accept': 'application/json',
      };

      if (apikey) {
        headers['api-key'] = apikey;
      }
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const formData = new URLSearchParams();
      formData.append('url', url);
      formData.append('max_pages', '50');
      formData.append('max_depth', '2');

      // Use an AbortController to allow stopping the fetch request
      const controller = new AbortController();
      const signal = controller.signal;

      // 🛑 Set a flag to allow checking for a manual stop outside the fetch
      let isCancelled = false;
      const checkCancellation = setInterval(() => {
        if (!loadingPages) { // If setLoadingPages(false) was called by stopLocalProcess
          controller.abort();
          isCancelled = true;
          clearInterval(checkCancellation);
        }
      }, 100);

      const res = await fetch("https://api.chatsupplies.com/training/discover-pages", {
        method: "POST",
        headers,
        body: formData,
        signal, // Pass the signal to the fetch call
      });

      clearInterval(checkCancellation);

      if (isCancelled || !res.ok) {
        if (isCancelled) {
          // If manually cancelled, just return and do nothing further
          return;
        }
        if (res.status === 524) {
          throw new Error("Discovery timed out. Try a smaller website or check the URL.");
        }
        throw new Error(`Failed to discover pages. Status: ${res.status}`);
      }

      const data = await res.json();

      let rawPages: any[] = [];
      if (Array.isArray(data)) {
        rawPages = data;
      } else if (data.pages && Array.isArray(data.pages)) {
        rawPages = data.pages;
      } else if (data.data && Array.isArray(data.data)) {
        rawPages = data.data;
      } else if (data.success && Array.isArray(data.data)) {
        rawPages = data.data;
      } else {
        for (const key in data) {
          if (Array.isArray(data[key])) {
            rawPages = data[key];
            break;
          }
        }
      }

      const validPages: string[] = [];
      rawPages.forEach((item, index) => {
        const pageUrl = extractPageUrl(item);
        if (pageUrl && typeof pageUrl === 'string') {
          validPages.push(pageUrl);
        }
      });

      if (validPages.length === 0) {
        if (rawPages.length > 0) {
          throw new Error(`Found ${rawPages.length} pages but couldn't extract valid URLs.`);
        }
        throw new Error("No pages discovered from this URL");
      }

      setDiscoveredPages(validPages);
      setSelectedPages(validPages.slice(0, 10));
      toast.success(`Discovered ${validPages.length} pages. Showing first 10.`);

    } catch (error: any) {
      console.error('Discovery error:', error);
      if (error.name === 'AbortError') {
        // Ignore AbortError on purpose when user stops
      } else {
        toast.error(error.message || "Failed to discover pages. The website might be too large or blocked.");
      }
      setDiscoveredPages([]);
      setSelectedPages([]);
    } finally {
      // 🛑 Only set loadingPages to false if it was not stopped manually
      if (loadingPages) {
        setLoadingPages(false);
      }
    }
  };

  // Scrape selected pages API - Re-implemented handleScrapeSelected
  const handleScrapeSelected = async () => {
    if (selectedPages.length === 0) return toast.error("Select at least one page");

    try {
      setScrapingLoading(true);

      const token = localStorage.getItem("token");
      const apikey = localStorage.getItem("apikey");

      const headers: HeadersInit = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'accept': 'application/json',
      };

      if (apikey) {
        headers['api-key'] = apikey;
      }
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const formData = new URLSearchParams();
      formData.append('chatbot_id', chatbotId.toString());
      formData.append('client_email', client_email);

      selectedPages.forEach((pageUrl) => {
        formData.append('urls', pageUrl);
      });

      const res = await fetch(
        "https://api.chatsupplies.com/training/scrape-selected-urls",
        {
          method: "POST",
          headers,
        }
      );

      if (!res.ok) {
        throw new Error(`Failed to start crawling. Status: ${res.status}`);
      }

      const result = await res.json();

      if (!result.success) {
        throw new Error(result.detail || "Scraping failed");
      }

      if (files.length > 0) {
        const pdfFormData = new FormData();
        files.forEach((file) => pdfFormData.append("files", file));
        pdfFormData.append("chatbot_id", String(chatbotId));
        await uploadRequirement(pdfFormData).unwrap();
      }

      toast.success(`Crawling started for ${selectedPages.length} pages!`);

      setUrl("");
      setAgreed(false);
      setFiles([]);
      setDiscoveredPages([]);
      setSelectedPages([]);
      setCrawlingStarted(true);

      setTimeout(() => setCrawlingStarted(false), 30000);
      setTimeout(() => setOpen(false), 1500);

    } catch (error: any) {
      console.error('Scraping error:', error);
      toast.error(error.message || "Failed to start crawling selected pages.");
    } finally {
      setScrapingLoading(false);
    }
  };

  // Reset discovery when URL changes (Re-implemented useEffect)
  React.useEffect(() => {
    if (url) {
      setDiscoveredPages([]);
      setSelectedPages([]);
      // 🛑 Stop any local process if the URL changes
      stopLocalProcess();
    }
  }, [url]);

  // =========================================================================
  // ❌ END OF FIXES
  // =========================================================================

  const getDialogSize = () => {
    return "w-[95vw] max-w-md sm:max-w-md md:max-w-lg";
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* Trigger... (omitted for brevity) */}

      {/* 🎯 MODAL TRIGGER: Added status checks to show the dialog properly */}
      {isChatbotCrawling ? (
        <button
          type="button"
          disabled
          className="p-1 rounded cursor-not-allowed min-w-[32px] min-h-[32px] flex items-center justify-center"
        >
          <Loader className="h-4 w-4 animate-spin text-orange-500" />
        </button>
      ) : status === "ready" || status === "just_created" ? (
        <DialogTrigger asChild>
          <button
            type="button"
            className="p-1 rounded hover:bg-muted transition min-w-[32px] min-h-[32px] flex items-center justify-center"
            onClick={() => setOpen(true)}
          >
            <Play className="h-4 w-4 text-green-600" />
          </button>
        </DialogTrigger>
      ) : status === "failed" ? (
        <DialogTrigger asChild>
         <Button
  type="button"
  variant="ghost" // 👈 removes background & border
  onClick={() => setOpen(true)}
  className="p-0 h-auto hover:bg-transparent focus-visible:ring-0"
>
  <img
    src="/arrows-rotate-reverse.svg"
    alt="Recrawl"
    className="w-4 h-4 sm:w-5 sm:h-5"
  />
</Button>


        </DialogTrigger>
      ) : (
        <button
          type="button"
          disabled
          className="p-1 rounded cursor-not-allowed min-w-[32px] min-h-[32px] flex items-center justify-center"
        >
          <Loader className="h-4 w-4 animate-spin" />
        </button>
      )}


      {/* Modal Content - Slightly smaller desktop size */}
      <DialogContent className={getDialogSize()}>
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">
            {isChatbotCrawling || isLocalProcessing ? "Crawling/Discovery in Progress" : "Start Website Crawling & Upload Files"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 max-h-[70vh] overflow-y-auto px-1">

          {/* 🎯 STOP CRAWLING BUTTON: Removed the external status alert block to centralize the stop button in the input field */}
          {isChatbotCrawling && (
            <div className="p-4 border border-orange-400 bg-orange-50 rounded-lg space-y-3">
              <p className="text-sm font-medium text-orange-700">
                The chatbot is currently processing. You can stop the process in the URL field below.
              </p>
            </div>
          )}

          {/* URL input / Stop Button Field - Show when not in the discovery results view */}
          {discoveredPages.length === 0 && (
            <div>
              <label className="text-sm font-medium mb-2 block">Website URL (required)*</label>

              {/* 🛑 MODIFIED: Container for URL Input and Stop Button */}
              <div className="flex w-full items-center relative">
                {/* The Input Field */}
                <Input
                  type="url"
                  placeholder={showStopButtonInInput ? "Process in progress..." : "https://example.com"}
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  // 🛑 Disable input when any process is active
                  disabled={showStopButtonInInput}
                  // 🛑 Add padding-right to prevent text from going under the button
                  className={`w-full text-sm sm:text-base ${showStopButtonInInput ? 'pr-[100px] sm:pr-[120px]' : ''}`}
                />

                {/* 🛑 The Stop Button - Absolutely positioned to the right */}
                {showStopButtonInInput && (
                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10">
                    <StopCrawlingButton
                      chatbotId={chatbotId}
                      status={status}
                      onStopSuccess={handleStopCrawlingSuccess}
                      isLocalProcess={isLocalProcessing} // Pass the local state
                      stopLocalProcess={stopLocalProcess} // Pass the local stop function
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Discover Pages Button - Hide when pages are discovered OR when discovery is loading OR when already crawling */}
          {!isChatbotCrawling && discoveredPages.length === 0 && !isLocalProcessing && (
            <Button
              onClick={handleDiscoverPages}
              disabled={!url} // Removed loadingPages from disabled as it's now controlled by showStopButtonInInput
              variant="secondary"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm sm:text-base py-2 h-auto min-h-[44px]"
            >
              {"Discover Pages"}
            </Button>
          )}

          {/* Page selection UI & Discovery Loading State */}
          {loadingPages && (
            <div className="flex items-center justify-center p-4 border rounded text-sm sm:text-base">
              <Loader className="h-4 w-4 animate-spin mr-2" />
              <p className="truncate">Discovering pages from {url}...</p>
            </div>
          )}

          {/* Discovered Pages List */}
          {discoveredPages.length > 0 && (
            <div className="border rounded p-3 sm:p-4">
              {/* ... Page selection UI (omitted for brevity) ... */}

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                <p className="text-sm font-medium truncate">
                  Select pages to crawl
                </p>
                <span className="text-xs text-gray-500">
                  {selectedPages.length} of {discoveredPages.length} selected
                </span>
              </div>

              {/* Select All */}
              <div className="flex items-center space-x-2 border-b pb-2 mb-3">
                <Checkbox
                  id="selectAll"
                  checked={selectedPages.length === discoveredPages.length}
                  onCheckedChange={(checked) => {
                    setSelectedPages(checked ? [...discoveredPages] : []);
                  }}
                />
                <label htmlFor="selectAll" className="text-sm font-medium truncate">
                  Select All
                </label>
              </div>

              {/* Pages list */}
              <div className="max-h-[180px] sm:max-h-[200px] md:max-h-[220px] overflow-y-auto space-y-2 mb-4 pr-2">
                {discoveredPages.map((pageUrl, idx) => {
                  const safeUrl = typeof pageUrl === 'string' ? pageUrl : String(pageUrl);

                  return (
                    <div
                      key={safeUrl}
                      className="flex items-start space-x-2 rounded border p-2 hover:bg-gray-50 text-sm"
                    >
                      <Checkbox
                        id={`page-${idx}`}
                        checked={selectedPages.includes(safeUrl)}
                        onCheckedChange={(checked) => {
                          setSelectedPages((prev) =>
                            checked ? [...prev, safeUrl] : prev.filter((p) => p !== safeUrl)
                          );
                        }}
                        className="mt-0.5 flex-shrink-0"
                      />
                      <label
                        htmlFor={`page-${idx}`}
                        className="flex flex-col cursor-pointer flex-1 min-w-0"
                      >
                        <span className="font-medium truncate text-xs sm:text-sm">
                          {formatPageDisplayName(safeUrl)}
                        </span>
                        <span className="text-xs text-gray-500 truncate">{safeUrl}</span>
                      </label>
                    </div>
                  );
                })}
              </div>

              {/* Crawl Selected Button */}
              <Button
                onClick={handleScrapeSelected}
                className="w-full text-sm sm:text-base py-2 h-auto min-h-[44px]"
                disabled={selectedPages.length === 0 || scrapingLoading}
              >
                {scrapingLoading ? (
                  <>
                    <Loader className="h-4 w-4 animate-spin mr-2" />
                    <span className="truncate">Starting Crawl...</span>
                  </>
                ) : (
                  `Crawl ${selectedPages.length} Selected Pages`
                )}
              </Button>

              <div className="text-center mt-3">
                <Button
                  onClick={() => {
                    setDiscoveredPages([]);
                    setSelectedPages([]);
                    // 🛑 Stop local process when going back
                    stopLocalProcess();
                  }}
                  variant="link"
                  className="text-sm p-0 h-auto"
                >
                  ← Back to URL input
                </Button>
              </div>
            </div>
          )}

          {/* PDF Upload - Show in both views (omitted for brevity) */}

          <div>
            <label className="text-sm font-medium mb-2 block">PDF Files (Optional)</label>
            <label
              htmlFor="fileInput"
              className="cursor-pointer rounded-lg border-2 border-dashed border-gray-300 p-3 sm:p-4 text-center text-sm text-gray-500 hover:bg-gray-50 min-h-[80px] flex items-center justify-center"
            >
              <div>
                {files.length > 0
                  ? `Selected ${files.length} file(s)`
                  : "Click or drag PDF files here to upload (optional)."}
              </div>
              <Input
                id="fileInput"
                type="file"
                accept="application/pdf"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>

          {files.length > 0 && (
            <ul className="max-h-[100px] sm:max-h-[120px] overflow-y-auto rounded border p-2 text-sm text-muted-foreground space-y-1">
              {files.map((file, index) => (
                <li
                  key={file.name}
                  className="flex items-center justify-between rounded px-2 py-1 hover:bg-gray-50 text-xs sm:text-sm"
                >
                  <span className="truncate flex-1 pr-2">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => setFiles(files.filter((_, i) => i !== index))}
                    className="ml-2 text-red-500 hover:text-red-700 flex-shrink-0 p-1"
                    aria-label={`Remove ${file.name}`}
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          )}

          {/* Single URL Flow - Only show when NOT crawling, no pages discovered, and not loading */}
          {!isChatbotCrawling && discoveredPages.length === 0 && !isLocalProcessing && (
            <>
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="agree"
                  checked={agreed}
                  onCheckedChange={(checked) => setAgreed(Boolean(checked))}
                  className="mt-0.5 flex-shrink-0"
                />
                <label htmlFor="agree" className="text-sm text-gray-600 leading-tight">
                  I agree to start crawling of this website
                </label>
              </div>

              <Button
                onClick={handleUpload}
                disabled={!agreed || !url || isLoading || isUploadingPDF}
                className="w-full text-sm sm:text-base py-2 h-auto min-h-[44px]"
              >
                {isLoading || isUploadingPDF ? (
                  <>
                    <Loader className="h-4 w-4 animate-spin mr-2" />
                    <span className="truncate">Starting...</span>
                  </>
                ) : (
                  `Start Crawling${files.length > 0 ? " & Upload PDFs" : ""}`
                )}
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UploadUrlWithPDF;