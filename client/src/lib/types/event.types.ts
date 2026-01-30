import { EventMode, EventStatus, RegistrationStatus, UserRole } from "./common.types";

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  mode: EventMode;
  venue?: string | null;
  link?: string | null;
  registrationDeadline: string;
  maxCapacity: number;
  currentRegistrations: number;
  category: string;
  status: EventStatus;
  approvedAt?: string;
  approvedById?: string;
  approvedByName?: string;
  rejectionReason?: string;
  departmentId: string;
  departmentName: string;
  creatorId: string;
  creatorName: string;
  createdAt: string;
  updatedAt: string;
  registeredUsers?: string[];
}

export interface CreateEventRequest {
  title: string;
  description: string;
  date: string;
  time: string;
  mode: 'ONLINE' | 'OFFLINE' | 'HYBRID';
  venue?: string;
  link?: string;
  registrationDeadline: string;
  maxCapacity: number;
  category: string;
}

export interface UpdateEventRequest {
  title?: string;
  description?: string;
  date?: string;
  time?: string;
  mode?: 'ONLINE' | 'OFFLINE' | 'HYBRID';
  venue?: string;
  link?: string;
  registrationDeadline?: string;
  maxCapacity?: number;
  category?: string;
  status?: string;
}

export interface EventFilters {
  search?: string;
  departments?: string[];
  categories?: string[];
  mode?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface EventsResponse {
  events: Event[];
  total: number;
  page: number;
  totalPages: number;
  limit: number;
}

// ============================================================================
// REGISTRATION TYPES
// ============================================================================

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

export interface MyEventsResponse {
  events: Event[];
  registrations: Registration[];
}

// ============================================================================
// APPROVAL & ATTENDANCE TYPES
// ============================================================================

export interface ApprovalRequest {
  action: 'approve' | 'reject';
  feedback?: string;
}

export interface MarkAttendanceRequest {
  userIds: string[];
}

// ============================================================================
// AUTH TYPES
// ============================================================================

export interface User {
  id: string;
  email: string;
  fullName: string;
  studentID?: string;
  avatar?: string;
  role: {
    id: string;
    name: UserRole;
  };
  departmentId?: string;
  departmentName?: string;
}

export interface EventsState {
  events: Event[];
  currentEvent: Event | null;
  myEvents: Event[];
  myRegistrations: Registration[];
  departmentEvents: Event[];
  total: number;
  page: number;
  totalPages: number;
  limit: number;
  isLoading: boolean;
  error: string | null;
  isRegistering: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
}
