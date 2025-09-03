"use client"
import React, { useState } from "react";
import { Upload } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/src/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/src/components/ui/tooltip";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { useUploadRequirementMutation } from "@/src/hooks/useTraining";
import { toast } from "sonner";

// Define the maximum file size (10MB)
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes

const UploadPDF = ({ chatbotId, status }: { chatbotId: number; status: string }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploadRequirement, { isLoading }] = useUploadRequirementMutation();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);

      // Only allow PDFs under 10MB
      const validFiles = newFiles.filter(
        (file) => file.type === "application/pdf" && file.size <= MAX_FILE_SIZE
      );
      const oversizedFiles = newFiles.filter(
        (file) => file.type === "application/pdf" && file.size > MAX_FILE_SIZE
      );

      // Show error for each oversized PDF
      oversizedFiles.forEach((file) => {
        toast.error(`'${file.name}' exceeds the 10MB PDF limit.`);
      });

      // If no valid files, reset input and exit
      if (validFiles.length === 0) {
        e.target.value = "";
        return;
      }

      // Merge new valid files with existing, ensuring no duplicates
      const updatedFiles = [...files, ...validFiles].filter(
        (file, index, self) => index === self.findIndex((f) => f.name === file.name)
      );

      setFiles(updatedFiles);

      // Clear input so the same file can be re-selected later
      e.target.value = "";
    }
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });
    formData.append("chatbot_id", String(chatbotId));

    try {
      await uploadRequirement(formData).unwrap();
      toast.success("Files uploaded successfully!");
      setFiles([]);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to upload files.");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Upload className="h-4 w-4 text-green-600 cursor-pointer" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Requirement Files</DialogTitle>
          <DialogDescription>
            Select one or more PDF files. You can select multiple times.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <label
            htmlFor="fileInput"
            className="block cursor-pointer rounded-lg border-2 border-dashed border-gray-300 p-4 text-center text-sm text-gray-500 hover:bg-gray-50"
          >
            {files.length > 0
              ? `Selected ${files.length} file(s)`
              : "Click or drag PDF files here to upload."}
            <Input
              id="fileInput"
              type="file"
              accept="application/pdf"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
          </label>

          {files.length > 0 && (
            <ul className="max-h-40 overflow-y-auto rounded border p-2 text-sm text-muted-foreground">
              {files.map((file) => (
                <li key={file.name} className="truncate">
                  {file.name}
                </li>
              ))}
            </ul>
          )}

          <Button
            onClick={handleUpload}
            disabled={files.length === 0 || isLoading}
            className="w-full"
          >
            {isLoading ? "Uploading..." : `Upload ${files.length} File(s)`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UploadPDF;
