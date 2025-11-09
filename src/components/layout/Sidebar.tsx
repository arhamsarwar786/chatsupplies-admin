"use client"

import { useState, useEffect } from "react"
import {
  Home, Bot, User, ChevronDown, ChevronUp,
  Book, PackagePlus, Package,
} from "lucide-react"
import { usePathname } from "next/navigation"
import { useSelector } from "react-redux"
import { RootState } from "@/src/store/store"
import Image from "next/image"
import Link from "next/link"

interface AppSidebarProps {
  isSidebarOpen?: boolean
  toggleSidebar?: () => void
}

export function AppSidebar({ isSidebarOpen, toggleSidebar }: AppSidebarProps) {
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("sidebar-collapsed")
      return saved === "true"
    }
    return false
  })

  const pathname = usePathname()
  const role = useSelector((state: RootState) => state.authSlice.role)

  useEffect(() => {
    const handleSidebarToggle = (event: CustomEvent) => {
      setCollapsed(event.detail.collapsed)
    }
    window.addEventListener("sidebar-toggle", handleSidebarToggle as EventListener)
    return () => {
      window.removeEventListener("sidebar-toggle", handleSidebarToggle as EventListener)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("sidebar-collapsed", String(collapsed))
  }, [collapsed])

  // Updated isActive function to check sub-items
  const isActive = (url: string, subItems?: Array<{url: string}>) => {
    // Direct match
    if (pathname === url) return true
    
    // Check if any sub-item is active
    if (subItems) {
      return subItems.some(subItem => 
        pathname === subItem.url || 
        (subItem.url !== "/dashboard" && pathname.startsWith(subItem.url))
      )
    }
    
    // For non-dashboard items, check if path starts with url
    return url !== "/dashboard" && pathname.startsWith(url)
  }

  const toggleMenu = (title: string) => {
    setOpenMenu((prev) => (prev === title ? null : title))
  }

  const items = [
    { title: "Dashboard", url: "/dashboard", icon: Home },
    {
      title: "Chatbot Management",
      url: "#",
      icon: Bot,
      subItems: [
        { title: "Chatbot", url: "/dashboard/chatbot-management/chatbot", icon: Bot },
        { title: "Chat History", url: "/dashboard/chatbot-management/chat-history", icon: Home },
      ],
    },
    ...(role === "super_admin"
      ? [{ title: "Client Management", url: "/dashboard/client-management", icon: User }]
      : []),
   
    {
      title: "Packages Management",
      url: "#", // 👈 prevent navigation
      icon: Package,
      subItems: [
        { title: "Packages", url: "/dashboard/packages", icon: Package },
        ...(role === "super_admin"
          ? [{ title: "Add Package", url: "/dashboard/add-packages", icon: PackagePlus }]
          : []),
      ],
    },
   
    { title: "Terms and Conditions", url: "/dashboard/term-and-condition", icon: Home },
    { title: "Privacy Policy", url: "/dashboard/privacy-policy", icon: Home },
  ]

  return (
    <aside
      className={`left-0 bottom-0 sticky top-0 h-screen relative bg-white border-r shadow-sm flex flex-col justify-between transition-all duration-300 
        ${collapsed ? "w-[70px]" : "w-[320px] md:w-[250px]"}`}
    >
      {/* Header */}
      <div className="p-4 h-[85px] border-b flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image src="/Logo/Group.png" alt="Logo" width={40} height={40} className="rounded-md" />
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-bold text-primary text-xl">Chat Supplies</span>
              <span className="text-xs text-gray-500">Management Panel</span>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar Navigation */}
      <div className="flex-1 overflow-y-auto">
        <nav className={`space-y-2 ${collapsed ? "pt-2" : "py-4"}`}>
          {items.map((item) => {
            const hasSubItems = item.subItems && item.subItems.length > 0
            const isOpen = openMenu === item.title
            const isChatbotManagement = item.title === "Chatbot Management"
            const isPackageManagement = item.title === "Packages Management"
            const itemIsActive = isActive(item.url, item.subItems)

            return (
              <div key={item.title} className="px-2">
                {/* For Chatbot & Package Management: expand/collapse only */}
                {isChatbotManagement || isPackageManagement ? (
                  <button
                    type="button"
                    onClick={() => toggleMenu(item.title)}
                    className={`w-full flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all ${
                      itemIsActive
                        ? "bg-primary text-white"
                        : "hover:bg-gray-100 text-gray-700"
                    } ${collapsed ? "justify-center" : "justify-between"}`}
                  >
                    <div
                      className={`flex items-center gap-2 ${
                        collapsed ? "w-full justify-center" : ""
                      }`}
                    >
                      <item.icon size={18} />
                      {!collapsed && <span>{item.title}</span>}
                    </div>
                    {!collapsed && hasSubItems && (
                      <div className="ml-auto">
                        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </div>
                    )}
                  </button>
                ) : (
                  // All other items behave normally
                  <Link
                    href={item.url}
                    className={`w-full flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all ${
                      itemIsActive
                        ? "bg-primary text-white"
                        : "hover:bg-gray-100 text-gray-700"
                    } ${collapsed ? "justify-center" : "justify-between"}`}
                  >
                    <div
                      className={`flex items-center gap-2 ${
                        collapsed ? "w-full justify-center" : ""
                      }`}
                    >
                      <item.icon size={18} />
                      {!collapsed && <span>{item.title}</span>}
                    </div>
                    {!collapsed && hasSubItems && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault()
                          toggleMenu(item.title)
                        }}
                        className="ml-auto"
                      >
                        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                    )}
                  </Link>
                )}

                {/* Sub-items */}
                {hasSubItems && isOpen && !collapsed && (
                  <div className="ml-6 mt-2 space-y-1">
                    {item.subItems.map((subItem) => (
                      <Link
                        key={subItem.title}
                        href={subItem.url}
                        className={`flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-all ${
                          isActive(subItem.url)
                            ? "bg-white border border-primary text-primary"
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
      <div
        className={`text-xs text-gray-400 text-center border-t py-3 ${
          collapsed ? "hidden" : ""
        }`}
      >
        © 2025 ChatSupplies
      </div>
    </aside>
  )
}