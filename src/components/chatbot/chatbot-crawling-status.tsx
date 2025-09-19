// @ts-nocheck
"use client";

import { useEffect, useState } from "react";
import { CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/src/components/ui/button";

interface Log {
  id: number;
  message: string;
  status: "pending" | "in_progress" | "completed" | "failed";
  timestamp: string;
}

interface ChatbotCrawlingStatusProps {
  chatbotId: number;
  onRecrawlClick: (id: number) => void;
}

export default function ChatbotCrawlingStatus({
  chatbotId,
  onRecrawlClick,
}: ChatbotCrawlingStatusProps) {
  const [logs, setLogs] = useState<Log[]>([]);

  // Simulate fetching logs (replace with your API later)
  useEffect(() => {
    let steps: Log[] = [
      {
        id: 1,
        message: "Crawling started",
        status: "completed",
        timestamp: new Date().toLocaleString(),
      },
      {
        id: 2,
        message: "Crawling in progress",
        status: "in_progress", // start as in progress
        timestamp: new Date().toLocaleString(),
      },
      {
        id: 3,
        message: "Processing content",
        status: "pending",
        timestamp: "",
      },
      {
        id: 4,
        message: "Crawling finished",
        status: "pending",
        timestamp: "",
      },
    ];

    setLogs(steps);

    // ⏳ Simulate fetching done after 3 seconds
    const timer = setTimeout(() => {
      setLogs((prev) =>
        prev.map((log) =>
          log.id === 2
            ? { ...log, status: "completed", timestamp: new Date().toLocaleString() }
            : log
        )
      );
    }, 3000);

    return () => clearTimeout(timer);
  }, [chatbotId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700 border-green-300";
      case "in_progress":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "failed":
        return "bg-red-100 text-red-700 border-red-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  return (
    <div className="space-y-3">
      {logs.map((log) => (
        <div
          key={log.id}
          className={`border rounded-md p-3 flex items-center justify-between ${getStatusColor(
            log.status
          )}`}
        >
          <div className="flex items-center gap-2">
            {/* show spinner when in progress, tick when done, or a button when failed */}
            {log.status === "completed" && (
              <CheckCircle className="w-5 h-5 text-green-600" />
            )}
            {log.status === "in_progress" && (
              <Loader2 className="w-5 h-5 text-yellow-600 animate-spin" />
            )}
            {log.status === "failed" && (
              <Button
                onClick={() => onRecrawlClick(chatbotId)}
                variant="outline"
                className="text-red-500 hover:text-red-600 border-red-500 hover:border-red-600 px-3 py-1"
              >
                Recrawl
              </Button>
            )}
            <span className="font-medium">{log.message}</span>
          </div>
          <span className="text-xs">{log.timestamp || "..."}</span>
        </div>
      ))}
    </div>
  );
}