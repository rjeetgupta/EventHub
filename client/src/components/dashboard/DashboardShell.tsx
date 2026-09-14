"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  CalendarDays,
  ChevronDown,
  ChevronRight,
  CircleUserRound,
  Home,
  LayoutGrid,
  Menu,
  Moon,
  Search,
  Settings,
  Users,
  BarChart3,
  ClipboardList,
  Building2,
  Heart,
  LogOut,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useState } from "react";
import "./DashboardShell.module.css";
import ThemeToggler from "@/components/common/ThemeToggle";

export type DashboardRole = "student" | "group" | "department" | "admin";

const roleConfig = {
  student: {
    name: "Sneha Patel",
    type: "Student",
    context: "EventHub",
    welcome: "Explore, learn and be part of amazing events.",
    nav: [
      ["Dashboard", "/student", Home],
      ["Explore Events", "#", LayoutGrid],
      ["My Registrations", "/student", ClipboardList],
      ["My Bookmarks", "#", Heart],
      ["Clubs & Groups", "#", Users],
      ["Notifications", "#", Bell],
      ["Profile", "#", CircleUserRound],
      ["Settings", "#", Settings],
    ],
  },
  group: {
    name: "Rohit Verma",
    type: "Group Admin",
    context: "Web Development Club",
    welcome: "Here's what's happening with your group - Web Development Club.",
    nav: [
      ["Dashboard", "/group-admin", Home],
      ["Events", "#", CalendarDays],
      ["Registrations", "#", ClipboardList],
      ["Members", "#", Users],
      ["Analytics", "#", BarChart3],
      ["Settings", "#", Settings],
    ],
  },
  department: {
    name: "Dr. Sharma",
    type: "Department Admin",
    context: "Computer Science",
    welcome: "Here's what's happening in your Computer Science Department.",
    nav: [
      ["Dashboard", "/department", Home],
      ["Events", "#", CalendarDays],
      ["Registrations", "#", ClipboardList],
      ["Students", "#", Users],
      ["Groups", "#", Users],
      ["Analytics", "#", BarChart3],
      ["Notifications", "#", Bell],
      ["Settings", "#", Settings],
    ],
  },
  admin: {
    name: "Admin",
    type: "Super Admin",
    context: "EventHub",
    welcome: "Here's an overview of what's happening across the college.",
    nav: [
      ["Dashboard", "/admin", Home],
      ["Events", "#", CalendarDays],
      ["Departments", "#", Building2],
      ["Groups", "#", LayoutGrid],
      ["Users", "#", Users],
      ["Registrations", "#", ClipboardList],
      ["Analytics", "#", BarChart3],
      ["Notifications", "#", Bell],
      ["Settings", "#", Settings],
    ],
  },
} as const;

