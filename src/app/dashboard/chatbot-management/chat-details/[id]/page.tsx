"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useGetChatbotByIdQuery } from "@/src/hooks/useChatbot";
import { PencilIcon, CheckCircleIcon, XCircleIcon, ClockIcon, GlobeAltIcon, DocumentTextIcon } from "@heroicons/react/24/solid";
import UploadUrlWithPDF from "@/src/components/chatbot/upload-url-pdf"; // Retained the import for context

// 🛑 SIMULATE CRAWLED PAGE TYPE
interface CrawledPage {
  id: number;
  url: string;
  status: "Completed" | "In Progress" | "Failed";
  crawledAt: string; // ISO string
  size: string;
}

// 🛑 SIMULATE NEW HOOK TO GET REAL-TIME CRAWLED PAGE DETAILS
// In a real application, you would replace this with your actual RTK Query / TanStack Query hook
const useGetCrawledPagesQuery = (chatbotId: number) => {
  // 🛑 Replace this dummy data with your actual API call result
  const dummyCrawledPages: CrawledPage[] = [
    {
      id: 1,
      url: "https://example.com/home",
      status: "Completed",
      crawledAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
      size: "245 KB"
    },
    {
      id: 2,
      url: "https://example.com/about-us-team",
      status: "Completed",
      crawledAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(), // 2 minutes ago
      size: "156 KB"
    },
    {
      id: 3,
      url: "https://example.com/contact",
      status: "Failed",
      crawledAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 minutes ago
      size: "0 KB"
    },
    {
      id: 4,
      url: "https://example.com/products/widgets",
      status: "In Progress",
      crawledAt: new Date().toISOString(),
      size: "Processing..."
    },
    // Add PDF/File entries if your API supports it
    {
      id: 5,
      url: "https://example.com/docs/policy.pdf",
      status: "Completed",
      crawledAt: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
      size: "4.2 MB"
    }
  ];

  // Assuming your real hook would handle refreshing/polling to get "real-time" data
  const data = dummyCrawledPages.sort((a, b) => new Date(b.crawledAt).getTime() - new Date(a.crawledAt).getTime());

  return {
    data: data,
    isLoading: false, // Set to true if waiting for the list
    error: null,
    // You would include a refetch function here for manual refresh if needed
  };
};

