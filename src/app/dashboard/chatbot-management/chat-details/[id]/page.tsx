"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useGetChatbotByIdQuery } from "@/src/hooks/useChatbot";

const ChatbotDetailPage = () => {
  const { id } = useParams();
  const router = useRouter();

  // Fetch single chatbot by ID
  const {
    data: chatbot,
    isLoading,
    error,
  } = useGetChatbotByIdQuery(Number(id));

  if (isLoading) {
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

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header / Breadcrumb */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Chatbot Details</h1>
        <button
          onClick={() => router.back()}
          className="text-sm text-blue-500 hover:underline"
        >
          Back to list
        </button>
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

      {/* Extra Chatbot Details */}
      <section className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Chatbot Details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {/* Chatbot Name */}
          <div className="bg-white rounded-xl shadow-md border p-4">
            <h4 className="text-sm font-medium text-gray-500 mb-1">
              🤖 Chatbot Name
            </h4>
            <p className="text-base font-semibold text-gray-800">
              {chatbot.name || "N/A"}
            </p>
          </div>

          {/* Client */}
          <div className="bg-white rounded-xl shadow-md border p-4">
            <h4 className="text-sm font-medium text-gray-500 mb-1">👤 Client</h4>
            <p className="text-base font-semibold text-gray-800">
              {chatbot.client_name || "N/A"}
            </p>
          </div>

          {/* Interactions Created */}
          <div className="bg-white rounded-xl shadow-md border p-4">
            <h4 className="text-sm font-medium text-gray-500 mb-1">
              📊 Interactions Created
            </h4>
            <p className="text-base font-semibold text-gray-800">
              {chatbot.total_interactions ?? 0}
            </p>
          </div>

          {/* Last Response */}
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

      {/* Crawling Stats */}
      <section className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Crawling Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p>
              <strong>Total Pages Crawled:</strong>{" "}
              {chatbot.pages_crawled != null ? chatbot.pages_crawled : 0}
            </p>
          </div>
          <div>
            <p>
              <strong>Total Pages:</strong>{" "}
              {chatbot.total_pages != null ? chatbot.total_pages : 0}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ChatbotDetailPage;
