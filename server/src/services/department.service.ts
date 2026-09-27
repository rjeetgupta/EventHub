import { prisma } from "../config/db.js";
import ApiError from "../utils/ApiError.js";
import {
  CreateDepartmentDto,
  UpdateDepartmentDto,
  AssignGroupAdminDto,
  UpdateGroupAdminPermissionsDto,
  DepartmentFiltersDto,
  GroupAdminFiltersDto,
  DepartmentResponse,
  GroupAdminResponse,
  PaginatedDepartmentsResponse,
  PaginatedGroupAdminsResponse,
  DepartmentStats,
  GroupAdminStats,
  PermissionDefinition,
  PermissionCategory,
  DepartmentAnalyticsFiltersDto,
  DepartmentAnalytics,
  DepartmentRegistrationsFiltersDto,
  DepartmentRegistrationsResponse,
  DerivedRegistrationStatus,
  DepartmentRegistrationRow,
  CreateDepartmentResponse,
} from "../types/department.types.js";
import { Permission, UserRole } from "../types/common.types.js";
import { EventStatus, RegistrationStatus, PermissionType, RoleType } from "../../generated/prisma/enums.js";
import { hashPassword } from "../utils/password.js";

export const AVAILABLE_PERMISSIONS: PermissionDefinition[] = [
  {
    id: "1",
    name: Permission.CREATE_EVENT,
    description: "Can create new events for the department",
    category: PermissionCategory.EVENT_MANAGEMENT,
    isDefault: true,
  },
  {
    id: "2",
    name: Permission.UPDATE_EVENT,
    description: "Can edit event details",
    category: PermissionCategory.EVENT_MANAGEMENT,
    isDefault: true,
  },
  {
    id: "3",
    name: Permission.DELETE_EVENT,
    description: "Can delete events",
    category: PermissionCategory.EVENT_MANAGEMENT,
    isDefault: false,
  },
  {
    id: "4",
    name: Permission.PUBLISH_EVENT,
    description: "Can publish events without approval",
    category: PermissionCategory.EVENT_MANAGEMENT,
    isDefault: false,
  },
  {
    id: "5",
    name: Permission.CLOSE_EVENT,
    description: "Can close event registration",
    category: PermissionCategory.EVENT_MANAGEMENT,
    isDefault: true,
  },
  {
    id: "6",
    name: Permission.VIEW_REGISTRATIONS,
    description: "Can view event registrations",
    category: PermissionCategory.PARTICIPANT_MANAGEMENT,
    isDefault: true,
  },
  {
    id: "7",
    name: Permission.MARK_ATTENDANCE,
    description: "Can mark participant attendance",
    category: PermissionCategory.PARTICIPANT_MANAGEMENT,
    isDefault: true,
  },
  {
    id: "8",
    name: Permission.DECLARE_WINNERS,
    description: "Can declare event winners",
    category: PermissionCategory.PARTICIPANT_MANAGEMENT,
    isDefault: true,
  },
  {
    id: "9",
    name: Permission.MANAGE_GROUP_ADMINS,
    description: "Can manage group admins",
    category: PermissionCategory.ADMIN_MANAGEMENT,
    isDefault: false,
  },
  {
    id: "10",
    name: Permission.ASSIGN_PERMISSIONS,
    description: "Can assign permissions",
    category: PermissionCategory.ADMIN_MANAGEMENT,
    isDefault: false,
  },
];

async function calculateDepartmentStats(
  departmentId: string
): Promise<DepartmentStats> {
  const now = new Date();

  const [totalEvents, upcomingEvents, completedEvents, pendingApproval, registrationStats, groupAdminCount] =
    await Promise.all([
      // Total events
      prisma.event.count({
        where: { departmentId },
      }),
      
      // Upcoming events (published and date >= now)
      prisma.event.count({
        where: {
          departmentId,
          status: EventStatus.PUBLISHED,
          date: { gte: now },
        },
      }),
      
      // Completed events (date < now)
      prisma.event.count({
        where: {
          departmentId,
          date: { lt: now },
        },
      }),
      
      // Pending approval events
      prisma.event.count({
        where: {
          departmentId,
          status: EventStatus.PENDING_APPROVAL,
        },
      }),
      
      // Registration stats for average attendance
      prisma.registration.groupBy({
        by: ["status"],
        where: {
          event: { departmentId },
        },
        _count: true,
      }),
      
      // Total group admins
      prisma.groupAdminPermission.findMany({
        where: {
          user: { departmentId },
          isGranted: true,
        },
        distinct: ["userId"],
      }),
    ]);

  const totalRegistrations = registrationStats.reduce(
    (sum, stat) => sum + stat._count,
    0
  );
  
  const attendedCount =
    registrationStats.find((s) => s.status === RegistrationStatus.ATTENDED)?._count || 0;

  const averageAttendance =
    totalRegistrations > 0 ? (attendedCount / totalRegistrations) * 100 : 0;

  return {
    totalEvents,
    upcomingEvents,
    completedEvents,
    pendingApproval,
    totalParticipants: totalRegistrations,
    totalGroupAdmins: groupAdminCount.length,
    averageAttendance: Math.round(averageAttendance * 10) / 10,
  };
}

