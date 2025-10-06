// DashboardLayout.tsx
"use client";

import { useState, useEffect } from "react";
import { DashboardHeader } from "./dashboard-header";
import { AppSidebar } from "./Sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  buttonText?: string;
  onButtonClick?: () => void;
}

// ✅ Add interfaces for imported components
interface SidebarProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

interface HeaderProps {
  title: string;
  description: string;
  buttonText?: string;
  onButtonClick?: () => void;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

// Type cast components to include props
const TypedAppSidebar = AppSidebar as React.FC<SidebarProps>;
const TypedDashboardHeader = DashboardHeader as React.FC<HeaderProps>;

export default function DashboardLayout({
  children,
  title = "",
  description = "",
  buttonText = "",
  onButtonClick,
}: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Close sidebar when resizing to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <TypedAppSidebar
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <TypedDashboardHeader
          title={title}
          description={description}
          buttonText={buttonText}
          onButtonClick={onButtonClick}
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
        />

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
