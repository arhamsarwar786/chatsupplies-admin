"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { SidebarTrigger } from "@/src/components/ui/sidebar"
import { Button } from "@/src/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/src/components/ui/tooltip";
import { Avatar, AvatarFallback } from "@/src/components/ui/avatar"
import { Bell, Plus, User, LogOut, Settings, CircleUserRound } from "lucide-react"

type DashboardHeaderProps = {
  title?: string
  description?: string
  buttonText?: string
  onButtonClick?: () => void
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  title = "",
  description = "",
  buttonText = "",
  onButtonClick,
}) => {
  const [role, setRole] = useState("")
  const [username, setUsername] = useState("")
  const router = useRouter()

  useEffect(() => {
    // const role = localStorage.getItem("role") || "hhh"
    const name = localStorage.getItem("username") || "hhh"
    console.log("Fetched username:", name)
    // console.log("Fetched email:", role)
    // setRole(role)
    setUsername(name)
  }, [])

  const handleLogout = () => {
    localStorage.clear()
    router.push("/")
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <header className="flex items-center  justify-between border-b bg-gray-100  px-6 py-4 shadow-sm">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="-ml-1" />
        <div>
          <h1 className="text-2xl font-bold text-black">{title}</h1>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {buttonText && (
          <Button
            onClick={onButtonClick}
            className="flex gap-2  text-white bg-primary hover:bg-primary/80"
          >
             {buttonText}
          </Button>
        )}

        {/* Notification Icon (Optional) */}
        <Button variant="ghost" className="relative p-2 ">
          <Bell className="w-5 h-5 text-muted-foreground" />
          <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-primary hover:bg-primary/80"></span>
        </Button>

        {/* Avatar Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger>
     
  <Tooltip>
  <TooltipTrigger asChild>
    <button className=" rounded-full">
      <CircleUserRound size={30} className="text-muted-foreground" />
    </button>
  </TooltipTrigger>
  <TooltipContent>
    <p>Profile</p>
  </TooltipContent>
</Tooltip>


          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-semibold">{username}</p>
                <p className="text-xs text-muted-foreground">{role}</p>
              </div>
            </DropdownMenuLabel>
{/* 
            <DropdownMenuSeparator />

            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>

            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem> */}

            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4 text-red-500" />
              <span className="text-red-500">Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
