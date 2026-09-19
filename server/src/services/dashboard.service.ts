import { EventStatus, RegistrationStatus, RoleType } from "../../generated/prisma/enums.js";
import { prisma } from "../config/db.js";
import ApiError from "../utils/ApiError.js";

const getMonthKey = (date: Date) =>
  `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;

const getLastSixMonths = () => {
  const months: { key: string; label: string; start: Date; end: Date }[] = [];
  const now = new Date();

  for (let offset = 5; offset >= 0; offset -= 1) {
    const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - offset, 1));
    const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - offset + 1, 1));
    months.push({
      key: getMonthKey(start),
      label: start.toLocaleString("en-US", { month: "short", timeZone: "UTC" }),
      start,
      end,
    });
  }

  return months;
};

const countByMonth = (
  items: { date: Date }[],
  months: { start: Date; end: Date }[]
) =>
  months.map((month) => ({
    month: "",
    count: items.filter((item) => item.date >= month.start && item.date < month.end).length,
  }));

const toDateList = <T>(items: T[], pick: (item: T) => Date) =>
  items.map((item) => ({ date: pick(item) }));

class DashboardService {
  /** Super Admin: college-wide metrics. */
  async getAdminDashboard() {
    const months = getLastSixMonths();
    const trendStart = months[0].start;

    const [
      totalEvents,
      totalStudents,
      totalRegistrations,
      departments,
      activeGroups,
      eventCategories,
      events,
      registrations,
      upcomingEvents,
      recentRegistrations,
    ] = await Promise.all([
      prisma.event.count(),
      prisma.user.count({ where: { role: { name: RoleType.STUDENT }, isActive: true } }),
      prisma.registration.count({ where: { status: { not: RegistrationStatus.CANCELLED } } }),
      prisma.department.count(),
      prisma.user.count({ where: { role: { name: RoleType.GROUP_ADMIN }, isActive: true } }),
      prisma.event.groupBy({ by: ["category"], _count: { _all: true }, orderBy: { _count: { category: "desc" } } }),
      prisma.event.findMany({
        where: { createdAt: { gte: trendStart } },
        select: { createdAt: true },
      }),
      prisma.registration.findMany({
        where: { registeredAt: { gte: trendStart }, status: { not: RegistrationStatus.CANCELLED } },
        select: { registeredAt: true },
      }),
      prisma.event.findMany({
        where: {
          date: { gte: new Date() },
          status: { in: [EventStatus.PUBLISHED, EventStatus.APPROVED] },
        },
        orderBy: { date: "asc" },
        take: 5,
        include: { department: { select: { name: true } } },
      }),
      prisma.registration.findMany({
        orderBy: { registeredAt: "desc" },
        take: 8,
        include: {
          user: { select: { id: true, fullName: true, avatar: true } },
          event: { select: { id: true, title: true, department: { select: { name: true } } } },
        },
      }),
    ]);

    const eventActivity = countByMonth(
      toDateList(events, (event) => event.createdAt),
      months
    ).map((m, i) => ({
      month: months[i].label,
      events: m.count,
    }));

    const registrationTrend = countByMonth(
      toDateList(registrations, (registration) => registration.registeredAt),
      months
    ).map((m, i) => ({
      month: months[i].label,
      registrations: m.count,
    }));

    const statusRows = await prisma.event.groupBy({
      by: ["status"],
      _count: { _all: true },
    });
    const statusCount = (status: EventStatus) =>
      statusRows.find((row) => row.status === status)?._count._all ?? 0;

    return {
      summary: { totalEvents, totalStudents, totalRegistrations, departments, activeGroups },
      eventActivity,
      registrationTrend,
      eventsByCategory: eventCategories.map((item) => ({ category: item.category, count: item._count._all })),
      eventStatus: {
        active: statusCount(EventStatus.PUBLISHED) + statusCount(EventStatus.APPROVED),
        draft: statusCount(EventStatus.DRAFT),
        completed: statusCount(EventStatus.COMPLETED),
      },
      upcomingEvents: upcomingEvents.map((event) => ({
        id: event.id,
        title: event.title,
        date: event.date.toISOString(),
        time: event.time,
        venue: event.venue,
        department: event.department.name,
        currentRegistrations: event.currentRegistrations,
        maxCapacity: event.maxCapacity,
      })),
      recentRegistrations,
    };
  }

  /** Department Admin: metrics scoped to the admin's department. */
  async getDepartmentDashboard(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { departmentId: true },
    });

    if (!user?.departmentId) {
      throw new ApiError(400, "User must belong to a department");
    }

    const departmentId = user.departmentId;
    const months = getLastSixMonths();
    const trendStart = months[0].start;
    const departmentWhere = { departmentId };

    const [
      department,
      totalEvents,
      totalStudents,
      totalGroups,
      totalRegistrations,
      categories,
      events,
      registrations,
      upcomingEvents,
      recentRegistrations,
    ] = await Promise.all([
      prisma.department.findUnique({
        where: { id: departmentId },
        select: { id: true, name: true, code: true, description: true },
      }),
      prisma.event.count({ where: departmentWhere }),
      prisma.user.count({
        where: { departmentId, role: { name: RoleType.STUDENT }, isActive: true },
      }),
      prisma.user.count({
        where: { departmentId, role: { name: RoleType.GROUP_ADMIN }, isActive: true },
      }),
      prisma.registration.count({
        where: { status: { not: RegistrationStatus.CANCELLED }, event: departmentWhere },
      }),
      prisma.event.groupBy({
        by: ["category"],
        where: departmentWhere,
        _count: { _all: true },
        orderBy: { _count: { category: "desc" } },
      }),
      prisma.event.findMany({
        where: { ...departmentWhere, createdAt: { gte: trendStart } },
        select: { createdAt: true },
      }),
      prisma.registration.findMany({
        where: {
          registeredAt: { gte: trendStart },
          status: { not: RegistrationStatus.CANCELLED },
          event: departmentWhere,
        },
        select: { registeredAt: true },
      }),
      prisma.event.findMany({
        where: {
          ...departmentWhere,
          date: { gte: new Date() },
          status: { in: [EventStatus.PUBLISHED, EventStatus.APPROVED] },
        },
        orderBy: { date: "asc" },
        take: 5,
        select: {
          id: true,
          title: true,
          date: true,
          time: true,
          venue: true,
          status: true,
        },
      }),
      prisma.registration.findMany({
        where: { status: { not: RegistrationStatus.CANCELLED }, event: departmentWhere },
        orderBy: { registeredAt: "desc" },
        take: 8,
        include: {
          user: { select: { id: true, fullName: true, avatar: true } },
          event: { select: { id: true, title: true } },
        },
      }),
    ]);

    const activeEvents = await prisma.event.count({
      where: { ...departmentWhere, status: { in: [EventStatus.PUBLISHED, EventStatus.APPROVED, EventStatus.ONGOING] } },
    });
    const draftEvents = await prisma.event.count({
      where: { ...departmentWhere, status: EventStatus.DRAFT },
    });
    const completedEvents = await prisma.event.count({
      where: { ...departmentWhere, status: EventStatus.COMPLETED },
    });

    const attendedCount = await prisma.registration.count({
      where: { status: RegistrationStatus.ATTENDED, event: departmentWhere },
    });

    const eventActivity = countByMonth(
      toDateList(events, (event) => event.createdAt),
      months
    ).map((m, i) => ({
      month: months[i].label,
      events: m.count,
    }));

    const registrationTrend = countByMonth(
      toDateList(registrations, (registration) => registration.registeredAt),
      months
    ).map((m, i) => ({
      month: months[i].label,
      registrations: m.count,
    }));

    return {
      department: department
        ? { id: department.id, name: department.name, code: department.code, description: department.description }
        : null,
      summary: {
        totalEvents,
        totalStudents,
        activeGroups: totalGroups,
        totalRegistrations,
        activeEvents,
        draftEvents,
        completedEvents,
        participationRate: totalStudents ? Math.round((attendedCount / totalStudents) * 100) : 0,
        activeParticipants: attendedCount,
      },
      eventActivity,
      registrationTrend,
      eventsByType: categories.map((item) => ({ category: item.category, count: item._count._all })),
      upcomingEvents,
      recentRegistrations: recentRegistrations.map((registration) => ({
        id: registration.id,
        registeredAt: registration.registeredAt.toISOString(),
        user: { id: registration.user.id, fullName: registration.user.fullName, avatar: registration.user.avatar },
        event: { id: registration.event.id, title: registration.event.title },
      })),
    };
  }

  /** Group Admin: metrics scoped to the events the admin's group created. */
  async getGroupDashboard(userId: string) {
    const [user, totalEvents, totalMembers, totalRegistrations] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: { departmentId: true },
      }),
      prisma.event.count({ where: { creatorId: userId } }),
      prisma.user.count({ where: { role: { name: RoleType.STUDENT }, isActive: true } }),
      prisma.registration.count({
        where: { status: { not: RegistrationStatus.CANCELLED }, event: { creatorId: userId } },
      }),
    ]);

    if (!user?.departmentId) {
      throw new ApiError(400, "User must belong to a department");
    }

    const months = getLastSixMonths();
    const trendStart = months[0].start;
    const groupWhere = { creatorId: userId };

    const [
      upcomingEvents,
      participatedMembers,
      recentRegistrations,
      eventActivity,
      registrationTrend,
    ] = await Promise.all([
      prisma.event.findMany({
        where: {
          ...groupWhere,
          date: { gte: new Date() },
          status: { in: [EventStatus.DRAFT, EventStatus.PENDING_APPROVAL, EventStatus.APPROVED, EventStatus.PUBLISHED] },
        },
        orderBy: { date: "asc" },
        take: 5,
        select: {
          id: true,
          title: true,
          date: true,
          time: true,
          venue: true,
          link: true,
          mode: true,
          status: true,
        },
      }),
      prisma.registration.count({
        where: { status: RegistrationStatus.ATTENDED, event: groupWhere },
      }),
      prisma.registration.findMany({
        where: { status: { not: RegistrationStatus.CANCELLED }, event: groupWhere },
        orderBy: { registeredAt: "desc" },
        take: 8,
        include: {
          user: { select: { id: true, fullName: true, avatar: true } },
          event: { select: { id: true, title: true } },
        },
      }),
      prisma.event.findMany({
        where: { ...groupWhere, createdAt: { gte: trendStart } },
        select: { createdAt: true },
      }),
      prisma.registration.findMany({
        where: {
          registeredAt: { gte: trendStart },
          status: { not: RegistrationStatus.CANCELLED },
          event: groupWhere,
        },
        select: { registeredAt: true },
      }),
    ]);

    const notParticipated = Math.max(0, totalMembers - participatedMembers);

    const group = await prisma.user.findUnique({
      where: { id: userId },
      select: { fullName: true, department: { select: { name: true, code: true } } },
    });

    return {
      group: {
        name: group?.fullName ? `${group.fullName}'s Group` : "My Group",
        department: group?.department?.name ?? null,
      },
      summary: {
        totalEvents,
        totalMembers,
        totalRegistrations,
        upcomingEvents: upcomingEvents.length,
        participatedMembers,
        notParticipatedMembers: notParticipated,
      },
      eventActivity: countByMonth(
        toDateList(eventActivity, (event) => event.createdAt),
        months
      ).map((m, i) => ({
        month: months[i].label,
        events: m.count,
      })),
      registrationTrend: countByMonth(
        toDateList(registrationTrend, (registration) => registration.registeredAt),
        months
      ).map((m, i) => ({
        month: months[i].label,
        registrations: m.count,
      })),
      upcomingEvents,
      recentRegistrations: recentRegistrations.map((registration) => ({
        id: registration.id,
        registeredAt: registration.registeredAt.toISOString(),
        user: { id: registration.user.id, fullName: registration.user.fullName, avatar: registration.user.avatar },
        event: { id: registration.event.id, title: registration.event.title },
      })),
    };
  }

  /** Student: the signed-in student's own registrations and activity. */
  async getStudentDashboard(userId: string) {
    const months = getLastSixMonths();

    const [
      user,
      myRegistrations,
      recommendedEvents,
      upcomingRegistered,
      announcements,
    ] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: {
          fullName: true,
          studentID: true,
          department: { select: { name: true, code: true } },
        },
      }),
      prisma.registration.findMany({
        where: { userId, status: { not: RegistrationStatus.CANCELLED } },
        include: {
          event: {
            select: {
              id: true,
              title: true,
              date: true,
              time: true,
              venue: true,
              mode: true,
              status: true,
              category: true,
              currentRegistrations: true,
              maxCapacity: true,
            },
          },
        },
      }),
      prisma.event.findMany({
        where: {
          date: { gte: new Date() },
          status: { in: [EventStatus.PUBLISHED] },
        },
        orderBy: [{ currentRegistrations: "desc" }],
        take: 4,
        select: {
          id: true,
          title: true,
          description: true,
          date: true,
          time: true,
          venue: true,
          mode: true,
          category: true,
          currentRegistrations: true,
          maxCapacity: true,
          department: { select: { name: true } },
        },
      }),
      prisma.registration.findMany({
        where: {
          userId,
          status: { not: RegistrationStatus.CANCELLED },
          event: { date: { gte: new Date() } },
        },
        orderBy: { registeredAt: "asc" },
        take: 3,
        include: {
          event: {
            select: { id: true, title: true, date: true, time: true, venue: true, mode: true },
          },
        },
      }),
      prisma.event.findMany({
        where: { createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } },
        orderBy: { createdAt: "desc" },
        take: 4,
        select: {
          id: true,
          title: true,
          createdAt: true,
          category: true,
          department: { select: { name: true } },
        },
      }),
    ]);

    const registeredEvents = myRegistrations.map((registration) => registration.eventId);
    const attendedCount = myRegistrations.filter(
      (registration) => registration.status === RegistrationStatus.ATTENDED
    ).length;

    return {
      student: {
        fullName: user?.fullName ?? null,
        studentID: user?.studentID ?? null,
        department: user?.department?.name ?? null,
      },
      summary: {
        totalRegistrations: myRegistrations.length,
        attendedEvents: attendedCount,
        upcomingRegistered: upcomingRegistered.length,
      },
      recommendedEvents,
      upcomingEvents: upcomingRegistered.map((registration) => ({
        registrationId: registration.id,
        status: registration.status,
        event: registration.event,
      })),
      announcements: announcements.map((event) => ({
        id: event.id,
        title: event.title,
        createdAt: event.createdAt.toISOString(),
        category: event.category,
        department: event.department.name,
      })),
      registeredEventIds: registeredEvents,
    };
  }
}

export default new DashboardService();
