"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Bell, CircleUser, Menu } from "lucide-react"
import { NAVIGATION } from "@/lib/Navigation"
import { Role } from "@/lib/types/common.types"
import { Button } from "@/components/ui/button"
import ThemeToggler from "@/components/common/ThemeToggle"
import { useAppSelector } from "@/store/hook"
import UserDropdown from "../UserDropdown"

interface Props {
  user?: {
    role: Role
    name: string
  }
}

export default function Navbar() {
  const pathname = usePathname()

  const {isAuthenticated, user} = useAppSelector((state) => state.auth)

  const visibleNavigation = NAVIGATION.filter(item => {
    if (!item.roles) return true;
    if (!user) return false
    // Logged-in user
    return item.roles.includes(user?.role)
  })

  return (
    <header className="sticky top-0 z-50 border-b bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        {/* Logo */}
        <Link
          href="/"
          className="text-lg font-semibold tracking-wide"
        >
          EventHub
        </Link>

        {/* Navigation */}
        <nav className="hidden items-center gap-6 md:flex">
          {visibleNavigation.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={
                pathname.startsWith(item.href)
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <ThemeToggler />

          {user && (
            <button className="relative rounded-full p-2 hover:bg-accent">
              <Bell className="h-5 w-5" />
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-destructive" />
            </button>
          )}

          {!user ? (
            <>
              <Link href="/login">
                <Button size="sm" className="hover:cursor-pointer">
                  Login
                </Button>
              </Link>
              {/* <Link href="/register">
                <Button size="sm">Register</Button>
              </Link> */}
            </>
          ) : (
              <div >
                <UserDropdown />
            </div>
          )}

          <button className="md:hidden">
            <Menu />
          </button>
        </div>
      </div>
    </header>
  )
}
