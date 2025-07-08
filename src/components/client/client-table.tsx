'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/src/components/ui/table"
import { Badge } from "@/src/components/ui/badge"
import { Eye, Pencil, Pause, Play } from "lucide-react"
import Image from "next/image"

type Client = {
  name: string
  email: string
  avatar: string
  company: string
  industry: string
  status: "Active" | "Suspended"
  chatbots: string
  payment: "Verified" | "Unverified"
  lastActivity: string
}

const clients: Client[] = [
  {
    name: "Ali Khan",
    email: "ali@techcorp.com",
    avatar: "/avatars/ali.jpg", // Replace with your actual image paths
    company: "TechCorp Inc.",
    industry: "Technology",
    status: "Active",
    chatbots: "3 Bots",
    payment: "Verified",
    lastActivity: "2 hours ago"
  },
  {
    name: "Sarah Wilson",
    email: "sarah@retailmax.com",
    avatar: "/avatars/sarah.jpg",
    company: "RetailMax",
    industry: "E-commerce",
    status: "Active",
    chatbots: "2 Bots",
    payment: "Verified",
    lastActivity: "1 day ago"
  },
  {
    name: "Mike Johnson",
    email: "mike@financehub.com",
    avatar: "/avatars/mike.jpg",
    company: "FinanceHub",
    industry: "Financial Services",
    status: "Suspended",
    chatbots: "1 Bot",
    payment: "Unverified",
    lastActivity: "5 days ago"
  }
]

export default function ClientTable() {
  return (
    <div className="border rounded-xl shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Client</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Chatbots</TableHead>
            <TableHead>Payment</TableHead>
            <TableHead>Last Activity</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.map((client, index) => (
            <TableRow key={index}>
              <TableCell className="flex items-center gap-3">
                {/* <Image
                  src={client.avatar}
                  alt={client.name}
                  width={32}
                  height={32}
                  className="rounded-full"
                /> */}
                <div>
                  <p className="font-medium">{client.name}</p>
                  <p className="text-xs text-gray-500">{client.email}</p>
                </div>
              </TableCell>
              <TableCell>
                <p>{client.company}</p>
                <p className="text-xs text-gray-500">{client.industry}</p>
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={`text-xs px-2 ${
                    client.status === "Active"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {client.status}
                </Badge>
              </TableCell>
              <TableCell>
                <span className="text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded">
                  {client.chatbots}
                </span>
                <span className="ml-1 text-lg font-bold text-gray-400">+</span>
              </TableCell>
              <TableCell>
                <Badge
                  className={`text-xs px-2 ${
                    client.payment === "Verified"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {client.payment === "Verified" ? "✓ Verified" : "✗ Unverified"}
                </Badge>
              </TableCell>
              <TableCell>{client.lastActivity}</TableCell>
              <TableCell className="flex items-center justify-center gap-2">
                <Eye className="w-4 h-4 text-blue-500 cursor-pointer" />
                <Pencil className="w-4 h-4 text-green-600 cursor-pointer" />
                {client.status === "Active" ? (
                  <Pause className="w-4 h-4 text-orange-500 cursor-pointer" />
                ) : (
                  <Play className="w-4 h-4 text-green-500 cursor-pointer" />
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="p-4 text-sm text-gray-600">
        Showing 1 to 3 of 247 results
        <div className="flex justify-end mt-2 gap-2">
          <button className="px-2 py-1 text-gray-500">Previous</button>
          <button className="px-3 py-1 bg-purple-600 text-white rounded">1</button>
          <button className="px-2 py-1 text-gray-500">2</button>
          <button className="px-2 py-1 text-gray-500">3</button>
          <button className="px-2 py-1 text-gray-500">Next</button>
        </div>
      </div>
    </div>
  )
}
