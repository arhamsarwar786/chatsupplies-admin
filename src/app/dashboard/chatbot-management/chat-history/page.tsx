"use client";

import React, { useState, useEffect } from "react";
import dynamic from 'next/dynamic';
import { useGetChatbotQuery } from "@/src/hooks/useChatbot";
import { DashboardHeader } from "@/src/components/layout/dashboard-header";
import { Card, CardContent } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";

const Player = dynamic(() =>
  import('@lottiefiles/react-lottie-player').then(mod => mod.Player),
  { ssr: false }
);

import { skipToken } from "@reduxjs/toolkit/query";
import { MessageCircle } from "lucide-react";
import NoResultsAnimation from "@/public/lottie/no-result-found.json";
import noDataAnimation from "@/public/lottie/nodata.json";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationLink,
} from "@/src/components/ui/pagination";
import { useGetAllChatsQuery } from "@/src/hooks/useChat";

interface Chatbot {
  id: number;
  name: string;
  description: string;
  client_name: string;
  created_at: string;
  personality_tone: string;
  bot_avatar: string;
  industry: string;
  language: string;
  welcome_message: string;
  business_hours_start: string;
  business_hours_end: string;
  updated_at: string;
  is_active: boolean;
  progress_status: string;
  user_id: number;
  total_interactions: number;
  interaction_change_percent: number;
}

interface ChatData {
  id: number;
  created_at: string;
  updated_at: string;
  language: string;
  user_message: string;
  bot_response: string;
  timestamp: string;
  user_id: number;
  ip_address: string;
  chatbot_id: number;
  intent_detected: string;
}

