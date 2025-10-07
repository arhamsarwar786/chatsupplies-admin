"use client";

import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/src/components/ui/button";

interface ConfirmStopPopupProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function ConfirmStopPopup({
  open,
  onClose,
  onConfirm,
}: ConfirmStopPopupProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence mode="wait">
      {open && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none">
          {/* 🔹 Background overlay */}
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm pointer-events-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            onClick={onClose}
          />

          {/* 🔹 Centered popup box */}
          <motion.div
            className="relative bg-white rounded-2xl shadow-2xl w-[90%] max-w-sm text-center p-6 z-50 pointer-events-auto"
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{
              duration: 0.25,
              ease: "easeInOut",
            }}
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              Stop Crawling?
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to stop the crawling process?
            </p>
            <div className="flex justify-center gap-3">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
              >
                Stop
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