export function DashboardShell({
  children,
  role,
}: {
  children: React.ReactNode;
  role?: DashboardRole;
}) {
  const pathname = usePathname();
  const activeRole: DashboardRole =
    role ??
    (pathname.includes("student")
      ? "student"
      : pathname.includes("group-admin")
        ? "group"
        : pathname.includes("department")
          ? "department"
          : "admin");
  const config = roleConfig[activeRole];
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div
      className={`dashboard-app ${collapsed ? "dashboard-app--collapsed" : ""}`}
    >
      <header className="dashboard-header">
        <div className="dashboard-brand">
          <span className="dashboard-brand__mark">
            <CalendarDays size={25} />
          </span>
          <span>
            <strong>
              Event<span>Hub</span>
            </strong>
            <small>Connect · Collaborate · Celebrate</small>
          </span>
        </div>
        <button
          className="dashboard-menu"
          onClick={() => setCollapsed((v) => !v)}
          aria-label="Toggle sidebar"
        >
          <Menu size={21} />
        </button>
        <label className="dashboard-search">
          <Search size={18} />
          <input placeholder="Search events, clubs, or keywords..." />
        </label>
        <div className="dashboard-header__actions">
          <ThemeToggler />
          <button className="dashboard-icon">
            <Bell size={19} />
            <i>3</i>
          </button>
          <div className="dashboard-user">
            <span className="dashboard-avatar">{config.name[0]}</span>
            <span>
              <strong>{config.name}</strong>
              <small>{config.type}</small>
            </span>
            <ChevronDown size={16} />
          </div>
        </div>
      </header>
      <aside className="dashboard-sidebar">
        <div className="dashboard-context">
          <span className="dashboard-context__icon">
            <Users size={19} />
          </span>
          <span>
            <strong>{config.context}</strong>
            <small>{config.type}</small>
          </span>
        </div>
        <nav>
          {config.nav.map(([label, href, Icon]) => (
            <Link
              key={label}
              href={href}
              className={pathname === href ? "is-active" : ""}
            >
              <Icon size={19} />
              <span>{label}</span>
              {label === "Notifications" && <b>3</b>}
            </Link>
          ))}
        </nav>
        <div className="dashboard-promo">
          <strong>
            {activeRole === "student"
              ? "Learn\nParticipate\nGrow"
              : activeRole === "admin"
                ? "Events Build\nBetter Communities"
                : "Build Skills\nCreate Opportunities"}
          </strong>
          <p>
            {activeRole === "student"
              ? "Be a part of something greater."
              : "Empowering students through meaningful experiences."}
          </p>
        </div>
        <div className="dashboard-version">
          <span>
            <LogOut size={16} /> EventHub v1.0.0
          </span>
          <ChevronRight size={16} />
        </div>
      </aside>
      <main className="dashboard-main">
        <div className="dashboard-welcome">
          <div>
            <h1>Good morning, {config.name}!</h1>
            <p>{config.welcome}</p>
          </div>
          <div className="dashboard-quote">
            “Great events create great opportunities.”<small>— EventHub</small>
          </div>
          <div className="dashboard-date">
            <CalendarDays size={21} />
            <span>
              Tue, Sep 9, 2025<small>Make it a great day!</small>
            </span>
          </div>
        </div>
        {children}
      </main>
    </div>
  );
}

export function DashboardCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`dashboard-card ${className}`}>{children}</section>
  );
}
export function DashboardCardHeader({
  title,
  action = "View All",
}: {
  title: string;
  action?: string;
}) {
  return (
    <div className="dashboard-card__header">
      <h2>{title}</h2>
      {action && (
        <button>
          {action} <ChevronRight size={14} />
        </button>
      )}
    </div>
  );
}
export function DashboardStat({
  icon: Icon,
  value,
  label,
  trend = "+12%",
}: {
  icon: LucideIcon;
  value: string | number;
  label: string;
  trend?: string;
}) {
  return (
    <DashboardCard className="dashboard-stat">
      <span className="dashboard-stat__icon">
        <Icon size={25} />
      </span>
      <div>
        <strong>{value}</strong>
        <span>{label}</span>
        <small>{trend}</small>
      </div>
      <ChevronRight className="dashboard-stat__arrow" size={18} />
    </DashboardCard>
  );
}

export function DashboardSection({
  children,
  columns = "1fr",
}: {
  children: React.ReactNode;
  columns?: string;
}) {
  return (
    <div
      className="dashboard-section"
      style={{ "--dashboard-columns": columns } as React.CSSProperties}
    >
      {children}
    </div>
  );
}

