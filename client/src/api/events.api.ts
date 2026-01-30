/**
 * ============================================================================
 * EVENTS API - IMPROVED VERSION
 * ============================================================================
 * Type-safe event API with Zod validation and proper error handling
 */

import axiosInstance from '@/api/axios';
import {
  Event,
  EventSchema,
  EventsResponse,
  EventsResponseSchema,
  MyEventsResponse,
  MyEventsResponseSchema,
  CreateEventRequest,
  UpdateEventRequest,
  EventFilters,
  EventFiltersSchema,
  Registration,
  RegistrationSchema,
  ApprovalRequest,
  MarkAttendanceRequest,
  CreateEventSchema,
  UpdateEventSchema,
  ApprovalSchema,
  MarkAttendanceSchema,
} from "@/lib/schema/event.schema";
import { ApiResponse } from '@/lib/types/common.types';

/**
 * API Error class with typed errors
 */
export class EventApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public errors?: Record<string, string>
  ) {
    super(message);
    this.name = 'EventApiError';
  }
}

/**
 * Handle API errors with Zod validation
 */
const handleApiError = (error: any): never => {
  if (error.response?.data) {
    const { message, errors } = error.response.data;
    throw new EventApiError(
      message || 'An error occurred',
      error.response.status,
      errors
    );
  }
  throw new EventApiError(
    error.message || 'An unexpected error occurred'
  );
};

/**
 * Parse and validate API response
 */
const parseResponse = <T>(data: any, schema: any): T => {
  try {
    return schema.parse(data);
  } catch (error) {
    console.error('Response validation error:', error);
    throw new EventApiError('Invalid response from server');
  }
};

// EVENT LISTING & RETRIEVAL

/**
 * Get all events with filters
 */
