import { prisma } from "../config/db.js";
import ApiError from "../utils/ApiError.js";
import { EventStatus, RoleType } from "../../generated/prisma/enums.js";
import type {
  CreateGroupInput,
  UpdateGroupInput,
  GroupFiltersInput,
} from "../validators/group.validator.js";

/**
 * A "group" is a student community inside a department, led by a GROUP_ADMIN
 * (the group admin user created by the department admin). The group identity
 * is derived from the GroupMembership rows pointing at that admin — there is
 * no dedicated Group table, so "creating" a group promotes/uses an existing
 * department student as its admin and seeds the membership row.
 */

export interface GroupResponse {
  id: string;
  name: string;
  description: string | null;
  category: string;
  isActive: boolean;
  departmentId: string;
  departmentName: string;
  adminId: string;
  adminName: string;
  adminEmail: string;
  adminAvatar: string | null;
  memberCount: number;
  eventCount: number;
  activeEventCount: number;
  createdAt: string;
  updatedAt: string;
}

interface GroupOverview {
  totalGroups: number;
  totalMembers: number;
  eventsOrganized: number;
  activeGroups: number;
}

/** Group-name → category defaults used when creating a group. */
const resolveAdminUser = async (departmentId: string, adminId?: string) => {
  const where: any = {
    departmentId,
    role: { name: RoleType.GROUP_ADMIN },
    isActive: true,
  };
  if (adminId) where.id = adminId;

  const admin = await prisma.user.findFirst({
    where,
    orderBy: { createdAt: "asc" },
  });

  if (!admin) {
    throw new ApiError(
      404,
      adminId
        ? "Group admin not found in this department"
        : "No group admin available in this department. Assign a group admin first."
    );
  }

  return admin;
};

const countGroupMembers = (adminId: string) =>
  prisma.groupMembership.count({ where: { adminId } });

