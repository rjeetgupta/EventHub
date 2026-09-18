import { EventStatus, RegistrationStatus, RoleType } from "../../generated/prisma/enums.js";
import { prisma } from "../config/db.js";

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

class DashboardService {
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
        where: { registeredAt: { gte: trendStart } },
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

    const eventActivity = months.map((month) => ({
      month: month.label,
      events: events.filter((event) => event.createdAt >= month.start && event.createdAt < month.end).length,
    }));

    const registrationTrend = months.map((month) => ({
      month: month.label,
      registrations: registrations.filter(
        (registration) => registration.registeredAt >= month.start && registration.registeredAt < month.end
      ).length,
    }));

    return {
      summary: { totalEvents, totalStudents, totalRegistrations, departments, activeGroups },
      eventActivity,
      registrationTrend,
      eventsByCategory: eventCategories.map((item) => ({ category: item.category, count: item._count._all })),
      upcomingEvents,
      recentRegistrations,
    };
  }
}

export default new DashboardService();
