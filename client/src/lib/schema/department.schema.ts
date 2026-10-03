/**
 * ============================================================================
 * DEPARTMENT SCHEMAS - PRODUCTION READY
 * ============================================================================
 * Comprehensive Zod schemas for department-related data validation
 */

import { z } from 'zod';

// ENUMS

export const PermissionEnum = z.enum([
  'CREATE_EVENT',
  'UPDATE_EVENT',
  'DELETE_EVENT',
  'PUBLISH_EVENT',
  'CLOSE_EVENT',
  'MARK_ATTENDANCE',
  'DECLARE_WINNERS',
  'MANAGE_GROUP_ADMINS',
  'ASSIGN_PERMISSIONS',
  'VIEW_REGISTRATIONS',
]);

export type Permission = z.infer<typeof PermissionEnum>;

// BASE SCHEMAS

/**
 * Department admin schema
 */
export const DepartmentAdminSchema = z.object({
  id: z.string().uuid(),
  fullName: z.string(),
  email: z.string().email(),
  isActive: z.boolean(),
  createdAt: z.string().datetime(),
});

export type DepartmentAdmin = z.infer<typeof DepartmentAdminSchema>;

/**
 * Department stats schema
 */
export const DepartmentStatsSchema = z.object({
  totalEvents: z.number().int().nonnegative(),
  upcomingEvents: z.number().int().nonnegative(),
  completedEvents: z.number().int().nonnegative(),
  totalParticipants: z.number().int().nonnegative(),
  totalGroupAdmins: z.number().int().nonnegative(),
  averageAttendance: z.number().nonnegative(),
});

export type DepartmentStats = z.infer<typeof DepartmentStatsSchema>;

/**
 * Department schema
 */
