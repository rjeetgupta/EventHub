import { prisma } from "../config/prisma.js"

export const getStudentAchievementsService = async (userId: string) => {
  const registrations = await prisma.eventRegistration.findMany({
    where: { userId },
    include: { event: true },
  });

  const participated = registrations.length;
  const attended = registrations.filter(r => r.status === "ATTENDED").length;
  const wins = registrations.filter(r => r.isWinner).length;

  return {
    participated,
    attended,
    wins,
  };
};


export const getStudentEventsService = async (userId: string) => {
    return prisma.eventRegistration.findMany({
      where: { userId },
      include: {
        event: {
          include: { department: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  };

  

  export const getStudentCertificatesService = async (userId: string) => {
    return prisma.eventRegistration.findMany({
      where: {
        userId,
        isWinner: true,
        certificateUrl: { not: null },
      },
      include: {
        event: true,
      },
      orderBy: { position: "asc" },
    });
  };
  