const getAnalyticsMonthKey = (date: Date) =>
  `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;

/**
 * Maps the Prisma RegistrationStatus onto the UI status buckets used by the
 * department registrations screen (Confirmed / Cancelled / Others).
 */
export const deriveRegistrationStatus = (
  status: RegistrationStatus
): DerivedRegistrationStatus => {
  if (status === RegistrationStatus.CANCELLED) return "CANCELLED";
  if (status === RegistrationStatus.ATTENDED) return "CONFIRMED";
  if (status === RegistrationStatus.REGISTERED) return "CONFIRMED";
  return "OTHERS"; // ABSENT and any future values
};

async function calculateGroupAdminStats(
  userId: string,
  departmentId: string
): Promise<GroupAdminStats> {
  const [totalEventsCreated, activeEvents, participantCount] =
    await Promise.all([
      prisma.event.count({
        where: { creatorId: userId, departmentId },
      }),
      prisma.event.count({
        where: {
          creatorId: userId,
          departmentId,
          status: {
            in: [EventStatus.PUBLISHED, EventStatus.ONGOING],
          },
        },
      }),
      prisma.registration.count({
        where: {
          event: {
            creatorId: userId,
            departmentId,
          },
        },
      }),
    ]);

  return {
    totalEventsCreated,
    activeEvents,
    totalParticipants: participantCount,
  };
}

class DepartmentService {
  /**
   * Get all departments with filters
   */
  async getDepartments(
    filters?: Partial<DepartmentFiltersDto>,
    userRole?: UserRole,
    userDepartmentId?: string
  ): Promise<PaginatedDepartmentsResponse> {
    const {
      search,
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = filters || {};

    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { code: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    const canViewAdminInfo =
      userRole === UserRole.SUPER_ADMIN ||
      userRole === UserRole.DEPARTMENT_ADMIN;

    // DEPARTMENT_ADMIN should only see own department
    if (userRole === UserRole.DEPARTMENT_ADMIN && userDepartmentId) {
      where.id = userDepartmentId;
    }

    const skip = (page - 1) * limit;

    const [departments, total] = await Promise.all([
      prisma.department.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: canViewAdminInfo
          ? {
              users: {
                where: {
                  role: { name: RoleType.DEPARTMENT_ADMIN },
                },
                select: {
                  id: true,
                  fullName: true,
                  email: true,
                  isActive: true,
                  createdAt: true,
                },
              },
            }
          : undefined,
      }),
      prisma.department.count({ where }),
    ]);

    const departmentsWithStats = await Promise.all(
      departments.map(async (dept: any) => {
        const admin = canViewAdminInfo ? dept.users?.[0] : undefined;

        return {
          id: dept.id,
          name: dept.name,
          code: dept.code,
          description: dept.description ?? undefined,

          admin: admin
            ? {
                id: admin.id,
                fullName: admin.fullName,
                email: admin.email,
                isActive: admin.isActive,
                createdAt: admin.createdAt.toISOString(),
              }
            : undefined,

          stats: await calculateDepartmentStats(dept.id),
          createdAt: dept.createdAt.toISOString(),
          updatedAt: dept.updatedAt.toISOString(),
        };
      })
    );

    return {
      data: departmentsWithStats,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Activate / deactivate a department by toggling its admin user.
   * (The Department model has no status column — the admin user's flag is the
   * source of truth surfaced in the admin dashboard table.)
   */
  async setDepartmentStatus(
    id: string,
    isActive: boolean
  ): Promise<DepartmentResponse> {
    const department = await prisma.department.findUnique({
      where: { id },
      include: {
        users: {
          where: { role: { name: RoleType.DEPARTMENT_ADMIN } },
          select: { id: true, fullName: true, email: true, isActive: true, createdAt: true },
          take: 1,
        },
      },
    });

    if (!department) {
      throw new ApiError(404, "Department not found");
    }

    const admin = department.users[0];
    if (!admin) {
      throw new ApiError(409, "Department has no admin assigned yet");
    }

    await prisma.user.update({
      where: { id: admin.id },
      data: { isActive },
    });

    return {
      id: department.id,
      name: department.name,
      code: department.code,
      description: department.description ?? undefined,
      admin: {
        id: admin.id,
        fullName: admin.fullName,
        email: admin.email,
        isActive,
        createdAt: admin.createdAt.toISOString(),
      },
      stats: await calculateDepartmentStats(department.id),
      createdAt: department.createdAt.toISOString(),
      updatedAt: department.updatedAt.toISOString(),
    };
  }

  /**
   * Get department by ID with analytics
   */
  async getDepartmentById(id: string): Promise<DepartmentResponse> {
    const department = await prisma.department.findUnique({
      where: { id },
    });

    if (!department) {
      throw new ApiError(404, "Department not found");
    }

    return {
      id: department.id,
      name: department.name,
      code: department.code,
      description: department.description || undefined,
      stats: await calculateDepartmentStats(department.id),
      createdAt: department.createdAt.toISOString(),
      updatedAt: department.updatedAt.toISOString(),
    };
  }

  /**
   * Create new department
   */
  async createDepartment(
    data: CreateDepartmentDto
  ): Promise<CreateDepartmentResponse> {
    const existing = await prisma.department.findUnique({
      where: { code: data.code },
    });

    if (existing) {
      throw new ApiError(409, `Department with code ${data.code} already exists`);
    }

    const deptAdminRole = await prisma.role.findUnique({
      where: { name: RoleType.DEPARTMENT_ADMIN },
    });

    if (!deptAdminRole) {
      throw new ApiError(500, "Role misconfiguration");
    }

    const hashedPassword = await hashPassword(data.adminPassword);

    const { department, departmentAdmin } = await prisma.$transaction(
      async (tx) => {
        const department = await tx.department.create({
          data: {
            name: data.name,
            code: data.code,
            description: data.description,
          },
        });

        const departmentAdmin = await tx.user.create({
          data: {
            email: data.adminEmail,
            password: hashedPassword,
            fullName: data.adminFullName,
            roleId: deptAdminRole.id,
            departmentId: department.id,
          },
        });

        return { department, departmentAdmin };
      }
    );

    return {
      department: {
        id: department.id,
        name: department.name,
        code: department.code,
        description: department.description ?? undefined,
        createdAt: department.createdAt.toISOString(),
        updatedAt: department.updatedAt.toISOString(),
      },
      departmentAdmin: {
        id: departmentAdmin.id,
        email: departmentAdmin.email,
        fullName: departmentAdmin.fullName,
      },
    };
  }

  /**
   * Update department
   */
  async updateDepartment(
    id: string,
    data: UpdateDepartmentDto,
    userId: string,
    userRole: UserRole
  ): Promise<DepartmentResponse> {
    const department = await prisma.department.findUnique({
      where: { id },
      include: { users: true },
    });

    if (!department) {
      throw new ApiError(404, "Department not found");
    }

    // Authorization check for department admin
    if (userRole === UserRole.DEPARTMENT_ADMIN) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (user?.departmentId !== id) {
        throw new ApiError(403, "You can only update your own department");
      }
    }

    // Check code uniqueness if updating code
    if (data.code && data.code !== department.code) {
      const existing = await prisma.department.findUnique({
        where: { code: data.code },
      });

      if (existing) {
        throw new ApiError(409, `Department with code ${data.code} already exists`);
      }
    }

    const updated = await prisma.department.update({
      where: { id },
      data,
    });

    return {
      id: updated.id,
      name: updated.name,
      code: updated.code,
      description: updated.description || undefined,
      stats: await calculateDepartmentStats(updated.id),
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
    };
  }

  /**
   * Delete department
   */
  async deleteDepartment(id: string): Promise<void> {
    const department = await prisma.department.findUnique({
      where: { id },
    });

    if (!department) {
      throw new ApiError(404, "Department not found");
    }

    // Check for active events
    const activeEvents = await prisma.event.count({
      where: {
        departmentId: id,
        status: {
          in: [EventStatus.PUBLISHED, EventStatus.ONGOING],
        },
      },
    });

    if (activeEvents > 0) {
      throw new ApiError(400, "Cannot delete department with active events");
    }

    await prisma.department.delete({
      where: { id },
    });
  }

  /**
   * Get group admins for a department
   */
  async getGroupAdmins(
    departmentId: string,
    filters?: Partial<GroupAdminFiltersDto>
  ): Promise<PaginatedGroupAdminsResponse> {
    const { search, isActive, page = 1, limit = 20 } = filters || {};

    const department = await prisma.department.findUnique({
      where: { id: departmentId },
    });

    if (!department) {
      throw new ApiError(404, "Department not found");
    }

    const skip = (page - 1) * limit;

    // Get unique group admins for this department
    const groupAdminPermissions = await prisma.groupAdminPermission.findMany({
      where: {
        user: { departmentId },
        ...(isActive !== undefined && { isGranted: isActive }),
      },
      include: {
        user: true,
        permission: true,
      },
    });

    // Group permissions by user
    const userPermissionsMap = new Map<string, any>();

    for (const gap of groupAdminPermissions) {
      if (!userPermissionsMap.has(gap.userId)) {
        userPermissionsMap.set(gap.userId, {
          user: gap.user,
          permissions: [],
          isActive: gap.isGranted,
          grantedBy: gap.grantedBy,
          createdAt: gap.createdAt,
          updatedAt: gap.updatedAt,
        });
      }

      if (gap.isGranted) {
        userPermissionsMap
          .get(gap.userId)
          .permissions.push(gap.permission.name as Permission);
      }
    }

    let groupAdmins = Array.from(userPermissionsMap.values());

    // Search filter
    if (search) {
      groupAdmins = groupAdmins.filter((ga) => {
        const searchLower = search.toLowerCase();
        return (
          ga.user.fullName.toLowerCase().includes(searchLower) ||
          ga.user.email.toLowerCase().includes(searchLower) ||
          (ga.user.studentID &&
            ga.user.studentID.toLowerCase().includes(searchLower))
        );
      });
    }

    const total = groupAdmins.length;
    const paginatedAdmins = groupAdmins.slice(skip, skip + limit);

    const groupAdminResponses = await Promise.all(
      paginatedAdmins.map(async (ga) => ({
        id: ga.user.id,
        userId: ga.user.id,
        userName: ga.user.fullName,
        userEmail: ga.user.email,
        studentID: ga.user.studentID || undefined,
        departmentId,
        departmentName: department.name,
        permissions: ga.permissions,
        isActive: ga.isActive,
        grantedBy: ga.grantedBy || undefined,
        stats: await calculateGroupAdminStats(ga.user.id, departmentId),
        createdAt: ga.createdAt.toISOString(),
        updatedAt: ga.updatedAt.toISOString(),
      }))
    );

    return {
      data: groupAdminResponses,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Assign user as group admin
   */
  async assignGroupAdmin(
    departmentId: string,
    data: AssignGroupAdminDto,
    assignedBy: string
  ): Promise<GroupAdminResponse> {
    const department = await prisma.department.findUnique({
      where: { id: departmentId },
    });

    if (!department) {
      throw new ApiError(404, "Department not found");
    }

    const user = await prisma.user.findUnique({
      where: { id: data.userId },
      include: { role: true },
    });

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    if (user.role.name !== "STUDENT") {
      throw new ApiError(400, "Only students can be assigned as group admins");
    }

    if (user.departmentId !== departmentId) {
      throw new ApiError(400, "User must belong to this department");
    }

    // Check if already a group admin
    const existing = await prisma.groupAdminPermission.findFirst({
      where: {
        userId: data.userId,
        isGranted: true,
      },
    });

    if (existing) {
      throw new ApiError(409, "User is already a group admin");
    }

    // Get permission IDs
    const permissions = await prisma.permission.findMany({
      where: {
        name: { in: data.permissions as PermissionType[] },
      },
    });

    if (permissions.length !== data.permissions.length) {
      throw new ApiError(400, "Some permissions are invalid");
    }

    // Update user role to GROUP_ADMIN
    const groupAdminRole = await prisma.role.findUnique({
      where: { name: "GROUP_ADMIN" },
    });

    if (!groupAdminRole) {
      throw new ApiError(500, "GROUP_ADMIN role not found");
    }

    await prisma.user.update({
      where: { id: data.userId },
      data: { roleId: groupAdminRole.id },
    });

    // Create permission grants
    await prisma.groupAdminPermission.createMany({
      data: permissions.map((perm) => ({
        userId: data.userId,
        permissionId: perm.id,
        isGranted: true,
        grantedBy: assignedBy,
      })),
    });

    const createdPermissions = await prisma.groupAdminPermission.findMany({
      where: {
        userId: data.userId,
        isGranted: true,
      },
      include: {
        permission: true,
      },
    });

    return {
      id: user.id,
      userId: user.id,
      userName: user.fullName,
      userEmail: user.email,
      studentID: user.studentID || undefined,
      departmentId,
      departmentName: department.name,
      permissions: createdPermissions.map(
        (cp) => cp.permission.name as Permission
      ),
      isActive: true,
      grantedBy: assignedBy,
      stats: await calculateGroupAdminStats(user.id, departmentId),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  /**
   * Update group admin permissions
   */
  async updateGroupAdminPermissions(
    departmentId: string,
    userId: string,
    data: UpdateGroupAdminPermissionsDto
  ): Promise<GroupAdminResponse> {
    const department = await prisma.department.findUnique({
      where: { id: departmentId },
    });

    if (!department) {
      throw new ApiError(404, "Department not found");
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || user.departmentId !== departmentId) {
      throw new ApiError(404, "Group admin not found in this department");
    }

    // Delete existing permissions
    await prisma.groupAdminPermission.deleteMany({
      where: { userId },
    });

    // Get new permission IDs
    const permissions = await prisma.permission.findMany({
      where: {
        name: { in: data.permissions as PermissionType[] },
      },
    });

    if (permissions.length !== data.permissions.length) {
      throw new ApiError(400, "Some permissions are invalid");
    }

    // Create new permission grants
    await prisma.groupAdminPermission.createMany({
      data: permissions.map((perm) => ({
        userId,
        permissionId: perm.id,
        isGranted: true,
      })),
    });

    const updatedPermissions = await prisma.groupAdminPermission.findMany({
      where: {
        userId,
        isGranted: true,
      },
      include: {
        permission: true,
      },
    });

    return {
      id: user.id,
      userId: user.id,
      userName: user.fullName,
      userEmail: user.email,
      studentID: user.studentID || undefined,
      departmentId,
      departmentName: department.name,
      permissions: updatedPermissions.map(
        (up) => up.permission.name as Permission
      ),
      isActive: true,
      stats: await calculateGroupAdminStats(user.id, departmentId),
      createdAt: user.createdAt.toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  /**
   * Toggle a group admin's active status (soft enable/disable their permission grants)
   */
  async toggleGroupAdminStatus(
    departmentId: string,
    userId: string,
    isActive: boolean
  ): Promise<GroupAdminResponse> {
    const department = await prisma.department.findUnique({
      where: { id: departmentId },
    });

    if (!department) {
      throw new ApiError(404, "Department not found");
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || user.departmentId !== departmentId) {
      throw new ApiError(404, "Group admin not found in this department");
    }

    await prisma.groupAdminPermission.updateMany({
      where: { userId },
      data: { isGranted: isActive },
    });

    const permissions = await prisma.groupAdminPermission.findMany({
      where: { userId, isGranted: true },
      include: { permission: true },
    });

    return {
      id: user.id,
      userId: user.id,
      userName: user.fullName,
      userEmail: user.email,
      studentID: user.studentID || undefined,
      departmentId,
      departmentName: department.name,
      permissions: permissions.map((p) => p.permission.name as Permission),
      isActive,
      stats: await calculateGroupAdminStats(user.id, departmentId),
      createdAt: user.createdAt.toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  /**
   * Remove group admin
   */
  async removeGroupAdmin(departmentId: string, userId: string): Promise<void> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || user.departmentId !== departmentId) {
      throw new ApiError(404, "Group admin not found in this department");
    }

    // Delete all permissions
    await prisma.groupAdminPermission.deleteMany({
      where: { userId },
    });

    // Revert role to STUDENT
    const studentRole = await prisma.role.findUnique({
      where: { name: "STUDENT" },
    });

    if (studentRole) {
      await prisma.user.update({
        where: { id: userId },
        data: { roleId: studentRole.id },
      });
    }
  }

  /**
   * Get available permissions
   */
  async getAvailablePermissions(): Promise<PermissionDefinition[]> {
    return AVAILABLE_PERMISSIONS;
  }

  /**
   * Get department analytics — real aggregations for the queried date range
   * (defaults to the trailing 12 months). Percent-trend metrics compare the
   * selected window against the preceding window of equal length.
   */
  async getDepartmentAnalytics(
    departmentId: string,
    filters?: DepartmentAnalyticsFiltersDto
  ): Promise<DepartmentAnalytics> {
    const department = await prisma.department.findUnique({
      where: { id: departmentId },
    });

    if (!department) {
      throw new ApiError(404, "Department not found");
    }

    // ---- Resolve the comparison windows -----------------------------------
    // Default window: the trailing 12 months ending today.
    const end = filters?.endDate ? new Date(filters.endDate) : new Date();
    const resolvedStart = filters?.startDate
      ? new Date(filters.startDate)
      : new Date(end.getTime() - 365 * 86_400_000);
    const rangeMs = Math.max(end.getTime() - resolvedStart.getTime(), 86_400_000);
    const prevEnd = new Date(resolvedStart.getTime() - 1);
    const prevStart = new Date(prevEnd.getTime() - rangeMs);

    const rangeLabel = `${resolvedStart.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })} - ${end.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })}`;

    const departmentWhere = { departmentId };
    const dateWhere = { date: { gte: resolvedStart, lte: end } };

    // ---- Core aggregates ---------------------------------------------------
    const [
      eventsInRange,
      registrationsInRange,
      uniqueStudentsInRange,
      activeGroups,
      registrationsAllTime,
      categoryRows,
      statusRows,
      modeRows,
      topEvents,
      recentEvents,
      groupAdmins,
    ] = await Promise.all([
      // Events happening in the window (used for monthly buckets)
      prisma.event.findMany({
        where: { ...departmentWhere, ...dateWhere },
        select: { id: true, date: true, maxCapacity: true, currentRegistrations: true },
      }),
      prisma.registration.findMany({
        where: {
          status: { not: RegistrationStatus.CANCELLED },
          event: { ...departmentWhere, ...dateWhere },
        },
        select: { userId: true, registeredAt: true, status: true },
      }),
      prisma.registration.findMany({
        where: {
          status: { not: RegistrationStatus.CANCELLED },
          event: { ...departmentWhere, ...dateWhere },
        },
        select: { userId: true },
        distinct: ["userId"],
      }),
      prisma.user.count({
        where: {
          departmentId,
          isActive: true,
          role: { name: RoleType.GROUP_ADMIN },
        },
      }),
      prisma.registration.count({
        where: {
          status: { not: RegistrationStatus.CANCELLED },
          event: departmentWhere,
        },
      }),
      prisma.event.groupBy({
        by: ["category"],
        where: { ...departmentWhere, ...dateWhere },
        _count: { _all: true },
        orderBy: { _count: { category: "desc" } },
      }),
      prisma.event.groupBy({
        by: ["status"],
        where: { ...departmentWhere, ...dateWhere },
        _count: { _all: true },
      }),
      prisma.event.groupBy({
        by: ["mode"],
        where: { ...departmentWhere, ...dateWhere },
        _count: { _all: true },
        orderBy: { _count: { mode: "desc" } },
      }),
      // Top 5 events by registrations inside the window
      prisma.event.findMany({
        where: { ...departmentWhere, ...dateWhere },
        orderBy: { currentRegistrations: "desc" },
        take: 5,
        select: { id: true, title: true, currentRegistrations: true, maxCapacity: true },
      }),
      // 5 most recently updated events for the "Recent Events" list
      prisma.event.findMany({
        where: departmentWhere,
        orderBy: { updatedAt: "desc" },
        take: 5,
        select: { id: true, title: true, date: true, status: true },
      }),
      // Group admins of this department (the "groups")
      prisma.user.findMany({
        where: {
          departmentId,
          isActive: true,
          role: { name: RoleType.GROUP_ADMIN },
        },
        select: {
          id: true,
          fullName: true,
          _count: {
            select: {
              membershipsAdmin: true,
              createdEvents: { where: { departmentId, ...dateWhere } },
            },
          },
        },
        orderBy: { createdEvents: { _count: "desc" } },
        take: 5,
      }),
    ]);

    // ---- Previous-window numbers for trend percentages ---------------------
    const [
      prevEventCount,
      prevRegistrations,
      prevUniqueStudents,
      prevActiveGroups,
    ] = await Promise.all([
      prisma.event.count({ where: { ...departmentWhere, date: { gte: prevStart, lte: prevEnd } } }),
      prisma.registration.count({
        where: {
          status: { not: RegistrationStatus.CANCELLED },
          event: { ...departmentWhere, date: { gte: prevStart, lte: prevEnd } },
        },
      }),
      prisma.registration.findMany({
        where: {
          status: { not: RegistrationStatus.CANCELLED },
          event: { ...departmentWhere, date: { gte: prevStart, lte: prevEnd } },
        },
        select: { userId: true },
        distinct: ["userId"],
      }),
      prisma.user.count({
        where: {
          departmentId,
          isActive: true,
          role: { name: RoleType.GROUP_ADMIN },
          createdAt: { lte: prevEnd },
        },
      }),
    ]);

    const percentChange = (current: number, previous: number): number =>
      previous > 0
        ? Math.round(((current - previous) / previous) * 1000) / 10
        : current > 0
          ? 100
          : 0;

    // ---- Monthly buckets over the queried window ---------------------------
    const monthBuckets: { key: string; label: string; start: Date; end: Date }[] = [];
    {
      const cursor = new Date(Date.UTC(resolvedStart.getUTCFullYear(), resolvedStart.getUTCMonth(), 1));
      const lastKey = getAnalyticsMonthKey(end);
      while (getAnalyticsMonthKey(cursor) <= lastKey) {
        const start = new Date(cursor);
        const bucketEnd = new Date(Date.UTC(cursor.getUTCFullYear(), cursor.getUTCMonth() + 1, 1));
        monthBuckets.push({
          key: getAnalyticsMonthKey(cursor),
          label: start.toLocaleString("en-US", { month: "short", timeZone: "UTC" }),
          start,
          end: bucketEnd,
        });
        cursor.setUTCMonth(cursor.getUTCMonth() + 1);
      }
    }

    const monthlyTrend = monthBuckets.map((month) => ({
      month: month.label,
      monthKey: month.key,
      registrations: registrationsInRange.filter(
        (r) => r.registeredAt >= month.start && r.registeredAt < month.end,
      ).length,
      students: new Set(
        registrationsInRange
          .filter((r) => r.registeredAt >= month.start && r.registeredAt < month.end)
          .map((r) => r.userId),
      ).size,
      attendees: registrationsInRange.filter(
        (r) =>
          r.status === RegistrationStatus.ATTENDED &&
          r.registeredAt >= month.start &&
          r.registeredAt < month.end,
      ).length,
    }));

    const eventsByMonth = monthBuckets.map((month) => ({
      month: month.label,
      monthKey: month.key,
      count: eventsInRange.filter((event) => event.date >= month.start && event.date < month.end).length,
    }));

    // ---- Overview + derived rates ------------------------------------------
    const totalRegistrations = registrationsInRange.length;
    const totalCapacity = eventsInRange.reduce((sum, event) => sum + event.maxCapacity, 0);
    const fillRate =
      totalCapacity > 0
        ? Math.round((totalRegistrations / totalCapacity) * 1000) / 10
        : 0;

    const completedEvents = statusRows.find((row) => row.status === EventStatus.COMPLETED)?._count._all ?? 0;
    const statusTotal = statusRows.reduce((sum, row) => sum + row._count._all, 0);

    const trends = {
      totalEvents: percentChange(eventsInRange.length, prevEventCount),
      totalRegistrations: percentChange(totalRegistrations, prevRegistrations),
      uniqueStudents: percentChange(uniqueStudentsInRange.length, prevUniqueStudents.length),
      activeGroups: percentChange(activeGroups, prevActiveGroups),
      fillRate: 0,
    };

    // ---- Top groups: members + events ---------------------------------------
    const topGroups = groupAdmins.map((admin) => ({
      id: admin.id,
      name: admin.fullName.includes("'") ? admin.fullName : `${admin.fullName}'s Group`,
      members: admin._count.membershipsAdmin,
      events: admin._count.createdEvents,
    }));

    // ---- Insights -----------------------------------------------------------
    const insights: DepartmentAnalytics["insights"] = [];
    if (trends.totalRegistrations !== 0) {
      insights.push({
        icon: "trend",
        text: `Registrations ${trends.totalRegistrations > 0 ? "increased" : "decreased"} by ${Math.abs(trends.totalRegistrations)}% compared to the previous period.`,
      });
    }
    const topCategory = categoryRows[0];
    if (topCategory) {
      insights.push({
        icon: "category",
        text: `${topCategory.category} events are the most popular (${Math.round(
          (topCategory._count._all / Math.max(statusTotal, 1)) * 100,
        )}%).`,
      });
    }
    insights.push({
      icon: "students",
      text: `${uniqueStudentsInRange.length} unique students participated in department events.`,
    });
    insights.push({
      icon: "rating",
      text: `Events reached ${fillRate}% of total capacity on average.`,
    });
    if (trends.activeGroups !== 0) {
      insights.push({
        icon: "activity",
        text: `Group activity has ${trends.activeGroups > 0 ? "increased" : "decreased"} by ${Math.abs(trends.activeGroups)}%.`,
      });
    }

    return {
      range: { start: resolvedStart.toISOString(), end: end.toISOString(), label: rangeLabel },
      overview: {
        totalEvents: eventsInRange.length,
        totalRegistrations,
        uniqueStudents: uniqueStudentsInRange.length,
        activeGroups,
        fillRate,
        totalParticipants: registrationsAllTime,
        averageAttendance: totalRegistrations > 0
          ? Math.round(
              (registrationsInRange.filter((r) => r.status === RegistrationStatus.ATTENDED).length /
                totalRegistrations) * 1000,
            ) / 10
          : 0,
        completionRate:
          statusTotal > 0 ? Math.round((completedEvents / statusTotal) * 1000) / 10 : 0,
      },
      trends,
      monthlyTrend,
      eventsByMonth,
      eventBreakdown: {
        byCategory: categoryRows.map((row) => ({
          category: row.category,
          count: row._count._all,
          participants: 0,
        })),
        byStatus: statusRows
          .map((row) => ({ status: row.status, count: row._count._all }))
          .sort((a, b) => b.count - a.count),
        byMode: modeRows.map((row) => ({ mode: row.mode, count: row._count._all })),
      },
      topEvents: topEvents.map((event) => ({
        id: event.id,
        title: event.title,
        registrations: event.currentRegistrations,
        capacity: event.maxCapacity,
      })),
      topGroups,
      recentEvents: recentEvents.map((event) => ({
        id: event.id,
        title: event.title,
        date: event.date.toISOString(),
        status: event.status,
      })),
      insights,
      participationTrends: monthlyTrend.map((entry) => ({
        date: entry.month,
        participants: entry.students,
        events: eventsByMonth.find((m) => m.month === entry.month)?.count ?? 0,
      })),
      topPerformers: {
        groupAdmins: topGroups.map((group) => ({
          id: group.id,
          name: group.name,
          eventsCreated: group.events,
          totalParticipants: group.members,
        })),
        events: topEvents.map((event) => ({
          id: event.id,
          title: event.title,
          participants: event.currentRegistrations,
        })),
      },
      recentActivity: recentEvents.map((event) => ({
        type: "EVENT",
        description: event.title,
        timestamp: event.date.toISOString(),
      })),
    };
  }

  /**
   * Department-wide registration records for the registrations screen.
   * Table rows honor the passed filters; the `summary` block is always
   * department-wide (minus the eventId filter, which scopes everything).
   */
  async getDepartmentRegistrations(
    departmentId: string,
    filters?: DepartmentRegistrationsFiltersDto
  ): Promise<DepartmentRegistrationsResponse> {
    const department = await prisma.department.findUnique({
      where: { id: departmentId },
    });

    if (!department) {
      throw new ApiError(404, "Department not found");
    }

    const {
      eventId,
      status,
      search,
      group,
      startDate,
      endDate,
      page = 1,
      limit = 10,
      sortOrder = "desc",
    } = filters || {};

    const eventWhere: any = { departmentId };
    if (eventId) eventWhere.id = eventId;
    if (startDate || endDate) {
      eventWhere.registeredAt = {};
      if (startDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        eventWhere.registeredAt.gte = start;
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        eventWhere.registeredAt.lte = end;
      }
    }

    const registrationWhere: any = { event: eventWhere };
    if (group) registrationWhere.user = { membershipsJoined: { some: { adminId: group } } };
    if (status) registrationWhere.status = this.statusFilterToPrisma(status);

    const skip = (page - 1) * limit;

    const [rows, total, registrations, statusGroup, uniqueStudents, topEvents, groups, recent, eventsWithFirstRegs] =
      await Promise.all([
        prisma.registration.findMany({
          where: registrationWhere,
          include: {
            user: {
              select: { id: true, fullName: true, email: true, avatar: true, studentID: true, membershipsJoined: { select: { adminId: true } } },
            },
            event: { select: { id: true, title: true, date: true, time: true } },
          },
          orderBy: { registeredAt: sortOrder },
          skip,
          take: limit,
        }),
        prisma.registration.count({ where: registrationWhere }),
        // Full set for summary aggregates (cheap scalar select).
        prisma.registration.findMany({
          where: { event: eventId ? { departmentId, id: eventId } : { departmentId } },
          select: { userId: true, status: true, registeredAt: true, eventId: true },
        }),
        prisma.registration.groupBy({
          by: ["status"],
          where: { event: eventId ? { departmentId, id: eventId } : { departmentId } },
          _count: { _all: true },
        }),
        prisma.registration.findMany({
          where: { event: eventId ? { departmentId, id: eventId } : { departmentId } },
          select: { userId: true },
          distinct: ["userId"],
        }),
        prisma.event.findMany({
          where: eventId ? { departmentId, id: eventId } : { departmentId },
          orderBy: { currentRegistrations: "desc" },
          take: 5,
          select: { id: true, title: true, currentRegistrations: true, maxCapacity: true },
        }),
        // Group filter options: admins of groups the department's registrants belong to.
        prisma.user.findMany({
          where: {
            departmentId,
            role: { name: RoleType.GROUP_ADMIN },
            membershipsAdmin: {
              some: { user: { registrations: { some: { event: { departmentId } } } } },
            },
          },
          select: { id: true, fullName: true },
        }),
        prisma.registration.findMany({
          where: { event: eventId ? { departmentId, id: eventId } : { departmentId } },
          orderBy: { registeredAt: "desc" },
          take: 4,
          select: {
            id: true,
            registeredAt: true,
            user: { select: { id: true, fullName: true, avatar: true } },
            event: { select: { id: true, title: true } },
          },
        }),
        // Events whose EARLIEST registration falls in the current month
        // ("2 new this month" on the Events tile).
        prisma.event.findMany({
          where: { departmentId, registrations: { some: {} } },
          select: {
            id: true,
            registrations: {
              select: { registeredAt: true },
              orderBy: { registeredAt: "asc" },
              take: 1,
            },
          },
        }),
      ]);

    const totalRegistrations = registrations.length;

    // "New this month" = events that started taking registrations this month.
    const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const newEventsThisMonth = eventsWithFirstRegs.filter(
      (event) => event.registrations[0] && event.registrations[0].registeredAt >= monthStart,
    ).length;

    const confirmed = statusGroup.find((row) => row.status === RegistrationStatus.REGISTERED)?._count._all ?? 0;
    const attended = statusGroup.find((row) => row.status === RegistrationStatus.ATTENDED)?._count._all ?? 0;
    const cancelled = statusGroup.find((row) => row.status === RegistrationStatus.CANCELLED)?._count._all ?? 0;
    const others = statusGroup.find((row) => row.status === RegistrationStatus.ABSENT)?._count._all ?? 0;

    // Percent change vs the trailing 30-day window.
    const now = new Date();
    const currentWindowStart = new Date(now.getTime() - 30 * 86_400_000);
    const prevWindowStart = new Date(now.getTime() - 60 * 86_400_000);

    const trendOf = (current: number, previous: number): number =>
      previous > 0 ? Math.round(((current - previous) / previous) * 1000) / 10 : current > 0 ? 100 : 0;

    const currentRegs = registrations.filter((r) => r.registeredAt >= currentWindowStart);
    const prevRegs = registrations.filter(
      (r) => r.registeredAt >= prevWindowStart && r.registeredAt < currentWindowStart,
    );
    const currentStudents = new Set(currentRegs.map((r) => r.userId)).size;
    const prevStudents = new Set(prevRegs.map((r) => r.userId)).size;
    const currentAttended = currentRegs.filter((r) => r.status === RegistrationStatus.ATTENDED).length;
    const prevAttended = prevRegs.filter((r) => r.status === RegistrationStatus.ATTENDED).length;
    const currentCancelled = currentRegs.filter((r) => r.status === RegistrationStatus.CANCELLED).length;
    const prevCancelled = prevRegs.filter((r) => r.status === RegistrationStatus.CANCELLED).length;

    const groupNameById = new Map(
      groups.map((admin) => [admin.id, `${admin.fullName.includes("'") ? admin.fullName : `${admin.fullName}'s Group`}`]),
    );

    const data: DepartmentRegistrationRow[] = rows.map((row) => ({
      id: row.id,
      userId: row.user.id,
      userName: row.user.fullName,
      userEmail: row.user.email,
      userAvatar: row.user.avatar ?? undefined,
      studentID: row.user.studentID ?? undefined,
      eventId: row.event.id,
      eventTitle: row.event.title,
      eventDate: row.event.date.toISOString(),
      eventTime: row.event.time,
      group: row.user.membershipsJoined[0]
        ? {
            id: row.user.membershipsJoined[0].adminId,
            name: groupNameById.get(row.user.membershipsJoined[0].adminId) ?? "Group",
          }
        : null,
      status: deriveRegistrationStatus(row.status),
      rawStatus: row.status,
      registeredAt: row.registeredAt.toISOString(),
      attendedAt: row.attendedAt?.toISOString() ?? null,
      cancelledAt: row.cancelledAt?.toISOString() ?? null,
    }));

    return {
      data,
      summary: {
        totalRegistrations,
        uniqueStudents: uniqueStudents.length,
        events: new Set(registrations.map((r) => r.eventId)).size,
        newEventsThisMonth,
        confirmed,
        attended,
        cancelled,
        others,
        trends: {
          totalRegistrations: trendOf(currentRegs.length, prevRegs.length),
          uniqueStudents: trendOf(currentStudents, prevStudents),
          attended: trendOf(currentAttended, prevAttended),
          cancelled: trendOf(currentCancelled, prevCancelled),
        },
        groups: groups.map((admin) => ({ id: admin.id, name: groupNameById.get(admin.id) ?? admin.fullName })),
        topEvents: topEvents.map((event) => ({
          id: event.id,
          title: event.title,
          registrations: event.currentRegistrations,
          capacity: event.maxCapacity,
        })),
        recentRegistrations: recent.map((row) => ({
          id: row.id,
          userName: row.user.fullName,
          userAvatar: row.user.avatar ?? undefined,
          eventId: row.event.id,
          eventTitle: row.event.title,
          registeredAt: row.registeredAt.toISOString(),
        })),
      },
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  /** "CONFIRMED" matches REGISTERED or ATTENDED; the rest map 1:1. */
  private statusFilterToPrisma(status: DerivedRegistrationStatus) {
    if (status === "CONFIRMED") {
      return { in: [RegistrationStatus.REGISTERED, RegistrationStatus.ATTENDED] };
    }
    if (status === "CANCELLED") return RegistrationStatus.CANCELLED;
    return RegistrationStatus.ABSENT;
  }
}

export default new DepartmentService();