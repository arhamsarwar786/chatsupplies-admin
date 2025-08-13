// @ts-nocheck
"use client";

import { useEffect, useState } from "react";
// import dynamic from "next/dynamic";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
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

// const Player = dynamic(
//   () => import("@lottiefiles/react-lottie-player").then((mod) => mod.Player),
//   { ssr: false }
// );
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
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "just_created":
      return "bg-red-100 text-red-800";
    case "knowledge_base_ready":
      return "bg-green-100 text-green-800";
    case "scrapping":
      return "bg-orange-100 text-orange-800";
    case "building_knowledge_base":
      return "bg-blue-100 text-blue-800";
    case "training":
      return "bg-purple-100 text-purple-800";
    case "ready":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
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
  const [createChatbot, { isLoading: isCreating }] = useCreateChatbotMutation();
  // console.log("Chatbots data:", data);

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
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Input placeholder="Search chatbots..." className="w-64" />
        <div className="flex gap-2">
          <Button variant="outline">All Status</Button>
          <Button variant="outline">All Clients</Button>
          <Button variant="outline">Filter</Button>
          <Button>Export</Button>
          <Button onClick={handleAddChatbot} disabled={isCreating}>
            {isCreating ? "Adding..." : "Add Chatbot"}
          </Button>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Chatbot Name</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Interactions</TableHead>
            <TableHead>Edit Chatbot</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading && (
            <TableRow>
              <TableCell colSpan={6}>Loading...</TableCell>
            </TableRow>
          )}
          {error && (
            <TableRow>
              <TableCell colSpan={6} className="text-red-500">
                Failed to load chatbots.
              </TableCell>
            </TableRow>
          )}
          {/* {data.length === 0 ? (
            <div className="w-full flex justify-center">
              <div className="flex flex-col items-center">
                <Player
                  autoplay
                  loop
                  src={NoDataFoundAnimation}
                  style={{ height: "200px", width: "200px" }}
                />
                <p className="mt-4 text-muted-foreground">No chatbot found.</p>
              </div>
            </div>
          ) : null} */}
          {data.map((bot: Chatbot, idx: number) => (
            <TableRow key={idx}>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-medium">{bot.name}</span>
                  <span className="text-muted-foreground text-sm">
                    {bot.description}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span>{bot.client_name}</span>
                </div>
              </TableCell>
              <TableCell>
                <TableCell>
                  <span
                    className={`text-xs font-semibold uppercase px-2 py-1 rounded-full ${getStatusStyle(
                      bot.progress_status
                    )}`}
                  >
                    {bot.progress_status.replace(/_/g, " ")}
                  </span>
                </TableCell>
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-medium">
                    {bot.total_interactions ?? "N/A"}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <SquarePen
                  onClick={() =>
                    router.push(
                      `/dashboard/chatbot-management/update-chatbot/${bot.id}`
                    )
                  }
                  className="cursor-pointer text-primary hover:text-primary/80 transition-colors"
                />
              </TableCell>
              <TableCell>
                {bot.created_at
                  ? new Date(bot.created_at).toLocaleDateString()
                  : "N/A"}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <UploadURL chatbotId={bot.id} status={bot.progress_status} />
                  {bot.progress_status == "ready" ||
                  bot.progress_status == "just_created" ||
                  bot.progress_status == "ready" ? (
                    <>
                      <UploadPDF
                        chatbotId={bot.id}
                        status={bot.progress_status}
                      />
                      {bot.progress_status === "ready" && (
                        <CopyScript
                          chatbotId={bot.id}
                          status={bot.progress_status}
                        />
                      )}

                      <ActionsDropdown chatbotId={bot.id} />
                    </>
                  ) : (
                    <div></div>
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
            disabled={data.length < 10} // Disable Next if data count is less than expected page size
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
