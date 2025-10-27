"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useGetChatbotQuery } from "@/src/hooks/useChatbot";
import { DashboardHeader } from "@/src/components/layout/dashboard-header";
import { Button } from "@/src/components/ui/button";
import { skipToken } from "@reduxjs/toolkit/query";
import { MessageCircle, ArrowLeft } from "lucide-react";
import noDataAnimation from "@/public/lottie/nodata.json";
import { useGetAllChatsQuery } from "@/src/hooks/useChat";
import { Globe, Clock, Target, MapPin } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/src/components/ui/tooltip"; // ✅ import your tooltip

const Player = dynamic(
  () => import("@lottiefiles/react-lottie-player").then((mod) => mod.Player),
  { ssr: false }
);

interface Chatbot {
  id: number;
  name: string;
  description: string;
  profile_image?: string;
}

interface ChatData {
  id: number;
  user_message: string;
  bot_response: string;
  timestamp: string;
  created_at: string;
  user_id: number;
  chatbot_id: number;
  intent_detected: string;
  language: string;
  ip_address?: string;
  username?: string;
  user_agent?: string;
  location?: string;
  platform?: string;
}

const ChatHistoryPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBotId, setSelectedBotId] = useState<number | null>(null);
  const [selectedUser, setSelectedUser] = useState<{
    id: number;
    name: string;
  } | null>(null);

  const {
    data: chatbotResponse,
    isLoading,
    isError,
  } = useGetChatbotQuery({ page: currentPage });

  const chatbotList: Chatbot[] = Array.isArray(chatbotResponse)
    ? chatbotResponse
    : chatbotResponse?.results ??
    chatbotResponse?.data ??
    chatbotResponse?.chatbots ??
    [];

  const {
    data: chatData,
    isLoading: chatLoading,
    isError: chatError,
  } = useGetAllChatsQuery(
    selectedBotId !== null
      ? {
        chatbot_id: selectedBotId,
      }
      : skipToken
  );

  const chatList: ChatData[] = chatData?.results ?? chatData?.data ?? [];

  useEffect(() => {
    if (chatbotList.length > 0 && !selectedBotId) {
      setSelectedBotId(chatbotList[0].id);
    }
  }, [chatbotList, selectedBotId]);

  useEffect(() => {
    if (chatList.length > 0 && !selectedUser) {
      const firstUser = chatList[0];
      setSelectedUser({
        id: firstUser.user_id,
        name: firstUser.username || `User ${firstUser.user_id}`,
      });
    }
  }, [chatList, selectedUser]);

  const formatTime = (timestamp: string) =>
    new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  // ✅ StatCard component (kept here but unused in the render logic)
  const StatCard: React.FC<{
    icon: React.ElementType;
    title: string;
    value: string;
    valueClass?: string;
  }> = ({ icon: Icon, title, value, valueClass = "text-gray-800" }) => (
    <div className="flex items-center space-x-2 border rounded-xl p-3 bg-white shadow-sm w-48 h-16">
      <Icon className="w-5 h-5 text-blue-500 flex-shrink-0" />
      <div className="flex flex-col text-xs overflow-hidden">
        <span className="text-muted-foreground truncate">{title}</span>
        <span className={`font-semibold ${valueClass} truncate`}>{value}</span>
      </div>
    </div>
  );

  // 🛠️ UPDATED Tooltip Content Component: Language line removed.
  const UserMessageTooltipContent: React.FC<{ chat: ChatData }> = ({ chat }) => (
    <div className="text-xs space-y-2 min-w-64">
      {/* IP Address is kept as the primary hover info */}
      <div className="flex justify-between border-b border-gray-700 pb-2 mb-2">
        <span className="text-gray-300 font-bold">IP Address:</span>
        <span className="text-white font-bold">{chat.ip_address || "—"}</span>
      </div>

      {/* Existing details */}
      <div className="flex justify-between">
       <span className="text-gray-300">User Agent:</span>
<span
  className="text-white text-right ml-2 break-words whitespace-normal max-w-xs leading-snug"
>
  {chat.user_agent || "—"}
</span>

      </div>
      <div className="flex justify-between">
        <span className="text-gray-300">Location:</span>
        <span className="text-white">{chat.location || "—"}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-300">Platform:</span>
        <span className="text-white">{chat.platform || "—"}</span>
      </div>
      {/* The following Language section has been removed:
      <div className="flex justify-between">
        <span className="text-gray-300">Language:</span>
        <span className="text-white">{chat.language || "—"}</span>
      </div> 
      */}
    </div>
  );

  // ✅ latest chat
  const latestChat = chatList.length > 0 ? chatList[chatList.length - 1] : null;

  return (
    <TooltipProvider> {/* ✅ Wrap entire app with TooltipProvider */}
      <DashboardHeader
        title="Chat History"
        description="View and manage your chatbot conversations"
      />

      {/* Back button + Stat Cards (Only back button remains after removal) */}
      <div className="p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
   <button
  onClick={() => history.back()}>
  <ArrowLeft size={16} />
</button>

        {/* ❌ REMOVED: Stat Cards Row 
        
        <div className="flex flex-wrap justify-start gap-3 text-sm">
          {latestChat ? (
            <>
              <StatCard
                icon={Globe}
                title="Language"
                value={latestChat.language || "—"}
                valueClass="text-gray-600"
              />
              <StatCard
                icon={Clock}
                title="Timestamp"
                value={
                  latestChat.timestamp
                    ? new Date(latestChat.timestamp).toLocaleString()
                    : "—"
                }
                valueClass="text-gray-600"
              />
              <StatCard
                icon={MapPin}
                title="IP Address"
                value={latestChat.ip_address || "—"}
              />
              <StatCard
                icon={Target}
                title="Intent"
                value={latestChat.intent_detected || "—"}
                valueClass="text-blue-600"
              />
            </>
          ) : (
            <>
              <StatCard icon={Globe} title="Language" value="—" />
              <StatCard icon={Clock} title="Timestamp" value="—" />
              <StatCard icon={MapPin} title="IP Address" value="—" />
              <StatCard icon={Target} title="Intent" value="—" />
            </>
          )}
        </div>
        */}
      </div>

      {/* ✅ rest of your existing code untouched */}
      <div className="p-4 md:p-5 ">
        {isLoading ? (
          <div className="mt-8 text-center text-muted-foreground">
            Loading chatbots...
          </div>
        ) : isError ? (
          <div className="mt-8 text-center text-red-500">
            Failed to load chatbots.
          </div>
        ) : chatbotList.length === 0 ? (
          <div className="h-[80vh] flex flex-col items-center justify-center text-center">
            <Player
              autoplay
              loop
              src={noDataAnimation}
              style={{ height: 200, width: 200 }}
            />
            <p className="mt-4 text-muted-foreground">No chatbot found.</p>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6 -mt-5 shadow-4xl h-[calc(100vh-200px)]">
            {/* Left Sidebar */}
            <div className="w-full lg:w-[320px] flex-shrink-0 flex flex-col border rounded-lg bg-gray-50">
              <div className="p-4 border-b bg-white rounded-t-lg">
                <h3 className="font-semibold text-lg">Chatbots List</h3>
                <p className="text-sm text-muted-foreground">
                  {chatbotList.length} bots
                </p>
              </div>
              <div className="flex-1 overflow-y-auto">
                {chatbotList.map((bot) => {
                  const botChats = chatList.filter(
                    (chat) => chat.chatbot_id === bot.id
                  );
                  const lastMessage =
                    botChats.length > 0 ? botChats[botChats.length - 1] : null;

                  return (
                    <div
                      key={bot.id}
                      onClick={() => {
                        setSelectedBotId(bot.id);
                        setSelectedUser(null);
                      }}
                      className={`p-4 border-b cursor-pointer hover:bg-gray-100 transition-colors ${selectedBotId === bot.id
                        ? "bg-blue-50 border-l-4 border-l-blue-500"
                        : "bg-white"
                        }`}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          {bot.profile_image ? (
                            <img
                              src={bot.profile_image}
                              alt={bot.name}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-white text-xs">
                              {bot.name.charAt(0)}
                            </div>
                          )}
                          <p className="font-medium text-sm truncate">
                            {bot.name}
                          </p>
                        </div>
                        {lastMessage && (
                          <span className="text-xs text-muted-foreground ml-2 whitespace-nowrap">
                            {formatTime(lastMessage.timestamp)}
                          </span>
                        )}
                      </div>
                      <p className="text-xs ml-10 text-muted-foreground truncate">
                        <div>
                          <div dangerouslySetInnerHTML={{ __html: bot.description }} />
                        </div>
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Chat Area */}
            <div className="flex-1 flex flex-col border rounded-lg bg-gray-50">
              {selectedUser ? (
                <>
                  <div className="p-4 border-b bg-white rounded-t-lg flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedUser(null)}
                        className="lg:hidden"
                      >
                        <ArrowLeft className="w-4 h-4" />
                      </Button>

                      {selectedBotId && (
                        <>
                          {chatbotList.find((bot) => bot.id === selectedBotId)?.profile_image ? (
                            <img
                              src={
                                chatbotList.find((bot) => bot.id === selectedBotId)
                                  ?.profile_image
                              }
                              alt={
                                chatbotList.find((bot) => bot.id === selectedBotId)
                                  ?.name || "Bot"
                              }
                              className="w-8 h-8 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-white text-sm font-semibold">
                              {chatbotList.find((bot) => bot.id === selectedBotId)?.name?.charAt(0) || "?"}
                            </div>
                          )}
                        </>
                      )}

                      <h3 className="font-semibold">
                        Chat with{" "}
                        {chatbotList.find((bot) => bot.id === selectedBotId)
                          ?.name || "Chatbot"}
                      </h3>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {chatLoading ? (
                      <div className="flex items-center justify-center h-full text-muted-foreground">
                        Loading chats...
                      </div>
                    ) : chatList.length === 0 ? (
                      <div className="flex items-center justify-center h-full text-muted-foreground">
                        No chats found.
                      </div>
                    ) : (
                      chatList
                        .filter(
                          (chat: ChatData) => chat.user_id === selectedUser.id
                        )
                        .map((chat: ChatData) => (
                          <div key={chat.id} className="space-y-2">
                            {chat.user_message && (
                              <div className="flex justify-end">
                                <Tooltip> {/* ✅ Use Radix Tooltip */}
                                  <TooltipTrigger asChild>
                                    <div className="bg-blue-500 text-white rounded-2xl rounded-br-none px-4 py-2 max-w-[70%] shadow cursor-pointer">
                                      <p className="text-sm">
                                        <div>
                                          <div dangerouslySetInnerHTML={{ __html: chat.user_message }} />
                                        </div>
                                      </p>
                                      <span className="text-xs opacity-70 block text-right mt-1">
                                        {formatTime(chat.timestamp)}
                                      </span>
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent
                                    side="left"
                                    align="end"
                                    className="bg-gray-900 text-white border-0"
                                  >
                                    <UserMessageTooltipContent chat={chat} />
                                  </TooltipContent>
                                </Tooltip>
                              </div>
                            )}

                            {chat.bot_response &&
                              chat.bot_response.toLowerCase() !== "general" && (
                                <div className="flex justify-start">
                                  <div className="bg-gray-200 text-gray-800 rounded-2xl rounded-bl-none px-4 py-2 max-w-[70%] shadow">
                                    <p className="text-sm">
                                      <div>
                                        <div dangerouslySetInnerHTML={{ __html: chat.bot_response }} />
                                      </div>
                                    </p>
                                    <span className="text-xs opacity-70 block text-right mt-1">
                                      {formatTime(chat.timestamp)}
                                    </span>
                                  </div>
                                </div>
                              )}
                          </div>
                        ))
                    )}
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Select a conversation to view messages</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
};

export default ChatHistoryPage;