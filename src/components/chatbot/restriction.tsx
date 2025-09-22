"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const useExitPrompt = () => {
  const router = useRouter();
  const [isFormDirty, setIsFormDirty] = useState(false);

  // Mark the form as dirty from outside
  const markDirty = () => setIsFormDirty(true);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!isFormDirty) return;
      e.preventDefault();
      e.returnValue = ""; // Required for Chrome
      return "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isFormDirty]);

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      if (isFormDirty) {
        const confirmLeave = window.confirm("Are you sure you want to exit?");
        if (!confirmLeave) {
          // Prevent navigation by throwing error
          throw "Route change aborted by user";
        }
      }
    };

    // Next.js router.events is not available in App Router; use workaround
    const beforePopState = (e: PopStateEvent) => {
      if (isFormDirty) {
        const confirmLeave = window.confirm("Are you sure you want to exit?");
        if (!confirmLeave) {
          e.preventDefault();
        }
      }
    };

    window.addEventListener("popstate", beforePopState);

    return () => {
      window.removeEventListener("popstate", beforePopState);
    };
  }, [isFormDirty]);

  return { markDirty };
};

export default useExitPrompt;
