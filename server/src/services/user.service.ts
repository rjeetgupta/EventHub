import { prisma } from "../config/db.js";
import ApiError from "../utils/ApiError.js";

interface GetUsersFilters {
  departmentId?: string;
  role?: string;
  search?: string;
  excludeGroupAdmins?: boolean;
  page?: number;
  limit?: number;
}

class UserService {
  /**
   * List users, optionally scoped by department/role.
   * Used by department/group-admin management to pick eligible students.
   */
  async getUsers(filters: GetUsersFilters) {
    const {
      departmentId,
      role,
      search,
      excludeGroupAdmins = true,
      page = 1,
      limit = 20,
    } = filters;

    const where: any = {
      isActive: true,
      ...(departmentId && { departmentId }),
      ...(role && { role: { name: role } }),
      ...(search && {
        OR: [
          { fullName: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
          { studentID: { contains: search, mode: "insensitive" } },
        ],
      }),
    };

    // Exclude users who already have at least one granted group-admin permission
    if (excludeGroupAdmins) {
      where.groupAdminPermissions = {
        none: { isGranted: true },
      };
    }

    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          fullName: true,
          email: true,
          studentID: true,
          roleId: true,
          departmentId: true,
          role: { select: { name: true } },
        },
        skip,
        take: limit,
        orderBy: { fullName: "asc" },
      }),
      prisma.user.count({ where }),
    ]);

    return {
      data: users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getUserById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        fullName: true,
        email: true,
        studentID: true,
        avatar: true,
        isActive: true,
        departmentId: true,
        department: { select: { id: true, name: true } },
        role: { select: { id: true, name: true } },
      },
    });

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    return user;
  }
}

export default new UserService();
