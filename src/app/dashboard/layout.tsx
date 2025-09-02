// @ts-nocheck
"use client";
import React from "react";
import { SidebarProvider } from "@/src/components/ui/sidebar";
import { AppSidebar } from "@/src/components/layout/Sidebar";
import { DashboardHeader } from "@/src/components/layout/dashboard-header";
import TermsModal from "@/src/components/term-model";
import { useSelector } from "react-redux"; // or your auth context

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const role = useSelector((state: RootState) => state.authSlice.role);
  const [showTerms, setShowTerms] = React.useState(false);

  React.useEffect(() => {
    if (role === "client" && !localStorage.getItem("termsAccepted")) {
      setShowTerms(true);
    }
  }, [role]);

  const handleAcceptTerms = () => {
    localStorage.setItem("termsAccepted", "true");
    setShowTerms(false);
  };

  if (showTerms) {
    return <TermsModal open={showTerms} onAccept={handleAcceptTerms} />;
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1 flex flex-col min-h-screen ">
        <div>{children}</div>
      </main>
    </SidebarProvider>
  );
}
