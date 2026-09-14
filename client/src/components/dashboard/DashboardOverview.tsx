"use client";

import { usePathname } from "next/navigation";
import { useMemo } from "react";
import {
  Activity,
  Award,
  BarChart3,
  Building2,
  CalendarDays,
  ClipboardList,
  Layers3,
  Megaphone,
  Plus,
  Users,
} from "lucide-react";
import {
  DashboardCard,
  DashboardCardHeader,
  DashboardChart,
  DashboardDonut,
  DashboardEventList,
  DashboardProgress,
  DashboardQuickActions,
  DashboardRegistrationTable,
  DashboardSection,
  DashboardStat,
  DashboardSystemOverview,
  type DashboardEvent,
} from "./DashboardShell";
import { useAppSelector } from "@/store/hook";
import type { Event } from "@/lib/schema/event.schema";

type ViewConfig = {
  stats: {
    value: string;
    label: string;
    icon: typeof CalendarDays;
    trend: string;
  }[];
  events: DashboardEvent[];
  registrations: { name: string; event: string; time: string }[];
  chartTitle: string;
  chartSubtitle: string;
  quick: { label: string; icon: typeof Plus }[];
};

const events: DashboardEvent[] = [
  {
    title: "React & Next.js Workshop",
    date: "Sep 18, 2025",
    venue: "Lab 1, CSE Block",
    status: "Open",
  },
  {
    title: "Git & GitHub Session",
    date: "Sep 25, 2025",
    venue: "Lab 2, CSE Block",
    status: "Open",
  },
  {
    title: "Portfolio Building Workshop",
    date: "Oct 5, 2025",
    venue: "Seminar Hall",
    status: "Registration Soon",
  },
  {
    title: "Web Development Contest",
    date: "Oct 20, 2025",
    venue: "Online",
    status: "Open",
  },
  {
    title: "Open Source Meetup",
    date: "Nov 2, 2025",
    venue: "CSE Block",
    status: "Open",
  },
];
const registrations = [
  "Rahul Kumar",
  "Priya Singh",
  "Amit Verma",
  "Sneha Patel",
  "Vikash Kumar",
  "Neha Gupta",
  "Aditya Raj",
  "Sunil Kumar",
].map((name, i) => ({
  name,
  event: events[i % events.length].title,
  time: `${i * 13 + 5} mins ago`,
}));

const views: Record<string, ViewConfig> = {
  student: {
    stats: [
      { value: "8", label: "My Registrations", icon: ClipboardList, trend: "" },
      { value: "5", label: "Bookmarked Events", icon: Award, trend: "" },
      { value: "3", label: "Events Attended", icon: Activity, trend: "" },
      { value: "2", label: "Clubs Joined", icon: Users, trend: "" },
    ],
    events,
    registrations,
    chartTitle: "My Participation",
    chartSubtitle: "Your event activity over the last 6 months",
    quick: [
      { label: "Browse All Events", icon: BarChart3 },
      { label: "My Bookmarks", icon: Award },
      { label: "My Registrations", icon: ClipboardList },
      { label: "Join Clubs & Groups", icon: Users },
    ],
  },
  group: {
    stats: [
      { value: "5", label: "Group Events", icon: CalendarDays, trend: "+25%" },
      { value: "48", label: "Group Members", icon: Users, trend: "+12%" },
      {
        value: "126",
        label: "Total Registrations",
        icon: ClipboardList,
        trend: "+18%",
      },
      { value: "3", label: "Upcoming Events", icon: Layers3, trend: "+50%" },
    ],
    events,
    registrations,
    chartTitle: "Event Registrations Trend",
    chartSubtitle: "Registrations for your group events over the last 6 months",
    quick: [
      { label: "Create Event", icon: Plus },
      { label: "View All Events", icon: CalendarDays },
      { label: "Manage Members", icon: Users },
      { label: "View Registrations", icon: ClipboardList },
    ],
  },
  department: {
    stats: [
      {
        value: "12",
        label: "Department Events",
        icon: CalendarDays,
        trend: "+20%",
      },
      { value: "320", label: "Department Students", icon: Users, trend: "+5%" },
      { value: "5", label: "Active Groups", icon: Layers3, trend: "+25%" },
      {
        value: "842",
        label: "Total Registrations",
        icon: ClipboardList,
        trend: "+18%",
      },
    ],
    events,
    registrations,
    chartTitle: "Event Registrations Trend",
    chartSubtitle: "Registrations for department events over the last 6 months",
    quick: [
      { label: "Create Event", icon: Plus },
      { label: "Manage Events", icon: CalendarDays },
      { label: "View Registrations", icon: ClipboardList },
      { label: "Manage Groups", icon: Users },
    ],
  },
  admin: {
    stats: [
      { value: "48", label: "Total Events", icon: CalendarDays, trend: "+12%" },
      { value: "1,248", label: "Total Students", icon: Users, trend: "+8%" },
      {
        value: "3,842",
        label: "Total Registrations",
        icon: ClipboardList,
        trend: "+18%",
      },
      { value: "12", label: "Departments", icon: Building2, trend: "0%" },
      { value: "48", label: "Active Groups", icon: Layers3, trend: "+9%" },
    ],
    events,
    registrations,
    chartTitle: "Event Activity",
    chartSubtitle: "Number of events created over the last 6 months",
    quick: [
      { label: "Create Event", icon: Plus },
      { label: "Add Department", icon: Building2 },
      { label: "Create Group", icon: Layers3 },
      { label: "Manage Users", icon: Users },
    ],
  },
};

