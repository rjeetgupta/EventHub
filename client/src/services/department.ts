/**
 * ============================================================================
 * DEPARTMENT UTILITY FUNCTIONS
 * ============================================================================
 * 
 * Helper functions for department management:
 * - Permission checking and validation
 * - Role-based access control
 * - Department statistics formatting
 * - Analytics calculations
 * 
 * @module utils/department.utils
 * ============================================================================
 */

import type {
  Department,
  GroupAdmin,
  DepartmentAnalytics,
  PermissionDefinition,
  DepartmentStats,
} from "@/lib/types/department.types"
import { Permission, UserRole } from "@/lib/types/common.types";
import type { User } from "@/lib/types/user.types";

// PERMISSION UTILITIES

/**
 * Check if a user has a specific permission
 * 
 * @param user - Current user
 * @param permission - Permission to check
 * @param groupAdmin - Optional group admin data
 * @returns Whether user has the permission
 * 
 * @example
 * ```ts
 * const canDelete = hasPermission(user, Permission.DELETE_EVENT, groupAdmin);
 * ```
 */
export function hasPermission(
  user: User | null,
  permission: Permission,
  groupAdmin?: GroupAdmin | null
): boolean {
  if (!user) return false;

  // Super admin has all permissions
  if (user.role === UserRole.SUPER_ADMIN) return true;

  // Department admin has all department-level permissions
  if (user.role === UserRole.DEPARTMENT_ADMIN) {
    return [
      Permission.CREATE_EVENT,
      Permission.UPDATE_EVENT,
      Permission.DELETE_EVENT,
      Permission.PUBLISH_EVENT,
      Permission.CLOSE_EVENT,
      Permission.VIEW_REGISTRATIONS,
      Permission.MARK_ATTENDANCE,
      Permission.DECLARE_WINNERS,
      Permission.MANAGE_GROUP_ADMINS,
      Permission.ASSIGN_PERMISSIONS,
    ].includes(permission);
  }

  // Group admin - check their specific permissions
  if (user.role === UserRole.GROUP_ADMIN && groupAdmin) {
    return groupAdmin.permissions.includes(permission);
  }

  return false;
}

/**
 * Check if user has multiple permissions (all required)
 * 
 * @param user - Current user
 * @param permissions - Array of permissions to check
 * @param groupAdmin - Optional group admin data
 * @returns Whether user has all permissions
 * 
 * @example
 * ```ts
 * const canManage = hasAllPermissions(user, [
 *   Permission.CREATE_EVENT,
 *   Permission.DELETE_EVENT
 * ]);
 * ```
 */
export function hasAllPermissions(
  user: User | null,
  permissions: Permission[],
  groupAdmin?: GroupAdmin | null
): boolean {
  return permissions.every((permission) =>
    hasPermission(user, permission, groupAdmin)
  );
}

/**
 * Check if user has at least one of the specified permissions
 * 
 * @param user - Current user
 * @param permissions - Array of permissions to check
 * @param groupAdmin - Optional group admin data
 * @returns Whether user has any of the permissions
 */
export function hasAnyPermission(
  user: User | null,
  permissions: Permission[],
  groupAdmin?: GroupAdmin | null
): boolean {
  return permissions.some((permission) =>
    hasPermission(user, permission, groupAdmin)
  );
}

/**
 * Get all available permissions for a user's role
 * 
 * @param role - User role
 * @returns Array of available permissions
 */
export function getAvailablePermissionsForRole(
  role: UserRole
): Permission[] {
  switch (role) {
    case UserRole.SUPER_ADMIN:
      return Object.values(Permission);
    
    case UserRole.DEPARTMENT_ADMIN:
      return [
        Permission.CREATE_EVENT,
        Permission.UPDATE_EVENT,
        Permission.DELETE_EVENT,
        Permission.PUBLISH_EVENT,
        Permission.CLOSE_EVENT,
        Permission.VIEW_REGISTRATIONS,
        Permission.MARK_ATTENDANCE,
        Permission.DECLARE_WINNERS,
        Permission.MANAGE_GROUP_ADMINS,
        Permission.ASSIGN_PERMISSIONS,
      ];
    
    case UserRole.GROUP_ADMIN:
      return [
        Permission.CREATE_EVENT,
        Permission.UPDATE_EVENT,
        Permission.DELETE_EVENT,
        Permission.PUBLISH_EVENT,
        Permission.CLOSE_EVENT,
        Permission.VIEW_REGISTRATIONS,
        Permission.MARK_ATTENDANCE,
        Permission.DECLARE_WINNERS,
      ];
    
    default:
      return [];
  }
}

