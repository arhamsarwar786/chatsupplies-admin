"use client"

import { Home, Shield, Bot, ChartNoAxesCombined, User, Settings } from "lucide-react"
import { usePathname } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/src/components/ui/sidebar"

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Chatbot Management",
    url: "/dashboard/chatbot-management",
    icon: Bot,
  },
  {
    title: "Analytics",
    url: "/dashboard/analytics",
    icon: ChartNoAxesCombined,
  },
  {
    title: "Client Management",
    url: "/dashboard/client-management",
    icon: User,
  },
  {
    title: "Settings",
    url: "/dashboard/settings",
    icon: Settings,
  }
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2 px-4 py-2">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-[#5046E5] text-sidebar-primary-foreground">
            <Bot className="size-4" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate text-xl font-bold">ChatBot Admin</span>
            <span className="truncate text-xs">Management Panel</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive = pathname === item.url || 
                                 (item.url !== "/dashboard" && pathname.startsWith(item.url))
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild
                      className={`hover:bg-[#5146e5b5] hover:text-white ${
                        isActive ? 'bg-[#5046E5] text-white' : 'text-muted-foreground'
                      }`}
                    >
                      <a href={item.url}>
                        <item.icon className="size-4" />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <div className="p-4 text-xs text-muted-foreground">© 2024 Admin Dashboard</div>
      </SidebarFooter>
    </Sidebar>
  )
}