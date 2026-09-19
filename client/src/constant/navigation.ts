import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Bell,
  Building2,
  CalendarDays,
  CircleUserRound,
  ClipboardList,
  Heart,
  Home,
  LayoutGrid,
  Settings,
  Users,
} from "lucide-react";

export type DashboardRole = "student" | "group" | "department" | "admin";

export type DashboardNavItem = Readonly<{
  label: string;
  href: string;
  icon: LucideIcon;
}>;

export type DashboardRoleMeta = Readonly<{
  type: string;
  context: string;
  welcome: string;
}>;

export const dashboardRoleMeta: Record<DashboardRole, DashboardRoleMeta> = {
  student: {
    type: "Student",
    context: "EventHub",
    welcome: "Explore, learn and be part of amazing events.",
  },
  group: {
    type: "Group Admin",
    context: "Web Development Club",
    welcome: "Here's what's happening with your group.",
  },
  department: {
    type: "Department Admin",
    context: "Computer Science",
    welcome: "Here's what's happening in your department.",
  },
  admin: {
    type: "Super Admin",
    context: "EventHub",
    welcome: "Here's an overview of what's happening across the college.",
  },
};

export const dashboardNavigation: Record<
  DashboardRole,
  readonly DashboardNavItem[]
> = {
  student: [
    { label: "Dashboard", href: "/student", icon: Home },
    { label: "Explore Events", href: "/student/events", icon: LayoutGrid },
    {
      label: "My Registrations",
      href: "/student/registrations",
      icon: ClipboardList,
    },
    { label: "My Bookmarks", href: "/student/bookmarks", icon: Heart },
    { label: "Clubs & Groups", href: "/student/clubs", icon: Users },
    { label: "Notifications", href: "/student/notifications", icon: Bell },
    { label: "Profile", href: "/student/profile", icon: CircleUserRound },
    { label: "Settings", href: "/student/settings", icon: Settings },
  ],
  group: [
    { label: "Dashboard", href: "/group-admin", icon: Home },
    { label: "Events", href: "/group-admin/events", icon: CalendarDays },
    {
      label: "Registrations",
      href: "/group-admin/registrations",
      icon: ClipboardList,
    },
    { label: "Members", href: "/group-admin/members", icon: Users },
    { label: "Analytics", href: "/group-admin/analytics", icon: BarChart3 },
    { label: "Settings", href: "/group-admin/settings", icon: Settings },
  ],
  department: [
    { label: "Dashboard", href: "/department", icon: Home },
    { label: "Events", href: "/department/events", icon: CalendarDays },
    {
      label: "Registrations",
      href: "/department/registrations",
      icon: ClipboardList,
    },
    { label: "Students", href: "/department/students", icon: Users },
    { label: "Groups", href: "/department/groups", icon: Users },
    { label: "Analytics", href: "/department/analytics", icon: BarChart3 },
    {
      label: "Notifications",
      href: "/department/notifications",
      icon: Bell,
    },
    { label: "Settings", href: "/department/settings", icon: Settings },
  ],
  admin: [
    { label: "Dashboard", href: "/admin", icon: Home },
    { label: "Events", href: "/admin/events", icon: CalendarDays },
    { label: "Departments", href: "/admin/departments", icon: Building2 },
    { label: "Groups", href: "/admin/groups", icon: LayoutGrid },
    { label: "Users", href: "/admin/users", icon: Users },
    {
      label: "Registrations",
      href: "/admin/registrations",
      icon: ClipboardList,
    },
    { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
    { label: "Notifications", href: "/admin/notifications", icon: Bell },
    { label: "Settings", href: "/admin/settings", icon: Settings },
  ],
};

/** URL prefix for each dashboard role (first path segment). */
export const dashboardBasePath: Record<DashboardRole, string> = {
  student: "/student",
  group: "/group-admin",
  department: "/department",
  admin: "/admin",
};

/**
 * Resolve the dashboard role from the URL's FIRST path segment only.
 * Segment matching (never `includes`) so /admin/departments stays admin.
 */
export function resolveDashboardRole(pathname: string): DashboardRole {
  const first = pathname.split("/").filter(Boolean)[0] ?? "";
  for (const role of Object.keys(dashboardBasePath) as DashboardRole[]) {
    if (first === dashboardBasePath[role].slice(1)) return role;
  }
  return "admin";
}

const ROLE_VALUE_TO_DASHBOARD: Record<string, DashboardRole> = {
  SUPER_ADMIN: "admin",
  ADMIN: "admin",
  DEPARTMENT_ADMIN: "department",
  GROUP_ADMIN: "group",
  STUDENT: "student",
};

/** Map the auth user's role value ("SUPER_ADMIN"…) to a dashboard role. */
export function dashboardRoleForUser(
  roleValue: string | null | undefined,
): DashboardRole | null {
  if (!roleValue) return null;
  return ROLE_VALUE_TO_DASHBOARD[roleValue] ?? null;
}

/** Does this URL belong to the given dashboard role's area? */
export function isDashboardRolePath(
  pathname: string,
  role: DashboardRole,
): boolean {
  const base = dashboardBasePath[role];
  return pathname === base || pathname.startsWith(`${base}/`);
}

export function getDashboardSection(pathname: string): string | null {
  const segments = pathname.split("/").filter(Boolean);
  // /admin, /department, /group-admin, /student → home (no section)
  if (segments.length < 2) return null;
  return segments[1] ?? null;
}