/**
 * Validate permissions array
 * 
 * @param permissions - Permissions to validate
 * @param allowedPermissions - Permissions that are allowed
 * @returns Validation result with invalid permissions
 */
export function validatePermissions(
  permissions: Permission[],
  allowedPermissions: Permission[]
): {
  valid: boolean;
  invalidPermissions: Permission[];
} {
  const invalidPermissions = permissions.filter(
    (perm) => !allowedPermissions.includes(perm)
  );

  return {
    valid: invalidPermissions.length === 0,
    invalidPermissions,
  };
}

// ROLE CHECKING UTILITIES

/**
 * Check if user is a super admin
 */
export function isSuperAdmin(user: User | null): boolean {
  return user?.role === UserRole.SUPER_ADMIN;
}

/**
 * Check if user is a department admin
 */
export function isDepartmentAdmin(user: User | null): boolean {
  return user?.role === UserRole.DEPARTMENT_ADMIN;
}

/**
 * Check if user is a group admin
 */
export function isGroupAdmin(user: User | null): boolean {
  return user?.role === UserRole.GROUP_ADMIN;
}

/**
 * Check if user is a student
 */
export function isStudent(user: User | null): boolean {
  return user?.role === UserRole.STUDENT;
}

/**
 * Check if user can manage a specific department
 * 
 * @param user - Current user
 * @param departmentId - Department ID to check
 * @returns Whether user can manage the department
 */
export function canManageDepartment(
  user: User | null,
  departmentId: string
): boolean {
  if (!user) return false;

  // Super admin can manage all departments
  if (isSuperAdmin(user)) return true;

  // Department admin can only manage their own department
  if (isDepartmentAdmin(user)) {
    return user.departmentId === departmentId;
  }

  return false;
}

// FORMATTING UTILITIES

/**
 * Format department statistics for display
 * 
 * @param department - Department object
 * @returns Formatted stats object
 */
// export function formatDepartmentStats(department: DepartmentStats) {
//     const stats = department.stats || {};
//   return {
//     totalEvents: stats.totalEvents || 0,
//     upcomingEvents: stats.upcomingEvents || 0,
//     completedEvents: stats.completedEvents || 0,
//     totalParticipants: stats.totalParticipants || 0,
//     totalGroupAdmins: stats.totalGroupAdmins || 0,
//     averageAttendance: (stats.averageAttendance || 0).toFixed(1) + '%',
//     popularCategories: stats.popularCategories || [],
//   };
// }

/**
 * Calculate completion rate
 * 
 * @param completed - Number of completed events
 * @param total - Total number of events
 * @returns Completion rate as percentage
 */
export function calculateCompletionRate(
  completed: number,
  total: number
): number {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
}

/**
 * Calculate growth rate between two periods
 * 
 * @param current - Current period value
 * @param previous - Previous period value
 * @returns Growth rate as percentage
 */
export function calculateGrowthRate(
  current: number,
  previous: number
): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
}

/**
 * Format analytics data for charts
 * 
 * @param analytics - Department analytics
 * @returns Chart-ready data
 */
export function formatAnalyticsForCharts(analytics: DepartmentAnalytics) {
  return {
    // Participation trends for line chart
    participationTrends: analytics.participationTrends.map((item) => ({
      date: new Date(item.date).toLocaleDateString(),
      participants: item.participants,
      events: item.events,
    })),

    // Event breakdown by category for pie chart
    categoryBreakdown: analytics.eventBreakdown.byCategory.map((item) => ({
      name: item.category,
      value: item.count,
      participants: item.participants,
    })),

    // Event breakdown by status for bar chart
    statusBreakdown: analytics.eventBreakdown.byStatus.map((item) => ({
      name: item.status,
      value: item.count,
    })),

    // Event breakdown by mode for donut chart
    modeBreakdown: analytics.eventBreakdown.byMode.map((item) => ({
      name: item.mode,
      value: item.count,
    })),
  };
}

// PERMISSION DISPLAY UTILITIES

/**
 * Get permission display name
 * 
 * @param permission - Permission enum value
 * @returns Human-readable permission name
 */
