"use client";

import { Toaster } from "sonner";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import Provider from "./Provider";

export default function RootLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <Provider>
      <Toaster />
      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          initial={{ opacity: 0, scale: 0.97, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: -20 }}
          transition={{
            duration: 0.5,
            ease: [0.25, 0.8, 0.25, 1],
          }}
          className="h-full"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </Provider>
  );
}
