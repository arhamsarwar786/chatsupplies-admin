// @ts-nocheck
"use client"

import { useState, useEffect } from "react"
import { Home, Bot, User, Settings, ChevronDown, ChevronUp, Book, MessageCircleReply, PackagePlus, Package } from "lucide-react"
import { usePathname } from "next/navigation"
import { useSelector } from "react-redux"
import { RootState } from "@/src/store/store"
import Image from "next/image"
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
    // { title: "Feedback", url: "/dashboard/feedback", icon: MessageCircleReply },
    { title: "Subscription Packages", url: "/dashboard/subscription-packages", icon: Package }

  ]

  const clientManagementItem =
    role === "super_admin"
      ? [
          {
            title: "Client Management",
            url: "/dashboard/client-management",
            icon: User,
             subItems: [
        {
          title: "Create Client",
          url: "/dashboard/client-management/create-client",
          icon: Home,
        },
      ],
          },
    { title: "Add Package", url: "/dashboard/add-packages", icon: PackagePlus }

        ]
      : []

  const items = [...baseItems, ...clientManagementItem]

  return (
    <Sidebar className="bg-gradient-to-br from-primary to-secondary text-sm  shadow-md">
      <SidebarHeader className="border-b bg-primary  h-[85px]">
      <div className="flex items-center h-full mx-auto w-full justify-center gap-3 hover:scale-105 transition-transform duration-300">
               <Image
                 src="/Frame.svg"
                 alt="Logo"
                 width={50}
                 height={50}
                 className="rounded-md shadow-sm"
               />
               <h1 className="text-[18px] sm:text-xl flex flex-col font-bold tracking-tight text-gray-900 ">
                 <span className="text-white">
                   Chat Supplies
                 </span>
                  <span className="text-xs font-light text-gray-400">Management Panel</span>
               </h1>
             </div>
      </SidebarHeader>

      <SidebarContent className="bg-gradient-to-b from-primary to-secondary">
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
                          className={`flex items-center gap-2 px-3 py-2 hover:bg-white hover:text-black rounded-md flex-1 ${
                            activeUrl === item.url ? "bg-secondary text-white" : "bg-transparent text-white"
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
                          className="p-2"
                        >
                          {openMenus[item.title] ? <ChevronUp size={16} color="white" /> : <ChevronDown size={16} color="white" />}
                        </button>
                      </div>

                      {openMenus[item.title] && (
                        <div className="ml-8 flex flex-col">
                          {item.subItems.map((subItem) => (
                            <Link
                              key={subItem.title}
                              href={subItem.url}
                              className={`flex items-center gap-2 px-3 py-2 hover:bg-white hover:text-black rounded-md ${
                                activeUrl === subItem.url ? "bg-secondary text-white" : "bg-transparent text-white"
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
                    <SidebarMenuButton asChild className="">
                      <Link
                        href={item.url}
                        className={`flex items-center gap-2 px-3 py-2 ${
                          activeUrl === item.url ? "bg-secondary text-white" : "bg-transparent text-white"
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

      <SidebarFooter className=" bg-secondary">
        <div className="p-4 text-xs text-gray-400">© 2024 Admin Dashboard</div>
      </SidebarFooter>
    </Sidebar>
  )
}
