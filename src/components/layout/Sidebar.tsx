"use client";
import React, { useState, useEffect } from "react";
import {
  Home,
  Box,
  SquareRoundCorner,
  ChartColumnDecreasing,
  Star,
  Layers,
  PlusCircle,
  ChevronDown,
  ChevronUp,
  Package,
} from "lucide-react";
import {
  Sidebar as UiSidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/src/components/ui/sidebar";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from 'next/navigation';

// Sidebar items array with collapsible support
const items = [
  { title: "Home", url: "/seller", icon: Home },
  {
    title: "Product Management",
    url: "/seller/product-management", // Add URL for the main page
    icon: Box,
    subItems: [{ title: "Products", url: "/seller/product-management/products", icon: Package },
      { title: "Add Product", url: "/seller/product-management/add-product", icon: PlusCircle }
    ],
  },
  { title: "Orders", url: "/seller/orders", icon: SquareRoundCorner },
  { title: "Reviews", url: "/seller/reviews", icon: Star },
  { title: "Analytics & Reports", url: "/seller/analytics-&-reports", icon: ChartColumnDecreasing },
  // { title: "Stock Management", url: "/seller/stock-management", icon: Layers },
];

const SellerSidebar = () => {
  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({});
  const pathname = usePathname();
  const [activeUrl, setActiveUrl] = useState<string | null>(null);

  useEffect(() => {
    setActiveUrl(pathname);
  }, [pathname]);

  // Toggle collapsible menu items
  const toggleMenu = (title: string) => {
    setOpenMenus((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  return (
    <UiSidebar className="md:w-65">
      <SidebarContent>
        <SidebarGroup>
          {/* Logo */}
          <SidebarGroupLabel className="w-full flex justify-center pt-8 pb-6">
            <div className="max-w-52 xl:w-64 2xl:w-72">
              <Link href="/seller">
                <Image src="/logo.svg" alt="Umazing-official" width={100} height={40} className="w-[98px]" />
              </Link>
            </div>
          </SidebarGroupLabel>

          {/* Menu Items */}
          <SidebarGroupContent className="pt-5">
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {/* Check if item has subItems (Collapsible Menu) */}
                  {item.subItems ? (
                    <>
                      <div className="flex items-center justify-between w-full">
                        {/* Link to the main page */}
                        <Link
                          href={item.url}
                          className={`flex items-center gap-2 px-3 py-2 hover:bg-primary-light flex-1 ${
                            activeUrl === item.url ? "text-primary" : ""
                          }`}
                        >
                          <item.icon size={18} />
                          <span>{item.title}</span>
                        </Link>

                        {/* Dropdown toggle button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent event bubbling
                            toggleMenu(item.title);
                          }}
                          className="p-2 hover:bg-primary-light"
                        >
                          {openMenus[item.title] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                      </div>

                      {/* Collapsible Submenu */}
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
    </UiSidebar>
  );
};

export default SellerSidebar;