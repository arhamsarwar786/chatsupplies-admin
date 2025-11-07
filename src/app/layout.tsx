// app/layout.tsx

import "./globals.css";
import type { Metadata } from "next";
import { Ubuntu } from "next/font/google";
import RootLayoutClient from "./layout.client";

const ubuntu = Ubuntu({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-ubuntu",
  weight: ["300", "400", "500", "700"],
});

// Server-only metadata export (allowed)
export const metadata: Metadata = {
  title: "Chat Supplies",
  description: "Chatbot management platform",
  icons: {
    icon: [
      // 💡 Added 'shortcut icon' for better Safari compatibility (Fix for tab image)
      { url: "/Logo/Group.png", rel: "shortcut icon", type: "image/png" },
      // Existing definitions
      { url: "/Logo/Group.png", type: "image/png" },
      { url: "/Logo/Group.png", type: "image/png", sizes: "32x32" },
      { url: "/Logo/Group.png", type: "image/png", sizes: "16x16" },
    ],
    apple: "/Logo/Group.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={ubuntu.className}>
      <body className="w-screen min-h-screen">
        <RootLayoutClient>{children}</RootLayoutClient>
      </body>
    </html>
  );
}