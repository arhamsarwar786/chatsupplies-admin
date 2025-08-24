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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/src/components/ui/tooltip";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Checkbox } from "@/src/components/ui/checkbox";
import { useUploadUrlMutation } from "@/src/hooks/useTraining";
import { toast } from "sonner";

const UploadURL = ({ chatbotId,  status }: { chatbotId: number , status: string }) => {
  const [url, setUrl] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [crawlingStarted, setCrawlingStarted] = useState(false);

  const [uploadUrl, { isLoading }] = useUploadUrlMutation();

  const handleUpload = async () => {
    if (!url || !agreed) return;

    try {
      await uploadUrl({
        chatbot_id: chatbotId,
        url: url,
      }).unwrap();

      toast.success("Crawling started successfully!");
      setUrl("");
      setAgreed(false);
      setCrawlingStarted(true);

      // Auto-reset the Loader after 30 seconds
      setTimeout(() => {
        setCrawlingStarted(false);
      }, 30000);

    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to start crawling.");
      // console.error("Upload URL error:", err);
    }
  };

  return (
    <Dialog>
     {(status == "ready" || status == "just_created" || status == "knowledge_base_ready" ) ? (
  <DialogTrigger asChild>
      <Tooltip>
                                <TooltipTrigger>
                                 <button
      type="button"
      className="p-1 rounded hover:bg-muted transition"
    >
      <Play className="h-4 w-4 text-green-600" />
    </button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Upload URL</p>
                                </TooltipContent>
                              </Tooltip>
 
  </DialogTrigger>
) : (
  <button
    type="button"
    disabled
    className="p-1 rounded cursor-not-allowed"
  >
    <Loader className="h-4 w-4 animate-spin" />
  </button>
) }

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Start Website Crawling</DialogTitle>
          <DialogDescription>
            Enter the website URL and agree to start crawling.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            type="url"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />

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

          <Button
            onClick={handleUpload}
            disabled={!agreed || !url || isLoading}
            className="w-full"
          >
            {isLoading ? "Starting..." : "Start Crawling"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UploadURL;