const ChatbotDetailPage = () => {
  const { id } = useParams();
  const router = useRouter();

  const chatbotId = Number(id);

  const {
    data: chatbot,
    isLoading,
    error,
  } = useGetChatbotByIdQuery(chatbotId);

  // 🛑 NEW: Fetch the list of crawled pages
  const {
    data: crawledPages,
    isLoading: isPagesLoading
  } = useGetCrawledPagesQuery(chatbotId);


  if (isLoading || isPagesLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Loading chatbot details...</p>
      </div>
    );
  }

  if (error || !chatbot) {
    return (
      <div className="flex flex-col justify-center items-center h-64">
        <p className="text-red-500 mb-4">No chatbot found.</p>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 !cursor-pointer"
        >
          Back to list
        </button>
      </div>
    );
  }

  const getCrawlingStatus = () => {
    if (chatbot.progress_status === "ready") {
      if (chatbot.pages_crawled != null && chatbot.total_pages != null) {
        return `${chatbot.pages_crawled} / ${chatbot.total_pages} pages crawled`;
      }
      return "Ready";
    }
    return "In progress";
  };

  // Calculate progress based on the fetched crawledPages list
  const completedPages = crawledPages.filter(page => page.status === "Completed").length;
  const totalPages = crawledPages.length;
  const progressPercent = totalPages > 0 ? Math.round((completedPages / totalPages) * 100) : 0;

  // Helper function to format page display name
  const formatPageDisplayName = (url: string): string => {
    try {
      if (!url) return 'Unknown Page';
      // Check if it's a file URL (e.g., pdf)
      if (url.endsWith('.pdf') || url.endsWith('.docx')) {
        const parts = url.split('/');
        return parts[parts.length - 1]; // Just return the filename
      }
      const withoutProtocol = url.replace(/^https?:\/\//, '');
      const domain = withoutProtocol.split('/')[0];
      const path = withoutProtocol.split('/').slice(1).join('/');
      return path || domain;
    } catch (error) {
      return 'Unknown Page';
    }
  };

  // Helper function to format date
  const formatCrawlDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString(undefined, {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return "Unknown date";
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-start mb-2">
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 !cursor-pointer"
          title="Back to chatbot Management"
        >
          Back to Previous
        </button>
      </div>

      <div className="mb-6 flex items-center gap-2">
        <h1 className="text-2xl font-bold">
          {chatbot.name || "Chatbot Name"}
        </h1>
        <PencilIcon
          className="w-5 h-5 text-blue-500 cursor-pointer hover:text-blue-700"
          onClick={() =>
            router.push(`/dashboard/chatbot-management/update-chatbot/${id}`)
          }
          title="Edit Chatbot"
        />
      </div>


      {/* Overview */}
      <section className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Overview</h2>
        <p>
          <strong>User name:</strong>{" "}
          {chatbot.website_name || chatbot.client_name || "N/A"}
        </p>
        <p>
          <strong>User Email:</strong>{" "}
          {chatbot.client_email || chatbot.user_name || "N/A"}
        </p>
        <p>
          <strong>Crawling Status:</strong> {getCrawlingStatus()}
        </p>
      </section>

      ---

      {/* Extra Chatbot Details (Omitted for brevity, no changes) */}
      <section className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Chatbot Details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">

          {/* ✅ Chatbot History (clickable) */}
          <div
            onClick={() => router.push(`/dashboard/chatbot-management/chat-history/`)}
            className="bg-white rounded-xl shadow-md border p-4 cursor-pointer hover:bg-gray-50 transition"
          >
            <h4 className="text-sm font-medium text-gray-500 mb-1">
              📜 Chatbot History
            </h4>
            <p className="text-base font-semibold text-gray-800 ">
              {chatbot.name || "N/A"}
            </p>
          </div>

          {/* ✅ Client */}
          <div className="bg-white rounded-xl shadow-md border p-4">
            <h4 className="text-sm font-medium text-gray-500 mb-1">👤 Client</h4>
            <p className="text-base font-semibold text-gray-800">
              {chatbot.client_name || "N/A"}
            </p>
          </div>

          {/* ✅ Interactions */}
          <div className="bg-white rounded-xl shadow-md border p-4">
            <h4 className="text-sm font-medium text-gray-500 mb-1">
              📊 Interactions Created
            </h4>
            <p className="text-base font-semibold text-gray-800">
              {chatbot.total_interactions ?? 0}
            </p>
          </div>

          {/* ✅ Last Response */}
          <div className="bg-white rounded-xl shadow-md border p-4">
            <h4 className="text-sm font-medium text-gray-500 mb-1">
              ⏱️ Last Response
            </h4>
            <p className="text-base font-semibold text-gray-800">
              {chatbot.updated_at
                ? new Date(chatbot.updated_at).toLocaleString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                })
                : "N/A"}
            </p>
          </div>

        </div>
      </section>

      ---

      {/* 🛑 UPDATED: Crawled Pages Display (Replaces the old Progress Steps) */}
      <section className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">
          Source Data Status ({completedPages} / {totalPages})
        </h2>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
          <div
            className="bg-pink-500 h-2 rounded-full"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
        <p className="text-sm text-right mb-4 text-gray-600">
          **{progressPercent}%** of data has been processed.
        </p>

        {/* Crawled Pages List */}
        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
          {crawledPages.length > 0 ? (
            crawledPages.map((page) => (
              <div key={page.id} className="flex items-center gap-3 p-3 border rounded-lg shadow-sm hover:bg-gray-50 transition">

                {/* Status Icon */}
                {page.status === "Completed" ? (
                  <CheckCircleIcon className="w-6 h-6 text-green-500 flex-shrink-0" />
                ) : page.status === "In Progress" ? (
                  <ClockIcon className="w-6 h-6 text-yellow-500 flex-shrink-0 animate-pulse" />
                ) : (
                  <XCircleIcon className="w-6 h-6 text-red-500 flex-shrink-0" />
                )}

                <div className="flex-1 min-w-0">
                  {/* Page Name/Path */}
                  <h3 className={`font-medium ${page.status === "Completed" ? "text-gray-900" : "text-gray-600"}`}>
                    {formatPageDisplayName(page.url)}
                  </h3>
                  {/* Full URL/Source */}
                  <p className="text-xs text-gray-500 truncate">{page.url}</p>
                </div>

                {/* Status and Timestamp */}
                <div className="flex flex-col items-end text-right flex-shrink-0 ml-auto space-y-1">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${page.status === "Completed" ? "bg-green-100 text-green-700"
                      : page.status === "In Progress" ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}>
                    {page.status === "In Progress" ? "Processing" : page.status}
                  </span>
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    {page.url.endsWith('.pdf') ? <DocumentTextIcon className="w-3 h-3" /> : <GlobeAltIcon className="w-3 h-3" />}
                    {page.size}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatCrawlDate(page.crawledAt)}
                  </span>
                </div>

              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500 border border-dashed rounded-lg">
              <p>No pages have been crawled yet.</p>
              <p className="text-sm mt-2">Start crawling using the **Upload URL & PDF** button.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ChatbotDetailPage;