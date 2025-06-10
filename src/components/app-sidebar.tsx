"use client"

import { Home, Inbox, Settings, Users, ShoppingCart, BarChart3, FileText, Shield } from "lucide-react"

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
//   {
//     title: "Users",
//     url: "/dashboard/users",
//     icon: Users,
//   },
//   {
//     title: "Orders",
//     url: "/dashboard/orders",
//     icon: ShoppingCart,
//   },
//   {
//     title: "Analytics",
//     url: "/dashboard/analytics",
//     icon: BarChart3,
//   },
//   {
//     title: "Reports",
//     url: "/dashboard/reports",
//     icon: FileText,
//   },
//   {
//     title: "Messages",
//     url: "/dashboard/messages",
//     icon: Inbox,
//   },
]

// const settingsItems = [
//   {
//     title: "Settings",
//     url: "/dashboard/settings",
//     icon: Settings,
//   },
//   {
//     title: "Security",
//     url: "/dashboard/security",
//     icon: Shield,
//   },
// ]

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2 px-4 py-2">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <Shield className="size-4" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">Admin Panel</span>
            <span className="truncate text-xs">Management System</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* <SidebarGroup>
          <SidebarGroupLabel>System</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup> */}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <div className="p-4 text-xs text-muted-foreground">© 2024 Admin Dashboard</div>
      </SidebarFooter>
    </Sidebar>
  )
}
