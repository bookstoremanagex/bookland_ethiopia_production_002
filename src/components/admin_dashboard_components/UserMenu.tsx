"use client"

import React from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { User, Settings, LogOut, ChevronDown, Loader2 } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog"

import { logoutAction } from "@/app/actions/auth-actions"

interface UserMenuProps {
  name?: string | null
  role?: string | null
  basePath?: string
}

export default function UserMenu({ name, role, basePath = "/admin_dashboard" }: UserMenuProps) {
  const router = useRouter()
  const [loggingOut, setLoggingOut] = React.useState(false)
  const [alertOpen, setAlertOpen] = React.useState(false)
  const [dropdownOpen, setDropdownOpen] = React.useState(false)

  const handleLogout = async () => {
    setLoggingOut(true)
    await logoutAction()
    setAlertOpen(false)
    router.push("/")
    router.refresh()
  }

  if (!name && !role) return null

  return (
    <>
      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2 h-9 px-3 rounded-xl border border-primarycolor/10 bg-white hover:bg-primarycolor/5 transition-all cursor-pointer outline-none">
            <div className="size-7 rounded-lg bg-primarycolor/10 flex items-center justify-center text-primarycolor">
              <User className="size-3.5" />
            </div>
            <span className="text-[11px] font-black uppercase tracking-wider text-secondarycolor hidden sm:block">
              {role || "User"}
            </span>
            <ChevronDown className="size-3 text-muted-foreground" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col gap-1">
              <p className="text-sm font-bold text-foreground truncate">{name || "User"}</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{role || ""}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuItem asChild>
            <Link href={`${basePath}/profile`} className="cursor-pointer">
              <User className="size-4" />
              Profile
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link href={`${basePath}/settings/theme`} className="cursor-pointer">
              <Settings className="size-4" />
              Settings
            </Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            className="text-rose-600 data-highlighted:text-rose-600 data-highlighted:bg-rose-50 cursor-pointer"
            onSelect={(e) => {
              e.preventDefault()
              setDropdownOpen(false)
              setTimeout(() => setAlertOpen(true), 100)
            }}
          >
            <LogOut className="size-4" />
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sign Out</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to sign out? You will need to log in again to access the dashboard.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <button className="h-9 px-4 rounded-lg border border-border bg-background hover:bg-muted text-sm font-medium transition-all cursor-pointer">
                Cancel
              </button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="h-9 px-4 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-sm font-medium transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {loggingOut && <Loader2 className="size-3.5 animate-spin" />}
                {loggingOut ? "Signing out..." : "Sign Out"}
              </button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
