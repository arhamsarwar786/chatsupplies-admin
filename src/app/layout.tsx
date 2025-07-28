import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { Bot } from "lucide-react";
import Provider from "./Provider";
import { Toaster } from "sonner";
import "./globals.css";



const roboto = Roboto({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto",
  weight: ["100", "300", "400", "500", "700", "900"], // available Roboto weights
});

export const metadata: Metadata = {
  title: "Chat Supplies",
   
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
    
      </head>
      <body
       className={`${roboto.className} w-screen min-h-screen`}
      >
         <Provider>
          <Toaster />
          {children}
        </Provider>
      </body>
    </html>
  );
}
