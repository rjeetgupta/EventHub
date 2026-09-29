/**
 * Test-data seed: "Test Department" + HOD login, 20 students, 5 events in 2027.
 *
 * Idempotent — safe to run repeatedly (upserts + skipped creations).
 * Run with: cd server && npx tsx prisma/seed-test-department.ts
 *
 * Logins created:
 *   HOD     hod.test@edu.com        / Hod@123
 *   Student student01.test@edu.com  / Student@123  (… student20.test@edu.com)
 */
import bcrypt from "bcrypt";
import { prisma } from "../src/config/db.js";
import { RoleType, EventStatus, EventMode } from "../generated/prisma/enums.js";

const DEPT = { name: "Test Department", code: "TEST" };

const HOD = {
  email: "hod.test@edu.com",
  password: "Hod@123",
  fullName: "Dr. Test Hod",
};

const STUDENT_PASSWORD = "Student@123";
const STUDENT_COUNT = 20;

const FIRST_NAMES = [
  "Aarav", "Diya", "Rohan", "Isha", "Karan", "Ananya", "Vivek", "Priya",
  "Arjun", "Sneha", "Rahul", "Meera", "Aditya", "Pooja", "Nikhil", "Tara",
  "Sanjay", "Kavya", "Manish", "Riya",
];
const LAST_NAMES = [
  "Sharma", "Verma", "Iyer", "Patel", "Das", "Nair", "Gupta", "Reddy",
];

/**
 * Five events per department, organized in 2027 (upcoming → registration open).
 * Deadlines sit ~10 days before each event date.
 */
const EVENTS_2027 = [
  {
    title: "TestFest 2027 — Annual Tech Carnival",
    description:
      "A grand celebration of technology with coding contests, robotics exhibitions, startup showcases and expert talks. Open to all departments — compete, learn and network.",
    date: "2027-03-15", time: "09:00", category: "Technical",
    mode: EventMode.HYBRID, venue: "Test Department Main Auditorium",
    link: "https://meet.google.com/testfest-2027", maxCapacity: 500,
  },
  {
    title: "AI & Future Skills Workshop 2027",
    description:
      "Hands-on workshop covering applied AI, prompt engineering and building real projects with modern tooling. Certificates for all participants; laptops required.",
    date: "2027-02-08", time: "10:00", category: "Workshop",
    mode: EventMode.OFFLINE, venue: "Test Department Lab 101",
    link: null, maxCapacity: 120,
  },
  {
    title: "Test Talks: Career Guidance Seminar",
    description:
      "Industry mentors and alumni share insights on careers in tech, higher studies and entrepreneurship, followed by an open Q&A and networking session.",
    date: "2027-01-20", time: "11:00", category: "Seminar",
    mode: EventMode.OFFLINE, venue: "Seminar Hall B",
    link: null, maxCapacity: 200,
  },
  {
    title: "Test Premier League 2027",
    description:
      "Inter-class sports meet featuring cricket, football and athletics. Team registrations via class representatives — show your department spirit!",
    date: "2027-04-10", time: "08:30", category: "Sports",
    mode: EventMode.OFFLINE, venue: "Central Sports Complex",
    link: null, maxCapacity: 300,
  },
  {
    title: "Test Night: Cultural Evening 2027",
    description:
      "An evening of music, dance and drama celebrating diverse talents. Live band performances, solo and group acts, and the much-awaited prize distribution.",
    date: "2027-03-28", time: "17:00", category: "Cultural",
    mode: EventMode.OFFLINE, venue: "Open Air Theatre",
    link: null, maxCapacity: 400,
  },
] as const;

function daysAgo(days: number): Date {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000);
}

function deadlineFor(dateStr: string): Date {
  const deadline = new Date(`${dateStr}T00:00:00.000Z`);
  deadline.setUTCDate(deadline.getUTCDate() - 10);
  return deadline;
}

/** Roll numbers encode admission year → deriveYearLabel() buckets them nicely. */
function rollNumber(index: number): string {
  const admissionYear = 2024 + (index % 3); // 2024/2025/2026 → 3rd/2nd/1st yr mix
  return `TST${admissionYear}${String(index + 1).padStart(3, "0")}`;
}