export function getPermissionDisplayName(permission: Permission): string {
  const permissionNames: Record<Permission, string> = {
    [Permission.CREATE_EVENT]: 'Create Events',
    [Permission.UPDATE_EVENT]: 'Update Events',
    [Permission.DELETE_EVENT]: 'Delete Events',
    [Permission.PUBLISH_EVENT]: 'Publish Events',
    [Permission.CLOSE_EVENT]: 'Close Events',
    [Permission.MARK_ATTENDANCE]: 'Mark Attendance',
    [Permission.DECLARE_WINNERS]: 'Declare Winners',
    [Permission.MANAGE_GROUP_ADMINS]: 'Manage Group Admins',
    [Permission.ASSIGN_PERMISSIONS]: 'Assign Permissions',
    [Permission.VIEW_REGISTRATIONS]: 'View Registrations',
  };

  return permissionNames[permission] || permission;
}

/**
 * Group permissions by category
 * 
 * @param permissions - Array of permission definitions
 * @returns Permissions grouped by category
 */
export function groupPermissionsByCategory(
  permissions: PermissionDefinition[]
): Record<string, PermissionDefinition[]> {
  return permissions.reduce((acc, perm) => {
    if (!acc[perm.category]) {
      acc[perm.category] = [];
    }
    acc[perm.category].push(perm);
    return acc;
  }, {} as Record<string, PermissionDefinition[]>);
}

/**
 * Get permission badge color based on permission type
 * 
 * @param permission - Permission enum value
 * @returns Tailwind color class
 */
export function getPermissionBadgeColor(permission: Permission): string {
  const colorMap: Record<string, string> = {
    CREATE_EVENT: 'bg-green-100 text-green-800',
    UPDATE_EVENT: 'bg-blue-100 text-blue-800',
    DELETE_EVENT: 'bg-red-100 text-red-800',
    PUBLISH_EVENT: 'bg-purple-100 text-purple-800',
    CLOSE_EVENT: 'bg-orange-100 text-orange-800',
    MARK_ATTENDANCE: 'bg-yellow-100 text-yellow-800',
    DECLARE_WINNERS: 'bg-pink-100 text-pink-800',
    MANAGE_GROUP_ADMINS: 'bg-indigo-100 text-indigo-800',
    ASSIGN_PERMISSIONS: 'bg-teal-100 text-teal-800',
    VIEW_REGISTRATIONS: 'bg-cyan-100 text-cyan-800',
  };

  return colorMap[permission] || 'bg-gray-100 text-gray-800';
}

// DEPARTMENT SETTINGS UTILITIES

/**
 * Check if event requires approval based on department settings
 * 
 * @param department - Department object
 * @returns Whether events require approval
 */
export function requiresEventApproval(department: Department): boolean {
  return department.settings?.requireEventApproval || false;
}

/**
 * Check if user can create event based on monthly limit
 * 
 * @param department - Department object
 * @param eventsThisMonth - Number of events created this month
 * @returns Whether user can create more events
 */
export function canCreateEvent(
  department: Department,
  eventsThisMonth: number
): boolean {
  const maxEvents = department.settings?.maxEventsPerMonth;
  
  if (!maxEvents) return true; // No limit set
  
  return eventsThisMonth < maxEvents;
}

/**
 * Get remaining events quota for the month
 * 
 * @param department - Department object
 * @param eventsThisMonth - Number of events created this month
 * @returns Remaining events that can be created
 */
export function getRemainingEventsQuota(
  department: Department,
  eventsThisMonth: number
): number | null {
  const maxEvents = department.settings?.maxEventsPerMonth;
  
  if (!maxEvents) return null; // No limit set
  
  return Math.max(0, maxEvents - eventsThisMonth);
}

// EXPORT ALL UTILITIES

export const departmentUtils = {
  // Permissions
  hasPermission,
  hasAllPermissions,
  hasAnyPermission,
  getAvailablePermissionsForRole,
  validatePermissions,
  
  // Roles
  isSuperAdmin,
  isDepartmentAdmin,
  isGroupAdmin,
  isStudent,
  canManageDepartment,
  
  // Formatting
  // formatDepartmentStats,
  calculateCompletionRate,
  calculateGrowthRate,
  formatAnalyticsForCharts,
  
  // Permission Display
  getPermissionDisplayName,
  groupPermissionsByCategory,
  getPermissionBadgeColor,
  
  // Settings
  requiresEventApproval,
  canCreateEvent,
  getRemainingEventsQuota,
};