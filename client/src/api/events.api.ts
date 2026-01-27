/**
 * ============================================================================
 * EVENTS API - PRODUCTION READY
 * ============================================================================
 * 
 * Comprehensive event management API:
 * - Event CRUD operations
 * - Registration management
 * - Attendance tracking
 * - Certificate generation
 * - Department event management
 * 
 * @module api/events.api
 * ============================================================================
 */

import axiosInstance, { handleApiError } from '@/api/axios';
import type {
  Event,
  EventsResponse,
  EventFilters,
  CreateEventRequest,
  UpdateEventRequest,
  Registration,
  MyEventsResponse,
} from "@/lib/types/event.types";
import type { ApiResponse } from "@/lib/types/common.types";

// ============================================================================
// EVENT LISTING & RETRIEVAL
// ============================================================================

/**
 * Get all events with optional filtering
 * 
 * @param filters - Optional filters (department, category, date, etc.)
 * @returns Paginated events response
 * @throws Error if fetch fails
 * 
 * @example
 * ```ts
 * const response = await eventsApi.getEvents({
 *   departments: ['btech'],
 *   status: 'upcoming',
 *   page: 1,
 *   limit: 10
 * });
 * ```
 */
export const getEvents = async (
  filters?: EventFilters
): Promise<EventsResponse> => {
  try {
    const response = await axiosInstance.get<ApiResponse<EventsResponse>>(
      '/events',
      { params: filters }
    );

    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to fetch events');
    }

    return response.data.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Get single event by ID
 * 
 * @param id - Event ID
 * @returns Event object
 * @throws Error if event not found or fetch fails
 * 
 * @example
 * ```ts
 * const event = await eventsApi.getEventById('event-123');
 * ```
 */
export const getEventById = async (id: string): Promise<Event> => {
  try {
    const response = await axiosInstance.get<ApiResponse<Event>>(
      `/events/${id}`
    );

    if (!response.data.success || !response.data.data) {
      throw new Error('Event not found');
    }

    return response.data.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

// ============================================================================
// EVENT MANAGEMENT (GROUP ADMIN)
// ============================================================================

/**
 * Create new event (Group Admin only)
 * 
 * @param data - Event creation data
 * @returns Created event object
 * @throws Error if creation fails or unauthorized
 * 
 * @example
 * ```ts
 * const event = await eventsApi.createEvent({
 *   title: 'Tech Workshop',
 *   description: 'Learn React',
 *   department: 'btech',
 *   date: '2024-03-15',
 *   maxCapacity: 50
 * });
 * ```
 */
export const createEvent = async (
  data: CreateEventRequest
): Promise<Event> => {
  try {
    const response = await axiosInstance.post<ApiResponse<Event>>(
      '/events',
      data
    );

    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to create event');
    }

    return response.data.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Update existing event (Group Admin only)
 * 
 * @param id - Event ID
 * @param data - Fields to update
 * @returns Updated event object
 * @throws Error if update fails or unauthorized
 * 
 * @example
 * ```ts
 * const updated = await eventsApi.updateEvent('event-123', {
 *   maxCapacity: 100
 * });
 * ```
 */
export const updateEvent = async (
  id: string,
  data: UpdateEventRequest
): Promise<Event> => {
  try {
    const response = await axiosInstance.put<ApiResponse<Event>>(
      `/events/${id}`,
      data
    );

    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to update event');
    }

    return response.data.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Delete event (Group Admin only)
 * 
 * @param id - Event ID
 * @throws Error if deletion fails or unauthorized
 * 
 * @example
 * ```ts
 * await eventsApi.deleteEvent('event-123');
 * ```
 */
export const deleteEvent = async (id: string): Promise<void> => {
  try {
    const response = await axiosInstance.delete<ApiResponse>(
      `/events/${id}`
    );

    if (!response.data.success) {
      throw new Error('Failed to delete event');
    }
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Submit event for approval (Group Admin only)
 * 
 * @param id - Event ID
 * @returns Updated event with pending status
 * @throws Error if submission fails
 * 
 * @example
 * ```ts
 * const event = await eventsApi.submitForApproval('event-123');
 * // event.status === 'pending'
 * ```
 */
export const submitForApproval = async (id: string): Promise<Event> => {
  try {
    const response = await axiosInstance.post<ApiResponse<Event>>(
      `/events/${id}/submit`
    );

    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to submit event for approval');
    }

    return response.data.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Save event as draft (Group Admin only)
 * 
 * @param data - Event draft data
 * @returns Saved draft event
 * @throws Error if save fails
 * 
 * @example
 * ```ts
 * const draft = await eventsApi.saveDraft({
 *   title: 'Workshop Draft',
 *   description: 'TBD'
 * });
 * ```
 */
export const saveDraft = async (
  data: CreateEventRequest
): Promise<Event> => {
  try {
    const response = await axiosInstance.post<ApiResponse<Event>>(
      '/events/draft',
      data
    );

    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to save draft');
    }

    return response.data.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Get events by department (Group Admin only)
 * 
 * @param status - Optional status filter
 * @returns Array of department events
 * @throws Error if fetch fails
 * 
 * @example
 * ```ts
 * const events = await eventsApi.getDepartmentEvents('approved');
 * ```
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
      throw new Error('Failed to fetch department events');
    }

    return response.data.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

// ============================================================================
// STUDENT REGISTRATION
// ============================================================================

/**
 * Register for an event (Student)
 * 
 * @param eventId - Event ID
 * @returns Registration object
 * @throws Error if registration fails (full, deadline passed, etc.)
 * 
 * @example
 * ```ts
 * const registration = await eventsApi.registerForEvent('event-123');
 * ```
 */
export const registerForEvent = async (
  eventId: string
): Promise<Registration> => {
  try {
    const response = await axiosInstance.post<ApiResponse<Registration>>(
      `/events/${eventId}/register`
    );

    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to register for event');
    }

    return response.data.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Cancel event registration (Student)
 * 
 * @param eventId - Event ID
 * @throws Error if cancellation fails
 * 
 * @example
 * ```ts
 * await eventsApi.cancelRegistration('event-123');
 * ```
 */
export const cancelRegistration = async (eventId: string): Promise<void> => {
  try {
    const response = await axiosInstance.delete<ApiResponse>(
      `/events/${eventId}/register`
    );

    if (!response.data.success) {
      throw new Error('Failed to cancel registration');
    }
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Get user's registered events (Student)
 * 
 * @param status - Filter by 'upcoming' or 'finished'
 * @returns My events response with registrations
 * @throws Error if fetch fails
 * 
 * @example
 * ```ts
 * const { events, registrations } = await eventsApi.getMyEvents('upcoming');
 * ```
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
      throw new Error('Failed to fetch my events');
    }

    return response.data.data;
  } catch (error) {
    // console.log("ERROR FROM API : ", error?.response?.data?.errors[0].message)
    throw new Error(handleApiError(error));
  }
};

// ============================================================================
// CERTIFICATE & ATTENDANCE
// ============================================================================

/**
 * Download certificate for attended event (Student)
 * 
 * @param eventId - Event ID
 * @returns PDF blob
 * @throws Error if certificate not available or download fails
 * 
 * @example
 * ```ts
 * const blob = await eventsApi.downloadCertificate('event-123');
 * // Trigger download in browser
 * const url = URL.createObjectURL(blob);
 * const a = document.createElement('a');
 * a.href = url;
 * a.download = 'certificate.pdf';
 * a.click();
 * ```
 */
export const downloadCertificate = async (
  eventId: string
): Promise<Blob> => {
  try {
    const response = await axiosInstance.get(
      `/events/${eventId}/certificate`,
      {
        responseType: 'blob',
      }
    );

    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Get event registrations (Group Admin)
 * 
 * @param eventId - Event ID
 * @returns Array of registrations
 * @throws Error if fetch fails or unauthorized
 * 
 * @example
 * ```ts
 * const registrations = await eventsApi.getEventRegistrations('event-123');
 * ```
 */
export const getEventRegistrations = async (
  eventId: string
): Promise<Registration[]> => {
  try {
    const response = await axiosInstance.get<ApiResponse<Registration[]>>(
      `/events/${eventId}/registrations`
    );

    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to fetch registrations');
    }

    return response.data.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Mark attendance for registrants (Group Admin)
 * 
 * @param eventId - Event ID
 * @param userIds - Array of user IDs who attended
 * @throws Error if marking fails or unauthorized
 * 
 * @example
 * ```ts
 * await eventsApi.markAttendance('event-123', ['user1', 'user2']);
 * ```
 */
export const markAttendance = async (
  eventId: string,
  userIds: string[]
): Promise<void> => {
  try {
    const response = await axiosInstance.post<ApiResponse>(
      `/events/${eventId}/attendance`,
      { userIds }
    );

    if (!response.data.success) {
      throw new Error('Failed to mark attendance');
    }
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Update event results and winners (Group Admin)
 * 
 * @param eventId - Event ID
 * @param data - Winner and results data
 * @returns Updated event
 * @throws Error if update fails or unauthorized
 * 
 * @example
 * ```ts
 * const event = await eventsApi.updateResults('event-123', {
 *   winner: 'user-456',
 *   results: { first: 'John', second: 'Jane' }
 * });
 * ```
 */
export const updateResults = async (
  eventId: string,
  data: { winner?: string; results?: any }
): Promise<Event> => {
  try {
    const response = await axiosInstance.post<ApiResponse<Event>>(
      `/events/${eventId}/results`,
      data
    );

    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to update results');
    }

    return response.data.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};


export const eventsApi = {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  submitForApproval,
  saveDraft,
  getDepartmentEvents,
  registerForEvent,
  cancelRegistration,
  getMyEvents,
  downloadCertificate,
  getEventRegistrations,
  markAttendance,
  updateResults,
};