export const DepartmentSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  code: z.string(),
  description: z.string().optional(),
  admin: DepartmentAdminSchema.optional(),
  stats: DepartmentStatsSchema.optional(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

export type Department = z.infer<typeof DepartmentSchema>;

/**
 * Group admin stats schema
 */
export const GroupAdminStatsSchema = z.object({
  totalEventsCreated: z.number().int().nonnegative(),
  activeEvents: z.number().int().nonnegative(),
  totalParticipants: z.number().int().nonnegative(),
});

export type GroupAdminStats = z.infer<typeof GroupAdminStatsSchema>;

/**
 * Group admin schema
 */
export const GroupAdminSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  userName: z.string(),
  userEmail: z.string().email(),
  studentID: z.string().optional(),
  departmentId: z.string().uuid(),
  departmentName: z.string(),
  permissions: z.array(PermissionEnum),
  isActive: z.boolean(),
  grantedBy: z.string().uuid().optional(),
  stats: GroupAdminStatsSchema.optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type GroupAdmin = z.infer<typeof GroupAdminSchema>;

/**
 * Permission definition schema
 */
export const PermissionDefinitionSchema = z.object({
  id: z.string(),
  name: PermissionEnum,
  description: z.string(),
  category: z.string(),
  isDefault: z.boolean(),
});

export type PermissionDefinition = z.infer<typeof PermissionDefinitionSchema>;

// API REQUEST SCHEMAS

/**
 * Department filters
 */
export const DepartmentFiltersSchema = z.object({
  search: z.string().optional(),
  isActive: z.boolean().optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(10),
  sortBy: z.enum(['name', 'code', 'createdAt']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type DepartmentFilters = z.infer<typeof DepartmentFiltersSchema>;

/**
 * Create department request
 */
export const CreateDepartmentRequestSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters').max(100),
  code: z.string()
    .min(2, 'Code must be at least 2 characters')
    .max(10)
    .regex(/^[A-Z0-9]+$/, 'Code must be uppercase letters and numbers only'),
  description: z.string().optional(),
  adminFullName: z.string().min(2, 'Admin name must be at least 2 characters'),
  adminEmail: z.string().email('Invalid email address'),
  adminPassword: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain uppercase, lowercase, and number'
    ),
});

export type CreateDepartmentRequest = z.infer<typeof CreateDepartmentRequestSchema>;

/**
 * Update department request
 */
export const UpdateDepartmentRequestSchema = z.object({
  name: z.string().min(3).max(100).optional(),
  code: z.string().min(2).max(10).regex(/^[A-Z0-9]+$/).optional(),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
});

export type UpdateDepartmentRequest = z.infer<typeof UpdateDepartmentRequestSchema>;

/**
 * Group admin filters
 */
export const GroupAdminFiltersSchema = z.object({
  search: z.string().optional(),
  isActive: z.boolean().optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
});

export type GroupAdminFilters = z.infer<typeof GroupAdminFiltersSchema>;

/**
 * Assign group admin request
 */
export const AssignGroupAdminRequestSchema = z.object({
  userId: z.string().uuid('Invalid user ID'),
  permissions: z
    .array(PermissionEnum)
    .min(1, 'At least one permission is required'),
});

export type AssignGroupAdminRequest = z.infer<typeof AssignGroupAdminRequestSchema>;

/**
 * Update group admin permissions request
 */
export const UpdateGroupAdminPermissionsRequestSchema = z.object({
  permissions: z
    .array(PermissionEnum)
    .min(1, 'At least one permission is required'),
});

export type UpdateGroupAdminPermissionsRequest = z.infer<
  typeof UpdateGroupAdminPermissionsRequestSchema
>;

// API RESPONSE SCHEMAS

/**
 * Paginated departments response
 */
export const DepartmentsResponseSchema = z.object({
  data: z.array(DepartmentSchema),
  pagination: z.object({
    page: z.number().int().positive(),
    limit: z.number().int().positive(),
    total: z.number().int().nonnegative(),
    totalPages: z.number().int().nonnegative(),
  }),
});

export type DepartmentsResponse = z.infer<typeof DepartmentsResponseSchema>;

/**
 * Create department response
 */
export const CreateDepartmentResponseSchema = z.object({
  department: DepartmentSchema,
  departmentAdmin: z.object({
    id: z.string().uuid(),
    email: z.string().email(),
    fullName: z.string(),
  }),
});

export type CreateDepartmentResponse = z.infer<typeof CreateDepartmentResponseSchema>;

/**
 * Paginated group admins response
 */
export const GroupAdminsResponseSchema = z.object({
  data: z.array(GroupAdminSchema),
  pagination: z.object({
    total: z.number().int().nonnegative(),
    page: z.number().int().positive(),
    totalPages: z.number().int().nonnegative(),
    limit: z.number().int().positive(),
  }),
});

export type GroupAdminsResponse = z.infer<typeof GroupAdminsResponseSchema>;

// VALIDATION HELPERS

/**
 * Validate permissions consistency
 */
export const validatePermissions = (permissions: Permission[]) => {
  // Check for conflicting permissions
  const hasManageAdmins = permissions.includes('MANAGE_GROUP_ADMINS');
  const hasAssignPerms = permissions.includes('ASSIGN_PERMISSIONS');

  if (hasAssignPerms && !hasManageAdmins) {
    throw new Error('ASSIGN_PERMISSIONS requires MANAGE_GROUP_ADMINS');
  }

  return true;
};

/**
 * Validate department code uniqueness (should be called with DB check)
 */
export const validateDepartmentCode = (code: string) => {
  return CreateDepartmentRequestSchema.shape.code.parse(code);
};

export const DepartmentAnalyticsSchema = z.object({
  /** Queried window; `label` feeds the date-range chip in the header. */
  range: z.object({
    start: z.string(),
    end: z.string(),
    label: z.string(),
  }),

  overview: z.object({
    totalEvents: z.number().int().nonnegative(),
    totalRegistrations: z.number().int().nonnegative(),
    uniqueStudents: z.number().int().nonnegative(),
    activeGroups: z.number().int().nonnegative(),
    fillRate: z.number().nonnegative(),
    totalParticipants: z.number().int().nonnegative(),
    averageAttendance: z.number().nonnegative(),
    completionRate: z.number().nonnegative(),
  }),

  /** Percent change vs the preceding window of equal length. */
  trends: z.object({
    totalEvents: z.number(),
    totalRegistrations: z.number(),
    uniqueStudents: z.number(),
    activeGroups: z.number(),
    fillRate: z.number(),
  }),

  monthlyTrend: z.array(
    z.object({
      month: z.string(),
      /** yyyy-mm bucket key, lets the UI filter rolling windows by calendar year. */
      monthKey: z.string(),
      registrations: z.number().int().nonnegative(),
      students: z.number().int().nonnegative(),
      attendees: z.number().int().nonnegative(),
    })
  ),

  eventsByMonth: z.array(
    z.object({
      month: z.string(),
      monthKey: z.string(),
      count: z.number().int().nonnegative(),
    })
  ),

  eventBreakdown: z.object({
    byCategory: z.array(
      z.object({
        category: z.string(),
        count: z.number().int().nonnegative(),
        participants: z.number().int().nonnegative(),
      })
    ),

    byStatus: z.array(
      z.object({
        status: z.string(),
        count: z.number().int().nonnegative(),
      })
    ),

    byMode: z.array(
      z.object({
        mode: z.string(),
        count: z.number().int().nonnegative(),
      })
    ),
  }),

  topEvents: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      registrations: z.number().int().nonnegative(),
      capacity: z.number().int().nonnegative(),
    })
  ),

  topGroups: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      members: z.number().int().nonnegative(),
      events: z.number().int().nonnegative(),
    })
  ),

  recentEvents: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      date: z.string(),
      status: z.string(),
    })
  ),

  insights: z.array(
    z.object({
      icon: z.string(),
      text: z.string(),
    })
  ),

  /** Legacy fields kept for backward compatibility. */
  participationTrends: z.array(
    z.object({
      date: z.string(),
      participants: z.number().int().nonnegative(),
      events: z.number().int().nonnegative(),
    })
  ),

  topPerformers: z.object({
    groupAdmins: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
        eventsCreated: z.number().int().nonnegative(),
        totalParticipants: z.number().int().nonnegative(),
      })
    ),
    events: z.array(
      z.object({
        id: z.string(),
        title: z.string(),
        participants: z.number().int().nonnegative(),
      })
    ),
  }),

  recentActivity: z.array(
    z.object({
      type: z.string(),
      description: z.string(),
      timestamp: z.string(),
    })
  ),
});

