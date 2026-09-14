"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import {
  Activity,
  Award,
  BarChart3,
  Building2,
  CalendarDays,
  ClipboardList,
  Layers3,
  Plus,
  Users,
} from "lucide-react";
import {
  DashboardCard,
  DashboardCardHeader,
  DashboardChart,
  DashboardDonut,
  DashboardEventList,
  DashboardQuickActions,
  DashboardRegistrationTable,
  DashboardSection,
  DashboardStat,
  DashboardSystemOverview,
  DashboardInfoRows,
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
  const searchParams = useSearchParams();
  const role = pathname.includes("student")
    ? "student"
    : pathname.includes("group-admin")
      ? "group"
      : pathname.includes("department")
        ? "department"
      : "admin";
  const studentSection = role === "student" && pathname.split("/")[2];
  const departmentSection = role === "department" ? searchParams.get("view") : null;
  const {
    departmentEvents,
    allEvents,
    myEvents,
    myRegistrations,
    isLoading,
    error,
  } = useAppSelector((state) => state.events);
  const departments = useAppSelector((state) => state.departments.departments);
  const currentUser = useAppSelector((state) => state.auth.user);
  const departmentData = departments.find((department) => department.id === currentUser?.departmentId);
  const sourceEvents: Event[] = (
    role === "student"
      ? myEvents
      : role === "admin"
        ? allEvents
        : departmentEvents
  ) as Event[];
  const studentAttendanceRate = myRegistrations.length ? Math.round((myRegistrations.filter((registration) => registration.status === "ATTENDED").length / myRegistrations.length) * 100) : null;
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
        ? myRegistrations.map((registration) => ({
            name: registration.userName || "Registered student",
            event: registration.eventTitle || "Event registration",
            time: registration.registeredAt ? new Date(registration.registeredAt).toLocaleDateString() : "Recently",
          }))
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
        if (stat.label === "Events Attended")
          return { ...stat, value: String(myRegistrations.filter((registration) => registration.status === "ATTENDED").length) };
        if (["Bookmarked Events", "Clubs Joined"].includes(stat.label))
          return { ...stat, value: "—", trend: "API needed" };
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
        if (stat.label === "Department Students")
          return { ...stat, value: departmentData?.stats?.totalParticipants?.toLocaleString() || "—", trend: departmentData?.stats ? "Live" : "API needed" };
        if (stat.label === "Active Groups")
          return { ...stat, value: departmentData?.stats?.totalGroupAdmins ?? "—", trend: departmentData?.stats ? "Live" : "API needed" };
        if (stat.label === "Upcoming Events")
          return { ...stat, value: String(sourceEvents.filter((event) => new Date(event.date) >= new Date()).length) };
        return stat;
      }),
    };
  }, [currentUser?.departmentId, departmentData?.stats, departments.length, myRegistrations, role, sourceEvents]);
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
  if (studentSection || departmentSection)
    return (
      <DashboardCard className="dashboard-route-panel">
        <DashboardCardHeader title={studentSection ? ({ events: "Explore Events", registrations: "My Registrations", bookmarks: "My Bookmarks", clubs: "Clubs & Groups", notifications: "Notifications", profile: "Profile", settings: "Settings" }[studentSection] || "Student Dashboard") : ({ events: "Department Events", registrations: "Registrations", students: "Students", groups: "Groups", analytics: "Analytics", notifications: "Notifications", settings: "Settings" }[departmentSection!] || "Department Dashboard")} action="" />
        <div className="dashboard-route-panel__content">
          {studentSection === "events" && <><h3>Explore Events</h3><p>Browse upcoming campus events and discover experiences that match your interests.</p><DashboardEventList events={view.events} title="Upcoming Events" /></>}
          {studentSection === "registrations" && <><h3>My Registrations</h3><p>You have {myRegistrations.length} registered event{myRegistrations.length === 1 ? "" : "s"}.</p><DashboardRegistrationTable rows={view.registrations} /></>}
          {studentSection === "bookmarks" && <><h3>My Bookmarks</h3><p>Bookmarks will appear here when the bookmarks API is available.</p><span className="dashboard-api-note">API needed</span></>}
          {studentSection === "clubs" && <><h3>Clubs & Groups</h3><p>Explore clubs and groups across your campus.</p><span className="dashboard-api-note">API needed</span></>}
          {studentSection === "notifications" && <><h3>Notifications</h3><p>Your notification center will appear here.</p><span className="dashboard-api-note">API needed</span></>}
          {studentSection === "profile" && <><h3>{currentUser?.fullName || "Student Profile"}</h3><p>{currentUser?.email || "Profile information is not available yet."}</p></>}
          {studentSection === "settings" && <><h3>Settings</h3><p>Account, theme, and notification preferences.</p><span className="dashboard-api-note">Settings panel ready for integration</span></>}
          {departmentSection === "events" && <><h3>Department Events</h3><p>Manage department events using the same dashboard event data.</p><DashboardEventList events={view.events} title="Department Events" /></>}
          {departmentSection === "registrations" && <><h3>Registrations</h3><p>Registration records derived from department event data.</p><DashboardRegistrationTable rows={view.registrations} /></>}
          {departmentSection === "students" && <><h3>Students</h3><p>Student totals are supplied by department analytics when available.</p><DashboardInfoRows rows={[["Total Students", departmentData?.stats?.totalParticipants?.toLocaleString() || "API needed"], ["Average Attendance", departmentData?.stats?.averageAttendance ? `${Math.round(departmentData.stats.averageAttendance)}%` : "API needed"]]} /></>}
          {departmentSection === "groups" && <><h3>Groups</h3><p>Group administration data is ready for the group API.</p><DashboardInfoRows rows={[["Active Groups", departmentData?.stats?.totalGroupAdmins?.toString() || "API needed"], ["Group Events", String(sourceEvents.length)]]} /></>}
          {departmentSection === "analytics" && <><h3>Analytics</h3><DashboardDonut value={departmentData?.stats?.averageAttendance ? `${Math.round(departmentData.stats.averageAttendance)}%` : "—"} label="Attendance" /></>}
          {departmentSection === "notifications" && <><h3>Notifications</h3><p>Notification data is not available in the current API.</p><span className="dashboard-api-note">API needed</span></>}
          {departmentSection === "settings" && <><h3>Settings</h3><p>Department settings panel ready for integration.</p><span className="dashboard-api-note">API needed</span></>}
        </div>
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
        ) : role === "student" ? (
          <DashboardCard>
            <DashboardCardHeader title="Student Participation" />
            <DashboardDonut value={studentAttendanceRate === null ? "—" : `${studentAttendanceRate}%`} label={studentAttendanceRate === null ? "API needed" : "Participation Rate"} segments={studentAttendanceRate === null ? [0, 0, 0, 0, 0] : [studentAttendanceRate, 100 - studentAttendanceRate, 0, 0, 0]} />
          </DashboardCard>
        ) : (
          <DashboardCard>
            <DashboardCardHeader title={role === "department" ? "Events by Type" : "Event Participation"} />
            <DashboardDonut value={sourceEvents.length} label={role === "department" ? "Events" : "Members"} segments={[sourceEvents.filter((event) => event.category === "Technical").length, sourceEvents.filter((event) => event.category === "Workshop").length, sourceEvents.filter((event) => event.category === "Seminar").length, sourceEvents.filter((event) => event.category === "Cultural").length, sourceEvents.filter((event) => event.category === "Other").length]} />
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
        ) : role === "department" ? (
          <DashboardCard>
            <DashboardCardHeader title="Student Participation" />
            <DashboardDonut value={departmentData?.stats?.averageAttendance ? `${Math.round(departmentData.stats.averageAttendance)}%` : "—"} label={departmentData?.stats ? "Participation Rate" : "API needed"} segments={departmentData?.stats ? [Math.round(departmentData.stats.averageAttendance), 100 - Math.round(departmentData.stats.averageAttendance), 0, 0, 0] : [0, 0, 0, 0, 0]} />
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
        ) : role === "department" ? (
          <div className="dashboard-stack">
            <DashboardQuickActions actions={view.quick} />
            <DashboardCard>
              <DashboardCardHeader title="Department Info" />
              <div className="dashboard-info"><p><span>{departmentData?.name || "Department"}</span><b>{departmentData?.code || "—"}</b></p><p><span>Total Students</span><b>{departmentData?.stats?.totalParticipants?.toLocaleString() || "—"}</b></p><p><span>Active Groups</span><b>{departmentData?.stats?.totalGroupAdmins ?? "—"}</b></p></div>
            </DashboardCard>
          </div>
        ) : (
          <DashboardCard>
          <DashboardCardHeader title="Group Info" />
          <div className="dashboard-info"><p><span>Web Development Club</span><b>API needed</b></p><p><span>Total Members</span><b>API needed</b></p><p><span>Group Events</span><b>{sourceEvents.length}</b></p></div>
        </DashboardCard>
        )}
      </DashboardSection>
    </>
  );
}