export function DashboardOverview() {
  const pathname = usePathname();
  const role = pathname.includes("student")
    ? "student"
    : pathname.includes("group-admin")
      ? "group"
      : pathname.includes("department")
        ? "department"
        : "admin";
  const {
    departmentEvents,
    allEvents,
    myEvents,
    myRegistrations,
    isLoading,
    error,
  } = useAppSelector((state) => state.events);
  const departments = useAppSelector((state) => state.departments.departments);
  const sourceEvents: Event[] = (
    role === "student"
      ? myEvents
      : role === "admin"
        ? allEvents
        : departmentEvents
  ) as Event[];
  const view = useMemo(() => {
    const configured = views[role];
    const mappedEvents: DashboardEvent[] = sourceEvents.map((event) => ({
      title: event.title,
      date: event.date
        ? new Date(event.date).toLocaleDateString()
        : "Date pending",
      venue: event.venue || event.mode || "Online",
      status:
        event.status === "PUBLISHED" || event.status === "APPROVED"
          ? "Open"
          : event.status.replaceAll("_", " "),
    }));
    const mappedRegistrations = (
      role === "student"
        ? myRegistrations
        : sourceEvents.flatMap((event) =>
            (event.registeredUsers || [])
              .slice(0, 3)
              .map((name) => ({
                name,
                event: event.title,
                time: event.date
                  ? new Date(event.date).toLocaleDateString()
                  : "Recently",
              })),
          )
    ).slice(0, 8);
    const active = sourceEvents.filter((event) =>
      ["PUBLISHED", "APPROVED", "ONGOING"].includes(event.status),
    ).length;
    const draft = sourceEvents.filter(
      (event) => event.status === "DRAFT",
    ).length;
    const completed = sourceEvents.filter(
      (event) => event.status === "COMPLETED",
    ).length;
    const registrationsCount = sourceEvents.reduce(
      (total, event) => total + event.currentRegistrations,
      0,
    );
    return {
      ...configured,
      events: mappedEvents,
      registrations: mappedRegistrations,
      active,
      draft,
      completed,
      registrationsCount,
      stats: configured.stats.map((stat) => {
        if (stat.label === "My Registrations")
          return { ...stat, value: String(myRegistrations.length) };
        if (
          stat.label === "Total Events" ||
          stat.label === "Group Events" ||
          stat.label === "Department Events"
        )
          return { ...stat, value: String(sourceEvents.length) };
        if (stat.label === "Total Registrations")
          return { ...stat, value: registrationsCount.toLocaleString() };
        if (stat.label === "Departments")
          return { ...stat, value: String(departments.length) };
        return stat;
      }),
    };
  }, [departments.length, myRegistrations.length, role, sourceEvents]);
  const retry = () => window.location.reload();
  if (isLoading)
    return (
      <div className="dashboard-loading">
        <span />
        <span />
        <span />
        <span />
      </div>
    );
  if (error)
    return (
      <DashboardCard className="dashboard-error">
        <h2>Unable to load dashboard data</h2>
        <p>{error}</p>
        <button onClick={retry}>Retry</button>
      </DashboardCard>
    );
  return (
    <>
      <DashboardSection
        columns={`repeat(${role === "admin" ? 5 : 4}, minmax(0, 1fr))`}
      >
        {view.stats.map((stat) => (
          <DashboardStat key={stat.label} {...stat} />
        ))}
      </DashboardSection>
      <DashboardSection
        columns={role === "admin" ? "1.15fr 1.15fr .8fr" : "1.4fr 1fr .8fr"}
      >
        <DashboardCard>
          <DashboardCardHeader title={view.chartTitle} />
          <p className="dashboard-panel-subtitle">{view.chartSubtitle}</p>
          {sourceEvents.length ? (
            <DashboardChart
              values={sourceEvents
                .slice(0, 7)
                .map((event) => event.currentRegistrations)}
              type={role === "admin" ? "bar" : "line"}
            />
          ) : (
            <div className="dashboard-empty">No chart data available yet.</div>
          )}
        </DashboardCard>
        {role === "admin" ? (
          <DashboardCard>
            <DashboardCardHeader title="Registrations Overview" />
            <p className="dashboard-panel-subtitle">
              Total registrations over the last 6 months
            </p>
            <DashboardChart
              values={[340, 480, 450, 620, 760, 920]}
              type="bar"
            />
          </DashboardCard>
        ) : (
          <DashboardCard>
            <DashboardCardHeader
              title={
                role === "student" ? "My Event Progress" : "Event Participation"
              }
            />
            <DashboardProgress label="Active participation" value={68} />
            <DashboardProgress label="Registered" value={82} color="green" />
            <DashboardProgress label="Completed" value={47} color="blue" />
          </DashboardCard>
        )}
        {role === "admin" ? (
          <DashboardCard>
            <DashboardCardHeader title="Events by Category" />
            <DashboardDonut
              value={sourceEvents.length}
              label="Events"
              segments={[
                sourceEvents.filter((event) => event.category === "Technical")
                  .length,
                sourceEvents.filter((event) => event.category === "Cultural")
                  .length,
                sourceEvents.filter((event) => event.category === "Sports")
                  .length,
                sourceEvents.filter((event) => event.category === "Workshop")
                  .length,
                sourceEvents.filter(
                  (event) =>
                    !["Technical", "Cultural", "Sports", "Workshop"].includes(
                      event.category,
                    ),
                ).length,
              ]}
            />
          </DashboardCard>
        ) : (
          <DashboardQuickActions actions={view.quick} />
        )}
      </DashboardSection>
      <DashboardSection columns="1.1fr 1fr .78fr">
        <DashboardEventList
          events={view.events}
          title={role === "student" ? "Recommended Events" : "Upcoming Events"}
        />
        <DashboardRegistrationTable rows={view.registrations} />
        {role === "admin" ? (
          <div className="dashboard-stack">
            <DashboardQuickActions actions={view.quick} />
            <DashboardCard>
              <DashboardCardHeader title="System Overview" />
              <DashboardSystemOverview
                active={view.active}
                draft={view.draft}
                completed={view.completed}
              />
            </DashboardCard>
          </div>
        ) : (
          <DashboardCard>
            <DashboardCardHeader title="Recent Announcements" />
            <div className="dashboard-empty">
              <Megaphone size={22} />
              Announcements API not available yet.
            </div>
          </DashboardCard>
        )}
      </DashboardSection>
    </>
  );
}
