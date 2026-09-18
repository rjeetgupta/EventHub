import axiosInstance from '@/api/axios';
import type { ApiResponse } from '@/lib/types/common.types';

export interface AdminDashboardResponse {
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
  upcomingEvents: unknown[];
  recentRegistrations: {
    id: string;
    registeredAt: string;
    user: { id: string; fullName: string; avatar: string | null };
    event: { id: string; title: string; department: { name: string } };
  }[];
}

class DashboardService {
  async getAdminDashboard(): Promise<AdminDashboardResponse> {
    const response = await axiosInstance.get<ApiResponse<AdminDashboardResponse>>('/dashboard/admin');
    if (response.data.success && response.data.data) return response.data.data;
    throw new Error(response.data.message || 'Failed to fetch admin dashboard');
  }
}

export const dashboardService = new DashboardService();
