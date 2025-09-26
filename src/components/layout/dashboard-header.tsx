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
} from "@/src/components/ui/tooltip"
import { Dialog, DialogContent } from "@/src/components/ui/dialog"
import ProfileCard from "./profileCard"
import { Bell, LogOut, CircleUserRound, User } from "lucide-react"

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
  const [showProfile, setShowProfile] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const storedRole = localStorage.getItem("role") || "hhh"
    const name = localStorage.getItem("username") || "hhh"
    setRole(storedRole)
    setUsername(name)
  }, [])

  const handleLogout = () => {
    localStorage.clear()
    router.push("/")
  }

  return (
    <header className="flex items-center justify-between border-b bg-gray-100 px-6 py-4 shadow-sm">
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
            className="flex gap-2 text-white bg-primary hover:bg-primary/80"
          >
            {buttonText}
          </Button>
        )}


        {/* Avatar Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="rounded-full">
                    <CircleUserRound size={30} className="text-muted-foreground" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Profile</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-semibold">{username}</p>
                <p className="text-xs text-muted-foreground">{role}</p>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            {/* Show Profile Card */}
            <DropdownMenuItem onClick={() => setShowProfile(true)}>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            {/* Logout */}
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4 text-red-500" />
              <span className="text-red-500">Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Profile Modal */}
      <Dialog open={showProfile} onOpenChange={setShowProfile}>
        <DialogContent className="bg-transparent border-none shadow-none flex justify-center">
          <ProfileCard
            email={role}
            name={username}
            onClose={() => setShowProfile(false)}
          />
        </DialogContent>
      </Dialog>
    </header>
  )
}
