// restriction.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type RouterFn = (url: string, ...args: any[]) => Promise<any>;

const useExitPrompt = () => {
  const [isDirty, setIsDirty] = useState(false);
  const [pendingPath, setPendingPath] = useState<string | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  const router = useRouter();

  // store original methods (bound) so we can call them later
  const origPushRef = useRef<RouterFn | null>(null);
  const origReplaceRef = useRef<RouterFn | null>(null);

  const markDirty = () => setIsDirty(true);

  // Confirm / Cancel handlers used by your modal
  const confirmLeave = () => {
    if (!pendingPath) {
      setShowPrompt(false);
      return;
    }

    // Restore original router methods before navigating to avoid recursion
    if (origPushRef.current) (router as any).push = origPushRef.current;
    if (origReplaceRef.current) (router as any).replace = origReplaceRef.current;

    // call original push (they were bound to router)
    origPushRef.current?.(pendingPath);

    // clear state
    setPendingPath(null);
    setShowPrompt(false);
    // optionally mark not dirty; keep current behavior (we don't change isDirty)
  };

  const cancelLeave = () => {
    setPendingPath(null);
    setShowPrompt(false);
    // keep isDirty true so further edits still prompt
  };

  // Handle browser refresh / close
  useEffect(() => {
    if (!isDirty) return;

    const handleWindowClose = (e: BeforeUnloadEvent) => {
    };

    window.addEventListener("beforeunload", handleWindowClose);
    return () => window.removeEventListener("beforeunload", handleWindowClose);
  }, [isDirty]);

  // Patch router.push & router.replace while dirty (store originals bound to router)
  useEffect(() => {
    if (!isDirty) return;

    // store originals only once
    if (!origPushRef.current) {
      const originalPush = (router as any).push;
      const originalReplace = (router as any).replace;
      // bind them to router so `this` works if needed
      origPushRef.current = originalPush ? originalPush.bind(router) : null;
      origReplaceRef.current = originalReplace ? originalReplace.bind(router) : null;
    }

    // patch
    (router as any).push = (url: string, ..._args: any[]) => {
      setPendingPath(url);
      setShowPrompt(true);
      return Promise.resolve(false); // prevent immediate navigation
    };

    (router as any).replace = (url: string, ..._args: any[]) => {
      setPendingPath(url);
      setShowPrompt(true);
      return Promise.resolve(false);
    };

    // cleanup: restore originals when component unmounts or when dirty toggles off
    return () => {
      if (origPushRef.current) (router as any).push = origPushRef.current;
      if (origReplaceRef.current) (router as any).replace = origReplaceRef.current;
    };
  }, [isDirty, router]);

  // Intercept ALL <a> clicks in capture phase to catch links (sidebar, header, next/link)
  useEffect(() => {
    if (!isDirty) return;

    const handleClickCapture: EventListener = (event) => {
      // use Event here (capture phase). cast to HTMLElement for closest()
      const ev = event as Event;
      const targetEl = (ev.target as HTMLElement)?.closest?.("a") as HTMLAnchorElement | null;
      if (!targetEl) return;

      const href = targetEl.getAttribute("href");
      if (!href) return;
      // ignore anchors, external links, mailto/tel and full URLs
      if (href.startsWith("#") || href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:")) {
        return;
      }

      // prevent native/default navigation and stop other handlers
      event.preventDefault();
      // stop other listeners (React synthetic handlers run in bubble; this prevents them)
      // stopImmediatePropagation may not always exist on Event, so guard
      try {
        (event as any).stopImmediatePropagation?.();
      } catch (err) {
        /* ignore */
      }

      // show modal and remember target
      setPendingPath(href);
      setShowPrompt(true);
    };

    // capture = true to run before other handlers / React synthetic listeners
    document.addEventListener("click", handleClickCapture, true);
    return () => document.removeEventListener("click", handleClickCapture, true);
  }, [isDirty]);

  return {
    markDirty,
    showPrompt,
    confirmLeave,
    cancelLeave,
  };
};

export default useExitPrompt;
