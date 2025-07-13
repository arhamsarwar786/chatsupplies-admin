"use client";

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
import { Eye, Edit, List, MoreHorizontal } from "lucide-react";
import { useGetChatbotQuery, useCreateChatbotMutation } from "@/src/hooks/useChatbot";
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
  user_id: number;
  total_interactions: number;
  interaction_change_percent: number;
}

export default function ChatbotTable() {
  const { data = [], isLoading, error, refetch } = useGetChatbotQuery();
  console.log("ChatbotTable data:", data);
  const [createChatbot, { isLoading: isCreating }] = useCreateChatbotMutation();

  // Example handler for creating a chatbot
  const handleAddChatbot = async () => {
    try {
      const newBot = {
        name: "New Chatbot",
        description: "Auto-created bot",
        // ...other required fields
      };
      await createChatbot(newBot).unwrap();
      toast.success("Chatbot created!");
      refetch(); // Refresh the list
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to create chatbot");
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Controls */}
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

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Chatbot Name</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Interactions</TableHead>
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
          {!isLoading && !error && data.length === 0 && (
            <TableRow>
              <TableCell colSpan={6}>No chatbots found.</TableCell>
            </TableRow>
          )}
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
                  {/* <Image
                    src={bot.clientAvatar}
                    alt="avatar"
                    width={32}
                    height={32}
                    className="rounded-full"
                  /> */}
                  <span>{bot.client_name}</span>
                </div>
              </TableCell>
              <TableCell>
                <span
                  className={`text-sm font-medium px-2 py-1 rounded-full ${
                    bot.updated_at === "active"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {bot.updated_at === "active" ? "● Active" : "● Inactive"}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-medium">
                    {bot.total_interactions ? new Date(bot.total_interactions).toLocaleString() : "N/A"}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {bot.updated_at}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                {bot.created_at ? new Date(bot.created_at).toLocaleDateString() : "N/A"}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Eye className="h-4 w-4 text-blue-500 cursor-pointer" />
                  <Edit className="h-4 w-4 text-green-600 cursor-pointer" />
                  <List className="h-4 w-4 text-orange-500 cursor-pointer" />
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <MoreHorizontal className="h-4 w-4 cursor-pointer" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>View</DropdownMenuItem>
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className="flex justify-between text-sm text-muted-foreground pt-4">
        <span>
          Showing{" "}
          {data.length > 0 ? `1 to ${data.length}` : "0"} of {data.length} results
        </span>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            Previous
          </Button>
          <Button size="sm" className="bg-primary text-white">
            1
          </Button>
          <Button variant="outline" size="sm">
            2
          </Button>
          <Button variant="outline" size="sm">
            3
          </Button>
          <Button variant="outline" size="sm">
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
