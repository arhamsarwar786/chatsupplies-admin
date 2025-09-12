// @ts-nocheck
"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import { toast } from "sonner";
import { Badge } from "@/src/components/ui/badge";
import { ShieldMinus, Pencil, Pause, Play, MailPlus } from "lucide-react";
import {
  useGetClientsQuery,
  useDeleteClientByIdMutation,
  useResendWelcomeEmailMutation,
} from "@/src/hooks/useClients";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/src/components/ui/tooltip";
import { Button } from "@/src/components/ui/button";

export default function ClientTable() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedClient, setSelectedClient] = useState(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  const {
    data: clients = [],
    isLoading,
    error,
    refetch,
  } = useGetClientsQuery({ page: currentPage });
  const [deleteClientById, { isLoading: isDeleting }] =
    useDeleteClientByIdMutation();
  const [resendWelcomeEmail, { isLoading: isSending }] =
    useResendWelcomeEmailMutation();

  const handleResendEmail = async (clientId: number) => {
    try {
      await resendWelcomeEmail({ id: clientId }).unwrap();
      toast.success("Welcome email has been resent successfully.");
    } catch (error) {
      toast.error("An error occurred while resending the welcome email.");
    }
  };
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (clients.length === 10) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  const handleUpdateStatusClick = (client) => {
    setSelectedClient(client);
    setConfirmDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedClient) {
      try {
        console.log("Attempting to delete client:", selectedClient.id);
        await deleteClientById(selectedClient.id).unwrap();
        setConfirmDialogOpen(false);
        setSelectedClient(null);
        refetch();
      } catch (error) {
        console.error("Error deleting client:", error);
      }
    }
  };
  return (
    <div className="border rounded-xl shadow-sm">
      {isLoading && <div className="p-4">Loading clients...</div>}
      {error && <div className="p-4 text-red-500">Failed to load clients.</div>}
      {!isLoading && !error && (
        <>
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-100 dark:bg-zinc-800">
                <TableHead className="py-4 px-6">Client</TableHead>
                <TableHead className="py-4 px-6">Company</TableHead>
                <TableHead className="py-4 px-6">Status</TableHead>
                <TableHead className="py-4 px-6">Chatbots</TableHead>
                <TableHead className="py-4 px-6">Payment</TableHead>
                <TableHead className="py-4 px-6">Activity</TableHead>
                <TableHead className="py-4 px-6">Add Chatbot</TableHead>
                <TableHead className="text-center py-4 px-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="min-h-[400px]">
              {clients.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-6 text-gray-500"
                  >
                    No clients found.
                  </TableCell>
                </TableRow>
              ) : (
                clients.map((client, index) => {
                  const isDisabled = !client.is_active;

                  return (
                    <TableRow
                      key={index}
                      className={`group transition-all ${isDisabled
                        ? "opacity-50 bg-gray-50"
                        : "hover:bg-gray-50"
                        }`}
                    >
                      <TableCell className="py-3 px-6">
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {client.first_name}
                          </span>
                          <span className="text-xs text-gray-500">
                            {client.email}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="py-3 px-6">
                        <div className="flex flex-col">
                          <span>{client.company}</span>
                          <span className="text-xs text-gray-500">
                            {client.company_name}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="py-3 px-6">
                        <Badge
                          variant="outline"
                          className={`text-xs px-3 py-1 rounded-full ${client.payment_status === "paid"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                            }`}
                        >
                          {client.payment_status}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-3 px-6">
                        <span className="text-sm font-semibold bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                          {client.max_chatbots}
                        </span>
                      </TableCell>
                      <TableCell className="py-3 px-6">
                        <Badge
                          className={`text-xs px-3 py-1 rounded-full ${client.payment_status === "paid"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-red-100 text-red-700"
                            }`}
                        >
                          {client.payment_status === "paid"
                            ? "✓ Verified"
                            : "✗ Unverified"}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-3 px-6">
                        <Badge
                          className={`text-xs px-3 py-1 rounded-full ${client.is_active
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-200 text-gray-500"
                            }`}
                        >
                          {client.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-3 px-6">
                        <Button
                          className={`p-2 ${!client.is_active ? "opacity-50 cursor-not-allowed" : ""}`}
                          onClick={() => {
                            if (client.is_active) {
                              router.push(
                                `/dashboard/chatbot-management/create-chatbot?clientEmail=${encodeURIComponent(
                                  client.email
                                )}`
                              );
                            }
                          }}
                          disabled={!client.is_active}
                        >
                          Add Chatbot
                        </Button>

                      </TableCell>
                      <TableCell className="py-3 px-6">
                        <div className="flex items-center justify-center gap-3">
                          <Tooltip>
                            <TooltipTrigger>
                              <ShieldMinus
                                title="Deactivate"
                                className={`w-4 h-4 transition-transform hover:scale-110 ${!client.is_active
                                  ? "text-gray-400 cursor-not-allowed"
                                  : "text-red-500 cursor-pointer"
                                  }`}
                                onClick={() =>
                                  client.is_active &&
                                  handleUpdateStatusClick(client)
                                }
                              />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Deactivate</p>
                            </TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger>
                              <Pencil
                                title="Edit"
                                className={`w-4 h-4 transition-transform hover:scale-110 ${!client.is_active
                                  ? "text-gray-400 cursor-not-allowed"
                                  : "text-green-600 cursor-pointer"
                                  }`}
                                onClick={() =>
                                  client.is_active &&
                                  router.push(
                                    `/dashboard/client-management/edit-client/${client.id}`
                                  )
                                }
                              />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Edit Client</p>
                            </TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger>
                              <MailPlus
                                title="Resend Welcome Email"
                                onClick={() => client.is_active && handleResendEmail(client.id)}
                                className={`w-4 h-4 transition-transform hover:scale-110 ${client.is_active
                                  ? "text-blue-600 cursor-pointer"
                                  : "text-gray-400 cursor-not-allowed"
                                  } ${isSending ? "opacity-50 cursor-not-allowed" : ""}`}
                              />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Resend Email</p>
                            </TooltipContent>
                          </Tooltip>

                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="p-4 text-sm text-gray-600">
            Showing {clients.length > 0 ? `1 to ${clients.length}` : "0"} of{" "}
            {clients.length} results
            <div className="flex justify-end mt-2 gap-2">
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className={`px-2 py-1 rounded ${currentPage === 1
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-gray-100 text-gray-700 cursor-pointer"
                  }`}
              >
                Previous
              </button>
              <button className="px-3 py-1 bg-purple-600 text-white rounded cursor-pointer">
                {currentPage}
              </button>
              <button
                onClick={handleNextPage}
                disabled={clients.length < 10}
                className={`px-2 py-1 rounded ${clients.length < 10
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-gray-100 text-gray-700 cursor-pointer"
                  }`}
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}

      {/* Confirm Deletion Dialog */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Status</DialogTitle>
          </DialogHeader>
          <p className="text-sm">
            Are you sure to change the status of{" "}
            <strong>
              {selectedClient?.first_name} ({selectedClient?.email})
            </strong>
            ?
          </p>

          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setConfirmDialogOpen(false)}
              disabled={isDeleting}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={isDeleting}
              className="cursor-pointer"
            >
              {isDeleting ? "Deleting..." : "Confirm"}
            </Button>
          </div>

        </DialogContent>
      </Dialog>
    </div>
  );
}
