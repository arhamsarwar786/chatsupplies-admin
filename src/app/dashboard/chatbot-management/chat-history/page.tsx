"use client";

import React, { useState, useEffect, useMemo } from "react"; // ✅ Added useMemo
import dynamic from "next/dynamic";
import { useGetChatbotQuery } from "@/src/hooks/useChatbot";
import { DashboardHeader } from "@/src/components/layout/dashboard-header";
import { Button } from "@/src/components/ui/button";
import { skipToken } from "@reduxjs/toolkit/query";
import { MessageCircle, ArrowLeft, User } from "lucide-react"; // ✅ Added User icon
import noDataAnimation from "@/public/lottie/nodata.json";
import { useGetAllChatsQuery } from "@/src/hooks/useChat";
import { Globe, Clock, Target, MapPin } from "lucide-react"; // ✅ added MapPin for IP

// NOTE: chat.ts (RTK Query definition) is not modified as it's correct.

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
}

// ✅ New UserConversation type
interface UserConversation {
  id: number;
  name: string;
  lastMessageTime: string;
  messageCount: number;
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

  // ✅ New memoized list of unique users for the selected bot
  const userConversations: UserConversation[] = useMemo(() => {
    const usersMap = new Map<number, UserConversation>();

    chatList.forEach((chat) => {
      if (!usersMap.has(chat.user_id)) {
        usersMap.set(chat.user_id, {
          id: chat.user_id,
          name: chat.username || `User ${chat.user_id}`,
          lastMessageTime: chat.timestamp,
          messageCount: 1,
        });
      } else {
        const existingUser = usersMap.get(chat.user_id)!;
        existingUser.messageCount += 1;
        // Keep the latest timestamp for sorting/display
        if (new Date(chat.timestamp) > new Date(existingUser.lastMessageTime)) {
            existingUser.lastMessageTime = chat.timestamp;
        }
      }
    });

    // Convert map values to array and sort by latest message time
    return Array.from(usersMap.values()).sort((a, b) => 
        new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime()
    );
  }, [chatList]); // Re-calculate when chatList changes

  // 1. Automatically select the first chatbot on load
  useEffect(() => {
    if (chatbotList.length > 0 && !selectedBotId) {
      setSelectedBotId(chatbotList[0].id);
    }
  }, [chatbotList, selectedBotId]);

  // 2. Automatically select the first user when selectedBotId changes or new chats load
  useEffect(() => {
    if (selectedBotId !== null && userConversations.length > 0) {
      // Only set if no user is currently selected OR if the selected user is no longer in the list
      if (!selectedUser || !userConversations.some(u => u.id === selectedUser.id)) {
        const firstUser = userConversations[0];
        setSelectedUser({
          id: firstUser.id,
          name: firstUser.name,
        });
      }
    } else if (selectedBotId !== null && userConversations.length === 0) {
        // If a bot is selected but has no chats, clear the user selection
        setSelectedUser(null);
    }
  }, [userConversations, selectedBotId, selectedUser]); // ✅ dependencies updated

  const formatTime = (timestamp: string) =>
    new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  // StatCard component (no change)
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

  // latest chat (no change)
  const latestChat = chatList.length > 0 ? chatList[chatList.length - 1] : null;

