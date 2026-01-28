/**
 * ============================================================================
 * DEPARTMENT TYPES - PRISMA BASED
 * ============================================================================
 */

import { RoleType, PermissionType } from "../../generated/prisma/enums";
import { Permission, UserRole } from "./common.types";

// ============================================================================
// REQUEST TYPES
// ============================================================================

export interface CreateDepartmentDto {
  name: string;
  code: string;
  description?: string;
  adminEmail: string
  adminPassword: string
  adminFullName: string
}

export interface UpdateDepartmentDto {
  name?: string;
  code?: string;
  description?: string;
}

export interface AssignGroupAdminDto {
  userId: string;
  permissions: Permission[];
}

export interface UpdateGroupAdminPermissionsDto {
  permissions: Permission[];
}

export interface DepartmentFiltersDto {
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: "name" | "code" | "createdAt";
  sortOrder?: "asc" | "desc";
}

export interface GroupAdminFiltersDto {
  search?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

// ============================================================================
// RESPONSE TYPES
// ============================================================================

export interface DepartmentAdminInfo {
  id: string;
  fullName: string;
  email: string;
  avatar?: string;
  isActive: boolean;
  createdAt: string;
}


export interface DepartmentResponse {
  id: string;
  name: string;
  code: string;
  description?: string;
  admin?: DepartmentAdminInfo;
  stats?: DepartmentStats;
  createdAt: string;
  updatedAt: string;
}


export interface CreateDepartmentResponse {
  department: {
    id: string
    name: string
    code: string
    description?: string
    createdAt: string
    updatedAt: string
  }
  departmentAdmin: {
    id: string
    email: string
    fullName: string
  }
}

export interface GroupAdminResponse {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  studentID?: string;
  departmentId: string;
  departmentName: string;
  permissions: Permission[];
  isActive: boolean;
  grantedBy?: string;
  stats?: GroupAdminStats;
  createdAt: string;
  updatedAt: string;
}

export interface DepartmentStats {
  totalEvents: number;
  upcomingEvents: number;
  completedEvents: number;
  totalParticipants: number;
  totalGroupAdmins: number;
  averageAttendance: number;
}

export interface GroupAdminStats {
  totalEventsCreated: number;
  activeEvents: number;
  totalParticipants: number;
}

export interface PermissionDefinition {
  id: string;
  name: Permission;
  description?: string;
  category: PermissionCategory;
  isDefault: boolean;
}

export enum PermissionCategory {
  EVENT_MANAGEMENT = "EVENT_MANAGEMENT",
  PARTICIPANT_MANAGEMENT = "PARTICIPANT_MANAGEMENT",
  ADMIN_MANAGEMENT = "ADMIN_MANAGEMENT",
}

// ============================================================================
// ANALYTICS TYPES
// ============================================================================

export interface DepartmentAnalyticsFiltersDto {
  startDate?: string;
  endDate?: string;
  eventCategory?: string;
  eventStatus?: string;
}

export interface DepartmentAnalytics {
  overview: {
    totalEvents: number;
    totalParticipants: number;
    averageAttendance: number;
    completionRate: number;
    growthRate: number;
  };
  eventBreakdown: {
    byCategory: Array<{
      category: string;
      count: number;
      participants: number;
    }>;
    byStatus: Array<{
      status: string;
      count: number;
    }>;
    byMode: Array<{
      mode: string;
      count: number;
    }>;
  };
  participationTrends: Array<{
    date: string;
    participants: number;
    events: number;
  }>;
  topPerformers: {
    groupAdmins: Array<{
      id: string;
      name: string;
      eventsCreated: number;
      totalParticipants: number;
    }>;
    events: Array<{
      id: string;
      title: string;
      participants: number;
    }>;
  };
  recentActivity: Array<{
    type: string;
    description: string;
    timestamp: string;
    metadata?: Record<string, any>;
  }>;
}

// ============================================================================
// PAGINATED RESPONSES
// ============================================================================

export interface PaginatedDepartmentsResponse {
  data: DepartmentResponse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface PaginatedGroupAdminsResponse {
  data: GroupAdminResponse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ============================================================================
// AUTHENTICATED REQUEST
// ============================================================================

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: UserRole;
  departmentId?: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
      validated?: any;
    }
  }
}