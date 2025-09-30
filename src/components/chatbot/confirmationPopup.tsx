// ConfirmLeaveModal.tsx
"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";

interface ConfirmationPopupProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmationPopup({ open, onConfirm, onCancel }: ConfirmationPopupProps) {
  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Unsaved changes</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-gray-600">
          You have unsaved changes. Are you sure you want to leave this page?
        </p>
        <DialogFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button variant="destructive" onClick={onConfirm} className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
          >Leave</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}