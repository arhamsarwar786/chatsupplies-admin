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
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/src/components/ui/dropdown-menu";
import { Eye, Edit, List, MoreHorizontal } from "lucide-react";
import Image from "next/image";

interface Chatbot {
  name: string;
  description: string;
  clientName: string;
  clientAvatar: string;
  status: "active" | "inactive";
  interactions: number;
  interactionChange: string;
  createdAt: string;
}

const data: Chatbot[] = [
  {
    name: "Customer Support Bot",
    description: "General customer inquiries",
    clientName: "TechCorp Inc.",
    clientAvatar: "/avatars/user1.png",
    status: "active",
    interactions: 15247,
    interactionChange: "+12% this week",
    createdAt: "Mar 15, 2024",
  },
  {
    name: "E-commerce Assistant",
    description: "Product recommendations & orders",
    clientName: "RetailMax",
    clientAvatar: "/avatars/user2.png",
    status: "active",
    interactions: 8932,
    interactionChange: "+8% this week",
    createdAt: "Mar 10, 2024",
  },
  {
    name: "Banking Assistant",
    description: "Account inquiries & transactions",
    clientName: "FinanceHub",
    clientAvatar: "/avatars/user3.png",
    status: "inactive",
    interactions: 5421,
    interactionChange: "-2% this week",
    createdAt: "Feb 28, 2024",
  },
];

export default function ChatbotTable() {
  return (
    <div className="p-6 space-y-4">
      {/* Top Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Input placeholder="Search chatbots..." className="w-64" />
        <div className="flex gap-2">
          <Button variant="outline">All Status</Button>
          <Button variant="outline">All Clients</Button>
          <Button variant="outline">Filter</Button>
          <Button>Export</Button>
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
          {data.map((bot, idx) => (
            <TableRow key={idx}>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-medium">{bot.name}</span>
                  <span className="text-muted-foreground text-sm">{bot.description}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Image
                    src={bot.clientAvatar}
                    alt="avatar"
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                  <span>{bot.clientName}</span>
                </div>
              </TableCell>
              <TableCell>
                <span
                  className={`text-sm font-medium px-2 py-1 rounded-full ${
                    bot.status === "active"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {bot.status === "active" ? "● Active" : "● Inactive"}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-medium">{bot.interactions.toLocaleString()}</span>
                  <span className="text-sm text-muted-foreground">{bot.interactionChange}</span>
                </div>
              </TableCell>
              <TableCell>{bot.createdAt}</TableCell>
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
        <span>Showing 1 to 3 of 47 results</span>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">Previous</Button>
          <Button size="sm" className="bg-primary text-white">1</Button>
          <Button variant="outline" size="sm">2</Button>
          <Button variant="outline" size="sm">3</Button>
          <Button variant="outline" size="sm">Next</Button>
        </div>
      </div>
    </div>
  );
}
