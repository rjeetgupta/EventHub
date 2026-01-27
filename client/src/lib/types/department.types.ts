/**
 * ============================================================================
 * DEPARTMENT TYPE DEFINITIONS
 * ============================================================================
 * 
 * Type definitions for department management:
 * - Department entity types
 * - Group admin management
 * - Permission system
 * - Analytics and statistics
 * 
 * @module types/department.types
 * ============================================================================
 */

import { Permission, UserRole } from './common.types';

// DEPARTMENT ENTITY

/**
 * Department entity
 */
export interface Department {
  id: string;
  name: string;
  code: string; // e.g., "BTECH", "BCA", "MCA"
  description?: string;
  adminId?: string; // Department Admin user ID
  adminName?: string;
  adminEmail?: string;
  logo?: string;
  color?: string; // Brand color for UI
  isActive: boolean;
  settings?: DepartmentSettings;
  stats?: DepartmentStats;
  createdAt: string; // ISO
  updatedAt: string; // ISO
}

/**
 * Department settings and rules
 */
export interface DepartmentSettings {
  requireEventApproval: boolean; // Whether group admin events need approval
  maxEventsPerMonth?: number;
  allowStudentGroupAdmins: boolean; // Whether students can be group admins
  autoApproveEvents: boolean;
  notificationEmail?: string;
  customFields?: Record<string, any>;
}

/**
 * Department statistics
 */
export interface DepartmentStats {
  totalEvents: number;
  upcomingEvents: number;
  completedEvents: number;
  totalParticipants: number;
  totalGroupAdmins: number;
  averageAttendance: number;
  popularCategories?: string[];
}

// GROUP ADMIN MANAGEMENT

/**
 * Group admin details
 */
export interface GroupAdmin {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  departmentId: string;
  departmentName?: string;
  permissions: Permission[];
  isActive: boolean;
  assignedBy?: string; // Department admin who assigned this role
  assignedAt: string; // ISO
  lastActiveAt?: string; // ISO
  stats?: GroupAdminStats;
}

/**
 * Group admin statistics
 */
export interface GroupAdminStats {
  totalEventsCreated: number;
  activeEvents: number;
  totalParticipants: number;
  averageRating?: number;
}

/**
 * Permission definition
 */
export interface PermissionDefinition {
  key: Permission;
  name: string;
  description: string;
  category: 'event_management' | 'participant_management' | 'content_management' | 'analytics';
  isDefault: boolean; // Whether this is granted by default
}

/**
 * Role-based permission template
 */
export interface RolePermissionTemplate {
  role: UserRole;
  defaultPermissions: Permission[];
  allowedPermissions: Permission[]; // All permissions this role can have
}

// REQUEST/RESPONSE TYPES

/**
 * Create department request
 */
export interface CreateDepartmentRequest {
  name: string;
  code: string;
  description?: string;
  logo?: string;
  color?: string;
  settings?: Partial<DepartmentSettings>;
}

/**
 * Update department request
 */
export interface UpdateDepartmentRequest {
  name?: string;
  code?: string;
  description?: string;
  logo?: string;
  color?: string;
  isActive?: boolean;
  settings?: Partial<DepartmentSettings>;
}

/**
 * Assign group admin request
 */
export interface AssignGroupAdminRequest {
  userId: string;
  permissions: Permission[];
}

/**
 * Update group admin permissions request
 */
export interface UpdateGroupAdminPermissionsRequest {
  permissions: Permission[];
}

/**
 * Department analytics filters
 */
export interface DepartmentAnalyticsFilters {
  startDate?: string; // ISO
  endDate?: string; // ISO
  groupAdminId?: string;
  eventCategory?: string;
  eventStatus?: string;
}

/**
 * Department analytics response
 */
