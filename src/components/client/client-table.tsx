// @ts-nocheck
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
import { useGetClientsQuery } from "@/src/hooks/useClients" 

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

export default function ClientTable() {
  const { data: clients = [], isLoading, error } = useGetClientsQuery({}) 
  console.log("ClientTable clients:", clients)

  return (
    <div className="border rounded-xl shadow-sm">
      {isLoading && <div className="p-4">Loading clients...</div>}
      {error && <div className="p-4 text-red-500">Failed to load clients.</div>}
      {!isLoading && !error && (
        <>
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
              {clients.map((clients, index: number) => (
                <TableRow key={index}>
                  <TableCell className="flex items-center gap-3">
                    {/* Uncomment if you want to show avatars and have valid image URLs */}
                    {/* <Image
                      src={client.avatar}
                      alt={client.name}
                      width={32}
                      height={32}
                      className="rounded-full"
                    /> */}
                    <div>
                      <p className="font-medium">{clients.first_name}</p>
                      <p className="text-xs text-gray-500">{clients.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p>{clients.company}</p>
                    <p className="text-xs text-gray-500">{clients.company_name}</p>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`text-xs px-2 ${
                        clients.payment_status === "paid"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {clients.payment_status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm bg-blue-10 text-black px-2 py-1 rounded">
                      {clients.max_chatbots}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`text-xs px-2 ${
                        clients.payment_status === "paid"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {clients.payment_status === "paid" ? "✓ Verified" : "✗ Unverified"}
                    </Badge>
                  </TableCell>
                  <TableCell>{clients.lastActivity}</TableCell>
                  <TableCell className="flex items-center justify-center gap-2">
                    <Eye className="w-4 h-4 text-blue-500 cursor-pointer" />
                    <Pencil className="w-4 h-4 text-green-600 cursor-pointer" />
                    {clients.status === "Active" ? (
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
            Showing {clients.length > 0 ? `1 to ${clients.length}` : "0"} of {clients.length} results
            <div className="flex justify-end mt-2 gap-2">
              <button className="px-2 py-1 text-gray-500">Previous</button>
              <button className="px-3 py-1 bg-purple-600 text-white rounded">1</button>
              <button className="px-2 py-1 text-gray-500">2</button>
              <button className="px-2 py-1 text-gray-500">3</button>
              <button className="px-2 py-1 text-gray-500">Next</button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
