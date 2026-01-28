import { EventStatus, EventMode, RegistrationStatus } from "../../generated/prisma/enums";
import { UserRole } from "./common.types";



export interface Event {
  id: string;
  title: string;
  description: string;
  date: string; // ISO string
  time: string;
  mode: EventMode;
  venue?: string;
  link?: string;
  registrationDeadline: string; // ISO string
  maxCapacity: number;
  currentRegistrations: number;
  category: string;
  status: EventStatus;
  approvedAt?: string;
  approvedById?: string;
  approvedByName?: string;
  rejectionReason?: string;
  departmentId: string;
  departmentName?: string;
  creatorId: string;
  creatorName?: string;
  createdAt: string;
  updatedAt: string;
}

// REGISTRATION TYPES

export interface Registration {
  id: string;
  userId: string;
  userName?: string;
  userEmail?: string;
  studentID?: string;
  eventId: string;
  eventTitle?: string;
  status: RegistrationStatus;
  registeredAt: string;
  attendedAt?: string;
  cancelledAt?: string;
}

// REQUEST

export interface CreateEventDto {
  title: string;
  description: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  mode: EventMode;
  venue?: string;
  link?: string;
  registrationDeadline: string; // YYYY-MM-DD
  maxCapacity: number;
  category: string;
}

export interface UpdateEventDto {
  title?: string;
  description?: string;
  date?: string;
  time?: string;
  mode?: EventMode;
  venue?: string;
  link?: string;
  registrationDeadline?: string;
  maxCapacity?: number;
  category?: string;
  status?: EventStatus;
}

export interface EventFilters {
  search?: string;
  departments?: string[];
  categories?: string[];
  mode?: EventMode | "All";
  status?: EventStatus;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
  sortBy?: "date" | "title" | "createdAt";
  sortOrder?: "asc" | "desc";
}

export interface ApprovalDto {
  action: "approve" | "reject";
  feedback?: string;
}

export interface MarkAttendanceDto {
  userIds: string[];
}

// RESPONSE TYPES

export interface EventsResponse {
  data: Event[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface MyEventsResponse {
  events: Event[];
  registrations: Registration[];
}

export interface EventRegistrationsResponse {
  registrations: Registration[];
  total: number;
}

export interface EventStatsResponse {
  totalRegistrations: number;
  attended: number;
  absent: number;
  cancelled: number;
  attendanceRate: number;
}