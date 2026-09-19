"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { dashboardNavigation, type DashboardRole } from "@/constant/navigation";

const rolePromo: Record<DashboardRole, string> = {
  student: "Learn\nParticipate\nGrow",
  group: "Build Skills\nCreate Opportunities",
  department: "Empowering\nInnovative Minds",
  admin: "Events Build\nBetter Communities",
};

export function Sidebar({
  role = "admin",
  context = "EventHub",
  type = "Dashboard",
  open = false,
}: {
  role?: DashboardRole;
  context?: string;
  type?: string;
  open?: boolean;
}) {
  const pathname = usePathname();
  const navItems = dashboardNavigation[role];
  const firstSegment = pathname.split("/").filter(Boolean)[0] ?? "";
  const isRootHref = (href: string) =>
    href === `/${firstSegment}` || !href.startsWith(`/${firstSegment}/`);

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 top-[78px] z-40 w-64 shrink-0 overflow-y-auto border-r border-sidebar-border bg-sidebar",
        "lg:static lg:inset-auto lg:top-auto lg:z-auto lg:w-60 lg:overflow-visible lg:shadow-none",
        open ? "block shadow-xl shadow-black/30" : "hidden lg:block",
      )}
    >
      <div className="flex h-full flex-col p-2.5">
        <div className="flex items-center gap-2.5 border-b border-sidebar-border px-1.5 pb-3.5">
          <span className="text-[13px] font-semibold">{context}</span>
          <span className="text-xs text-sidebar-foreground/60">{type}</span>
        </div>

        <nav className="mt-3.5 flex flex-1 flex-col gap-1">
          {navItems.map(({ label, href, icon: Icon }) => {
            const active = isRootHref(href)
              ? pathname === href
              : pathname === href || pathname.startsWith(`${href}/`);

            return (
              <Link
                key={href}
                href={href}
                onClick={() => window.dispatchEvent(new Event("dashboard-nav"))}
                className={cn(
                  "group relative flex items-center gap-3.5 rounded-lg px-3.5 py-2.5 text-sm transition-colors",
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
                )}
              >
                {active && (
                  <i className="absolute -left-2.5 top-1 bottom-1 w-1 rounded-r bg-primary" />
                )}
                <Icon className="size-4 shrink-0" />
                <span className="transition-transform group-hover:translate-x-0.5">
                  {label}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto rounded-lg border border-sidebar-border bg-card p-4">
          <strong className="whitespace-pre-line text-primary">
            {rolePromo[role]}
          </strong>
        </div>

        <div className="flex items-center justify-between px-2 pb-1.5 pt-2.5 text-xs text-sidebar-foreground/60">
          <span className="flex items-center gap-2">
            <LogOut className="size-4" /> EventHub v1.0.0
          </span>
          <ChevronRight className="size-4" />
        </div>
      </div>
    </aside>
  );
}
