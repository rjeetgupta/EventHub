/** Shared design tokens for the dashboard kit (see globals.css for values). */
export const dashboardChartLabels = [
  "Technical",
  "Cultural",
  "Sports",
  "Workshop",
  "Seminar",
] as const;

/** Color tokens (defined in globals.css @theme) used for donut/legend segments. */
export const dashboardChartColors = [
  "primary",
  "chart-1",
  "chart-2",
  "chart-3",
  "chart-4",
  "chart-5",
] as const;

/** Section page titles shown in the welcome bar, keyed by URL section. */
export const dashboardSectionTitles: Record<string, [string, string]> = {
  analytics: [
    "Analytics Overview",
    "Insights and analytics to understand event engagement across the college.",
  ],
  departments: [
    "Department Management",
    "Manage departments, admins and their events.",
  ],
  registrations: [
    "Event Registrations",
    "View and manage all event registrations across the university.",
  ],
  events: ["Event Management", "Review, publish, and manage events."],
  groups: ["Group Management", "Manage groups and group administrators."],
  users: ["User Management", "Manage students and administrators."],
  students: ["Students", "View department student participation."],
  members: ["Members", "Manage your group members."],
  notifications: ["Notifications", "System notifications and announcements."],
  settings: ["Settings", "Preferences and account settings."],
  bookmarks: ["My Bookmarks", "Events you have saved for later."],
  clubs: ["Clubs & Groups", "Explore clubs and groups across campus."],
  profile: ["Profile", "Your account information."],
};

/** Welcome-bar quote shown on every dashboard page. */
export const dashboardQuote = {
  text: "Great events create great opportunities.",
  author: "EventHub",
} as const;

/** Tailwind classes for status pills shared by lists and tables. */
export function dashboardStatusClass(status?: string): string {
  const value = (status ?? "").toLowerCase();
  if (/(open|active|registered|confirmed|attended|completed)/.test(value))
    return "bg-success/15 text-success";
  if (/(closing soon|pending|upcoming|participated)/.test(value))
    return "bg-warning/15 text-warning";
  if (/(draft|waitlisted|soon)/.test(value))
    return "bg-muted text-muted-foreground";
  if (/(inactive|absent|missed|cancelled)/.test(value))
    return "bg-destructive/15 text-destructive";
  return "bg-primary/15 text-primary";
}

export type DashboardAction = {
  label: string;
  icon: string;
  variant?: "primary" | "outline";
};

/**
 * Quick actions per role (labels double as the `dashboard-action` event detail).
 * Icons are Lucide component names resolved in the UI layer.
 */
export const dashboardQuickActions: Record<
  "admin" | "department" | "group" | "student",
  DashboardAction[]
> = {
  admin: [
    { label: "Create Event", icon: "Plus", variant: "primary" },
    { label: "Add Department", icon: "Building2" },
    { label: "Create Group", icon: "Layers3" },
    { label: "Manage Users", icon: "Users" },
  ],
  department: [
    { label: "Create Event", icon: "Plus", variant: "primary" },
    { label: "Manage Events", icon: "CalendarDays" },
    { label: "View Registrations", icon: "ClipboardList" },
    { label: "Manage Groups", icon: "Users" },
    { label: "View Students", icon: "GraduationCap" },
  ],
  group: [
    { label: "Create Event", icon: "Plus", variant: "primary" },
    { label: "View All Events", icon: "CalendarDays" },
    { label: "Manage Members", icon: "Users" },
    { label: "View Registrations", icon: "ClipboardList" },
  ],
  student: [
    { label: "Browse All Events", icon: "Search" },
    { label: "My Bookmarks", icon: "Heart" },
    { label: "My Registrations", icon: "ClipboardList" },
    { label: "Join Clubs & Groups", icon: "Users" },
  ],
};

/** Route each quick action navigates to, per role. */
export const dashboardActionRoutes: Record<string, Record<string, string>> = {
  admin: {
    "Create Event": "/admin/events?action=create",
    "Add Department": "/admin/departments?action=create",
    "Create Group": "/admin/groups?action=create",
    "Manage Users": "/admin/users",
  },
  department: {
    "Create Event": "/department/events?action=create",
    "Manage Events": "/department/events",
    "View Registrations": "/department/registrations",
    "Manage Groups": "/department/groups",
    "View Students": "/department/students",
  },
  group: {
    "Create Event": "/group-admin/events?action=create",
    "View All Events": "/group-admin/events",
    "Manage Members": "/group-admin/members",
    "View Registrations": "/group-admin/registrations",
  },
  student: {
    "Browse All Events": "/student/events",
    "My Bookmarks": "/student/bookmarks",
    "My Registrations": "/student/registrations",
    "Join Clubs & Groups": "/student/clubs",
  },
};

/** Role-specific quote shown in the welcome bar. */
export const dashboardRoleQuotes: Record<
  "admin" | "department" | "group" | "student",
  { text: string; author: string }
> = {
  admin: {
    text: "Great events create great opportunities.",
    author: "EventHub",
  },
  department: {
    text: "Events today, brighter tomorrows.",
    author: "Computer Science",
  },
  group: { text: "Small groups create big opportunities.", author: "EventHub" },
  student: {
    text: "New experiences build a brighter you.",
    author: "EventHub",
  },
};
