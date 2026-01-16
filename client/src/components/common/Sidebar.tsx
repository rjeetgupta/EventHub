"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const navItems = [
  { label: "Dashboard", href: "/dashboard", role: ["ADMIN", "DEPT", "STUDENT"] },
  { label: "Departments", href: "/dashboard/admin/departments", role: ["ADMIN"] },
  { label: "Events", href: "/dashboard/admin/events", role: ["ADMIN"] },
  { label: "My Events", href: "/dashboard/student/my-events", role: ["STUDENT"] },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 border-r border-sidebar-border bg-sidebar">
      <div className="flex h-full flex-col">
        <div className="p-6 text-lg font-semibold tracking-wide">
          EventSphere
        </div>

        <nav className="flex-1 space-y-1 px-3">
          {navItems.map((item) => {
            const active = pathname.startsWith(item.href)

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center rounded-lg px-3 py-2 text-sm transition-all",
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/60"
                )}
              >
                <span className="transition-transform group-hover:translate-x-1">
                  {item.label}
                </span>
              </Link>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}
