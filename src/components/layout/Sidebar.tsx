"use client"

import { useState, useEffect } from "react"
import {
  Home, Bot, User, Settings as SettingsIcon, ChevronDown, ChevronUp,
  Book, PackagePlus, Package
} from "lucide-react"
import { usePathname } from "next/navigation"
import { useSelector } from "react-redux"
import { RootState } from "@/src/store/store"
import Image from "next/image"
import Link from "next/link"

export function AppSidebar() {
  const [openMenu, setOpenMenu] = useState<string | null>(null) // Only one open at a time
  const pathname = usePathname()
  const [activeUrl, setActiveUrl] = useState<string | null>(null)
  const role = useSelector((state: RootState) => state.authSlice.role)

  useEffect(() => {
    setActiveUrl(pathname)
  }, [pathname])

  const isActive = (url: string) =>
    pathname === url || (url !== "/dashboard" && pathname.startsWith(url))

  const toggleMenu = (title: string) => {
    setOpenMenu(prev => (prev === title ? null : title)) // Open only one menu
  }

  // const baseItems = [
  //   { title: "Dashboard", url: "/dashboard", icon: Home },
  //   {
  //     title: "Chatbot Management",
  //     url: "/dashboard/chatbot-management",
  //     icon: Bot,
  //     subItems: [
  //       { title: "Chat History", url: "/dashboard/chatbot-management/chat-history", icon: Home },
  //       { title: "Chat Creation", url: "/dashboard/chatbot-management/create-chatbot", icon: Home },
  //     ],
  //   },
  // ]
  //   const baseItems2 = [
  //   {
  //     title: "Docs",
  //     url: "/dashboard/docs",
  //     icon: Book,
  //     subItems: [
  //       { title: "Script", url: "/dashboard/docs/script", icon: Home },
  //     ],
  //   },
  //   // { title: "Settings", url: "/dashboard/settings", icon: SettingsIcon },
  //   { title: "Subscription Packages", url: "/dashboard/subscription-packages", icon: Package },
  // ]

  // const clientManagementItem =
  //   role === "super_admin"
  //     ? [
  //         {
  //           title: "Client Management",
  //           url: "/dashboard/client-management",
  //           icon: User,
  //           subItems: [
  //             { title: "Create Client", url: "/dashboard/client-management/create-client", icon: Home },
  //           ],
  //         },
  //         { title: "Add Package", url: "/dashboard/add-packages", icon: PackagePlus },
  //       ]
  //     : []

  // const items = [...baseItems, ...clientManagementItem, ...baseItems2]
const items = [
  // Base Items
  { title: "Dashboard", url: "/dashboard", icon: Home },
  {
    title: "Chatbot Management",
    url: "/dashboard/chatbot-management",
    icon: Bot,
    subItems: [
      { title: "Chat History", url: "/dashboard/chatbot-management/chat-history", icon: Home },
      { title: "Chat Creation", url: "/dashboard/chatbot-management/create-chatbot", icon: Home },
    ],
  },

  // Conditionally include super_admin-only items
  ...(role === "super_admin"
    ? [
        {
          title: "Client Management",
          url: "/dashboard/client-management",
          icon: User,
          subItems: [
            { title: "Create Client", url: "/dashboard/client-management/create-client", icon: Home },
          ],
        },
        {
          title: "Add Package",
          url: "/dashboard/add-packages",
          icon: PackagePlus,
        },
      ]
    : []),

  // Additional Items
  {
    title: "Docs",
    url: "/dashboard/docs",
    icon: Book,
    subItems: [
      { title: "Script", url: "/dashboard/docs/script", icon: Home },
    ],
  },
  {
    title: "Packages Management",
    url: "/dashboard/subscription-packages",
    icon: Package,
  },

  // Optional: add Settings back if needed
  // { title: "Settings", url: "/dashboard/settings", icon: SettingsIcon },
]

  return (
    <aside className=" left-0 bottom-0 sticky top-0 h-screen relative w-[250px] bg-white border-r shadow-sm flex flex-col justify-between">
      {/* Logo Header */}
      <div className="p-4 h-[85px]  border-b flex items-center gap-3">
        <Image src="/Frame.svg" alt="Logo" width={40} height={40} className="rounded-md" />
        <div className="flex flex-col">
          <span className="font-bold text-primary text-xl">Chat Supplies</span>
          <span className="text-xs text-gray-500">Management Panel</span>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <div className="flex-1 overflow-y-auto">
        <nav className="py-4 space-y-2">
          {items.map((item) => {
            const hasSubItems = item.subItems && item.subItems.length > 0
            const isOpen = openMenu === item.title

            return (
              <div key={item.title} className="px-4">
                <button
                  onClick={() => hasSubItems ? toggleMenu(item.title) : null}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-all ${
                    isActive(item.url)
                      ? "bg-primary text-white"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <item.icon size={18} />
                    <Link href={item.url}>{item.title}</Link>
                  </div>
                  {hasSubItems && (isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />)}
                </button>

                {/* Submenu */}
                {hasSubItems && isOpen && (
                  <div className="ml-6 mt-2 space-y-1">
                    {item.subItems.map((subItem) => (
                      <Link
                        key={subItem.title}
                        href={subItem.url}
                        className={`flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-all ${
                          isActive(subItem.url)
                            ? "bg-white border border-primary  text-primary"
                            : "text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        <subItem.icon size={14} />
                        <span>{subItem.title}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </nav>
      </div>

      {/* Footer */}
      <div className="text-xs text-gray-400 text-center border-t py-3">
        © 2024 Admin Dashboard
      </div>
    </aside>
  )
}
