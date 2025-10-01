"use client";
import React, { useState } from "react";
import { Play, Loader } from "lucide-react";
import {
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

// Helper function to safely extract page URL from different response formats
const extractPageUrl = (page: any): string | null => {
  if (typeof page === 'string') {
    return page;
  }
  if (typeof page === 'object' && page !== null) {
    // Try common property names that might contain the URL
    if (page.url && typeof page.url === 'string') return page.url;
    if (page.link && typeof page.link === 'string') return page.link;
    if (page.href && typeof page.href === 'string') return page.href;
    if (page.location && typeof page.location === 'string') return page.location;

    // If it's an object with string properties, try to find the first string that looks like a URL
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

    // Remove protocol and get path
    const withoutProtocol = url.replace(/^https?:\/\//, '');
    const pathParts = withoutProtocol.split('/').filter(Boolean);

    // If no path, return domain
    if (pathParts.length <= 1) return 'Home';

    // Return the last path segment or the full path without domain
    const path = withoutProtocol.split('/').slice(1).join('/');
    return path || 'Home';
  } catch (error) {
    console.error('Error formatting page name:', error);
    return 'Unknown Page';
  }
};

const UploadUrlWithPDF = ({
  chatbotId,
  status,
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

  // Handle file input
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

  // Original upload flow (URL required, PDFs optional) - KEEP EXISTING BEHAVIOR
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

  // Discover pages API - WITHOUT AUTHENTICATION
  const handleDiscoverPages = async () => {
    if (!url) return toast.error("Enter a valid URL first");

    try {
      setLoadingPages(true);

      const headers: HeadersInit = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'accept': 'application/json',
      };

      const formData = new URLSearchParams();
      formData.append('url', url);
      formData.append('max_pages', '50');
      formData.append('max_depth', '2');

      const res = await fetch("https://api.chatsupplies.com/training/discover-pages", {
        method: "POST",
        headers,
        body: formData,
      });

      if (!res.ok) {
        if (res.status === 524) {
          throw new Error("Discovery timed out. Try a smaller website or check the URL.");
        }
        throw new Error(`Failed to discover pages. Status: ${res.status}`);
      }

      const data = await res.json();

      // Handle different response formats and extract valid URLs
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
        // Try to extract any array from the response
        for (const key in data) {
          if (Array.isArray(data[key])) {
            rawPages = data[key];
            break;
          }
        }
      }

      // Extract valid URLs from the raw pages
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
      toast.error(error.message || "Failed to discover pages. The website might be too large or blocked.");
      setDiscoveredPages([]);
      setSelectedPages([]);
    } finally {
      setLoadingPages(false);
    }
  };

  // Scrape selected pages API - WITHOUT AUTHENTICATION
  const handleScrapeSelected = async () => {
    if (selectedPages.length === 0) return toast.error("Select at least one page");

    try {
      setScrapingLoading(true);

      const headers: HeadersInit = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'accept': 'application/json',
      };

      const formData = new URLSearchParams();
      formData.append('chatbot_id', chatbotId.toString());
      formData.append('client_email', client_email);

      // Add each selected page URL
      selectedPages.forEach((pageUrl) => {
        formData.append('urls', pageUrl);
      });

      const res = await fetch(
        "https://api.chatsupplies.com/training/scrape-selected-urls",
        {
          method: "POST",
          headers,
          body: formData,
        }
      );

      if (!res.ok) {
        throw new Error(`Failed to start crawling. Status: ${res.status}`);
      }

      const result = await res.json();

      if (!result.success) {
        throw new Error(result.detail || "Scraping failed");
      }

      // Handle PDF uploads if any
      if (files.length > 0) {
        const pdfFormData = new FormData();
        files.forEach((file) => pdfFormData.append("files", file));
        pdfFormData.append("chatbot_id", String(chatbotId));
        await uploadRequirement(pdfFormData).unwrap();
      }

      toast.success(`Crawling started for ${selectedPages.length} pages!`);

      // Reset form
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

  // Reset discovery when URL changes
  React.useEffect(() => {
    if (url) {
      setDiscoveredPages([]);
      setSelectedPages([]);
    }
  }, [url]);

  // Determine dialog size based on whether pages are discovered
  const dialogSize = discoveredPages.length > 0 ? "max-w-md" : "max-w-2xl";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* Trigger */}
      {status === "ready" || status === "just_created" ? (
        <DialogTrigger asChild>
          <button
            type="button"
            className="p-1 rounded hover:bg-muted transition"
            onClick={() => setOpen(true)}
          >
            <Play className="h-4 w-4 text-green-600" />
          </button>
        </DialogTrigger>
      ) : status === "failed" ? (
        <DialogTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className="text-red-500 hover:text-red-600 border-red-500 hover:border-red-600"
            onClick={() => setOpen(true)}
          >
            Recrawl
          </Button>
        </DialogTrigger>
      ) : (
        <button type="button" disabled className="p-1 rounded cursor-not-allowed">
          <Loader className="h-4 w-4 animate-spin" />
        </button>
      )}

      {/* Modal Content - Dynamic size based on discovered pages */}
      <DialogContent className={dialogSize}>
        <DialogHeader>
          <DialogTitle>Start Website Crawling & Upload Files</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* URL input - Only show when no pages discovered */}
          {discoveredPages.length === 0 && (
            <div>
              <label className="text-sm font-medium mb-2 block">Website URL (required)*</label>
              <Input
                type="url"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>
          )}

          {/* Discover Pages Button - Only show when no pages discovered */}
          {discoveredPages.length === 0 && (
            <Button
              onClick={handleDiscoverPages}
              disabled={!url || loadingPages}
              variant="secondary"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              {loadingPages ? (
                <>
                  <Loader className="text-white h-4 w-4 animate-spin mr-2" />
                  Discovering Pages...
                </>
              ) : (
                "Discover Pages"
              )}
            </Button>

          )}

          {/* Page selection UI */}
          {loadingPages && (
            <div className="flex items-center justify-center p-4 border rounded">
              <Loader className="h-4 w-4 animate-spin mr-2" />
              <p>Discovering pages from {url}...</p>
            </div>
          )}

          {discoveredPages.length > 0 && (
            <div className="border rounded p-3">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium">
                  Select pages to crawl
                </p>
                <span className="text-xs text-gray-500">
                  {selectedPages.length} of {discoveredPages.length} selected
                </span>
              </div>

              {/* Select All */}
              <div className="flex items-center space-x-2 border-b pb-2 mb-2">
                <Checkbox
                  id="selectAll"
                  checked={selectedPages.length === discoveredPages.length}
                  onCheckedChange={(checked) => {
                    setSelectedPages(checked ? [...discoveredPages] : []);
                  }}
                />
                <label htmlFor="selectAll" className="text-sm font-medium">
                  Select All
                </label>
              </div>

              {/* Pages list - Smaller height for compact view */}
              <div className="max-h-40 overflow-y-auto space-y-2 mb-3">
                {discoveredPages.map((pageUrl, idx) => {
                  const safeUrl = typeof pageUrl === 'string' ? pageUrl : String(pageUrl);

                  return (
                    <div
                      key={safeUrl}
                      className="flex items-start space-x-2 rounded border p-2 hover:bg-gray-50"
                    >
                      <Checkbox
                        id={`page-${idx}`}
                        checked={selectedPages.includes(safeUrl)}
                        onCheckedChange={(checked) => {
                          setSelectedPages((prev) =>
                            checked ? [...prev, safeUrl] : prev.filter((p) => p !== safeUrl)
                          );
                        }}
                      />
                      <label
                        htmlFor={`page-${idx}`}
                        className="flex flex-col text-sm cursor-pointer flex-1"
                      >
                        <span className="font-medium truncate">
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
                className="w-full"
                disabled={selectedPages.length === 0 || scrapingLoading}
              >
                {scrapingLoading ? (
                  <>
                    <Loader className="h-4 w-4 animate-spin mr-2" />
                    Starting Crawl...
                  </>
                ) : (
                  `Crawl ${selectedPages.length} Selected Pages`
                )}


              </Button>

              <div className="text-center mt-2">
                <Button
                  onClick={() => {
                    setDiscoveredPages([]);
                    setSelectedPages([]);
                  }}
                  variant="link"
                  className="text-sm"
                >
                  ← Back to URL input
                </Button>
              </div>
            </div>
          )}

          {/* PDF Upload - Show in both views */}
          <div>
            <label className="text-sm font-medium mb-2 block">PDF Files (Optional)</label>
            <label
              htmlFor="fileInput"
              className="block cursor-pointer rounded-lg border-2 border-dashed border-gray-300 p-4 text-center text-sm text-gray-500 hover:bg-gray-50"
            >
              {files.length > 0
                ? `Selected ${files.length} file(s)`
                : "Click or drag PDF files here to upload (optional)."}
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
            <ul className="max-h-32 overflow-y-auto rounded border p-2 text-sm text-muted-foreground space-y-1">
              {files.map((file, index) => (
                <li
                  key={file.name}
                  className="flex items-center justify-between rounded px-2 py-1 hover:bg-gray-50"
                >
                  <span className="truncate">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => setFiles(files.filter((_, i) => i !== index))}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          )}

          {/* Single URL Flow - Only show when no pages discovered */}
          {discoveredPages.length === 0 && (
            <>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="agree"
                  checked={agreed}
                  onCheckedChange={(checked) => setAgreed(Boolean(checked))}
                />
                <label htmlFor="agree" className="text-sm text-gray-600">
                  I agree to start crawling of this website
                </label>
              </div>

              <Button
                onClick={handleUpload}
                disabled={!agreed || !url || isLoading || isUploadingPDF}
                className="w-full"
              >
                {isLoading || isUploadingPDF ? (
                  <>
                    <Loader className="h-4 w-4 animate-spin mr-2" />
                    Starting...
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