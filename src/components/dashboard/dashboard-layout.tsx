"use client"

import type React from "react"

import { SidebarProvider } from "@/src/components/ui/sidebar"
import { AppSidebar } from "@/src/components/app-sidebar"
import { DashboardHeader } from "@/src/components/dashboard/dashboard-header"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1 flex flex-col min-h-screen">
        <DashboardHeader />
        {children}
      </main>
    </SidebarProvider>
  )
}
