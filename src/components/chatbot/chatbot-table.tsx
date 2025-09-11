// @ts-nocheck
"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/src/components/ui/tooltip";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/src/components/ui/dropdown-menu";
import {
  useGetChatbotQuery,
  useCreateChatbotMutation,
} from "@/src/hooks/useChatbot";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import UploadPDF from "./upload-pdf";
import UploadURL from "./upload-url";
import ActionsDropdown from "./uploaded-files";
import CopyScript from "./copy-script";
import { SquarePen } from "lucide-react";

const Player = dynamic(
  () => import("@lottiefiles/react-lottie-player").then((mod) => mod.Player),
  { ssr: false }
);

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

const getStatusStyle = (status: string) => {
  switch (status.toLowerCase()) {
    // case "pending":
    //   return "bg-yellow-100 text-yellow-800";
    case "just_created":
      return "bg-red-100 text-red-800";
    // case "knowledge_base_ready":
    //   return "bg-green-100 text-green-800";
    case "in_progress":
      return "bg-orange-100 text-orange-800";
    // case "building_knowledge_base":
    //   return "bg-blue-100 text-blue-800";
    // case "training":
    //   return "bg-purple-100 text-purple-800";
    case "ready":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

// Utility: relative time like "5 sec ago"
const getRelativeTime = (dateString: string) => {
  if (!dateString) return "N/A";
  const now = new Date();
  const created = new Date(dateString);
  const diffMs = now.getTime() - created.getTime();

  const seconds = Math.floor(diffMs / 1000);
  if (seconds < 60) return `${seconds} sec ago`;

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr${hours > 1 ? "s" : ""} ago`;

  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
};

export default function ChatbotTable() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [uploadedFilesDialogOpen, setUploadedFilesDialogOpen] = useState(false);
  const {
    data = [],
    isLoading,
    error,
    refetch,
  } = useGetChatbotQuery({ page: currentPage });
  console.log(data);
  const [createChatbot, { isLoading: isCreating }] = useCreateChatbotMutation();

  const handleAddChatbot = async () => {
    try {
      const newBot = {
        name: "New Chatbot",
        description: "Auto-created bot",
      };
      await createChatbot(newBot).unwrap();
      toast.success("Chatbot created!");
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to create chatbot");
    }
  };

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    if (data.length < 10) return; // adjust this limit as per your backend pagination
    setCurrentPage((prev) => prev + 1);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Chatbots</h1>
      </div>

      <Table className="w-full border border-gray-200 rounded-md shadow-sm">
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead className="px-4 py-3 text-left font-semibold text-gray-700">
              Chatbot Name
            </TableHead>
            <TableHead className="px-4 py-3 text-left">Client</TableHead>
            <TableHead className="px-4 py-3 text-left">Status</TableHead>
            <TableHead className="px-4 py-3 text-left">Interactions</TableHead>
            <TableHead className="px-4 py-3 text-left">Edit</TableHead>
            <TableHead className="px-4 py-3 text-left">Created</TableHead>
            <TableHead className="px-4 py-3 text-left">Last Response</TableHead>
            <TableHead className="px-4 py-3 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {isLoading && (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-6 text-gray-500">
                Loading...
              </TableCell>
            </TableRow>
          )}

          {error && (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-6 text-red-500">
                Failed to load chatbots.
              </TableCell>
            </TableRow>
          )}

          {data.length === 0 && !isLoading && !error && (
            <TableRow>
              <TableCell colSpan={8}>
                <div className="w-full flex flex-col items-center py-10 text-muted-foreground">
                  <Player
                    autoplay
                    loop
                    src="NoDataFoundAnimation"
                    style={{ height: "200px", width: "200px" }}
                  />
                  <p className="mt-4 text-sm">No chatbots found.</p>
                </div>
              </TableCell>
            </TableRow>
          )}

          {data.map((bot: Chatbot, idx: number) => (
            <TableRow
              key={idx}
              className="hover:bg-gray-50 transition-colors duration-150"
            >
              {/* Chatbot Name & Description */}
              <TableCell className="px-4 py-3">
                <div className="flex flex-col">
                  <span className="font-medium text-gray-800">{bot.name}</span>
                  <span className="text-sm text-gray-500">
                    {bot.description}
                  </span>
                </div>
              </TableCell>

              {/* Client Name */}
              <TableCell className="px-4 py-3">
                <span>{bot.client_name}</span>
              </TableCell>

              {/* Status Badge */}
              <TableCell className="px-4 py-3">
                <span
                  className={`text-xs font-semibold uppercase px-2 py-1 rounded-full ${getStatusStyle(
                    bot.progress_status
                  )}`}
                >
                  {bot.progress_status.replace(/_/g, " ")}
                </span>
              </TableCell>

              {/* Interactions */}
              <TableCell className="px-4 py-3">
                <span className="font-medium text-gray-700">
                  {bot.total_interactions ?? "N/A"}
                </span>
              </TableCell>

              {/* Edit Icon */}
              <TableCell className="px-4 py-3">
                <SquarePen
                  onClick={() =>
                    router.push(
                      `/dashboard/chatbot-management/update-chatbot/${bot.id}`
                    )
                  }
                  className="cursor-pointer text-blue-600 hover:text-blue-500 transition"
                />
              </TableCell>

              {/* Creation Date */}
              <TableCell className="px-4 py-3">
                {bot.created_at
                  ? new Date(bot.created_at).toLocaleDateString()
                  : "N/A"}
              </TableCell>

              {/* Relative Time for Last Response */}
              <TableCell className="px-4 py-3">
                {bot.created_at ? getRelativeTime(bot.created_at) : "N/A"}
              </TableCell>

              {/* Actions */}
              <TableCell className="px-4 py-3 text-right">
                <div className="flex justify-end items-center gap-2">
                  <Tooltip>
                    <TooltipTrigger>
                      <UploadURL
                        chatbotId={bot.id}
                        status={bot.progress_status}
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Upload URL</p>
                    </TooltipContent>
                  </Tooltip>

                  {(bot.progress_status === "ready" ||
                    bot.progress_status === "just_created") && (
                    <>
                      <Tooltip>
                        <TooltipTrigger>
                          <UploadPDF
                            chatbotId={bot.id}
                            status={bot.progress_status}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Upload PDF</p>
                        </TooltipContent>
                      </Tooltip>

                      {bot.progress_status === "ready" && (
                        <Tooltip>
                          <TooltipTrigger>
                            <CopyScript
                              chatbotId={bot.id}
                              status={bot.progress_status}
                            />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Copy Script</p>
                          </TooltipContent>
                        </Tooltip>
                      )}

                      <ActionsDropdown chatbotId={bot.id} />
                    </>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-between text-sm text-muted-foreground pt-4">
        <span>
          Showing {data.length > 0 ? `1 to ${data.length}` : "0"} results on
          page {currentPage}
        </span>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span className="px-2">{currentPage}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextPage}
            disabled={data.length < 10}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