/**
 * Type
 */
export type DepartmentAnalytics = z.infer<
  typeof DepartmentAnalyticsSchema
>;

// ============================================================================
// REGISTRATIONS (department-wide)
// ============================================================================

/**
 * UI status buckets for the registrations screen. The backend maps the Prisma
 * statuses (REGISTERED/ATTENDED → CONFIRMED, CANCELLED → CANCELLED,
 * ABSENT → OTHERS) since there is no pending/waitlisted state in the schema.
 */
export const RegistrationStatusBucketEnum = z.enum([
  'CONFIRMED',
  'CANCELLED',
  'OTHERS',
]);

export type RegistrationStatusBucket = z.infer<typeof RegistrationStatusBucketEnum>;

export const DepartmentRegistrationRowSchema = z.object({
  id: z.string(),
  userId: z.string(),
  userName: z.string(),
  userEmail: z.string(),
  userAvatar: z.string().optional(),
  studentID: z.string().optional(),
  eventId: z.string(),
  eventTitle: z.string(),
  eventDate: z.string(),
  eventTime: z.string(),
  group: z
    .object({ id: z.string(), name: z.string() })
    .nullable(),
  status: RegistrationStatusBucketEnum,
  /** Raw Prisma status (REGISTERED | CANCELLED | ATTENDED | ABSENT). */
  rawStatus: z.string(),
  registeredAt: z.string(),
  attendedAt: z.string().nullable().optional(),
  cancelledAt: z.string().nullable().optional(),
});

export type DepartmentRegistrationRow = z.infer<
  typeof DepartmentRegistrationRowSchema
>;

