import { prisma } from "../config/db";
import ApiError from "../utils/ApiError";
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
  CreateDepartmentResponse,
} from "../types/department.types";
import { Permission, UserRole } from "../types/common.types";
import { EventStatus, RegistrationStatus, PermissionType, RoleType } from "../../generated/prisma/enums";
import { hashPassword } from "../utils/password";

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
   * Get department analytics
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

    const stats = await calculateDepartmentStats(departmentId);

    return {
      overview: {
        totalEvents: stats.totalEvents,
        totalParticipants: stats.totalParticipants,
        averageAttendance: stats.averageAttendance,
        completionRate:
          stats.totalEvents > 0
            ? (stats.completedEvents / stats.totalEvents) * 100
            : 0,
        growthRate: 0,
      },
      eventBreakdown: {
        byCategory: [],
        byStatus: [],
        byMode: [],
      },
      participationTrends: [],
      topPerformers: {
        groupAdmins: [],
        events: [],
      },
      recentActivity: [],
    };
  }
}

export default new DepartmentService();