"use client";
import React, { useState } from "react";
import { Play, Loader } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Checkbox } from "@/src/components/ui/checkbox";
import {
  useUploadUrlMutation,
  useUploadRequirementMutation,
} from "@/src/hooks/useTraining";
import { toast } from "sonner";

// Define the maximum file size (10MB)
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const UploadUrlWithPDF = ({
  chatbotId,
  status,
  client_email,
}: {
  chatbotId: number;
  status: string;
  client_email: string;
}) => {
  const [url, setUrl] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [crawlingStarted, setCrawlingStarted] = useState(false);
  const [open, setOpen] = useState(false);

  const [files, setFiles] = useState<File[]>([]);

  const [uploadUrl, { isLoading }] = useUploadUrlMutation();
  const [uploadRequirement, { isLoading: isUploadingPDF }] =
    useUploadRequirementMutation();

  // Handle PDF selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);

      const validFiles = newFiles.filter(
        (file) => file.type === "application/pdf" && file.size <= MAX_FILE_SIZE
      );
      const oversizedFiles = newFiles.filter(
        (file) => file.type === "application/pdf" && file.size > MAX_FILE_SIZE
      );

      oversizedFiles.forEach((file) => {
        toast.error(`'${file.name}' exceeds the 10MB PDF limit.`);
      });

      if (validFiles.length === 0) {
        e.target.value = "";
        return;
      }

      const updatedFiles = [...files, ...validFiles].filter(
        (file, index, self) =>
          index === self.findIndex((f) => f.name === file.name)
      );

      setFiles(updatedFiles);
      e.target.value = "";
    }
  };

  // Handle upload (URL required, PDFs optional)
  const handleUpload = async () => {
    if (!url || !agreed) return;

    try {
      // First upload URL (mandatory)
      await uploadUrl({
        chatbot_id: chatbotId,
        url,
        client_email,
      }).unwrap();

      // Then upload PDFs if any
      if (files.length > 0) {
        const formData = new FormData();
        files.forEach((file) => formData.append("files", file));
        formData.append("chatbot_id", String(chatbotId));
        await uploadRequirement(formData).unwrap();
      }

      toast.success("Crawling started successfully!");
      setUrl("");
      setAgreed(false);
      setFiles([]);
      setCrawlingStarted(true);

      setTimeout(() => {
        setCrawlingStarted(false);
      }, 30000);

      setTimeout(() => {
        setOpen(false);
      }, 1500);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to start crawling.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {status === "ready" || status === "just_created" ? (
        <DialogTrigger asChild>
          <button
            type="button"
            className="p-1 rounded hover:bg-muted transition"
            onClick={() => setOpen(true)}
          >
            <Play className="h-4 w-4 text-green-600" />
          </button>
        </DialogTrigger>
      ) : status === "failed" ? (
        <DialogTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className="text-red-500 hover:text-red-600 border-red-500 hover:border-red-600"
            onClick={() => setOpen(true)}
          >
            Recrawl
          </Button>
        </DialogTrigger>
      ) : (
        <button
          type="button"
          disabled
          className="p-1 rounded cursor-not-allowed"
        >
          <Loader className="h-4 w-4 animate-spin" />
        </button>
      )}

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Start Website Crawling & Upload Files</DialogTitle>
          <DialogDescription>
            Enter the website URL (required). You may also upload PDF files
            (optional).
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* URL Input */}
          <Input
            type="url"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />

          {/* PDF Upload Section */}
          <label
            htmlFor="fileInput"
            className="block cursor-pointer rounded-lg border-2 border-dashed border-gray-300 p-4 text-center text-sm text-gray-500 hover:bg-gray-50"
          >
            {files.length > 0
              ? `Selected ${files.length} file(s)`
              : "Click or drag PDF files here to upload (optional)."}
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
            <ul className="max-h-40 overflow-y-auto rounded border p-2 text-sm text-muted-foreground space-y-1">
              {files.map((file, index) => (
                <li
                  key={file.name}
                  className="flex items-center justify-between rounded px-2 py-1 hover:bg-gray-50"
                >
                  <span className="truncate">{file.name}</span>
                  <button
                    type="button"
                    onClick={() =>
                      setFiles(files.filter((_, i) => i !== index))
                    }
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          )}

          {/* Agreement Checkbox */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="agree"
              checked={agreed}
              onCheckedChange={(checked) => setAgreed(Boolean(checked))}
            />
            <label htmlFor="agree" className="text-sm text-gray-600">
              I agree to start crawling of this website
            </label>
          </div>

          {/* Upload Button */}
          <Button
            onClick={handleUpload}
            disabled={!agreed || !url || isLoading || isUploadingPDF}
            className="w-full"
            style={{ cursor: "pointer" }}
          >
            {isLoading || isUploadingPDF
              ? "Starting..."
              : `Start Crawling${files.length > 0 ? " & Upload PDFs" : ""}`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UploadUrlWithPDF;
