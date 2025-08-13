"use client";

import React from "react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/src/components/ui/tabs";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/src/components/ui/select";
import { DashboardHeader } from "@/src/components/layout/dashboard-header";
import { Card, CardContent } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { useGetChatbotQuery } from "@/src/hooks/useChatbot";
import { ClipboardCopy } from "lucide-react";
import { toast } from "sonner";

interface Chatbot {
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
  id: number;
  is_active: boolean;
  progress_status: string;
  user_id: number;
  total_interactions: number;
  interaction_change_percent: number;
}

const tabData = [
  {
    id: "react",
    label: "React.js",
    description: "React script and usage info",
    steps: [
      {
        title: "Step 1: Locate the global component",
        description:
          "Locate the global component. Open your main app layout file. For most React apps (created using Create React App or Vite), use App.js or App.tsx.",
      },
      // ... other steps
    ],
  },
  // ... other tab data
];

const ScriptManagementPage = () => {
  const [selectedBotId, setSelectedBotId] = React.useState<number | null>(null);
  const [apikey, setApikey] = React.useState<string | null>(null);
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined') {
      const storedApikey = localStorage.getItem("apikey");
      setApikey(storedApikey);
    }
  }, []);

  const {
    data = [],
    isLoading,
    error,
    refetch,
  } = useGetChatbotQuery({ page: 1 });

  React.useEffect(() => {
    if (data && data.length > 0 && selectedBotId === null) {
      setSelectedBotId(data[0].id);
    }
  }, [data, selectedBotId]);

  const scriptTag = isClient && selectedBotId && apikey 
    ? `<script 
        type="module" 
        src="index.js"
        id="chatbot"
        data-admin-id="${selectedBotId}"
        api-key="${apikey}">
       </script>`
    : 'Loading script configuration...';

  const handleCopy = (script: string) => {
    navigator.clipboard.writeText(script);
    toast.success("Copied to clipboard!");
  };

  return (
    <>
      <DashboardHeader
        title="Script Management"
        description="Copy and manage script"
      />
      <div className="space-y-6 p-4 md:p-5 overflow-x-hidden">
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white tracking-tight">
            API Headers
          </h2>
        </div>
        
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="w-full md:w-80">
            <h1 className="block text-xl font-medium mb-2">
              Select Chatbot
            </h1>

            <Select onValueChange={(value: any) => setSelectedBotId(Number(value))}>
              <SelectTrigger className="w-full border border-gray-300 dark:border-primary rounded-lg shadow-sm focus:ring-2 focus:ring-primary focus:border-primary dark:focus:ring-secondary dark:focus:border-secondary transition-colors">
                <SelectValue
                  placeholder={
                    isLoading ? "Loading chatbots..." : "Choose chatbot"
                  }
                  className="text-gray-800 dark:text-gray-100"
                />
              </SelectTrigger>

              <SelectContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md">
                {isLoading && (
                  <SelectItem value="loading" disabled>
                    <span className="text-gray-500 dark:text-gray-400">
                      Loading...
                    </span>
                  </SelectItem>
                )}

                {error && (
                  <SelectItem value="error" disabled>
                    <span className="text-red-500 dark:text-red-400">
                      Error fetching chatbots
                    </span>
                  </SelectItem>
                )}

                {!isLoading && !error && data?.length > 0 ? (
                  data.map((bot: Chatbot) => (
                    <SelectItem
                      key={bot.id}
                      value={bot.id.toString()}
                      className="hover:bg-primary/10 dark:hover:bg-secondary/10 focus:bg-primary/20 dark:focus:bg-secondary/20"
                    >
                      <span className="text-sm font-medium text-gray-800 dark:text-gray-100">
                        {bot.name}
                      </span>
                      <span
                        className={`ml-2 text-xs font-semibold ${
                          bot.is_active
                            ? "text-green-600 dark:text-green-400"
                            : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        {bot.is_active ? "Active" : "Inactive"}
                      </span>
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-data" disabled>
                    <span className="text-gray-500 dark:text-gray-400">
                      No chatbots available
                    </span>
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>

        {selectedBotId !== null && data.length > 0 && (
          <Tabs defaultValue={tabData[0].id} className="space-y-4">
            <TabsList className="grid grid-cols-4 sm:grid-cols-7 bg-white text-primary border border-black w-full">
              {tabData.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="data-[state=active]:bg-primary data-[state=active]:text-white"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {tabData.map((tab) => (
              <TabsContent key={tab.id} value={tab.id}>
                <Card>
                  <CardContent className="p-4 space-y-4">
                    {tab.steps && (
                      <div className="space-y-5">
                        <div>
                          <h3 className="text-2xl font-bold text-black">
                            Integration Steps
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {tab.description}
                          </p>
                        </div>

                        {tab.steps.map((step, index) => (
                          <div
                            key={index}
                            className="relative border-l-4 border-primary bg-gray-200 p-6 rounded-lg shadow-sm"
                          >
                            <div className="absolute -left-4 top-6 w-8 h-8 rounded-full bg-primary text-white text-base font-semibold flex items-center justify-center shadow">
                              {index + 1}
                            </div>
                            <div className="pl-7">
                              <p className="text-lg font-semibold text-black mb-2">
                                {step.title}
                              </p>
                              <p className="text-base text-gray-600">
                                {step.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="bg-gray-900 text-green-400 font-mono text-sm p-4 rounded-lg relative">
                      <pre>
                        <code>{scriptTag}</code>
                      </pre>
                      <Button
                        size="sm"
                        variant="outline"
                        className="absolute top-2 right-2 text-xs"
                        onClick={() => handleCopy(scriptTag)}
                      >
                        <ClipboardCopy className="w-4 h-4 mr-1" />
                        Copy
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        )}
      </div>
    </>
  );
};

export default ScriptManagementPage;