function studentEmail(index: number): string {
  return `student${String(index + 1).padStart(2, "0")}.test@edu.com`;
}

async function seedTestDepartment() {
  const department = await prisma.department.upsert({
    where: { code: DEPT.code },
    update: {},
    create: {
      name: DEPT.name,
      code: DEPT.code,
      description:
        "Test department created for demos — HOD login, 20 students and five 2027 events.",
    },
  });
  console.log(`✔ Department ready: ${department.name} (${department.code})`);

  // ------------------------------------------------------------------ HOD --
  const deptAdminRole = await prisma.role.findUnique({
    where: { name: RoleType.DEPARTMENT_ADMIN },
  });
  if (!deptAdminRole) throw new Error("DEPARTMENT_ADMIN role not found — run the main seed first");

  const hodPassword = await bcrypt.hash(HOD.password, 10);
  await prisma.user.upsert({
    where: { email: HOD.email },
    update: { departmentId: department.id, roleId: deptAdminRole.id, isActive: true },
    create: {
      email: HOD.email,
      password: hodPassword,
      fullName: HOD.fullName,
      roleId: deptAdminRole.id,
      departmentId: department.id,
      isActive: true,
    },
  });
  console.log(`✔ HOD ready: ${HOD.email} / ${HOD.password}`);

  // -------------------------------------------------------------- Students --
  const studentRole = await prisma.role.findUnique({
    where: { name: RoleType.STUDENT },
  });
  if (!studentRole) throw new Error("STUDENT role not found — run the main seed first");

  const studentPassword = await bcrypt.hash(STUDENT_PASSWORD, 10);
  const students = [];
  for (let index = 0; index < STUDENT_COUNT; index++) {
    const email = studentEmail(index);
    const student = await prisma.user.upsert({
      where: { email },
      update: { departmentId: department.id, roleId: studentRole.id, isActive: true },
      create: {
        email,
        password: studentPassword,
        fullName: `${FIRST_NAMES[index % FIRST_NAMES.length]} ${LAST_NAMES[index % LAST_NAMES.length]}`,
        studentID: rollNumber(index),
        roleId: studentRole.id,
        departmentId: department.id,
        isActive: true,
      },
    });
    students.push(student);
  }
  console.log(`✔ ${students.length} students ready (e.g. ${studentEmail(0)} / ${STUDENT_PASSWORD})`);

  // ---------------------------------------------------------------- Events --
  const creator = await prisma.user.findUnique({ where: { email: HOD.email } });
  if (!creator) throw new Error("HOD user missing — cannot create events");

  const superAdmin = await prisma.user.findUnique({
    where: { email: process.env.SUPER_ADMIN_EMAIL ?? "admin@edu.com" },
  });

  let createdCount = 0;
  for (const event of EVENTS_2027) {
    const existing = await prisma.event.findFirst({
      where: { title: event.title, departmentId: department.id },
    });
    if (existing) continue;

    const created = await prisma.event.create({
      data: {
        title: event.title,
        description: event.description,
        date: new Date(`${event.date}T00:00:00.000Z`),
        time: event.time,
        mode: event.mode,
        venue: event.venue,
        link: event.link,
        registrationDeadline: deadlineFor(event.date),
        maxCapacity: event.maxCapacity,
        category: event.category,
        status: EventStatus.PUBLISHED,
        approvedAt: daysAgo(3),
        approvedById: superAdmin?.id ?? creator.id,
        departmentId: department.id,
        creatorId: creator.id,
      },
    });

    // A realistic spread of early registrations from the department's students.
    const registrants = students.slice(0, 6 + (createdCount * 3));
    await prisma.registration.createMany({
      data: registrants.map((student, i) => ({
        userId: student.id,
        eventId: created.id,
        status: "REGISTERED" as const,
        registeredAt: daysAgo(2 - (i % 3)),
      })),
      skipDuplicates: true,
    });
    await prisma.event.update({
      where: { id: created.id },
      data: { currentRegistrations: registrants.length },
    });

    createdCount += 1;
  }
  console.log(`✔ ${createdCount} events created in 2027 (5 intended, skipped existing)`);
}

seedTestDepartment()
  .catch((error) => {
    console.error("Test-department seeding failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