export const getEvents = async (
  filters?: Partial<EventFilters>
): Promise<EventsResponse> => {
  try {
    // Validate filters
    const validatedFilters = filters
      ? EventFiltersSchema.partial().parse(filters)
      : {};

    const response = await axiosInstance.get<ApiResponse<EventsResponse>>(
      '/events',
      { params: validatedFilters }
    );

    if (!response.data.success || !response.data.data) {
      throw new EventApiError('Failed to fetch events');
    }

    // Validate response
    return parseResponse(response.data.data, EventsResponseSchema);
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Get single event by ID
 */
export const getEventById = async (id: string): Promise<Event> => {
  try {
    const response = await axiosInstance.get<ApiResponse<Event>>(
      `/events/${id}`
    );

    if (!response.data.success || !response.data.data) {
      throw new EventApiError('Event not found', 404);
    }

    return parseResponse(response.data.data, EventSchema);
  } catch (error) {
    return handleApiError(error);
  }
};

// EVENT MANAGEMENT (GROUP ADMIN)

/**
 * Create new event
 */
export const createEvent = async (
  data: CreateEventRequest
): Promise<Event> => {
  try {
    // Validate request data with custom rules
    const validatedData = CreateEventSchema.safeParse(data);

    const response = await axiosInstance.post<ApiResponse<Event>>(
      '/events',
      validatedData
    );

    if (!response.data.success || !response.data.data) {
      throw new EventApiError('Failed to create event');
    }

    return parseResponse(response.data.data, EventSchema);
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Update existing event
 */
export const updateEvent = async (
  id: string,
  data: UpdateEventRequest
): Promise<Event> => {
  try {
    // Validate request data
    const validatedData = UpdateEventSchema.parse(data);

    const response = await axiosInstance.put<ApiResponse<Event>>(
      `/events/${id}`,
      validatedData
    );

    if (!response.data.success || !response.data.data) {
      throw new EventApiError('Failed to update event');
    }

    return parseResponse(response.data.data, EventSchema);
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Delete event
 */
export const deleteEvent = async (id: string): Promise<void> => {
  try {
    const response = await axiosInstance.delete<ApiResponse>(
      `/events/${id}`
    );

    if (!response.data.success) {
      throw new EventApiError('Failed to delete event');
    }
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Submit event for approval
 */
export const submitForApproval = async (id: string): Promise<Event> => {
  try {
    const response = await axiosInstance.post<ApiResponse<Event>>(
      `/events/${id}/submit`
    );

    if (!response.data.success || !response.data.data) {
      throw new EventApiError('Failed to submit event for approval');
    }

    return parseResponse(response.data.data, EventSchema);
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Save event as draft
 */
export const saveDraft = async (
  data: CreateEventRequest
): Promise<Event> => {
  try {
    const validatedData = CreateEventSchema.parse(data);

    const response = await axiosInstance.post<ApiResponse<Event>>(
      '/events/draft',
      validatedData
    );

    if (!response.data.success || !response.data.data) {
      throw new EventApiError('Failed to save draft');
    }

    return parseResponse(response.data.data, EventSchema);
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Get department events
 */
export const getDepartmentEvents = async (
  status?: string
): Promise<Event[]> => {
  try {
    const response = await axiosInstance.get<ApiResponse<Event[]>>(
      '/events/department',
      { params: { status } }
    );

    if (!response.data.success || !response.data.data) {
      throw new EventApiError('Failed to fetch department events');
    }

    return response.data.data.map((event) =>
      parseResponse(event, EventSchema)
    );
  } catch (error) {
    return handleApiError(error);
  }
};

// DEPARTMENT ADMIN - APPROVAL

/**
 * Approve or reject event
 */
export const handleEventApproval = async (
  eventId: string,
  data: ApprovalRequest
): Promise<Event> => {
  try {
    const validatedData = ApprovalSchema.parse(data);

    const response = await axiosInstance.post<ApiResponse<Event>>(
      `/events/${eventId}/approval`,
      validatedData
    );

    if (!response.data.success || !response.data.data) {
      throw new EventApiError('Failed to process approval');
    }

    return parseResponse(response.data.data, EventSchema);
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Publish approved event
 */
export const publishEvent = async (id: string): Promise<Event> => {
  try {
    const response = await axiosInstance.post<ApiResponse<Event>>(
      `/events/${id}/publish`
    );

    if (!response.data.success || !response.data.data) {
      throw new EventApiError('Failed to publish event');
    }

    return parseResponse(response.data.data, EventSchema);
  } catch (error) {
    return handleApiError(error);
  }
};

// STUDENT REGISTRATION

/**
 * Register for event
 */
export const registerForEvent = async (
  eventId: string
): Promise<Registration> => {
  try {
    const response = await axiosInstance.post<ApiResponse<Registration>>(
      `/events/${eventId}/register`
    );

    if (!response.data.success || !response.data.data) {
      throw new EventApiError('Failed to register for event');
    }

    return parseResponse(response.data.data, RegistrationSchema);
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Cancel registration
 */
export const cancelRegistration = async (eventId: string): Promise<void> => {
  try {
    const response = await axiosInstance.delete<ApiResponse>(
      `/events/${eventId}/register`
    );

    if (!response.data.success) {
      throw new EventApiError('Failed to cancel registration');
    }
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Get user's registered events
 */
export const getMyEvents = async (
  status?: 'upcoming' | 'finished'
): Promise<MyEventsResponse> => {
  try {
    const response = await axiosInstance.get<ApiResponse<MyEventsResponse>>(
      '/events/my-events',
      { params: { status } }
    );

    if (!response.data.success || !response.data.data) {
      throw new EventApiError('Failed to fetch my events');
    }

    return parseResponse(response.data.data, MyEventsResponseSchema);
  } catch (error) {
    return handleApiError(error);
  }
};

// CERTIFICATE & ATTENDANCE

/**
 * Download certificate
 */
export const downloadCertificate = async (
  eventId: string
): Promise<Blob> => {
  try {
    const response = await axiosInstance.get(
      `/events/${eventId}/certificate`,
      { responseType: 'blob' }
    );

    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Get event registrations (Group Admin)
 */
export const getEventRegistrations = async (
  eventId: string
): Promise<Registration[]> => {
  try {
    const response = await axiosInstance.get<ApiResponse<Registration[]>>(
      `/events/${eventId}/registrations`
    );

    if (!response.data.success || !response.data.data) {
      throw new EventApiError('Failed to fetch registrations');
    }

    return response.data.data.map((reg) =>
      parseResponse(reg, RegistrationSchema)
    );
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Mark attendance
 */
export const markAttendance = async (
  eventId: string,
  data: MarkAttendanceRequest
): Promise<void> => {
  try {
    const validatedData = MarkAttendanceSchema.parse(data);

    const response = await axiosInstance.post<ApiResponse>(
      `/events/${eventId}/attendance`,
      validatedData
    );

    if (!response.data.success) {
      throw new EventApiError('Failed to mark attendance');
    }
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Close event registration
 */
export const closeRegistration = async (eventId: string): Promise<Event> => {
  try {
    const response = await axiosInstance.post<ApiResponse<Event>>(
      `/events/${eventId}/close-registration`
    );

    if (!response.data.success || !response.data.data) {
      throw new EventApiError('Failed to close registration');
    }

    return parseResponse(response.data.data, EventSchema);
  } catch (error) {
    return handleApiError(error);
  }
};

// EXPORT ALL METHODS

export const eventsApi = {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  submitForApproval,
  saveDraft,
  getDepartmentEvents,
  handleEventApproval,
  publishEvent,
  registerForEvent,
  cancelRegistration,
  getMyEvents,
  downloadCertificate,
  getEventRegistrations,
  markAttendance,
  closeRegistration,
};