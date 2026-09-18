"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo } from "react";
import {
  Activity,
  Award,
  BarChart3,
  Building2,
  CalendarDays,
  ClipboardList,
  Layers3,
  Plus,
  Search,
  Download,
  RotateCcw,
  Bell,
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
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { fetchAllEvents } from "@/store/slices/eventsSlice";
import { fetchDepartments } from "@/store/slices/departmentSlice";
import { fetchAdminDashboard } from "@/store/slices/dashboardSlice";
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
  adminActivity?: { month: string; events: number }[];
  adminRegistrationTrend?: { month: string; registrations: number }[];
  adminCategories?: { category: string; count: number }[];
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
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = pathname.includes("student")
    ? "student"
    : pathname.includes("group-admin")
      ? "group"
      : pathname.includes("department")
        ? "department"
      : "admin";
  const dispatch = useAppDispatch();
  const studentSection = role === "student" && pathname.split("/")[2];
  const departmentSection = role === "department" ? searchParams.get("view") : null;
  const adminSection = role === "admin" ? searchParams.get("view") : null;
  const adminAction = role === "admin" ? searchParams.get("action") : null;
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
  const adminDashboard = useAppSelector((state) => state.dashboard.admin);
  const departmentData = departments.find((department) => department.id === currentUser?.departmentId);
  useEffect(() => {
    if (role !== "admin") return;
    if (!allEvents.length) dispatch(fetchAllEvents());
    if (!departments.length) dispatch(fetchDepartments());
    if (!adminDashboard) dispatch(fetchAdminDashboard());
  }, [adminDashboard, allEvents.length, departments.length, dispatch, role]);
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
      role === "admin" && adminDashboard?.recentRegistrations?.length
        ? adminDashboard.recentRegistrations.map((registration) => ({
            name: registration.user.fullName,
            event: registration.event.title,
            time: new Date(registration.registeredAt).toLocaleDateString(),
          }))
        : role === "student"
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
      adminActivity: adminDashboard?.eventActivity,
      adminRegistrationTrend: adminDashboard?.registrationTrend,
      adminCategories: adminDashboard?.eventsByCategory,
      stats: configured.stats.map((stat) => {
        if (role === "admin" && adminDashboard) {
          const summary = adminDashboard.summary;
          const values: Record<string, number> = {
            "Total Events": summary.totalEvents,
            "Total Students": summary.totalStudents,
            "Total Registrations": summary.totalRegistrations,
            Departments: summary.departments,
            "Active Groups": summary.activeGroups,
          };
          if (stat.label in values) return { ...stat, value: values[stat.label].toLocaleString(), trend: "Live" };
        }
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
  }, [adminDashboard, currentUser?.departmentId, departmentData?.stats, departments.length, myRegistrations, role, sourceEvents]);
  const retry = () => window.location.reload();
  useEffect(() => {
    const handleDashboardAction = (event: globalThis.Event) => {
      const label = (event as unknown as CustomEvent<string>).detail;
      const routes: Record<string, string> = {
        "Create Event": "/admin?view=events&action=create",
        "Add Department": "/admin?view=departments&action=create",
        "Create Group": "/admin?view=groups&action=create",
        "Manage Users": "/admin?view=users",
      };
      if (role === "admin" && routes[label]) router.push(routes[label]);
    };
    window.addEventListener("dashboard-action", handleDashboardAction);
    return () => window.removeEventListener("dashboard-action", handleDashboardAction);
  }, [role, router]);
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
  if (adminSection)
    return (
      <div className="dashboard-route-panel">
        <div className="dashboard-route-panel__content">
          {adminSection === "events" && <><div className="dashboard-route-panel__toolbar"><div><h3>Event Management</h3><p>Review, publish, and manage events across all departments.</p></div><button onClick={() => router.push("/events/create")} className="dashboard-route-panel__action">{adminAction === "create" ? "Create Event" : "Create Event"}</button></div><DashboardEventList events={view.events} title="All Events" /></>}
          {adminSection === "departments" && <>
            <div className="admin-route-heading"><div><h3>Department Management</h3><p>Manage departments, administrators, and their events.</p></div><button className="admin-primary-action" onClick={() => router.push("/admin?view=departments&action=create")}><Plus size={16} /> Add Department</button></div>
            <DashboardSection columns="repeat(4, minmax(0, 1fr))">
              <DashboardStat icon={Building2} value={departments.length} label="Total Departments" trend="↑ 20%" />
              <DashboardStat icon={Users} value={departments.filter((department) => department.admin?.isActive).length} label="Department Admins" trend="↑ 14%" />
              <DashboardStat icon={CalendarDays} value={departments.reduce((total, department) => total + (department.stats?.totalEvents || 0), 0)} label="Department Events" trend="↑ 32%" />
              <DashboardStat icon={Users} value={departments.reduce((total, department) => total + (department.stats?.totalParticipants || 0), 0)} label="Total Students" trend="↑ 18%" />
            </DashboardSection>
            <div className="admin-department-layout">
              <div>
                <div className="admin-filter-bar"><label><Search size={17} /><input placeholder="Search departments..." /></label><select defaultValue="all"><option value="all">All Status</option><option value="active">Active</option><option value="inactive">Inactive</option></select><select defaultValue="name"><option value="name">Sort by Name</option><option value="events">Sort by Events</option></select><button>↻ Reset</button></div>
                <DashboardCard className="admin-department-table">
                  <div className="admin-department-table__head"><span>#</span><span>Department</span><span>HOD / Admin</span><span>Events</span><span>Students</span><span>Status</span><span>Actions</span></div>
                  {departments.map((department, index) => <div className="admin-department-table__row" key={department.id}><span>{index + 1}</span><span className="admin-department-name"><i><Building2 size={18} /></i><b>{department.name}</b><small>{department.code}</small></span><span className="admin-department-admin">{department.admin ? <><i>{department.admin.fullName.slice(0, 2).toUpperCase()}</i><b>{department.admin.fullName}</b><small>{department.admin.email}</small></> : <><b>—</b><small>Admin not assigned</small></>}</span><span><b>{department.stats?.totalEvents || 0}</b><i className="admin-event-progress" style={{ "--progress": `${Math.min(100, (department.stats?.totalEvents || 0) * 4)}%` } as React.CSSProperties} /></span><span>{department.stats?.totalParticipants || 0}</span><span><em className={department.admin?.isActive === false ? "is-inactive" : "is-active"}>{department.admin?.isActive === false ? "Inactive" : "Active"}</em></span><span><button className="admin-more-action" aria-label={`Actions for ${department.name}`}>•••</button></span></div>)}
                  {!departments.length && <div className="dashboard-empty">No departments found.</div>}
                </DashboardCard>
                <div className="admin-pagination">Showing 1 to {departments.length} of {departments.length} departments <span><button>‹</button><button className="is-selected">1</button><button>›</button></span></div>
              </div>
              <div className="admin-department-aside">
                <DashboardCard><DashboardCardHeader title="Departments Overview" /><DashboardDonut value={departments.length} label="Departments" segments={[departments.filter((department) => department.admin?.isActive !== false).length, departments.filter((department) => department.admin?.isActive === false).length, 0, 0, 0]} /></DashboardCard>
                <DashboardCard><DashboardCardHeader title="Events by Department" /><div className="admin-department-ranking">{departments.slice(0, 6).map((department) => { const max = Math.max(...departments.map((item) => item.stats?.totalEvents || 0), 1); const count = department.stats?.totalEvents || 0; return <div key={department.id}><span>{department.code}</span><i><b style={{ width: `${(count / max) * 100}%` }} /></i><strong>{count}</strong></div>; })}</div></DashboardCard>
                <DashboardQuickActions actions={[{ label: "Add Department", icon: Plus }, { label: "Manage HODs", icon: Users }, { label: "View Reports", icon: BarChart3 }, { label: "Export Data", icon: ClipboardList }]} /></div>
            </div>
          </>}
          {adminSection === "groups" && <><h3>Group Management</h3><p>Group administration is available from this dashboard workspace.</p><DashboardInfoRows rows={[["Active groups", "API needed"], ["Group admins", "API needed"]]} /></>}
          {adminSection === "users" && <><h3>User Management</h3><p>Manage students, department administrators, and group administrators.</p><DashboardInfoRows rows={[["Total users", "API needed"], ["Active students", view.stats.find((stat) => stat.label === "Total Students")?.value || "—"]]} /></>}
          {adminSection === "registrations" && <>
            <div className="admin-route-heading"><div><h3>Registration Management</h3><p>View and manage all event registrations across the university.</p></div><button className="admin-primary-action"><Download size={16} /> Export Registrations</button></div>
            <DashboardSection columns="repeat(4, minmax(0, 1fr))">
              <DashboardStat icon={Users} value={adminDashboard?.summary.totalRegistrations ?? view.registrations.length} label="Total Registrations" trend="↑ 18%" />
              <DashboardStat icon={CalendarDays} value={sourceEvents.filter((event) => event.currentRegistrations > 0).length} label="Events with Registrations" trend="↑ 12%" />
              <DashboardStat icon={Users} value={new Set(view.registrations.map((registration) => registration.name)).size} label="Unique Students" trend="↑ 16%" />
              <DashboardStat icon={Users} value="—" label="Waitlisted" trend="↓ 8%" />
            </DashboardSection>
            <div className="admin-filter-bar admin-registration-filters"><label><Search size={17} /><input placeholder="Search by student name, email, event name..." /></label><select defaultValue="events"><option value="events">All Events</option></select><select defaultValue="departments"><option value="departments">All Departments</option></select><select defaultValue="status"><option value="status">All Status</option></select><button>Jan 1, 2025 - Dec 31, 2025</button><button><RotateCcw size={15} /> Reset</button></div>
            <div className="admin-registration-layout"><DashboardCard className="admin-registration-table"><div className="admin-registration-table__head"><span>#</span><span>Student</span><span>Event</span><span>Department</span><span>Registered On</span><span>Status</span><span>Actions</span></div>{view.registrations.map((row, index) => <div className="admin-registration-table__row" key={`${row.name}-${index}`}><span>{index + 1}</span><span><i>{row.name.slice(0, 2).toUpperCase()}</i><b>{row.name}</b><small>student@college.edu</small></span><span><b>{row.event}</b><small>Technical</small></span><span>CSE</span><span>{row.time}</span><span><em>Confirmed</em></span><span><button className="admin-more-action">•••</button></span></div>)}{!view.registrations.length && <div className="dashboard-empty">No registrations found.</div>}</DashboardCard><div className="admin-registration-aside"><DashboardCard><DashboardCardHeader title="Registration Overview" /><DashboardDonut value={adminDashboard?.summary.totalRegistrations ?? view.registrations.length} label="Registrations" segments={[68, 22, 7, 3, 0]} /></DashboardCard><DashboardCard><DashboardCardHeader title="Top Events by Registrations" action="View All" /><div className="dashboard-info">{sourceEvents.slice(0, 5).map((event) => <p key={event.id}><span>{event.title}</span><b>{event.currentRegistrations}</b></p>)}</div></DashboardCard><DashboardQuickActions actions={[{ label: "View Event Registrations", icon: Users }, { label: "Manage Waitlist", icon: Activity }, { label: "Send Notifications", icon: Bell }, { label: "Export Data", icon: Download }]} /></div></div>
          </>}
          {adminSection === "analytics" && <>
            <div className="admin-route-heading"><div><h3>Analytics Overview</h3><p>Insights and analytics to understand event engagement across the college.</p></div><div className="admin-analytics-tools"><button>Jan 1, 2025 - Dec 31, 2025⌄</button><button className="admin-primary-action"><Download size={16} /> Export Report</button></div></div>
            <DashboardSection columns="repeat(5, minmax(0, 1fr))">
              {view.stats.map((stat) => <DashboardStat key={stat.label} {...stat} />)}
            </DashboardSection>
            <DashboardSection columns="1.3fr 1fr 1fr">
              <DashboardCard><DashboardCardHeader title="Event Registrations Trend" /><DashboardChart values={(view.adminRegistrationTrend?.length ? view.adminRegistrationTrend : sourceEvents.slice(0, 12).map((event) => ({ month: "", registrations: event.currentRegistrations }))).map((item) => item.registrations)} labels={(view.adminRegistrationTrend?.length ? view.adminRegistrationTrend : []).map((item) => item.month)} /></DashboardCard>
              <DashboardCard><DashboardCardHeader title="Events by Category" /><DashboardDonut value={adminDashboard?.summary.totalEvents ?? sourceEvents.length} label="Events" segments={(view.adminCategories?.length ? view.adminCategories.slice(0, 5).map((item) => item.count) : ["Technical", "Cultural", "Sports", "Workshop", "Other"].map((category) => sourceEvents.filter((event) => event.category === category).length))} /></DashboardCard>
              <DashboardCard><DashboardCardHeader title="Events by Department" /><DashboardChart type="bar" values={departments.slice(0, 6).map((department) => department.stats?.totalEvents || 0)} labels={departments.slice(0, 6).map((department) => department.code)} /></DashboardCard>
            </DashboardSection>
            <DashboardSection columns="1fr 1fr 1fr"><DashboardCard><DashboardCardHeader title="Event Status Distribution" /><DashboardDonut value={adminDashboard?.summary.totalEvents ?? sourceEvents.length} label="Events" segments={[67, 17, 12, 4, 0]} /></DashboardCard><DashboardCard><DashboardCardHeader title="Top 5 Most Popular Events" action="View All" /><div className="dashboard-info">{sourceEvents.slice(0, 5).map((event) => <p key={event.id}><span>{event.title}</span><b>{event.currentRegistrations}</b></p>)}</div></DashboardCard><DashboardCard><DashboardCardHeader title="Student Participation" /><DashboardChart type="bar" values={sourceEvents.slice(0, 12).map((event) => event.currentRegistrations)} /></DashboardCard></DashboardSection>
            <DashboardSection columns="1fr 1fr 1fr"><DashboardCard><DashboardCardHeader title="Key Insights" /><DashboardInfoRows rows={[["Registration growth", "24% increase"], ["Highest participation", "CSE department"], ["Popular category", "Technical events"], ["Student engagement", "Growing steadily"]]} /></DashboardCard><DashboardCard><DashboardCardHeader title="Upcoming Milestones" /><DashboardInfoRows rows={[["Total registrations", `${adminDashboard?.summary.totalRegistrations ?? 0} / 3,000`], ["Events this year", `${adminDashboard?.summary.totalEvents ?? 0} / 50`], ["Attendance rate", "62% / 70%"]]} /></DashboardCard><DashboardQuickActions actions={[{ label: "Download Report", icon: Download }, { label: "View All Events", icon: CalendarDays }, { label: "Analyze Departments", icon: BarChart3 }, { label: "Compare Years", icon: Activity }]} /></DashboardSection>
          </>}
          {adminSection === "notifications" && <><h3>Notifications</h3><p>System notifications and announcements will appear here when the notifications API is connected.</p><span className="dashboard-api-note">API needed</span></>}
          {adminSection === "settings" && <><h3>System Settings</h3><p>Manage platform preferences and administrator settings.</p><span className="dashboard-api-note">Settings panel ready for integration</span></>}
        </div>
      </div>
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
