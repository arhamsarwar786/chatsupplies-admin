import type { Metadata } from "next";
import { Ubuntu } from "next/font/google";
import { Bot } from "lucide-react";
import Provider from "./Provider";
import { Toaster } from "sonner";
import "./globals.css";
import Image from "next/image";

const ubuntu = Ubuntu({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-ubuntu",
  weight: ["300", "400", "500", "700"], // Available Ubuntu weights
});

export const metadata: Metadata = {
  
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
 <head>
  <title>Chat Supplies</title>
  <meta name="theme-color" content="#5046E5" />
  <link rel="icon" href="/Frame.svg" type="image/svg+xml" />
</head>
      <body className={`${ubuntu.className} w-screen min-h-screen`}>
        <Provider>
          <Toaster />
          {children}
        </Provider>
      </body>
    </html>
  );
}