  return (
    <>
      <DashboardHeader
        title="Chat History"
        description="View and manage your chatbot conversations"
      />

      {/* Back button + Stat Cards */}
      <div className="p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <button
          onClick={() => history.back()}
          className="px-4 py-2 text-sm bg-blue-500 text-white rounded-md shadow hover:bg-blue-600 !cursor-pointer flex-shrink-0"
          title="Back to chatbot Management"
        >
          Back to Previous
        </button>

        {/* Stat Cards Row */}
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
      </div>

      {/* Main Content Area */}
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
            {/* 1. Left Sidebar: Chatbots List */}
            <div className={`w-full lg:w-[320px] flex-shrink-0 flex flex-col border rounded-lg bg-gray-50 
              ${selectedBotId && selectedUser ? 'hidden lg:flex' : 'flex'}`}> {/* ✅ New responsiveness logic */}
              <div className="p-4 border-b bg-white rounded-t-lg">
                <h3 className="font-semibold text-lg">Chatbots List</h3>
                <p className="text-sm text-muted-foreground">
                  {chatbotList.length} bots
                </p>
              </div>
              <div className="flex-1 overflow-y-auto">
                {chatbotList.map((bot) => {
                  // NOTE: Filtering for last message is not efficient here, but kept for minimal change.
                  // This section does not need to be refactored to use the userConversations list.
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
                        setSelectedUser(null); // ✅ Reset selected user on new bot selection
                      }}
                      className={`p-4 border-b cursor-pointer hover:bg-gray-100 transition-colors ${
                        selectedBotId === bot.id
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
                        {bot.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2. Middle Sidebar: User Conversations List (NEW FIX) */}
            {selectedBotId && (
                <div className={`w-full lg:w-[320px] flex-shrink-0 flex flex-col border rounded-lg bg-gray-50 
                  ${!selectedUser ? 'flex' : 'hidden lg:flex'}`}> {/* ✅ New responsiveness logic */}
                  <div className="p-4 border-b bg-white rounded-t-lg flex items-center justify-between">
                    <h3 className="font-semibold text-lg">User Chats</h3>
                    <span className="text-sm text-muted-foreground">
                        {userConversations.length} users
                    </span>
                  </div>

                  {chatLoading ? (
                      <div className="p-4 text-center text-muted-foreground">Loading users...</div>
                  ) : userConversations.length === 0 ? (
                      <div className="p-4 text-center text-muted-foreground">No conversations for this bot.</div>
                  ) : (
                    <div className="flex-1 overflow-y-auto">
                        {userConversations.map((user) => (
                          <div
                            key={user.id}
                            onClick={() => {
                                setSelectedUser({ id: user.id, name: user.name });
                            }}
                            className={`p-4 border-b cursor-pointer hover:bg-gray-100 transition-colors ${
                                selectedUser?.id === user.id
                                  ? "bg-blue-50 border-l-4 border-l-blue-500"
                                  : "bg-white"
                            }`}
                          >
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <User className="w-5 h-5 text-gray-500 flex-shrink-0" />
                                <p className="font-medium text-sm truncate">
                                  {user.name}
                                </p>
                              </div>
                              <span className="text-xs text-muted-foreground ml-2 whitespace-nowrap">
                                {formatTime(user.lastMessageTime)}
                              </span>
                            </div>
                            <p className="text-xs ml-7 text-muted-foreground truncate">
                                {user.messageCount} messages
                            </p>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
            )}


            {/* 3. Right Chat Area */}
            <div className={`flex-1 flex flex-col border rounded-lg bg-gray-50 ${!selectedUser ? 'hidden lg:flex' : 'flex'}`}> {/* ✅ New responsiveness logic */}
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
                        // Displaying selected bot's image
                        <img
                          src={
                            chatbotList.find((bot) => bot.id === selectedBotId)
                              ?.profile_image || ""
                          }
                          alt={
                            chatbotList.find((bot) => bot.id === selectedBotId)
                              ?.name || "Bot"
                          }
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      )}

                      <h3 className="font-semibold">
                        Chat with{" "}
                        {selectedUser.name} {/* ✅ Show selected user's name */}
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
                          // ✅ Filtering based on the selected user ID
                          (chat: ChatData) => chat.user_id === selectedUser.id
                        )
                        .map((chat: ChatData) => (
                          <div key={chat.id} className="space-y-2">
                            {/* User Message */}
                            {chat.user_message && (
                              <div className="flex justify-end">
                                <div className="bg-blue-500 text-white rounded-2xl rounded-br-none px-4 py-2 max-w-[70%] shadow">
                                  <p className="text-sm">{chat.user_message}</p>
                                  <span className="text-xs opacity-70 block text-right mt-1">
                                    {formatTime(chat.timestamp)}
                                  </span>
                                </div>
                              </div>
                            )}

                            {/* Bot Response */}
                            {chat.bot_response &&
                              chat.bot_response.toLowerCase() !== "general" && (
                                <div className="flex justify-start">
                                  <div className="bg-gray-200 text-gray-800 rounded-2xl rounded-bl-none px-4 py-2 max-w-[70%] shadow">
                                    <p className="text-sm">
                                      {chat.bot_response}
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
                    <p>
                        {selectedBotId ? 
                        "Select a user conversation to view messages" : 
                        "Select a chatbot to begin."}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ChatHistoryPage;