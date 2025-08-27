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

const UploadPDF = ({ chatbotId, status }: { chatbotId: number , status: string }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploadRequirement, { isLoading }] = useUploadRequirementMutation();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      const updatedFiles = [...files, ...newFiles].filter(
        (file, index, self) =>
          index === self.findIndex((f) => f.name === file.name)
      );
      setFiles(updatedFiles);
    }
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);  // Match the cURL: append as 'files'
    });
    formData.append("chatbot_id", String(chatbotId));  // Match the cURL

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
