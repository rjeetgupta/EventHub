/**
 * ============================================================================
 * DEPARTMENT TYPES - PRISMA BASED
 * ============================================================================
 */

import {
  RoleType,
  PermissionType,
  RegistrationStatus,
} from "../../generated/prisma/enums.js";
import { Permission, UserRole } from "./common.types.js";

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
  /** Counted in calculateDepartmentStats; optional because some responses omit it. */
  pendingApproval?: number;
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
  /** Queried window (ISO bounds + human label shown in the header chip). */
  range: {
    start: string;
    end: string;
    label: string;
  };
  overview: {
    totalEvents: number;
    totalRegistrations: number;
    uniqueStudents: number;
    activeGroups: number;
    /** Mean registrations/capacity across events in range (0-100). */
    fillRate: number;
    totalParticipants: number;
    averageAttendance: number;
    completionRate: number;
  };
  /** Percent change vs the preceding window of equal length, per metric. */
  trends: {
    totalEvents: number;
    totalRegistrations: number;
    uniqueStudents: number;
    activeGroups: number;
    fillRate: number;
  };
  monthlyTrend: Array<{
    month: string;
    /** yyyy-mm bucket key, lets the UI filter rolling windows by calendar year. */
    monthKey: string;
    registrations: number;
    students: number;
    attendees: number;
  }>;
  eventsByMonth: Array<{
    month: string;
    monthKey: string;
    count: number;
  }>;
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
  topEvents: Array<{
    id: string;
    title: string;
    registrations: number;
    capacity: number;
  }>;
  topGroups: Array<{
    id: string;
    name: string;
    members: number;
    events: number;
  }>;
  recentEvents: Array<{
    id: string;
    title: string;
    date: string;
    status: string;
  }>;
  insights: Array<{
    icon: string;
    text: string;
  }>;
  /** Kept for backward compatibility with earlier consumers. */
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
// REGISTRATIONS TYPES
// ============================================================================

/**
 * UI status buckets for the department registrations screen. The Prisma
 * schema only has REGISTERED | CANCELLED | ATTENDED | ABSENT (no pending or
 * waitlisted states), so the UI groups them:
 *   REGISTERED / ATTENDED → CONFIRMED, CANCELLED → CANCELLED, ABSENT → OTHERS.
 */
export type DerivedRegistrationStatus = "CONFIRMED" | "CANCELLED" | "OTHERS";

export interface DepartmentRegistrationsFiltersDto {
  eventId?: string;
  status?: DerivedRegistrationStatus;
  /** Matches student name, student email or event title. */
  search?: string;
  /** GroupAdmin (membership admin) user id. */
  group?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
  /** Sort direction for registeredAt. */
  sortOrder?: "asc" | "desc";
}

export interface DepartmentRegistrationRow {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userAvatar?: string;
  studentID?: string;
  eventId: string;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  /** Derived from the student's GroupMembership admin (no direct link in schema). */
  group: { id: string; name: string } | null;
  status: DerivedRegistrationStatus;
  rawStatus: RegistrationStatus;
  registeredAt: string;
  attendedAt: string | null;
  cancelledAt: string | null;
}

export interface DepartmentRegistrationsResponse {
  data: DepartmentRegistrationRow[];
  /** Department-wide aggregates, intentionally unaffected by table filters. */
  summary: {
    totalRegistrations: number;
    uniqueStudents: number;
    /** Distinct events that have at least one registration. */
    events: number;
    /** Events that received their first registrations this calendar month. */
    newEventsThisMonth: number;
    confirmed: number;
    attended: number;
    cancelled: number;
    others: number;
    /** Percent change vs the trailing 30-day window. */
    trends: {
      totalRegistrations: number;
      uniqueStudents: number;
      attended: number;
      cancelled: number;
    };
    /** Group filter options (membership admins of registered students). */
    groups: { id: string; name: string }[];
    topEvents: {
      id: string;
      title: string;
      registrations: number;
      capacity: number;
    }[];
    recentRegistrations: {
      id: string;
      userName: string;
      userAvatar?: string;
      eventId: string;
      eventTitle: string;
      registeredAt: string;
    }[];
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ============================================================================
// STUDENTS TYPES
// ============================================================================

/**
 * Participation tier shown on the students screen. Derived (no column):
 *   - INACTIVE: deactivated account, or no department registration in the
 *     trailing ~180 days
 *   - TOP_CONTRIBUTOR: 5+ department events joined
 *   - ACTIVE: everything else
 */
export type DepartmentStudentStatus = "ACTIVE" | "INACTIVE" | "TOP_CONTRIBUTOR";

export interface DepartmentStudentsFiltersDto {
  search?: string;
  year?: string;
  section?: string;
  /** "active" | "inactive" | "top" (participation status filter). */
  status?: "active" | "inactive" | "top";
  page?: number;
  limit?: number;
  /** Sort by eventsJoined desc, or by name. */
  sortBy?: "eventsJoined" | "name" | "joinedAt";
  sortOrder?: "asc" | "desc";
}

export interface DepartmentStudentRow {
  id: string;
  fullName: string;
  email: string;
  avatar?: string;
  studentID?: string;
  /** Derived from the admission year in studentID (falls back to joined year). */
  year: string;
  /** Stable A/B/C bucket derived from the roll number (presentation only). */
  section: string;
  /** Non-cancelled registrations across the department's events (all time). */
  eventsJoined: number;
  /** Same, but registered within the trailing semester window (~6 months). */
  eventsJoinedThisSemester: number;
  lastRegisteredAt: string | null;
  status: DepartmentStudentStatus;
  isActive: boolean;
  joinedAt: string;
}

export interface DepartmentStudentsResponse {
  data: DepartmentStudentRow[];
  pagination: {
    page: number;
    limit: number;
    /** Count AFTER search/year/section/status filters. */
    total: number;
    totalPages: number;
  };
  /** Department-wide aggregates, unaffected by table filters. */
  summary: {
    totalStudents: number;
    activeStudents: number;
    eventParticipants: number;
    topContributors: number;
    /** Percent change vs the preceding ~6-month window. */
    trends: {
      totalStudents: number;
      activeStudents: number;
      eventParticipants: number;
      topContributors: number;
    };
    /** Students per derived year, for the overview donut. */
    yearDistribution: { year: string; count: number }[];
    /**
     * Students per events-joined bucket [0, 1-2, 3-5, 6-10, 10+],
     * all-time and within the trailing semester window.
     */
    participation: {
      allTime: number[];
      thisSemester: number[];
    };
    /** Top 5 students by department events joined. */
    topParticipants: {
      id: string;
      fullName: string;
      email: string;
      avatar?: string;
      eventsJoined: number;
    }[];
  };
}

export interface CreateDepartmentStudentDto {
  fullName: string;
  email: string;
  studentID?: string;
  password: string;
  isActive?: boolean;
}

export interface CreatedDepartmentStudent {
  id: string;
  fullName: string;
  email: string;
  studentID?: string;
  isActive: boolean;
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