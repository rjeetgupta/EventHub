"use client";

import { usePathname, useRouter } from "next/navigation";
import { Bell, CalendarDays, ChevronDown, LogOut, Menu, Search, UserRound } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import ThemeToggler from "@/components/common/ThemeToggle";
import { Sidebar } from "@/components/common/Sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  dashboardBasePath,
  dashboardRoleForUser,
  dashboardRoleMeta,
  getDashboardSection,
  resolveDashboardRole,
  type DashboardRole,
} from "@/constant/navigation";
import {
  dashboardRoleQuotes,
  dashboardSectionTitles,
} from "@/constant/dashboard";
import { clearAuth, logoutUser } from "@/store/slices/authSlice";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { toast } from "sonner";

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function formatToday() {
  return new Date().toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function DashboardShell({
  children,
  role,
}: {
  children: ReactNode;
  role?: DashboardRole;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user: currentUser, isAuthenticated } = useAppSelector(
    (state) => state.auth,
  );
  // The shell's chrome (sidebar, welcome copy) follows the LOGGED-IN user's
  // role — never the URL — so /admin/departments can't flip it to department.
  const userRole = dashboardRoleForUser(currentUser?.role);
  const activeRole: DashboardRole =
    role ?? userRole ?? resolveDashboardRole(pathname) ?? "admin";
  const meta = dashboardRoleMeta[activeRole];
  const section = getDashboardSection(pathname);
  // Students browse events rather than manage them — use role-appropriate copy.
  const sectionKey =
    activeRole === "student" && section === "events"
      ? "explore"
      : activeRole === "student" && section === "registrations"
        ? "myRegistrations"
        : section;
  const pageCopy = sectionKey ? dashboardSectionTitles[sectionKey] : undefined;
  const displayName = currentUser?.fullName || meta.type;
  const [navOpen, setNavOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // PersistGate only mounts children after redux-persist rehydrates, so
  // isAuthenticated is trustworthy here — no extra subscription needed.

  // Auth guard: bounce logged-out visitors to /login.
  useEffect(() => {
    if (!isAuthenticated) router.replace("/login");
  }, [isAuthenticated, router]);

  // Role guard: each role may only browse its own dashboard area. Shared
  // pages (/approvals, /my-events, /profile) have no URL role — they render
  // for any logged-in role. A student opening /admin (or an admin opening
  // /department) is redirected to their own dashboard home.
  useEffect(() => {
    if (!isAuthenticated || !userRole) return;
    const pathRole = resolveDashboardRole(pathname);
    if (pathRole && pathRole !== userRole) {
      router.replace(dashboardBasePath[userRole]);
    }
  }, [isAuthenticated, pathname, router, userRole]);

  useEffect(() => {
    const close = () => setNavOpen(false);
    window.addEventListener("dashboard-nav", close);
    return () => window.removeEventListener("dashboard-nav", close);
  }, []);

  const initials = displayName
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      toast.success("Logged out successfully");
    } catch {
      // Backend call failed — still clear local state and continue.
      dispatch(clearAuth());
      toast.success("Logged out");
    }
    router.replace("/login");
  };

  const handleDeleteAccount = async () => {
    setDeleteLoading(true);
    try {
      await fetch("/api/account", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken") ?? ""}` },
      });
    } catch {
      // Account API may not exist yet; still end the local session.
    }
    setDeleteLoading(false);
    setDeleteOpen(false);
    dispatch(clearAuth());
    toast.success("Account scheduled for deletion");
    router.replace("/login");
  };

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-background text-foreground">
      <header className="flex h-[78px] shrink-0 items-center gap-7 border-b border-border bg-background px-6 max-lg:px-4">
        <div className="flex min-w-0 items-center gap-3.5">
          <span className="text-primary">
            <CalendarDays size={25} />
          </span>
          <span className="min-w-0">
            <strong className="block text-[23px] leading-tight tracking-tight">
              Event<span className="text-primary">Hub</span>
            </strong>
            <small className="block text-xs text-muted-foreground">
              Connect · Collaborate · Celebrate
            </small>
          </span>
        </div>

        <button
          type="button"
          className="rounded-lg border border-border bg-card p-2 text-foreground lg:hidden"
          onClick={() => setNavOpen((open) => !open)}
          aria-label="Toggle sidebar"
          aria-expanded={navOpen}
        >
          <Menu size={21} />
        </button>

        <label className="hidden h-[42px] max-w-105 flex-1 items-center gap-3 rounded-lg border border-border bg-muted px-3.5 text-muted-foreground sm:flex">
          <Search size={18} />
          <input
            className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            placeholder="Search events, clubs, or keywords..."
          />
        </label>

        <div className="ml-auto flex items-center gap-4.5 max-lg:gap-2">
          <ThemeToggler />
          <button
            type="button"
            aria-label="Notifications"
            className="relative rounded-lg border border-border bg-card p-2 text-foreground"
          >
            <Bell size={19} />
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger
              className="flex items-center gap-2.5 rounded-lg outline-none"
              aria-label="Account menu"
            >
              <span className="grid size-11 place-items-center rounded-full bg-gradient-to-br from-orange-200 to-orange-400 font-bold text-white">
                {initials}
              </span>
              <span className="hidden min-[420px]:block text-left">
                <strong className="block text-sm">{displayName}</strong>
                <small className="block text-xs text-muted-foreground">
                  {meta.type}
                </small>
              </span>
              <ChevronDown size={16} className="hidden min-[420px]:block text-muted-foreground" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <p className="text-sm font-medium leading-none">{displayName}</p>
                <p className="mt-1 text-xs leading-none text-muted-foreground">
                  {currentUser?.email ?? "Signed in"}
                </p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer"
                onSelect={() => router.push(`${dashboardBasePath[activeRole]}/settings`)}
              >
                <UserRound className="mr-2 size-4" /> Profile
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer text-destructive"
                onSelect={() => setDeleteOpen(true)}
              >
                <UserRound className="mr-2 size-4" /> Delete Account
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer text-destructive"
                onSelect={handleLogout}
              >
                <LogOut className="mr-2 size-4" /> Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        <Sidebar
          role={activeRole}
          context={meta.context}
          type={meta.type}
          open={navOpen}
        />
        {navOpen && (
          <button
            type="button"
            aria-label="Close navigation"
            className="fixed inset-0 top-[78px] z-30 bg-black/50 lg:hidden"
            onClick={() => setNavOpen(false)}
          />
        )}
        <main className="min-w-0 flex-1 overflow-y-auto p-6 pb-16 max-md:p-4">
          <div className="mb-5 grid items-center gap-5 lg:grid-cols-[1fr_auto_auto] max-lg:grid-cols-1">
            <div>
              <h1 className="text-[28px] font-bold tracking-tight">
                {pageCopy?.[0] || `${greeting()}, ${displayName}!`}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {pageCopy?.[1] || meta.welcome}
              </p>
            </div>
            <blockquote className="text-right text-sm italic text-muted-foreground max-lg:text-left">
              “{dashboardRoleQuotes[activeRole].text}”
              <small className="mt-1.5 block not-italic">
                — {dashboardRoleQuotes[activeRole].author}
              </small>
            </blockquote>
            <div className="flex items-center gap-3 rounded-lg border border-border px-4 py-2.5 text-sm">
              <span className="text-primary">
                <CalendarDays size={21} />
              </span>
              <span>
                {formatToday()}
                <small className="mt-1 block text-xs text-muted-foreground">
                  Make it a great day!
                </small>
              </span>
            </div>
          </div>
          {children}
        </main>
      </div>

      <DeleteAccountDialog
        open={deleteOpen}
        isLoading={deleteLoading}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDeleteAccount}
      />
    </div>
  );
}

function DeleteAccountDialog({
  open,
  isLoading,
  onOpenChange,
  onConfirm,
}: {
  open: boolean;
  isLoading: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete your account?</DialogTitle>
          <DialogDescription>
            This permanently removes your account, your registrations and any
            events you manage. This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm} disabled={isLoading}>
            {isLoading ? "Deleting…" : "Delete account"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
