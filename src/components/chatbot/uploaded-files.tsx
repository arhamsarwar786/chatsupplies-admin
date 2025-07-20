// @ts-nocheck
"use client"

import React, { useState, useEffect } from "react"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from "@/src/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/src/components/ui/dialog"
import { Button } from "@/src/components/ui/button"
import {
  MoreHorizontal,
  Trash
} from "lucide-react"
import {
  useGetUploadedFilesQuery,
  useDeleteUploadedFileByIdMutation
} from "@/src/hooks/useTraining"

interface UploadedFiles {
  filename: string
  type: string
  id: number
}

const UploadedFilesDialog = ({
  open,
  setOpen,
  chatbotId
}: {
  open: boolean
  setOpen: (open: boolean) => void
  chatbotId: number
}) => {
  const { data: uploadedFiles, isLoading, refetch } = useGetUploadedFilesQuery(chatbotId)
  const [deleteUploadedFileById, { isLoading: isDeleting }] = useDeleteUploadedFileByIdMutation()

  const [fileToDelete, setFileToDelete] = useState<UploadedFiles | null>(null)
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)

  const handleDeleteClick = (file: UploadedFiles) => {
    setFileToDelete(file)
    setConfirmDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (fileToDelete) {
      await deleteUploadedFileById(fileToDelete.id)
      setFileToDelete(null)
      setConfirmDialogOpen(false)
      refetch() // Refresh the files list
    }
  }

  return (
    <>
      {/* Main Uploaded Files Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-center">
              Uploaded Files
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            {isLoading ? (
              <p className="text-center text-sm">Loading files...</p>
            ) : uploadedFiles && uploadedFiles.length > 0 ? (
              uploadedFiles.map((file: UploadedFiles, index: number) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-md border p-2 text-sm hover:bg-muted transition"
                >
                  <span className="truncate">{file.filename}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteClick(file)}
                    disabled={isDeleting}
                  >
                    <Trash className="text-red-500" />
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center">
                No files uploaded.
              </p>
            )}
          </div>

          <Button onClick={() => setOpen(false)} className="mt-4 w-full">
            Close
          </Button>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm File Deletion</DialogTitle>
          </DialogHeader>
          <p className="text-sm">
            Are you sure you want to delete{" "}
            <strong>{fileToDelete?.filename}</strong>?
          </p>

          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setConfirmDialogOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Confirm"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

const ActionsDropdown = ({ chatbotId }: { chatbotId: number }) => {
  const [uploadedFilesDialogOpen, setUploadedFilesDialogOpen] = useState(false)

  return (
    <>
      <UploadedFilesDialog
        chatbotId={chatbotId}
        open={uploadedFilesDialogOpen}
        setOpen={setUploadedFilesDialogOpen}
      />

      <DropdownMenu>
        <DropdownMenuTrigger>
          <MoreHorizontal className="h-4 w-4 cursor-pointer" />
        </DropdownMenuTrigger>

        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => setUploadedFilesDialogOpen(true)}>
            Uploaded Files
          </DropdownMenuItem>
          <DropdownMenuItem>Edit</DropdownMenuItem>
          <DropdownMenuItem>Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

export default ActionsDropdown