export interface DepartmentAnalytics {
  overview: {
    totalEvents: number;
    totalParticipants: number;
    averageAttendance: number;
    completionRate: number;
    growthRate: number; // Percentage compared to previous period
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
      mode: 'Online' | 'Offline' | 'Hybrid';
      count: number;
    }>;
  };
  
  participationTrends: Array<{
    date: string; // ISO
    participants: number;
    events: number;
  }>;
  
  topPerformers: {
    groupAdmins: Array<{
      id: string;
      name: string;
      eventsCreated: number;
      totalParticipants: number;
      averageRating?: number;
    }>;
    events: Array<{
      id: string;
      title: string;
      participants: number;
      rating?: number;
    }>;
  };
  
  recentActivity: Array<{
    type: 'event_created' | 'event_approved' | 'event_completed' | 'admin_assigned';
    description: string;
    timestamp: string; // ISO
    metadata?: Record<string, any>;
  }>;
}

/**
 * Departments list response
 */
export interface DepartmentsResponse {
  data: Department[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Group admins list response
 */
export interface GroupAdminsResponse {
  groupAdmins: GroupAdmin[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Department filters
 */
export interface DepartmentFilters {
  search?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
  sortBy?: 'name' | 'createdAt' | 'totalEvents';
  sortOrder?: 'asc' | 'desc';
}

/**
 * Group admin filters
 */
export interface GroupAdminFilters {
  departmentId?: string;
  isActive?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}

// PERMISSION CONSTANTS

/**
 * Available permissions for group admins
 */
export const AVAILABLE_PERMISSIONS: PermissionDefinition[] = [
  // Event Management
  {
    key: Permission.CREATE_EVENT,
    name: 'Create Events',
    description: 'Can create new events for the department',
    category: 'event_management',
    isDefault: true,
  },
  {
    key: Permission.UPDATE_EVENT,
    name: 'Update Events',
    description: 'Can edit event details',
    category: 'event_management',
    isDefault: true,
  },
  {
    key: Permission.DELETE_EVENT,
    name: 'Delete Events',
    description: 'Can delete events (only own events)',
    category: 'event_management',
    isDefault: false,
  },
  {
    key: Permission.PUBLISH_EVENT,
    name: 'Publish Events',
    description: 'Can publish events without approval',
    category: 'event_management',
    isDefault: false,
  },
  {
    key: Permission.CLOSE_EVENT,
    name: 'Close Events',
    description: 'Can close event registration',
    category: 'event_management',
    isDefault: true,
  },
  
  // Participant Management
  {
    key: Permission.VIEW_REGISTRATIONS,
    name: 'View Registrations',
    description: 'Can view event registrations',
    category: 'participant_management',
    isDefault: true,
  },
  {
    key: Permission.MARK_ATTENDANCE,
    name: 'Mark Attendance',
    description: 'Can mark participant attendance',
    category: 'participant_management',
    isDefault: true,
  },
  {
    key: Permission.DECLARE_WINNERS,
    name: 'Declare Winners',
    description: 'Can declare event winners and results',
    category: 'participant_management',
    isDefault: true,
  },
];

/**
 * Default permissions for group admins
 */
export const DEFAULT_GROUP_ADMIN_PERMISSIONS: Permission[] = 
  AVAILABLE_PERMISSIONS
    .filter(p => p.isDefault)
    .map(p => p.key);

export interface DepartmentState {
    // Departments
    departments: Department[];
    currentDepartment: Department | null;
    
    // Group Admins
    groupAdmins: GroupAdmin[];
    currentGroupAdmin: GroupAdmin | null;
    
    // Permissions
    availablePermissions: PermissionDefinition[];
    
    // Analytics
    analytics: DepartmentAnalytics | null;
    
    // Pagination
    departmentsPagination: {
        total: number;
        page: number;
        totalPages: number;
        limit: number;
    };
    
    groupAdminsPagination: {
        total: number;
        page: number;
        totalPages: number;
        limit: number;
    };
    
    // Loading states
    isLoading: boolean;
    isLoadingAnalytics: boolean;
    isCreatingDepartment: boolean;
    isUpdatingDepartment: boolean;
    isDeletingDepartment: boolean;
    isAssigningAdmin: boolean;
    isUpdatingPermissions: boolean;
    
    // Error state
    error: string | null;
    }