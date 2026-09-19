"use client";

import { useEffect, useMemo } from "react";
import {
  Activity,
  Building2,
  CalendarDays,
  ClipboardList,
  GraduationCap,
  Heart,
  Layers3,
  Plus,
  Search,
  Star,
  Users,
  type LucideIcon,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { fetchDashboard } from "@/store/slices/dashboardSlice";
import type {
  AdminDashboardData,
  DashboardDataByRole,
  DashboardRecentRegistration,
  DashboardRole,
  DepartmentDashboardData,
  GroupDashboardData,
  StudentDashboardData,
} from "@/services/dashboardService";
import type { DashboardEvent } from "@/components/cards/DashboardEventList";
import type {
  DashboardOverviewData,
  DashboardRegistration,
} from "@/components/dashboard/shared/types";
import { dashboardQuickActions, dashboardRoleQuotes } from "@/constant/dashboard";

type RoleMeta = {
  stats: DashboardOverviewData["stats"];
  chartTitle: string;
  chartSubtitle: string;
};

/**
 * Static per-role config: which stat cards to render and chart copy.
 * Live values are injected by buildStatValues from the API payload.
 */
const roleMeta: Record<DashboardRole, RoleMeta> = {
  student: {
    stats: [
      { value: "0", label: "My Registrations", icon: ClipboardList, trend: "" },
      { value: "0", label: "Bookmarked Events", icon: Heart, trend: "" },
      { value: "0", label: "Events Attended", icon: Star, trend: "" },
      { value: "0", label: "Upcoming Registered", icon: CalendarDays, trend: "" },
    ],
    chartTitle: "My Participation",
    chartSubtitle: "Your event activity over the last 6 months",
  },
  group: {
    stats: [
      { value: "0", label: "Group Events", icon: CalendarDays, trend: "" },
      { value: "0", label: "Group Members", icon: Users, trend: "" },
      { value: "0", label: "Total Registrations", icon: ClipboardList, trend: "" },
      { value: "0", label: "Upcoming Events", icon: Layers3, trend: "" },
    ],
    chartTitle: "Event Registrations Trend",
    chartSubtitle: "Registrations for your group events over the last 6 months",
  },
  department: {
    stats: [
      { value: "0", label: "Department Events", icon: CalendarDays, trend: "" },
      { value: "0", label: "Department Students", icon: GraduationCap, trend: "" },
      { value: "0", label: "Active Groups", icon: Layers3, trend: "" },
      { value: "0", label: "Total Registrations", icon: ClipboardList, trend: "" },
    ],
    chartTitle: "Event Registrations Trend",
    chartSubtitle: "Registrations for department events over the last 6 months",
  },
  admin: {
    stats: [
      { value: "0", label: "Total Events", icon: CalendarDays, trend: "" },
      { value: "0", label: "Total Students", icon: Users, trend: "" },
      { value: "0", label: "Total Registrations", icon: ClipboardList, trend: "" },
      { value: "0", label: "Departments", icon: Building2, trend: "" },
      { value: "0", label: "Active Groups", icon: Layers3, trend: "" },
    ],
    chartTitle: "Event Activity",
    chartSubtitle: "Number of events created over the last 6 months",
  },
};

/** Maps stat labels → live values from the role's API payload. */
function buildStatValues(
  role: DashboardRole,
  data:
    | AdminDashboardData
    | DepartmentDashboardData
    | GroupDashboardData
    | StudentDashboardData
    | null,
): Record<string, string> {
  if (!data) return {};

  if (role === "admin") {
    const summary = (data as AdminDashboardData).summary;
    return {
      "Total Events": summary.totalEvents.toLocaleString(),
      "Total Students": summary.totalStudents.toLocaleString(),
      "Total Registrations": summary.totalRegistrations.toLocaleString(),
      Departments: summary.departments.toLocaleString(),
      "Active Groups": summary.activeGroups.toLocaleString(),
    };
  }

  if (role === "department") {
    const summary = (data as DepartmentDashboardData).summary;
    return {
      "Department Events": summary.totalEvents.toLocaleString(),
      "Department Students": summary.totalStudents.toLocaleString(),
      "Active Groups": summary.activeGroups.toLocaleString(),
      "Total Registrations": summary.totalRegistrations.toLocaleString(),
    };
  }

  if (role === "group") {
    const summary = (data as GroupDashboardData).summary;
    return {
      "Group Events": summary.totalEvents.toLocaleString(),
      "Group Members": summary.totalMembers.toLocaleString(),
      "Total Registrations": summary.totalRegistrations.toLocaleString(),
      "Upcoming Events": String(summary.upcomingEvents),
    };
  }

  const summary = (data as StudentDashboardData).summary;
  return {
    "My Registrations": String(summary.totalRegistrations),
    "Events Attended": String(summary.attendedEvents),
    "Upcoming Registered": String(summary.upcomingRegistered),
  };
}

/** Quick-action icon lookup by config icon key. */
const actionIcons: Record<string, LucideIcon> = {
  Plus,
  Building2,
  Layers3,
  Users,
  CalendarDays,
  ClipboardList,
  GraduationCap,
  Search,
  Heart,
};

const formatDay = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

function prettyStatus(status?: string): string {
  switch (status) {
    case "PUBLISHED":
    case "APPROVED":
      return "Open";
    case "PENDING_APPROVAL":
      return "Pending";
    case "REGISTRATION_CLOSED":
      return "Closed";
    case "ONGOING":
      return "Ongoing";
    case "COMPLETED":
      return "Completed";
    case "DRAFT":
      return "Draft";
    default:
      return status ? status.replaceAll("_", " ") : "";
  }
}

const toEvent = (event: {
  title: string;
  date: string;
  venue: string | null;
  link?: string | null;
  mode?: string;
  status?: string;
}): DashboardEvent => ({
  title: event.title,
  date: formatDay(event.date),
  venue: event.venue || (event.mode === "ONLINE" ? "Online" : (event.link ?? "Venue TBA")),
  status: prettyStatus(event.status),
});

const toRegistrations = (
  recent?: DashboardRecentRegistration[],
): DashboardRegistration[] =>
  (recent ?? []).slice(0, 8).map((registration) => ({
    name: registration.user.fullName,
    event: registration.event.title,
    time: formatDay(registration.registeredAt),
  }));

export function useDashboardData<R extends DashboardRole>(role: R) {
  const dispatch = useAppDispatch();
  const roleState = useAppSelector((state) => state.dashboard[role]);
  const currentUser = useAppSelector((state) => state.auth.user);

  const data = roleState?.data as DashboardDataByRole[R] | null;
  const isLoading = roleState?.isLoading ?? false;
  const error = roleState?.error ?? null;
  const hasFetched = roleState?.hasFetched ?? false;

  useEffect(() => {
    if (!hasFetched && !isLoading) {
      dispatch(fetchDashboard({ role }));
    }
  }, [dispatch, hasFetched, isLoading, role]);

  const overview = useMemo((): DashboardOverviewData => {
    const meta = roleMeta[role];
    const liveValues = buildStatValues(role, data);
    const raw = data as
      | AdminDashboardData
      | DepartmentDashboardData
      | GroupDashboardData
      | StudentDashboardData
      | null;

    const events: DashboardEvent[] = (() => {
      if (!raw) return [];
      if (role === "student") {
        return (raw as StudentDashboardData).upcomingEvents.map(({ event }) => toEvent(event));
      }
      return ((raw as AdminDashboardData).upcomingEvents ?? [])
        .slice(0, 5)
        .map(toEvent);
    })();

    const registrations =
      role === "student"
        ? []
        : toRegistrations((raw as AdminDashboardData)?.recentRegistrations);

    const status = role === "admin" ? (raw as AdminDashboardData | null)?.eventStatus : undefined;

    return {
      stats: meta.stats.map((stat) => ({
        ...stat,
        value: liveValues[stat.label] ?? "—",
      })),
      events,
      registrations,
      chartTitle: meta.chartTitle,
      chartSubtitle: meta.chartSubtitle,
      quick: dashboardQuickActions[role].map((action) => ({
        label: action.label,
        icon: actionIcons[action.icon] ?? Activity,
      })),
      active: status?.active ?? 0,
      draft: status?.draft ?? 0,
      completed: status?.completed ?? 0,
      registrationTrend:
        role === "student"
          ? undefined
          : (raw as AdminDashboardData | null)?.registrationTrend ?? undefined,
      role,
    };
  }, [data, role]);

  return {
    data,
    overview,
    isLoading,
    error,
    hasFetched,
    currentUser,
    quote: dashboardRoleQuotes[role],
    retry: () => dispatch(fetchDashboard({ role, force: true })),
  };
}