export const DepartmentRegistrationsSchema = z.object({
  data: z.array(DepartmentRegistrationRowSchema),
  /** Department-wide aggregates — unaffected by table filters. */
  summary: z.object({
    totalRegistrations: z.number(),
    uniqueStudents: z.number(),
    events: z.number(),
    newEventsThisMonth: z.number(),
    confirmed: z.number(),
    attended: z.number(),
    cancelled: z.number(),
    others: z.number(),
    trends: z.object({
      totalRegistrations: z.number(),
      uniqueStudents: z.number(),
      attended: z.number(),
      cancelled: z.number(),
    }),
    groups: z.array(z.object({ id: z.string(), name: z.string() })),
    topEvents: z.array(
      z.object({
        id: z.string(),
        title: z.string(),
        registrations: z.number(),
        capacity: z.number(),
      })
    ),
    recentRegistrations: z.array(
      z.object({
        id: z.string(),
        userName: z.string(),
        userAvatar: z.string().optional(),
        eventId: z.string(),
        eventTitle: z.string(),
        registeredAt: z.string(),
      })
    ),
  }),
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    totalPages: z.number(),
  }),
});

export type DepartmentRegistrations = z.infer<
  typeof DepartmentRegistrationsSchema
>;

export const DepartmentRegistrationsFiltersSchema = z.object({
  eventId: z.string().optional(),
  status: RegistrationStatusBucketEnum.optional(),
  search: z.string().optional(),
  group: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(10),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type DepartmentRegistrationsFilters = z.infer<
  typeof DepartmentRegistrationsFiltersSchema
>;

// ============================================================================
// STUDENTS (department-wide)
// ============================================================================

/** Participation tier derived server-side (see DepartmentStudentStatus). */
export const StudentStatusBucketEnum = z.enum(['ACTIVE', 'INACTIVE', 'TOP_CONTRIBUTOR']);

export type StudentStatusBucket = z.infer<typeof StudentStatusBucketEnum>;

export const DepartmentStudentRowSchema = z.object({
  id: z.string(),
  fullName: z.string(),
  email: z.string(),
  userAvatar: z.string().optional(),
  studentID: z.string().optional(),
  /** Derived from the admission year in the roll number. */
  year: z.string(),
  /** Stable A/B/C bucket (presentation only). */
  section: z.string(),
  eventsJoined: z.number(),
  eventsJoinedThisSemester: z.number(),
  lastRegisteredAt: z.string().nullable(),
  status: StudentStatusBucketEnum,
  isActive: z.boolean(),
  joinedAt: z.string(),
});

export type DepartmentStudentRow = z.infer<
  typeof DepartmentStudentRowSchema
>;

export const DepartmentStudentsSchema = z.object({
  data: z.array(DepartmentStudentRowSchema),
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    /** Count AFTER search/year/section/status filters. */
    total: z.number(),
    totalPages: z.number(),
  }),
  /** Department-wide aggregates — unaffected by table filters. */
  summary: z.object({
    totalStudents: z.number(),
    activeStudents: z.number(),
    eventParticipants: z.number(),
    topContributors: z.number(),
    trends: z.object({
      totalStudents: z.number(),
      activeStudents: z.number(),
      eventParticipants: z.number(),
      topContributors: z.number(),
    }),
    yearDistribution: z.array(
      z.object({ year: z.string(), count: z.number() })
    ),
    /** Events-joined buckets [0, 1-2, 3-5, 6-10, 10+]. */
    participation: z.object({
      allTime: z.array(z.number()),
      thisSemester: z.array(z.number()),
    }),
    topParticipants: z.array(
      z.object({
        id: z.string(),
        fullName: z.string(),
        email: z.string(),
        userAvatar: z.string().optional(),
        eventsJoined: z.number(),
      })
    ),
  }),
});

export type DepartmentStudents = z.infer<
  typeof DepartmentStudentsSchema
>;

export const DepartmentStudentsFiltersSchema = z.object({
  search: z.string().optional(),
  year: z.string().optional(),
  section: z.string().optional(),
  status: z.enum(['active', 'inactive', 'top']).optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(10),
  sortBy: z.enum(['eventsJoined', 'name', 'joinedAt']).default('eventsJoined'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type DepartmentStudentsFilters = z.infer<
  typeof DepartmentStudentsFiltersSchema
>;

export const CreateDepartmentStudentRequestSchema = z.object({
  fullName: z.string().min(3, 'Name must be at least 3 characters').max(100),
  email: z.string().email('Invalid email address'),
  studentID: z.string().max(20).optional(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  isActive: z.boolean().optional(),
});

export type CreateDepartmentStudentRequest = z.infer<
  typeof CreateDepartmentStudentRequestSchema
>;