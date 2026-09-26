import { prisma } from "../config/db.js";
import ApiError from "../utils/ApiError.js";
import { RoleType } from "../../generated/prisma/enums.js";

// ============================================================================
// BOOKMARKS
// ============================================================================

export const listBookmarksService = async (userId: string) => {
  return prisma.bookmark.findMany({
    where: { userId },
    include: {
      event: { include: { department: true } },
    },
    orderBy: { createdAt: "desc" },
  });
};

export const addBookmarkService = async (userId: string, eventId: string) => {
  const event = await prisma.event.findUnique({ where: { id: eventId } });
  if (!event) {
    throw new ApiError(404, "Event not found");
  }

  // Idempotent — bookmarking twice is not an error.
  return prisma.bookmark.upsert({
    where: { userId_eventId: { userId, eventId } },
    update: {},
    create: { userId, eventId },
  });
};

export const removeBookmarkService = async (userId: string, eventId: string) => {
  await prisma.bookmark.deleteMany({ where: { userId, eventId } });
};

export const countBookmarksService = (userId: string) =>
  prisma.bookmark.count({ where: { userId } });

// ============================================================================
// GROUPS & CLUBS (group-admin led groups) + MEMBERSHIP
// ============================================================================

export const listGroupsService = async (viewerId?: string) => {
  const groupAdmins = await prisma.user.findMany({
    where: { role: { name: RoleType.GROUP_ADMIN }, isActive: true },
    select: {
      id: true,
      fullName: true,
      studentID: true,
      department: { select: { id: true, name: true, code: true } },
      _count: {
        select: {
          createdEvents: true,
          membershipsAdmin: true,
        },
      },
      ...(viewerId
        ? {
            membershipsAdmin: {
              where: { userId: viewerId },
              select: { id: true },
            },
          }
        : {}),
    },
    orderBy: { fullName: "asc" },
  });

  return groupAdmins.map((admin) => ({
    id: admin.id,
    name: admin.studentID ? `${admin.fullName}'s Group` : admin.fullName,
    leader: admin.fullName,
    department: admin.department,
    eventCount: admin._count.createdEvents,
    memberCount: admin._count.membershipsAdmin,
    isMember: viewerId ? admin.membershipsAdmin.length > 0 : false,
  }));
};

export const getGroupDetailService = async (adminId: string, viewerId?: string) => {
  const admin = await prisma.user.findFirst({
    where: { id: adminId, role: { name: RoleType.GROUP_ADMIN }, isActive: true },
    select: {
      id: true,
      fullName: true,
      studentID: true,
      email: true,
      department: { select: { id: true, name: true, code: true } },
      _count: { select: { membershipsAdmin: true } },
      membershipsAdmin: viewerId
        ? { where: { userId: viewerId }, select: { id: true } }
        : false,
      createdEvents: {
        where: { status: "PUBLISHED" },
        select: { id: true, title: true, date: true, category: true },
        orderBy: { date: "asc" },
      },
    },
  });

  if (!admin) {
    throw new ApiError(404, "Group not found");
  }

  const membershipRows = Array.isArray(admin.membershipsAdmin)
    ? admin.membershipsAdmin
    : [];

  return {
    id: admin.id,
    name: admin.studentID ? `${admin.fullName}'s Group` : admin.fullName,
    leader: admin.fullName,
    email: admin.email,
    department: admin.department,
    memberCount: admin._count.membershipsAdmin,
    isMember: membershipRows.length > 0,
    events: admin.createdEvents,
  };
};

export const joinGroupService = async (userId: string, adminId: string) => {
  const admin = await prisma.user.findFirst({
    where: { id: adminId, role: { name: RoleType.GROUP_ADMIN }, isActive: true },
  });
  if (!admin) {
    throw new ApiError(404, "Group not found");
  }

  // Idempotent — joining twice is not an error.
  await prisma.groupMembership.upsert({
    where: { userId_adminId: { userId, adminId } },
    update: {},
    create: { userId, adminId },
  });
};

export const leaveGroupService = async (userId: string, adminId: string) => {
  await prisma.groupMembership.deleteMany({ where: { userId, adminId } });
};

export const countMembershipsService = (userId: string) =>
  prisma.groupMembership.count({ where: { userId } });
