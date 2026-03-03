import { prisma } from "../config/db";
import ApiError from "../utils/ApiError";
import { EventStatus, RoleType, RegistrationStatus } from "../../generated/prisma/enums"
import { ApprovalDto, CreateEventDto, EventFilters, MarkAttendanceDto, UpdateEventDto,  } from "../types/event.types";
import { CreateEventInput } from "../validators/event.validator";
import { UserRole } from "../types/common.types";

class EventService {
  /**
   * Get all events with filters
   */
  async getEvents(filters: EventFilters, userId?: string, userRole?: RoleType) {
    const {
      search,
      departments,
      categories,
      mode,
      status,
      dateFrom,
      dateTo,
      page = 1,
      limit = 10,
      sortBy = "date",
      sortOrder = "asc",
    } = filters;

    const where: any = {};

    // Search filter
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { category: { contains: search, mode: "insensitive" } },
      ];
    }

    // Department filter
    if (departments && departments.length > 0) {
      where.departmentId = { in: departments };
    }

    // Category filter
    if (categories && categories.length > 0) {
      where.category = { in: categories };
    }

    // Mode filter
    if (mode && mode !== "All") {
      where.mode = mode;
    }

    // Status filter
    if (status) {
      where.status = status;
    } else {
      // Default: only show published events for students
      if (userRole === RoleType.STUDENT) {
        where.status = EventStatus.PUBLISHED;
      }
    }

    // Date range filter
    if (dateFrom || dateTo) {
      where.date = {};
      if (dateFrom) where.date.gte = new Date(dateFrom);
      if (dateTo) where.date.lte = new Date(dateTo);
    }

    const skip = (page - 1) * limit;

    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          department: { select: { name: true } },
          creator: { select: { fullName: true } },
          approvedBy: { select: { fullName: true } },
          registrations: {
            select: { userId: true },
          },
        },
      }),
      prisma.event.count({ where }),
    ]);

    const transformedEvents = events.map((event) => ({
      id: event.id,
      title: event.title,
      description: event.description,
      date: event.date.toISOString(),
      time: event.time,
      mode: event.mode,
      venue: event.venue || undefined,
      link: event.link || undefined,
      registrationDeadline: event.registrationDeadline.toISOString(),
      maxCapacity: event.maxCapacity,
      currentRegistrations: event.currentRegistrations,
      category: event.category,
      status: event.status,
      approvedAt: event.approvedAt?.toISOString(),
      approvedById: event.approvedById || undefined,
      approvedByName: event.approvedBy?.fullName,
      rejectionReason: event.rejectionReason || undefined,
      departmentId: event.departmentId,
      departmentName: event.department.name,
      creatorId: event.creatorId,
      creatorName: event.creator.fullName,
      registeredUsers: event.registrations.map(r => r.userId),
      createdAt: event.createdAt.toISOString(),
      updatedAt: event.updatedAt.toISOString(),
    }));

    return {
      data: transformedEvents,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get event by ID
   */
  async getEventById(id: string, userId?: string) {
    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        department: { select: { name: true } },
        creator: { select: { fullName: true } },
        approvedBy: { select: { fullName: true } },
        registrations: {
          select: { userId: true },
        },
      },
    });

    if (!event) {
      throw new ApiError(404, "Event not found");
    }

    return {
      id: event.id,
      title: event.title,
      description: event.description,
      date: event.date.toISOString(),
      time: event.time,
      mode: event.mode,
      venue: event.venue || undefined,
      link: event.link || undefined,
      registrationDeadline: event.registrationDeadline.toISOString(),
      maxCapacity: event.maxCapacity,
      currentRegistrations: event.currentRegistrations,
      category: event.category,
      status: event.status,
      approvedAt: event.approvedAt?.toISOString(),
      approvedById: event.approvedById || undefined,
      approvedByName: event.approvedBy?.fullName,
      rejectionReason: event.rejectionReason || undefined,
      departmentId: event.departmentId,
      departmentName: event.department.name,
      creatorId: event.creatorId,
      creatorName: event.creator.fullName,
      registeredUsers: event.registrations.map(r => r.userId),
      createdAt: event.createdAt.toISOString(),
      updatedAt: event.updatedAt.toISOString(),
    };
  }

  /**
   * Create event
   * - DEPT_ADMIN and ADMIN: Create and auto-publish (status = PUBLISHED)
   * - GROUP_ADMIN: Create as PENDING_APPROVAL (needs approval)
   */
  async createEvent(data: CreateEventInput, userId: string) {
    // Get user's department and role
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { department: true, role: true },
    });

    if (!user || !user.departmentId) {
      throw new ApiError(400, "User must belong to a department to create events");
    }

    // Determine initial status based on role
    const isDepartmentAdmin = user.role.name === RoleType.DEPARTMENT_ADMIN;
    const isSuperAdmin = user.role.name === RoleType.SUPER_ADMIN;
    const isGroupAdmin = user.role.name === RoleType.GROUP_ADMIN;

    let initialStatus: EventStatus;
    let approvedById: string | undefined;
    let approvedAt: Date | undefined;

    if (isDepartmentAdmin || isSuperAdmin) {
      // Auto-publish for department admins and super admins
      initialStatus = EventStatus.PUBLISHED;
      approvedById = userId; // Self-approved
      approvedAt = new Date();
    } else if (isGroupAdmin) {
      // Needs approval for group admins
      initialStatus = EventStatus.PENDING_APPROVAL;
    } else {
      throw new ApiError(403, "You don't have permission to create events");
    }

    // Create event
    const event = await prisma.event.create({
      data: {
        title: data.title,
        description: data.description,
        date: new Date(data.date),
        time: data.time,
        mode: data.mode,
        venue: data.venue || null,
        link: data.link || null,
        registrationDeadline: new Date(data.registrationDeadline),
        maxCapacity: data.maxCapacity,
        category: data.category,
        status: initialStatus,
        departmentId: user.departmentId,
        creatorId: userId,
        approvedById: approvedById,
        approvedAt: approvedAt,
      },
      include: {
        department: { select: { name: true } },
        creator: { select: { fullName: true } },
      },
    });

    return this.getEventById(event.id, userId);
  }

  /**
   * Save draft (partial validation, status = DRAFT)
   */
  async saveDraft(data: Partial<CreateEventInput>, userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { department: true, role: true },
    });

    if (!user || !user.departmentId) {
      throw new ApiError(400, "User must belong to a department to create events");
    }

    // Create as draft with partial data
    const event = await prisma.event.create({
      data: {
        title: data.title || "Untitled Event",
        description: data.description || "",
        date: data.date ? new Date(data.date) : new Date(),
        time: data.time || "00:00",
        mode: data.mode || "OFFLINE",
        venue: data.venue || null,
        link: data.link || null,
        registrationDeadline: data.registrationDeadline 
          ? new Date(data.registrationDeadline) 
          : new Date(),
        maxCapacity: data.maxCapacity || 50,
        category: data.category || "Other",
        status: EventStatus.DRAFT,
        departmentId: user.departmentId,
        creatorId: userId,
      },
      include: {
        department: { select: { name: true } },
        creator: { select: { fullName: true } },
      },
    });

    return this.getEventById(event.id, userId);
  }

  /**
   * Update event
   */
  async updateEvent(
    id: string,
    data: UpdateEventDto,
    userId: string,
    userRole: RoleType
  ) {
    const event = await prisma.event.findUnique({
      where: { id },
      include: { creator: true },
    });

    if (!event) {
      throw new ApiError(404, "Event not found");
    }

    // Authorization: Only creator or admins can update
    if (userRole === RoleType.GROUP_ADMIN && event.creatorId !== userId) {
      throw new ApiError(403, "You can only update your own events");
    }

    // Cannot update published/completed events
    if ([EventStatus.PUBLISHED, EventStatus.COMPLETED].includes(event.status)) {
      throw new ApiError(400, "Cannot update published or completed events");
    }

    await prisma.event.update({
      where: { id },
      data: {
        ...(data.title && { title: data.title }),
        ...(data.description && { description: data.description }),
        ...(data.date && { date: new Date(data.date) }),
        ...(data.time && { time: data.time }),
        ...(data.mode && { mode: data.mode }),
        ...(data.venue !== undefined && { venue: data.venue || null }),
        ...(data.link !== undefined && { link: data.link || null }),
        ...(data.registrationDeadline && {
          registrationDeadline: new Date(data.registrationDeadline),
        }),
        ...(data.maxCapacity && { maxCapacity: data.maxCapacity }),
        ...(data.category && { category: data.category }),
        ...(data.status && { status: data.status }),
      },
    });

    return this.getEventById(id, userId);
  }

  /**
   * Delete event
   */
  async deleteEvent(id: string, userId: string, userRole: RoleType) {
    const event = await prisma.event.findUnique({ where: { id } });

    if (!event) {
      throw new ApiError(404, "Event not found");
    }

    // Authorization
    if (userRole === RoleType.GROUP_ADMIN && event.creatorId !== userId) {
      throw new ApiError(403, "You can only delete your own events");
    }

    // Cannot delete published/ongoing events
    if ([EventStatus.PUBLISHED, EventStatus.ONGOING].includes(event.status)) {
      throw new ApiError(400, "Cannot delete published or ongoing events");
    }

    await prisma.event.delete({ where: { id } });
  }

  /**
   * Submit event for approval (GROUP_ADMIN only)
   */
  async submitForApproval(id: string, userId: string) {
    const event = await prisma.event.findUnique({ where: { id } });

    if (!event) {
      throw new ApiError(404, "Event not found");
    }

    if (event.creatorId !== userId) {
      throw new ApiError(403, "You can only submit your own events");
    }

    if (event.status !== EventStatus.DRAFT) {
      throw new ApiError(400, "Only draft events can be submitted");
    }

    await prisma.event.update({
      where: { id },
      data: { status: EventStatus.PENDING_APPROVAL },
    });

    return this.getEventById(id, userId);
  }

  /**
   * Approve/Reject event (DEPT_ADMIN only)
   * When approved, auto-publish the event
   */
  async handleApproval(id: string, data: ApprovalDto, approverId: string) {
    const event = await prisma.event.findUnique({ where: { id } });

    if (!event) {
      throw new ApiError(404, "Event not found");
    }

    if (event.status !== EventStatus.PENDING_APPROVAL) {
      throw new ApiError(400, "Only pending events can be approved/rejected");
    }

    // Determine new status: PUBLISHED if approved, REJECTED if rejected
    const newStatus = data.action === "approve" 
      ? EventStatus.PUBLISHED 
      : EventStatus.REJECTED;

    await prisma.event.update({
      where: { id },
      data: {
        status: newStatus,
        approvedById: approverId,
        approvedAt: new Date(),
        ...(data.feedback && { rejectionReason: data.feedback }),
      },
    });

    // Create approval record
    await prisma.approval.create({
      data: {
        eventId: id,
        action: data.action,
        feedback: data.feedback,
        approvedBy: approverId,
      },
    });

    return this.getEventById(id);
  }

  /**
   * Publish event directly (Department Admin)
   * Allows publishing pending or approved events
   */
  async publishEvent(id: string, userId: string) {
    const event = await prisma.event.findUnique({ where: { id } });

    if (!event) {
      throw new ApiError(404, "Event not found");
    }

    if (
      ![EventStatus.PENDING_APPROVAL, EventStatus.APPROVED].includes(
        event.status
      )
    ) {
      throw new ApiError(
        400,
        "Only pending or approved events can be published"
      );
    }

    await prisma.event.update({
      where: { id },
      data: {
        status: EventStatus.PUBLISHED,
        approvedById: userId,
        approvedAt: new Date(),
      },
    });

    return this.getEventById(id);
  }

  /**
   * Get department events
   */
  async getDepartmentEvents(userId: string, status?: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { department: true },
    });

    if (!user || !user.departmentId) {
      throw new ApiError(400, "User must belong to a department");
    }

    const where: any = { departmentId: user.departmentId };

    if (status) {
      where.status = status;
    }

    const events = await prisma.event.findMany({
      where,
      include: {
        department: { select: { name: true } },
        creator: { select: { fullName: true } },
        approvedBy: { select: { fullName: true } },
        registrations: {
          select: { userId: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return events.map((event) => ({
      id: event.id,
      title: event.title,
      description: event.description,
      date: event.date.toISOString(),
      time: event.time,
      mode: event.mode,
      venue: event.venue || undefined,
      link: event.link || undefined,
      registrationDeadline: event.registrationDeadline.toISOString(),
      maxCapacity: event.maxCapacity,
      currentRegistrations: event.currentRegistrations,
      category: event.category,
      status: event.status,
      approvedAt: event.approvedAt?.toISOString(),
      approvedById: event.approvedById || undefined,
      approvedByName: event.approvedBy?.fullName,
      rejectionReason: event.rejectionReason || undefined,
      departmentId: event.departmentId,
      departmentName: event.department.name,
      creatorId: event.creatorId,
      creatorName: event.creator.fullName,
      registeredUsers: event.registrations.map(r => r.userId),
      createdAt: event.createdAt.toISOString(),
      updatedAt: event.updatedAt.toISOString(),
    }));
  }

  /**
   * Register for event (Student)
   */
  async registerForEvent(eventId: string, userId: string) {
    const event = await prisma.event.findUnique({ where: { id: eventId } });

    if (!event) {
      throw new ApiError(404, "Event not found");
    }

    if (event.status !== EventStatus.PUBLISHED) {
      throw new ApiError(400, "Event is not open for registration");
    }

    if (new Date() > event.registrationDeadline) {
      throw new ApiError(400, "Registration deadline has passed");
    }

    if (event.currentRegistrations >= event.maxCapacity) {
      throw new ApiError(400, "Event is full");
    }

    // Check if already registered
    const existing = await prisma.registration.findUnique({
      where: {
        userId_eventId: { userId, eventId },
      },
    });

    if (existing) {
      throw new ApiError(409, "You are already registered for this event");
    }

    // Create registration
    const registration = await prisma.registration.create({
      data: {
        userId,
        eventId,
        status: RegistrationStatus.REGISTERED,
      },
      include: {
        user: { select: { fullName: true, email: true, studentID: true } },
        event: { select: { title: true } },
      },
    });

    // Update event registration count
    await prisma.event.update({
      where: { id: eventId },
      data: { currentRegistrations: { increment: 1 } },
    });

    return {
      id: registration.id,
      userId: registration.userId,
      userName: registration.user.fullName,
      userEmail: registration.user.email,
      studentID: registration.user.studentID || undefined,
      eventId: registration.eventId,
      eventTitle: registration.event.title,
      status: registration.status,
      registeredAt: registration.registeredAt.toISOString(),
    };
  }

  /**
   * Cancel registration
   */
  async cancelRegistration(eventId: string, userId: string) {
    const registration = await prisma.registration.findUnique({
      where: {
        userId_eventId: { userId, eventId },
      },
      include: { event: true },
    });

    if (!registration) {
      throw new ApiError(404, "Registration not found");
    }

    if (registration.status === RegistrationStatus.ATTENDED) {
      throw new ApiError(400, "Cannot cancel registration after attending");
    }

    if (new Date() >= registration.event.date) {
      throw new ApiError(400, "Cannot cancel registration after event has started");
    }

    // Update registration status
    await prisma.registration.update({
      where: { id: registration.id },
      data: {
        status: RegistrationStatus.CANCELLED,
        cancelledAt: new Date(),
      },
    });

    // Decrease event registration count
    await prisma.event.update({
      where: { id: eventId },
      data: { currentRegistrations: { decrement: 1 } },
    });
  }

  /**
   * Get user's registered events
   */
  async getMyEvents(userId: string, status?: "upcoming" | "finished") {
    const where: any = {
      userId,
      status: { not: RegistrationStatus.CANCELLED },
    };

    if (status === "upcoming") {
      where.event = { date: { gte: new Date() } };
    } else if (status === "finished") {
      where.event = { date: { lt: new Date() } };
    }

    const registrations = await prisma.registration.findMany({
      where,
      include: {
        event: {
          include: {
            department: { select: { name: true } },
            creator: { select: { fullName: true } },
          },
        },
      },
      orderBy: { event: { date: "asc" } },
    });

    const events = registrations.map((reg) => ({
      id: reg.event.id,
      title: reg.event.title,
      description: reg.event.description,
      date: reg.event.date.toISOString(),
      time: reg.event.time,
      mode: reg.event.mode,
      venue: reg.event.venue || undefined,
      link: reg.event.link || undefined,
      registrationDeadline: reg.event.registrationDeadline.toISOString(),
      maxCapacity: reg.event.maxCapacity,
      currentRegistrations: reg.event.currentRegistrations,
      category: reg.event.category,
      status: reg.event.status,
      departmentId: reg.event.departmentId,
      departmentName: reg.event.department.name,
      creatorId: reg.event.creatorId,
      creatorName: reg.event.creator.fullName,
      createdAt: reg.event.createdAt.toISOString(),
      updatedAt: reg.event.updatedAt.toISOString(),
    }));

    const regs = registrations.map((reg) => ({
      id: reg.id,
      userId: reg.userId,
      eventId: reg.eventId,
      eventTitle: reg.event.title,
      status: reg.status,
      registeredAt: reg.registeredAt.toISOString(),
      attendedAt: reg.attendedAt?.toISOString(),
      cancelledAt: reg.cancelledAt?.toISOString(),
    }));

    return { events, registrations: regs };
  }

  /**
   * Mark attendance
   */
  async markAttendance(eventId: string, data: MarkAttendanceDto) {
    const event = await prisma.event.findUnique({ where: { id: eventId } });

    if (!event) {
      throw new ApiError(404, "Event not found");
    }

    // Update registrations
    await prisma.registration.updateMany({
      where: {
        eventId,
        userId: { in: data.userIds },
        status: RegistrationStatus.REGISTERED,
      },
      data: {
        status: RegistrationStatus.ATTENDED,
        attendedAt: new Date(),
      },
    });
  }

  /**
   * Get event registrations
   */
  async getEventRegistrations(eventId: string) {
    const event = await prisma.event.findUnique({ where: { id: eventId } });

    if (!event) {
      throw new ApiError(404, "Event not found");
    }

    const registrations = await prisma.registration.findMany({
      where: { eventId },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            studentID: true,
          },
        },
      },
      orderBy: { registeredAt: "desc" },
    });

    return registrations.map((reg) => ({
      id: reg.id,
      userId: reg.user.id,
      userName: reg.user.fullName,
      userEmail: reg.user.email,
      studentID: reg.user.studentID || undefined,
      status: reg.status,
      registeredAt: reg.registeredAt.toISOString(),
      attendedAt: reg.attendedAt?.toISOString(),
      cancelledAt: reg.cancelledAt?.toISOString(),
    }));
  }

  /**
   * Close registration
   */
  async closeRegistration(eventId: string) {
    const event = await prisma.event.findUnique({ where: { id: eventId } });

    if (!event) {
      throw new ApiError(404, "Event not found");
    }

    if (event.status !== EventStatus.PUBLISHED) {
      throw new ApiError(400, "Only published events can have registration closed");
    }

    await prisma.event.update({
      where: { id: eventId },
      data: { status: EventStatus.REGISTRATION_CLOSED },
    });

    return this.getEventById(eventId);
  }

  /**
   * Generate certificate (placeholder)
   */
  async generateCertificate(eventId: string, userId: string) {
    const registration = await prisma.registration.findUnique({
      where: {
        userId_eventId: { userId, eventId },
      },
      include: {
        event: true,
        user: true,
      },
    });

    if (!registration) {
      throw new ApiError(404, "Registration not found");
    }

    if (registration.status !== RegistrationStatus.ATTENDED) {
      throw new ApiError(400, "Certificate only available for attended events");
    }

    // TODO: Implement actual PDF generation
    // For now, return a placeholder buffer
    return Buffer.from("PDF Certificate Placeholder");
  }
}

export default new EventService();