import React from 'react'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/src/components/ui/alert-dialog"
import { toast } from "sonner";

import { ClipboardCopy, MoreHorizontal } from "lucide-react";



const CopyScript = ({ chatbotId, status }: { chatbotId: number; status: string }) => {
    const tokenStore = localStorage.getItem("token")
  const token = tokenStore;

  const scriptTag = `<script type="module" src="index.js" id="chatbot" data-admin-id="${chatbotId}" data-token="${token}"></script>`;

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <ClipboardCopy className="h-4 w-4 text-green-900 cursor-pointer" />
      </AlertDialogTrigger>

      <AlertDialogContent className="w-[600px] max-w-[90vw]">
        <div className="flex justify-between items-start">
          <AlertDialogTitle>Copy Script</AlertDialogTitle>
          <AlertDialogCancel asChild>
            <button className="text-gray-500 hover:text-gray-700">
              {/* <X className="h-5 w-5" /> */}
              X
            </button>
          </AlertDialogCancel>
        </div>

        <AlertDialogDescription>
          <pre className="bg-gray-100 max-w-100 p-4 rounded-md overflow-x-auto text-sm font-mono border whitespace-pre-wrap break-words max-h-[300px]">
            <code>{scriptTag}</code>
          </pre>
        </AlertDialogDescription>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              navigator.clipboard.writeText(scriptTag);
              toast.success("Chatbot script copied to clipboard");
            }}
          >
            Copy to Clipboard
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CopyScript