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
import { Avatar, AvatarFallback } from "@/src/components/ui/avatar"
import { Bell, Plus, User, LogOut, Settings } from "lucide-react"

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
  const [userEmail, setUserEmail] = useState("")
  const [userName, setUserName] = useState("")
  const router = useRouter()

  useEffect(() => {
    const email = localStorage.getItem("userEmail") || ""
    const name = localStorage.getItem("userName") || email.split("@")[0]
    setUserEmail(email)
    setUserName(name)
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
    <header className="flex shrink-0 items-center gap-2 border-b px-4 py-4 bg-white">
      <SidebarTrigger className="-ml-1" />

      <div className="flex flex-1 items-center justify-between">
        <div className="flex flex-col items-start">
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="text-md text-muted-foreground">{description}</p>
        </div>

        <div className="flex items-center gap-2">
          {buttonText && (
            <Button onClick={onButtonClick} className="flex gap-2">
              <Plus className="w-4 h-4" /> {buttonText}
            </Button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar>
                  <AvatarFallback>
                    <User className="h-10 w-10 text-gray-700" />
                    {getInitials(userName)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{userName}</p>
                  <p className="text-xs leading-none text-muted-foreground">{userEmail}</p>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>

              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
