import axiosInstance from '@/api/axios';
import type { ApiResponse } from '@/lib/types/common.types';

export interface DashboardTrendPoint {
  month: string;
  count?: number;
  events?: number;
  registrations?: number;
}

export interface DashboardUpcomingEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  venue: string | null;
  link?: string | null;
  mode?: string;
  status?: string;
  department?: string;
  currentRegistrations?: number;
  maxCapacity?: number;
}

export interface DashboardRecentRegistration {
  id: string;
  registeredAt: string;
  user: { id: string; fullName: string; avatar: string | null };
  event: { id: string; title: string; department?: { name: string } };
}

export interface AdminDashboardData {
  summary: {
    totalEvents: number;
    totalStudents: number;
    totalRegistrations: number;
    departments: number;
    activeGroups: number;
  };
  eventActivity: { month: string; events: number }[];
  registrationTrend: { month: string; registrations: number }[];
  eventsByCategory: { category: string; count: number }[];
  eventStatus: { active: number; draft: number; completed: number };
  upcomingEvents: DashboardUpcomingEvent[];
  recentRegistrations: DashboardRecentRegistration[];
}

export interface DepartmentDashboardData {
  department: { id: string; name: string; code: string; description: string | null } | null;
  summary: {
    totalEvents: number;
    totalStudents: number;
    activeGroups: number;
    totalRegistrations: number;
    activeEvents: number;
    draftEvents: number;
    completedEvents: number;
    participationRate: number;
    activeParticipants: number;
  };
  eventActivity: { month: string; events: number }[];
  registrationTrend: { month: string; registrations: number }[];
  eventsByType: { category: string; count: number }[];
  upcomingEvents: DashboardUpcomingEvent[];
  recentRegistrations: DashboardRecentRegistration[];
}

export interface GroupDashboardData {
  group: { name: string; department: string | null };
  summary: {
    totalEvents: number;
    totalMembers: number;
    totalRegistrations: number;
    upcomingEvents: number;
    participatedMembers: number;
    notParticipatedMembers: number;
  };
  eventActivity: { month: string; events: number }[];
  registrationTrend: { month: string; registrations: number }[];
  upcomingEvents: DashboardUpcomingEvent[];
  recentRegistrations: DashboardRecentRegistration[];
}

export interface StudentDashboardData {
  student: { fullName: string | null; studentID: string | null; department: string | null };
  summary: {
    totalRegistrations: number;
    attendedEvents: number;
    upcomingRegistered: number;
    bookmarkedEvents: number;
    clubsJoined: number;
  };
  recommendedEvents: {
    id: string;
    title: string;
    description: string;
    date: string;
    time: string;
    venue: string | null;
    mode: string;
    category: string;
    currentRegistrations: number;
    maxCapacity: number;
    department: { name: string };
  }[];
  upcomingEvents: {
    registrationId: string;
    status: string;
    event: { id: string; title: string; date: string; time: string; venue: string | null; mode: string };
  }[];
  announcements: { id: string; title: string; createdAt: string; category: string; department: string }[];
  registeredEventIds: string[];
  popularClubs: { id: string; name: string; memberCount: number; isMember: boolean }[];
}

export type DashboardDataByRole = {
  admin: AdminDashboardData;
  department: DepartmentDashboardData;
  group: GroupDashboardData;
  student: StudentDashboardData;
};

export type DashboardRole = keyof DashboardDataByRole;

const ENDPOINTS: Record<DashboardRole, string> = {
  admin: '/dashboard/admin',
  department: '/dashboard/department',
  group: '/dashboard/group',
  student: '/dashboard/student',
};

class DashboardService {
  async getDashboard<R extends DashboardRole>(role: R): Promise<DashboardDataByRole[R]> {
    const response = await axiosInstance.get<ApiResponse<DashboardDataByRole[R]>>(
      ENDPOINTS[role],
    );
    if (response.data.success && response.data.data) return response.data.data;
    throw new Error(response.data.message || `Failed to fetch ${role} dashboard`);
  }
}

export const dashboardService = new DashboardService();
