// @ts-nocheck
"use client"

import { useState, useEffect } from "react"
import { Home, Bot, User, Settings, ChevronDown, ChevronUp, Book, MessageCircleReply } from "lucide-react"
import { usePathname } from "next/navigation"
import { useSelector } from "react-redux"
import { RootState } from "@/src/store/store"
import Link from "next/link"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/src/components/ui/sidebar"

export function AppSidebar() {
  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({})
  const pathname = usePathname()
  const [activeUrl, setActiveUrl] = useState<string | null>(null)
  const role = useSelector((state: RootState) => state.authSlice.role)

  useEffect(() => {
    setActiveUrl(pathname)
  }, [pathname])

  const toggleMenu = (title: string) => {
    setOpenMenus((prev) => ({ ...prev, [title]: !prev[title] }))
  }

  const isActive = (url: string) =>
    pathname === url || (url !== "/dashboard" && pathname.startsWith(url))

  const baseItems = [
    { title: "Dashboard", url: "/dashboard", icon: Home },
    {
      title: "Chatbot Management",
      url: "/dashboard/chatbot-management",
      icon: Bot,
      subItems: [
        {
          title: "Chat History",
          url: "/dashboard/chatbot-management/chat-history",
          icon: Home,
        },
      ],
    },
    {
      title: "Docs",
      url: "",
      icon: Book,
      subItems: [
        {
          title: "Script",
          url: "/dashboard/docs/script",
          icon: Home,
        },
      ],
    },
    { title: "Settings", url: "/dashboard/settings", icon: Settings },
    { title: "Feedback", url: "/dashboard/feedback", icon: MessageCircleReply },
  ]

  const clientManagementItem =
    role === "super_admin"
      ? [
          {
            title: "Client Management",
            url: "/dashboard/client-management",
            icon: User,
          },
        ]
      : []

  const items = [...baseItems, ...clientManagementItem]

  return (
    <Sidebar className="bg-[#F9FAFB] text-sm text-muted-foreground shadow-md">
      <SidebarHeader className="border-b border-gray-200">
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#5046E5] text-white">
            <Bot className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-semibold text-gray-800">   Chat Supplies</span>
            <span className="text-xs text-gray-500">Management Panel</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="px-2 py-3 space-y-1">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {item.subItems ? (
                    <>
                      <div className="flex items-center justify-between w-full">
                        <Link
                          href={item.url}
                          className={`flex items-center gap-2 px-3 py-2 hover:bg-primary-light flex-1 ${
                            activeUrl === item.url ? "text-primary" : ""
                          }`}
                        >
                          <item.icon size={18} />
                          <span>{item.title}</span>
                        </Link>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleMenu(item.title)
                          }}
                          className="p-2 hover:bg-primary-light"
                        >
                          {openMenus[item.title] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                      </div>

                      {openMenus[item.title] && (
                        <div className="ml-8 flex flex-col">
                          {item.subItems.map((subItem) => (
                            <Link
                              key={subItem.title}
                              href={subItem.url}
                              className={`flex items-center gap-2 px-3 py-2 hover:bg-gray-200 rounded-md ${
                                activeUrl === subItem.url ? "text-primary" : ""
                              }`}
                            >
                              <subItem.icon size={16} />
                              <span>{subItem.title}</span>
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <SidebarMenuButton asChild className="hover:bg-primary-light">
                      <Link
                        href={item.url}
                        className={`flex items-center gap-2 px-3 py-2 ${
                          activeUrl === item.url ? "text-primary" : ""
                        }`}
                      >
                        <item.icon size={18} />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-gray-200">
        <div className="p-4 text-xs text-gray-400">© 2024 Admin Dashboard</div>
      </SidebarFooter>
    </Sidebar>
  )
}
