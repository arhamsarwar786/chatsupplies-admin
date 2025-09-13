"use client";

import type { Metadata } from "next";
import { Ubuntu } from "next/font/google";
import Provider from "./Provider";
import { Toaster } from "sonner";
import "./globals.css";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";

const ubuntu = Ubuntu({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-ubuntu",
  weight: ["300", "400", "500", "700"],
});

// If you want static metadata, you must export it 
// from a separate server component (like layout.server.tsx) or use head.tsx
// export const metadata: Metadata = {
//   title: "Chat Supplies",
//   description: "Chatbot management platform",
// };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <html lang="en" className={ubuntu.className}>
      <head>
        <title>Chat Supplies</title>
        <meta name="theme-color" content="#5046E5" />
        <link rel="icon" href="/Frame.svg" type="image/svg+xml" />
      </head>
      <body className="w-screen min-h-screen">
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
      </body>
    </html>
  );
}
