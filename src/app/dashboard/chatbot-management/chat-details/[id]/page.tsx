"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useGetChatbotByIdQuery } from "@/src/hooks/useChatbot";
import { PencilIcon, CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";

const ChatbotDetailPage = () => {
  const { id } = useParams();
  const router = useRouter();

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

  // Dummy progress steps like in screenshot
  const steps = [
    {
      id: 1,
      title: "Personal Information",
      description: "Add your personal information",
      completed: chatbot.pages_crawled >= 1, // ✅ mark first step if at least 1 page crawled
    },
    {
      id: 2,
      title: "Add your first Project",
      description: "Some description",
      completed: chatbot.pages_crawled >= 2,
    },
    {
      id: 3,
      title: "Add Content to this Client",
      description: "Some description",
      completed: chatbot.pages_crawled >= 3,
    },
    {
      id: 4,
      title: "Use Document Editor",
      description: "Some description",
      completed: chatbot.pages_crawled >= 4,
    },
  ];

  const completedCount = steps.filter((s) => s.completed).length;
  const progressPercent = Math.round((completedCount / steps.length) * 100);

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-start mb-2">
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 !cursor-pointer"
          title="Back to chatbot Management"
        >
          Back to Chatbot
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

      {/* Extra Chatbot Details */}
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


      {/* ✅ Progress Steps Card */}
      <section className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Getting Started</h2>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
          <div
            className="bg-pink-500 h-2 rounded-full"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
        <p className="text-sm text-right mb-4">{progressPercent}% completed</p>

        {/* Steps */}
        {/* Steps */}
        <div className="space-y-4">
          {steps.map((step) => (
            <div key={step.id} className="flex items-start gap-3">
              {step.completed ? (
                <CheckCircleIcon className="w-6 h-6 text-green-500" />
              ) : (
                <XCircleIcon className="w-6 h-6 text-red-500" />
              )}
              <div>
                <h3
                  className={`font-semibold ${step.completed ? "text-gray-800" : "text-gray-500"
                    }`}
                >
                  Step {step.id}: {step.title}
                </h3>
                <p className="text-sm text-gray-500">{step.description}</p>
              </div>

              <button
                onClick={() => {
                  console.log(`Start crawling for Step ${step.id}`);
                  // TODO: Trigger your crawling API here
                }}
                className={`ml-auto px-4 py-1 rounded-full text-sm ${step.completed
                  ? "bg-green-100 text-green-700"
                  : "bg-blue-500 text-white hover:bg-blue-600 cursor-pointer"
                  }`}
              >
                {step.completed ? "Done" : "Start"}
              </button>
            </div>
          ))}
        </div>

      </section>
    </div>
  );
};

export default ChatbotDetailPage;