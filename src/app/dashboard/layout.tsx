import { SidebarProvider } from "@/src/components/ui/sidebar";
import { AppSidebar } from "@/src/components/layout/Sidebar";
import { DashboardHeader } from "@/src/components/layout/dashboard-header";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1 flex flex-col min-h-screen ">
      <div>{children}</div>
      </main>
    </SidebarProvider>
  );
}
