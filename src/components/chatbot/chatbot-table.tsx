// @ts-nocheck
"use client";

import { useEffect, useState, useCallback } from "react";
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
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/src/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/src/components/ui/pagination";
import {
  useGetChatbotQuery,
  useCreateChatbotMutation,
  useDeleteChatbotMutation,
} from "@/src/hooks/useChatbot";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import CopyScript from "./copy-script";
import { SquarePen, MoreHorizontal } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import UploadUrlPdf from "./upload-url-pdf";
import ConfirmStopPopup from "./confirm-stopPopup";

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
  client_api_key: string;
  client_email: string;
  website_name?: string;
  user_name?: string;
  pages_crawled?: number;
  total_pages?: number;
}

const getStatusStyle = (status: string) => {
  switch (status.toLowerCase()) {
    case "just_created":
      return "bg-red-100 text-red-800";
    case "in_progress":
      return "bg-orange-100 text-orange-800";
    case "ready":
      return "bg-green-100 text-green-800";
    case "failed":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

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

// SVG Icons Components
const PlayIcon = ({ className = "w-8 h-8", ...props }) => (
  <button {...props} className={className}>
    <img src="/play.svg" alt="Play" className="w-4 h-4" />
  </button>
);

const StopIcon = ({ className = "w-8 h-8", ...props }) => (
  <button {...props} className={className}>
    <img src="/stop.svg" />
  </button>
);

const RecrawlIcon = ({ className = "w-8 h-8", ...props }) => (
  <button {...props} className={className}>
    <img src="/arrows-rotate-reverse.svg" />
  </button>
);

const stopCrawling = async (chatbotId: number): Promise<void> => {
  const token = localStorage.getItem("token");
  const apikey = localStorage.getItem("apikey");

  const headers: HeadersInit = {
    'Content-Type': 'application/x-www-form-urlencoded',
  };

  if (apikey) {
    headers['api-key'] = apikey;
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const body = new URLSearchParams();
  body.append('chatbot_id', String(chatbotId));

  try {
    const response = await fetch('https://api.chatsupplies.com/training/crawl/stop', {
      method: 'POST',
      headers: headers,
      body: body.toString(),
    });

    if (!response.ok) {
      let errorMessage = 'Failed to stop crawling';
      try {
        const errorData = await response.json();
        errorMessage = errorData.detail || errorData.message || errorMessage;
      } catch (e) {
        // Ignore if JSON parsing fails, use generic message
      }
      throw new Error(errorMessage);
    }

  } catch (error) {
    console.error('Error stopping crawling:', error);
    throw error;
  }
};

const ActionsDropdown = ({
  chatbotId,
  onRecrawl,
  onDelete,
  onUploadFiles,
}: {
  chatbotId: number;
  onRecrawl?: (id: number) => void;
  onDelete?: (id: number) => void;
  onUploadFiles?: (id: number) => void;
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="p-2 rounded hover:bg-gray-100">
          <MoreHorizontal size={18} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onDelete?.(chatbotId)}>
          Delete
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onUploadFiles?.(chatbotId)}>
          Upload Files
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onRecrawl?.(chatbotId)}>
          Recrawl
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// MODIFIED: Stop Crawling Button Component to open confirmation dialog
const StopCrawlingButton = ({
  chatbotId,
  status,
  onOpenConfirmStop,
}: {
  chatbotId: number;
  status: string;
  onOpenConfirmStop: (id: number) => void;
}) => {
  if (status !== "in_progress") {
    return null;
  }

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onOpenConfirmStop(chatbotId);
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          onClick={handleClick}
          variant="ghost"
          size="sm"
          className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50"
        >
          <StopIcon className="w-4 h-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Stop Crawling</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default function ChatbotTable() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBotId, setSelectedBotId] = useState<number | null>(null);
  const [recrawlBot, setRecrawlBot] = useState<Chatbot | null>(null);
  const [botIdToStop, setBotIdToStop] = useState<number | null>(null);

  const { data, isLoading, error, refetch } = useGetChatbotQuery({
    page: currentPage,
    sort_desc: true,
  });

  const chatbots = data?.chatbots ?? [];
  const totalPages = data?.total_pages ?? 1;
  const totalCount = data?.total_count ?? 0;

  const [createChatbot] = useCreateChatbotMutation();
  const [deleteChatbot] = useDeleteChatbotMutation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  // Handler to open the confirmation popup
  const handleOpenConfirmStop = (chatbotId: number) => {
    setBotIdToStop(chatbotId);
  };

  // Handler to close the confirmation popup
  const handleCloseConfirmStop = () => {
    setBotIdToStop(null);
  };

  // Confirmation handler to perform the API call
  const handleConfirmStop = async () => {
    if (!botIdToStop) return;

    try {
      await stopCrawling(botIdToStop);
      toast.success("Crawling stop request sent successfully");
      
      // Manual refetch only when user explicitly stops crawling
      setTimeout(() => {
        refetch();
      }, 2000);
    } catch (error) {
      let errorMessage = "An unknown error occurred.";

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'object' && error !== null) {
        errorMessage = (error as any).message || (error as any).detail || String(error);
      } else if (typeof error === 'string') {
        errorMessage = error;
      }

      if (errorMessage === '[object Object]' || !errorMessage) {
        errorMessage = "Failed to stop crawling due to an API error.";
      }

      toast.error(errorMessage);
      console.error("Stop crawling error:", error);
    }
  };

  const handleDelete = async (chatbotId: number) => {
    try {
      await deleteChatbot(chatbotId).unwrap();
      toast.success("Chatbot deleted successfully");
    } catch (err) {
      toast.error("Failed to delete chatbot");
      console.error("Chatbot delete failed:", err);
    }
  };

  const handleUploadFiles = (chatbotId: number) => {
    const botToUpload = chatbots.find((b) => b.id === chatbotId);
    if (botToUpload) setRecrawlBot(botToUpload);
  };

  const handleRecrawl = (chatbotId: number) => {
    const botToRecrawl = chatbots.find((b) => b.id === chatbotId);
    if (botToRecrawl) setRecrawlBot(botToRecrawl);
  };

  // SIMPLIFIED: UploadUrlPdf component without automatic status checking
  const SimpleUploadUrlPdf = ({ chatbotId, status, client_email }: { 
    chatbotId: number; 
    status: string; 
    client_email: string;
  }) => {
    return (
      <UploadUrlPdf
        chatbotId={chatbotId}
        status={status}
        client_email={client_email}
        onStatusChange={refetch} // Only refetch when status actually changes
      />
    );
  };

  // Helper function to render the table row
  const renderChatbotRow = (bot: Chatbot, idx: number) => {
    const status = bot.progress_status;
    const isCrawling = status === "in_progress";

    return (
      <TableRow
        key={idx}
        onClick={() => {
          if (status === "ready") {
            router.push(`/dashboard/chatbot-management/chat-details/${bot.id}`);
            return;
          }

          if (status === "just_created" || status === "in_progress") {
            return;
          }

          setSelectedBotId(bot.id);
        }}
        className={`transition-colors duration-150 ${isCrawling ? 'cursor-default' : 'cursor-pointer hover:bg-gray-50'}`}
      >
        <TableCell className="px-4 py-3">
          <div className="flex flex-col">
            <span className="font-medium text-gray-800">{bot.name}</span>
            <span className="text-sm text-gray-500 max-w-[250px] truncate">
              {bot.description ? bot.description : "No description"}
            </span>
          </div>
        </TableCell>

        <TableCell className="px-4 py-3 hidden md:table-cell">
          <span>{bot.client_name}</span>
        </TableCell>

        <TableCell className="px-4 py-3">
          {isCrawling ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <span
                  className={`text-xs font-semibold uppercase px-2 py-1 rounded-full ${getStatusStyle(
                    bot.progress_status
                  )}`}
                >
                  {bot.progress_status.replace(/_/g, " ")}
                </span>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>Crawl in Progress</p>
              </TooltipContent>
            </Tooltip>
          ) : (
            <span
              className={`text-xs font-semibold uppercase px-2 py-1 rounded-full ${getStatusStyle(
                bot.progress_status
              )}`}
            >
              {bot.progress_status.replace(/_/g, " ")}
            </span>
          )}
        </TableCell>

        <TableCell className="px-4 py-3 hidden md:table-cell">
          <span className="font-medium text-gray-700">
            {bot.total_interactions ?? "N/A"}
          </span>
        </TableCell>

        <TableCell className="px-4 py-3 hidden md:table-cell">
          <Tooltip>
            <TooltipTrigger asChild>
              <SquarePen
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/dashboard/chatbot-management/update-chatbot/${bot.id}`);
                }}
                className="cursor-pointer text-blue-600 hover:text-blue-500 transition"
              />
            </TooltipTrigger>
            <TooltipContent>
              <p>Edit Chatbot</p>
            </TooltipContent>
          </Tooltip>
        </TableCell>

        <TableCell className="px-4 py-3 hidden md:table-cell">
          {bot.created_at
            ? new Date(bot.created_at).toLocaleString(undefined, {
              year: "numeric",
              month: "short",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            })
            : "N/A"}
        </TableCell>

        <TableCell className="px-4 py-3 hidden md:table-cell">
          {bot.created_at ? getRelativeTime(bot.created_at) : "N/A"}
        </TableCell>

        <TableCell className="px-4 py-3 text-right">
          <div
            className="flex justify-end items-center gap-2"
            onClick={(e) => e.stopPropagation()}
          >
            <StopCrawlingButton
              chatbotId={bot.id}
              status={bot.progress_status}
              onOpenConfirmStop={handleOpenConfirmStop}
            />
            <Tooltip>
              <TooltipTrigger asChild>
                <SimpleUploadUrlPdf
                  chatbotId={bot.id}
                  status={bot.progress_status}
                  client_email={bot.client_email}
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>Upload URL & PDF</p>
              </TooltipContent>
            </Tooltip>

            {bot.progress_status === "ready" && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <CopyScript
                    chatbotId={bot.id}
                    client_api_key={bot.client_api_key}
                    status={bot.progress_status}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Copy Script</p>
                </TooltipContent>
              </Tooltip>
            )}

            <ActionsDropdown
              chatbotId={bot.id}
              onRecrawl={handleRecrawl}
              onDelete={handleDelete}
              onUploadFiles={handleUploadFiles}
            />
          </div>
        </TableCell>
      </TableRow>
    );
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Chatbots</h1>
      </div>

      <div className="overflow-x-auto w-full">
        <Table className="min-w-[500px] sm:min-w-full w-full border border-gray-200 rounded-md shadow-sm">
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="px-4 py-3 text-left font-semibold text-gray-700">
                Chatbot Name
              </TableHead>
              <TableHead className="px-4 py-3 text-left hidden md:table-cell">
                Client
              </TableHead>
              <TableHead className="px-4 py-3 text-left">Status</TableHead>
              <TableHead className="px-4 py-3 text-left hidden md:table-cell">
                Interactions
              </TableHead>
              <TableHead className="px-4 py-3 text-left hidden md:table-cell">
                Edit
              </TableHead>
              <TableHead className="px-4 py-3 text-left hidden md:table-cell">
                Created
              </TableHead>
              <TableHead className="px-4 py-3 text-left hidden md:table-cell">
                Last Response
              </TableHead>
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

            {chatbots.length === 0 && !isLoading && !error && (
              <TableRow>
                <TableCell colSpan={8}>
                  <div className="w-full flex flex-col items-center py-10 text-muted-foreground">
                    <Player
                      autoplay
                      loop
                      src="./play.svg"
                      style={{ height: "200px", width: "200px" }}
                    />
                    <p className="mt-4 text-sm">No chatbots found.</p>
                  </div>
                </TableCell>
              </TableRow>
            )}

            {chatbots.map((bot: Chatbot, idx: number) => renderChatbotRow(bot, idx))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex w-full justify-between text-sm text-muted-foreground pt-4">
        <span>
          Showing {chatbots.length > 0 ? `1 to ${chatbots.length}` : "0"} of{" "}
          {totalCount} results (Page {currentPage} of {totalPages})
        </span>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage > 1) setCurrentPage((p) => p - 1);
                }}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  href="#"
                  isActive={currentPage === i + 1}
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage(i + 1);
                  }}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage < totalPages) setCurrentPage((p) => p + 1);
                }}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      {/* Crawling Status Popup */}
      <Dialog
        open={!!selectedBotId}
        onOpenChange={(open) => setSelectedBotId(open ? selectedBotId : null)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Crawling Status</DialogTitle>
          </DialogHeader>
          {selectedBotId && <div>Crawling status details would appear here</div>}
        </DialogContent>
      </Dialog>

      {/* Recrawl Popup */}
      <Dialog
        open={!!recrawlBot}
        onOpenChange={(open) => setRecrawlBot(open ? recrawlBot : null)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Start again Website Crawling & Upload Files</DialogTitle>
          </DialogHeader>
          {recrawlBot && (
            <SimpleUploadUrlPdf
              chatbotId={recrawlBot.id}
              status={recrawlBot.progress_status}
              client_email={recrawlBot.client_email}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Confirmation Popup */}
      <ConfirmStopPopup
        open={!!botIdToStop}
        onClose={handleCloseConfirmStop}
        onConfirm={handleConfirmStop}
      />
    </div>
  );
}