const ChatHistoryPage = () => {
  const [chatPage, setChatPage] = useState(0); // For offset pagination
  const [currentPage, setCurrentPage] = useState(1); // For chatbot pagination
  const [selectedBotId, setSelectedBotId] = useState<number | null>(null);

  const {
    data = [],
    isLoading,
    isError,
  } = useGetChatbotQuery({ page: currentPage });


  const selectedBot = data?.find((bot: Chatbot) => bot.id === selectedBotId);
  const CHAT_PAGE_LIMIT = 2;
const languageMap: Record<string, string> = {
  en: "English"
};

const {
  data: chatData,
  isLoading: chatLoading,
  isError: chatError,
} = useGetAllChatsQuery(
  selectedBotId !== null
    ? {
        chatbot_id: selectedBotId,
        limit: CHAT_PAGE_LIMIT,
        offset: chatPage * CHAT_PAGE_LIMIT,
      }
    : skipToken
);

const chatList = chatData?.results ?? [];
// console.log("All Chats:", chatList);

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    if (data.length < 10) return;
    setCurrentPage((prev) => prev + 1);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
     document.body.style.backgroundColor = 'white';
  }, [currentPage]);

  return (
  <>
      <DashboardHeader
        title="Chat History"
        description="Create, manage and monitor your chatbots"
      />
  <div className="p-4 md:p-5">
      {isLoading ? (
        <div className="mt-8 text-center text-muted-foreground">
          Loading chatbots...
        </div>
      ) : isError ? (
        <div className="mt-8 text-center text-red-500">
          Failed to load chatbots.
        </div>
      ) :
      data.length === 0 ? (
                <div className="text-center h-screen flex flex-col items-center justify-center">
                <Player
                    autoplay
                    loop
                    src={noDataAnimation}
                    style={{ height: "200px", width: "200px" }}
                />
                <p className="mt-4 text-muted-foreground">
                    No chatbot found.
                </p>
                </div>
            ) : !selectedBotId ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-8">
            {data.map((bot: Chatbot) => (
              <Card
                key={bot.id}
                onClick={() => setSelectedBotId(bot.id)}
                className="cursor-pointer border border-primary/30 hover:shadow-xl transition duration-300"
              >
                <CardContent className="p-6 space-y-3">
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-full bg-primary/10 text-primary">
                      <MessageCircle className="w-5 h-5" />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-800">
                      {bot.name}
                    </h2>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {bot.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-6 flex justify-between">
            <Button onClick={handlePreviousPage} disabled={currentPage === 1}>
              Previous
            </Button>
            <Button onClick={handleNextPage}>Next</Button>
          </div>
        </>
      ) : (
        <div className="mt-8 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-gray-800">
              {selectedBot?.name} - Chat History
            </h2>
            <Button variant="outline" onClick={() => setSelectedBotId(null)}>
              Back to All Bots
            </Button>
          </div>

          {chatLoading ? (
            <div className="text-center text-muted-foreground">
              Loading chat history...
            </div>
          ) : chatError ? (
            <div className="text-center text-red-500">
              Failed to load chat history.
            </div>
          ) : chatList.length === 0 ? (
                <div className="text-center h-[80vh] flex flex-col items-center justify-center">
                <Player
                    autoplay
                    loop
                    src={NoResultsAnimation}
                    style={{ height: "200px", width: "200px" }}
                />
                <p className="mt-4 text-muted-foreground">
                    No chat history found for this bot.
                </p>
                </div>
            ) :
          (
            <>
              <div className="flex flex-col gap-6 mt-6">
                {chatList.map((chat:any) => (
                  <Card
                    key={chat.id}
                    className="bg-secondary border border-amber-200 shadow-sm"
                  >
                    <CardContent className="p-4 space-y-4">
                      {/* Metadata */}
                      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                        {/* 🌐 Language */}
                        <div className="bg-white rounded-xl shadow-md border p-4">
                          <h4 className="text-sm font-medium text-gray-500 mb-1">
                            🌐 Language
                          </h4>
                          <p className="text-base font-semibold text-gray-800">
                            {languageMap[chat.language] || chat.language}
                          </p>
                        </div>

                        {/* 🕒 Timestamp */}
                        <div className="bg-white rounded-xl shadow-md border p-4">
                          <h4 className="text-sm font-medium text-gray-500 mb-1">
                            🕒 Timestamp
                          </h4>
                          <p className="text-base font-semibold text-gray-800">
                            {new Date(chat.timestamp).toLocaleString()}
                          </p>
                        </div>

                        {/* 📍 IP Address */}
                        <div className="bg-white rounded-xl shadow-md border p-4">
                          <h4 className="text-sm font-medium text-gray-500 mb-1">
                            📍 IP Address
                          </h4>
                          <p className="text-base font-semibold text-gray-800">
                            {chat.ip_address}
                          </p>
                        </div>

                        {/* 🎯 Intent */}
                        <div className="bg-white rounded-xl shadow-md border p-4">
                          <h4 className="text-sm font-medium text-gray-500 mb-1">
                            🎯 Intent
                          </h4>
                          <p className="text-base font-semibold text-primary">
                            {chat.intent_detected}
                          </p>
                        </div>
                      </div>

                      {/* User Message */}
                      {chat.user_message && (
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-full bg-gray-300 text-gray-800 font-bold flex items-center justify-center">
                            U
                          </div>
                          <div className="bg-white rounded-xl p-3 shadow-sm max-w-[80%]">
                            <div className="text-xs text-gray-500 font-medium mb-1">
                              User
                            </div>
                            <p className="text-sm text-gray-800">
                              {chat.user_message}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Bot Message */}
                      {chat.bot_response && (
                        <div className="flex items-start gap-3 justify-end">
                          <div className="bg-primary text-white rounded-xl p-3 shadow-sm max-w-[80%]">
                            <div className="text-xs text-white/70 font-medium mb-1">
                              Bot
                            </div>
                            <p className="text-sm">{chat.bot_response}</p>
                          </div>
                          <div className="w-10 h-10 rounded-full bg-primary text-white font-bold flex items-center justify-center">
                            B
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
              {/* Chat Pagination */}
              <Pagination className="mt-8">
                <PaginationContent className="justify-center gap-2">
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() =>
                        setChatPage((prev) => Math.max(prev - 1, 0))
                      }
                      className={
                        chatPage === 0 ? "pointer-events-none opacity-50" : ""
                      }
                    />
                  </PaginationItem>

                  <PaginationItem>
                    <PaginationLink isActive>{chatPage + 1}</PaginationLink>
                  </PaginationItem>

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setChatPage((prev) => prev + 1)}
                      className={
                        !chatData || chatData.length < CHAT_PAGE_LIMIT
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </>
          )}
        </div>
      )}
    </div>
    </>
  );
};

export default ChatHistoryPage;