class GroupService {
  /**
   * List groups for a department. Super Admin may pass any departmentId;
   * everyone else is scoped to their own department.
   */
  async getGroups(
    filters: GroupFiltersInput,
    userId: string,
    userRole: RoleType
  ) {
    const {
      search,
      status = "all",
      category,
      sortBy = "createdAt",
      sortOrder = "desc",
      page = 1,
      limit = 10,
    } = filters;

    const requester = await prisma.user.findUnique({
      where: { id: userId },
      select: { departmentId: true },
    });

    let departmentId: string;
    if (userRole === RoleType.SUPER_ADMIN) {
      const department = await prisma.department.findFirst({
        orderBy: { createdAt: "asc" },
      });
      if (!department) {
        throw new ApiError(404, "No departments exist yet");
      }
      departmentId = department.id;
    } else {
      if (!requester?.departmentId) {
        throw new ApiError(400, "User must belong to a department");
      }
      departmentId = requester.departmentId;
    }

    const department = await prisma.department.findUnique({
      where: { id: departmentId },
    });
    if (!department) {
      throw new ApiError(404, "Department not found");
    }

    // Group admins of this department = candidate groups.
    const admins = await prisma.user.findMany({
      where: {
        departmentId,
        role: { name: RoleType.GROUP_ADMIN },
        isActive: true,
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
        membershipsAdmin: { select: { id: true } },
        createdEvents: {
          select: {
            status: true,
            _count: { select: { registrations: true } },
          },
        },
      },
      orderBy: { createdAt: sortOrder === "asc" ? "asc" : "desc" },
    });

    let groups = await Promise.all(
      admins.map(async (admin) => {
        const memberCount = admin.membershipsAdmin.length;
        const eventCount = admin.createdEvents.length;
        const activeStatuses: EventStatus[] = [
          EventStatus.PUBLISHED,
          EventStatus.ONGOING,
        ];
        const activeEventCount = admin.createdEvents.filter((event) =>
          activeStatuses.includes(event.status)
        ).length;
        const totalRegistrations = admin.createdEvents.reduce(
          (sum, event) => sum + event._count.registrations,
          0
        );

        return {
          id: admin.id,
          name: `${admin.fullName}'s Group`,
          description: null as string | null,
          category: "General" as string,
          isActive: true,
          departmentId,
          departmentName: department.name,
          adminId: admin.id,
          adminName: admin.fullName,
          adminEmail: admin.email,
          adminAvatar: admin.avatar,
          memberCount,
          eventCount,
          activeEventCount,
          totalRegistrations,
          createdAt: admin.createdAt.toISOString(),
          updatedAt: admin.updatedAt.toISOString(),
        };
      })
    );

    // Filters
    if (search) {
      const q = search.toLowerCase();
      groups = groups.filter(
        (group) =>
          group.name.toLowerCase().includes(q) ||
          group.adminName.toLowerCase().includes(q) ||
          group.adminEmail.toLowerCase().includes(q)
      );
    }
    if (category && category !== "all") {
      groups = groups.filter(
        (group) => group.category.toLowerCase() === category.toLowerCase()
      );
    }
    if (status !== "all") {
      groups = groups.filter(
        (group) => (status === "active") === group.isActive
      );
    }

    // Sort
    groups.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name) * (sortOrder === "asc" ? 1 : -1);
        case "members":
          return (a.memberCount - b.memberCount) * (sortOrder === "asc" ? 1 : -1);
        case "events":
          return (a.eventCount - b.eventCount) * (sortOrder === "asc" ? 1 : -1);
        default:
          return 0; // already DB-sorted by createdAt
      }
    });

    const total = groups.length;
    const skip = (page - 1) * limit;
    const paged = groups.slice(skip, skip + limit);

    return {
      data: paged,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    };
  }

  /** Overview stat tiles for the Group Management screen. */
  async getGroupOverview(departmentId?: string): Promise<GroupOverview> {
    const where: any = {};
    if (departmentId) where.departmentId = departmentId;

    const admins = await prisma.user.findMany({
      where: { ...where, role: { name: RoleType.GROUP_ADMIN }, isActive: true },
      select: {
        id: true,
        createdAt: true,
        membershipsAdmin: { select: { id: true } },
        createdEvents: {
          select: {
            status: true,
            date: true,
            _count: { select: { registrations: true } },
          },
        },
      },
    });

    const totalMembers = admins.reduce(
      (sum, admin) => sum + admin.membershipsAdmin.length,
      0
    );
    const eventsOrganized = admins.reduce(
      (sum, admin) =>
        sum +
        admin.createdEvents.filter((event) => event.status !== EventStatus.DRAFT)
          .length,
      0
    );
    const activeGroups = admins.filter((admin) =>
      admin.createdEvents.some((event) => event.status === EventStatus.PUBLISHED)
    ).length;

    return {
      totalGroups: admins.length,
      totalMembers,
      eventsOrganized,
      activeGroups,
    };
  }

  /**
   * Create a group: promotes the chosen (or first available) department
   * student community admin and seeds an empty membership row if none exists.
   */
  async createGroup(data: CreateGroupInput, userId: string, userRole: RoleType) {
    const requester = await prisma.user.findUnique({
      where: { id: userId },
      select: { departmentId: true },
    });

    let departmentId: string | null | undefined;
    if (userRole === RoleType.SUPER_ADMIN) {
      departmentId = null; // must be inferred from adminId
    } else {
      departmentId = requester?.departmentId;
      if (!departmentId) {
        throw new ApiError(400, "User must belong to a department");
      }
    }

    const admin = await resolveAdminUser(departmentId!, data.adminId);

    // Ensure at least a self-membership row exists so the group is visible.
    const existingMembership = await prisma.groupMembership.findFirst({
      where: { adminId: admin.id },
    });

    if (!existingMembership) {
      await prisma.groupMembership.create({
        data: { userId: admin.id, adminId: admin.id },
      });
    }

    return {
      id: admin.id,
      name: `${admin.fullName}'s Group`,
      description: data.description ?? null,
      category: data.category,
      isActive: true,
      departmentId: admin.departmentId!,
      departmentName: "",
      adminId: admin.id,
      adminName: admin.fullName,
      adminEmail: admin.email,
      adminAvatar: admin.avatar,
      memberCount: await countGroupMembers(admin.id),
      eventCount: 0,
      activeEventCount: 0,
      createdAt: admin.createdAt.toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  /**
   * Update a group's metadata (display fields live with its admin user where
   * applicable) or swap its admin.
   */
  async updateGroup(
    departmentId: string,
    groupId: string,
    data: UpdateGroupInput,
    userId: string,
    userRole: RoleType
  ) {
    const admin = await prisma.user.findUnique({
      where: { id: groupId },
      include: { role: true },
    });

    if (!admin || admin.role.name !== RoleType.GROUP_ADMIN) {
      throw new ApiError(404, "Group not found");
    }

    if (userRole === RoleType.DEPARTMENT_ADMIN) {
      const requester = await prisma.user.findUnique({
        where: { id: userId },
        select: { departmentId: true },
      });
      if (requester?.departmentId !== admin.departmentId) {
        throw new ApiError(403, "You can only manage groups in your department");
      }
    }

    // Display-name edits flow through the admin's profile name.
    if (data.name) {
      const cleaned = data.name.replace(/'s Group$/i, "").trim();
      if (cleaned.length >= 3) {
        await prisma.user.update({
          where: { id: admin.id },
          data: { fullName: cleaned },
        });
      }
    }

    return {
      id: admin.id,
      name: data.name ?? `${admin.fullName}'s Group`,
      description: data.description ?? null,
      category: data.category ?? "General",
      isActive: data.isActive ?? true,
      departmentId: admin.departmentId!,
      departmentName: "",
      adminId: admin.id,
      adminName: data.name ?? admin.fullName,
      adminEmail: admin.email,
      adminAvatar: admin.avatar,
      memberCount: await countGroupMembers(admin.id),
      eventCount: await prisma.event.count({ where: { creatorId: admin.id } }),
      activeEventCount: 0,
      createdAt: admin.createdAt.toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  /**
   * Delete a group = remove its memberships and demote the admin back to
   * STUDENT. Their created events remain (owned by the department).
   */
  async deleteGroup(
    departmentId: string,
    groupId: string,
    userId: string,
    userRole: RoleType
  ) {
    const admin = await prisma.user.findUnique({
      where: { id: groupId },
      include: { role: true },
    });

    if (!admin || admin.role.name !== RoleType.GROUP_ADMIN) {
      throw new ApiError(404, "Group not found");
    }

    if (userRole === RoleType.DEPARTMENT_ADMIN) {
      const requester = await prisma.user.findUnique({
        where: { id: userId },
        select: { departmentId: true },
      });
      if (requester?.departmentId !== admin.departmentId) {
        throw new ApiError(403, "You can only manage groups in your department");
      }
    }

    await prisma.$transaction([
      prisma.groupMembership.deleteMany({ where: { adminId: admin.id } }),
      prisma.groupAdminPermission.deleteMany({ where: { userId: admin.id } }),
      prisma.user.update({
        where: { id: admin.id },
        data: {
          role: {
            connect: { name: RoleType.STUDENT },
          },
        },
      }),
    ]);
  }

  /** Activate / deactivate a group (toggles its admin user). */
  async toggleGroupStatus(
    departmentId: string,
    groupId: string,
    isActive: boolean
  ) {
    const admin = await prisma.user.findUnique({
      where: { id: groupId },
      include: { role: true },
    });

    if (!admin || admin.role.name !== RoleType.GROUP_ADMIN) {
      throw new ApiError(404, "Group not found");
    }

    await prisma.user.update({
      where: { id: admin.id },
      data: { isActive },
    });

    return {
      id: admin.id,
      isActive,
    };
  }
}

export default new GroupService();
