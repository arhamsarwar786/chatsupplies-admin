// @ts-nocheck
'use client'
import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/src/components/ui/table";
import { Badge } from "@/src/components/ui/badge";
import { Eye, Pencil, Pause, Play } from "lucide-react";
import { useGetClientsQuery } from "@/src/hooks/useClients";

export default function ClientTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const { data: clients = [], isLoading, error } = useGetClientsQuery({ page: currentPage });
  console.log("Client Data:", clients);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (clients.length === 10) {  // adjust according to API page size
      setCurrentPage(prev => prev + 1);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

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
              {clients.map((client, index) => (
                <TableRow key={index}>
                  <TableCell className="flex items-center gap-3">
                    <div>
                      <p className="font-medium">{client.first_name}</p>
                      <p className="text-xs text-gray-500">{client.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p>{client.company}</p>
                    <p className="text-xs text-gray-500">{client.company_name}</p>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`text-xs px-2 ${
                        client.payment_status === "paid"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {client.payment_status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm bg-blue-10 text-black px-2 py-1 rounded">
                      {client.max_chatbots}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`text-xs px-2 ${
                        client.payment_status === "paid"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {client.payment_status === "paid" ? "✓ Verified" : "✗ Unverified"}
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

          {/* Pagination */}
          <div className="p-4 text-sm text-gray-600">
            Showing {clients.length > 0 ? `1 to ${clients.length}` : "0"} of {clients.length} results
            <div className="flex justify-end mt-2 gap-2">
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className={`px-2 py-1 rounded ${
                  currentPage === 1
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                Previous
              </button>
              <button className="px-3 py-1 bg-purple-600 text-white rounded">
                {currentPage}
              </button>
              <button
                onClick={handleNextPage}
                disabled={clients.length < 10}
                className={`px-2 py-1 rounded ${
                  clients.length < 10
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