export function DashboardProgress({
  label,
  value,
  color = "orange",
}: {
  label: string;
  value: number;
  color?: "orange" | "green" | "blue";
}) {
  return (
    <div className="dashboard-progress">
      <div>
        <span>{label}</span>
        <strong>{value}%</strong>
      </div>
      <div
        className={`dashboard-progress__track dashboard-progress__track--${color}`}
      >
        <i style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

export function DashboardChart({
  values = [28, 42, 34, 55, 47, 69, 61],
  labels = ["Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"],
  type = "line",
}: {
  values?: number[];
  labels?: string[];
  type?: "line" | "bar";
}) {
  const max = Math.max(...values, 1);
  return (
    <div className={`dashboard-chart dashboard-chart--${type}`}>
      <div className="dashboard-chart__plot">
        {values.map((value, index) => (
          <span
            key={index}
            style={{ height: `${Math.max(8, (value / max) * 88)}%` }}
          >
            <i />
          </span>
        ))}
      </div>
      <div className="dashboard-chart__labels">
        {labels.map((label) => (
          <small key={label}>{label}</small>
        ))}
      </div>
    </div>
  );
}

export function DashboardDonut({ value = 48, label = 'Events', segments = [40, 25, 18, 10, 7] }: { value?: string | number; label?: string; segments?: number[] }) { return <div className="dashboard-donut-wrap"><div className="dashboard-donut"><div><strong>{value}</strong><small>{label}</small></div></div><div className="dashboard-legend">{['Technical', 'Cultural', 'Sports', 'Workshop', 'Others'].map((item, index) => <span key={item}><i className={`legend-${index}`} />{item}<b>{segments[index] ?? 0}</b></span>)}</div></div>; }
export function DashboardSystemOverview({ active = 0, draft = 0, completed = 0, users = '—' }: { active?: number; draft?: number; completed?: number; users?: string | number }) { return <div className="dashboard-system"><p><i className="is-green" />Active Events <b>{active}</b></p><p><i className="is-yellow" />Draft Events <b>{draft}</b></p><p><i className="is-gray" />Completed Events <b>{completed}</b></p><p><i className="is-orange" />Total Users <b>{users}</b></p></div>; }

export type DashboardEvent = {
  title: string;
  date: string;
  venue: string;
  status?: string;
  image?: string;
};
export function DashboardEventList({
  events,
  title = "Upcoming Events",
}: {
  events: DashboardEvent[];
  title?: string;
}) {
  return (
    <DashboardCard>
      <DashboardCardHeader title={title} />
      <div className="dashboard-list">
        {events.map((event, index) => (
          <div className="dashboard-event" key={`${event.title}-${index}`}>
            <div
              className="dashboard-event__image"
              style={
                event.image
                  ? { backgroundImage: `url(${event.image})` }
                  : undefined
              }
            >
              <CalendarDays size={20} />
            </div>
            <div className="dashboard-event__body">
              <strong>{event.title}</strong>
              <span>
                <CalendarDays size={13} /> {event.date} <span>·</span>{" "}
                {event.venue}
              </span>
            </div>
            {event.status && (
              <em
                className={`dashboard-status dashboard-status--${event.status.toLowerCase().replace(" ", "-")}`}
              >
                {event.status}
              </em>
            )}
          </div>
        ))}
      </div>
    </DashboardCard>
  );
}

export function DashboardQuickActions({
  actions,
}: {
  actions: { label: string; icon: LucideIcon }[];
}) {
  return (
    <DashboardCard>
      <DashboardCardHeader title="Quick Actions" action="" />
      <div className="dashboard-actions">
        {actions.map(({ label, icon: Icon }) => (
          <button
            key={label}
            onClick={() => window.dispatchEvent(new CustomEvent("dashboard-action", { detail: label }))}
          >
            <Icon size={17} />
            {label}
            <ChevronRight size={15} />
          </button>
        ))}
      </div>
    </DashboardCard>
  );
}

export function DashboardRegistrationTable({
  rows,
}: {
  rows: { name: string; event: string; time: string }[];
}) {
  return (
    <DashboardCard>
      <DashboardCardHeader title="Recent Registrations" />
      <div className="dashboard-table">
        <div className="dashboard-table__head">
          <span>Student</span>
          <span>Event</span>
          <span>Time</span>
        </div>
        {rows.map((row, index) => (
          <div className="dashboard-table__row" key={`${row.name}-${index}`}>
            <span>
              <i>{row.name.slice(0, 2).toUpperCase()}</i>
              {row.name}
            </span>
            <span>{row.event}</span>
            <span>{row.time}</span>
          </div>
        ))}
      </div>
    </DashboardCard>
  );
}
