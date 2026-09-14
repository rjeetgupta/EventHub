import { prisma } from "../config/prisma.js"
import { ApiError } from "../utils/ApiError.js";
import { EventStatus } from "@prisma/client";

export const getEventResultsService = async (
  eventId: string,
  allowEarlyAccess = false
) => {
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: {
      department: true,
    },
  });

  if (!event) throw new ApiError(404, "Event not found");

  if (
    !allowEarlyAccess &&
    ![EventStatus.COMPLETED, EventStatus.ARCHIVED].includes(event.status)
  ) {
    throw new ApiError(403, "Results not published yet");
  }

  const registrations = await prisma.eventRegistration.findMany({
    where: { eventId },
    include: {
      user: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  const winners = registrations.filter((r) => r.isWinner);

  return {
    event: {
      id: event.id,
      title: event.title,
      department: event.department.name,
      status: event.status,
    },
    summary: {
      totalRegistrations: registrations.length,
      attended: registrations.filter(
        (r) => r.status === "ATTENDED"
      ).length,
      winnersCount: winners.length,
    },
    winners: winners.map((w) => w.user),
  };
};


/**
 * export const getEventResultsService = async (
eventId: string,
allowEarlyAccess = false
) => {
const event = await prisma.event.findUnique({
  where: { id: eventId },
  include: { department: true },
});

if (!event) throw new ApiError(404, "Event not found");

if (
  !allowEarlyAccess &&
  !["COMPLETED", "ARCHIVED"].includes(event.status)
) {
  throw new ApiError(403, "Results not published yet");
}

const registrations = await prisma.eventRegistration.findMany({
  where: { eventId },
  include: {
    user: {
      select: { id: true, name: true, email: true },
    },
  },
  orderBy: { position: "asc" },
});

const winners = registrations.filter(r => r.isWinner);

return {
  event: {
    id: event.id,
    title: event.title,
    department: event.department.name,
    status: event.status,
  },
  summary: {
    totalRegistrations: registrations.length,
    attended: registrations.filter(r => r.status === "ATTENDED").length,
    winnersCount: winners.length,
  },
  winners: winners.map(w => ({
    userId: w.user.id,
    name: w.user.name,
    email: w.user.email,
    position: w.position,
    certificateUrl: w.certificateUrl,
  })),
};
};

 */