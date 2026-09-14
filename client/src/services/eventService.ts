import axiosInstance from '@/api/axios';
import {
  Event,
  EventsResponse,
  MyEventsResponse,
  CreateEventRequest,
  UpdateEventRequest,
  EventFilters,
  Registration,
  ApprovalRequest,
  MarkAttendanceRequest,
  CreateEventSchema,
  UpdateEventSchema,
  ApprovalSchema,
  MarkAttendanceSchema,
} from '@/lib/schema/event.schema';
import { ApiResponse } from '@/lib/types/common.types';

class EventService {
  private readonly endpoint = '/events';

  async getEvents(filters?: Partial<EventFilters>): Promise<EventsResponse> {
    try {
      const params = new URLSearchParams();
      
      // Only add params if they are explicitly provided
      if (filters?.search) params.append('search', filters.search);
      if (filters?.departments && filters.departments.length > 0) {
        params.append('departments', filters.departments.join(','));
      }
      if (filters?.categories && filters.categories.length > 0) {
        params.append('categories', filters.categories.join(','));
      }
      if (filters?.mode) params.append('mode', filters.mode);
      if (filters?.status) params.append('status', filters.status);
      if (filters?.dateFrom) params.append('dateFrom', filters.dateFrom);
      if (filters?.dateTo) params.append('dateTo', filters.dateTo);
      if (filters?.page) params.append('page', String(filters.page));
      if (filters?.limit) params.append('limit', String(filters.limit));
      if (filters?.sortBy) params.append('sortBy', filters.sortBy);
      if (filters?.sortOrder) params.append('sortOrder', filters.sortOrder);

      const response = await axiosInstance.get<ApiResponse<EventsResponse>>(
        this.endpoint,
        { params: params.toString() ? params : undefined }
      );

      if (response.data.success && response.data.data) {
        return response.data.data;
      }

      throw new Error(response.data.message || 'Failed to fetch events');
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch events');
    }
  }

  async getEventById(id: string): Promise<Event> {
    try {
      const response = await axiosInstance.get<ApiResponse<Event>>(
        `${this.endpoint}/${id}`
      );

      if (response.data.success && response.data.data) {
        return response.data.data;
      }

      throw new Error(response.data.message || 'Failed to fetch event');
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch event');
    }
  }

  async createEvent(data: CreateEventRequest): Promise<Event> {
    try {
      // Validate request data
      const validatedData = CreateEventSchema.parse(data);

      const response = await axiosInstance.post<ApiResponse<Event>>(
        this.endpoint,
        validatedData
      );

      if (response.data.success && response.data.data) {
        return response.data.data;
      }

      throw new Error(response.data.message || 'Failed to create event');
    } catch (error: any) {
      throw new Error(error.message || 'Failed to create event');
    }
  }

  async updateEvent(id: string, data: UpdateEventRequest): Promise<Event> {
    try {
      // Validate request data
      const validatedData = UpdateEventSchema.parse(data);

      const response = await axiosInstance.put<ApiResponse<Event>>(
        `${this.endpoint}/${id}`,
        validatedData
      );

      if (response.data.success && response.data.data) {
        return response.data.data;
      }

      throw new Error(response.data.message || 'Failed to update event');
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update event');
    }
  }

  async deleteEvent(id: string): Promise<void> {
    try {
      const response = await axiosInstance.delete<ApiResponse<null>>(
        `${this.endpoint}/${id}`
      );

      if (response.data.success) {
        return;
      }

      throw new Error(response.data.message || 'Failed to delete event');
    } catch (error: any) {
      throw new Error(error.message || 'Failed to delete event');
    }
  }

  async submitForApproval(id: string): Promise<Event> {
    try {
      const response = await axiosInstance.post<ApiResponse<Event>>(
        `${this.endpoint}/${id}/submit`
      );

      if (response.data.success && response.data.data) {
        return response.data.data;
      }

      throw new Error(response.data.message || 'Failed to submit event for approval');
    } catch (error: any) {
      throw new Error(error.message || 'Failed to submit event for approval');
    }
  }

  async saveDraft(data: CreateEventRequest): Promise<Event> {
    try {
      // Validate request data - but allow partial validation for drafts
      // Remove strict validation for drafts since not all fields are required
      const response = await axiosInstance.post<ApiResponse<Event>>(
        `${this.endpoint}/draft`,
        data // Send as-is for draft
      );

      if (response.data.success && response.data.data) {
        return response.data.data;
      }

      throw new Error(response.data.message || 'Failed to save draft');
    } catch (error: any) {
      throw new Error(error.message || 'Failed to save draft');
    }
  }

  async getDepartmentEvents(status?: string): Promise<Event[]> {
    try {
      const params = new URLSearchParams();
      if (status) params.append('status', status);

      const response = await axiosInstance.get<ApiResponse<Event[]>>(
        `${this.endpoint}/department`,
        { params: params.toString() ? params : undefined }
      );

      if (response.data.success && response.data.data) {
        return response.data.data;
      }

      throw new Error(response.data.message || 'Failed to fetch department events');
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch department events');
    }
  }

  /** Super Admin only: events across every department, not just one. */
  async getAllEvents(status?: string, departmentId?: string): Promise<Event[]> {
    try {
      const params = new URLSearchParams();
      if (status) params.append('status', status);
      if (departmentId) params.append('departmentId', departmentId);

      const response = await axiosInstance.get<ApiResponse<Event[]>>(
        `${this.endpoint}/admin/all`,
        { params: params.toString() ? params : undefined }
      );

      if (response.data.success && response.data.data) {
        return response.data.data;
      }

      throw new Error(response.data.message || 'Failed to fetch all events');
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch all events');
    }
  }

  async handleEventApproval(eventId: string, data: ApprovalRequest): Promise<Event> {
    try {
      // Validate approval data
      const validatedData = ApprovalSchema.parse(data);

      const response = await axiosInstance.post<ApiResponse<Event>>(
        `${this.endpoint}/${eventId}/approval`,
        validatedData
      );

      if (response.data.success && response.data.data) {
        return response.data.data;
      }

      throw new Error(response.data.message || 'Failed to process approval');
    } catch (error: any) {
      throw new Error(error.message || 'Failed to process approval');
    }
  }

  async publishEvent(id: string): Promise<Event> {
    try {
      const response = await axiosInstance.post<ApiResponse<Event>>(
        `${this.endpoint}/${id}/publish`
      );

      if (response.data.success && response.data.data) {
        return response.data.data;
      }

      throw new Error(response.data.message || 'Failed to publish event');
    } catch (error: any) {
      throw new Error(error.message || 'Failed to publish event');
    }
  }

  async registerForEvent(eventId: string): Promise<Registration> {
    try {
      const response = await axiosInstance.post<ApiResponse<Registration>>(
        `${this.endpoint}/${eventId}/register`
      );

      if (response.data.success && response.data.data) {
        return response.data.data;
      }

      throw new Error(response.data.message || 'Failed to register for event');
    } catch (error: any) {
      throw new Error(error.message || 'Failed to register for event');
    }
  }

  async cancelRegistration(eventId: string): Promise<void> {
    try {
      const response = await axiosInstance.delete<ApiResponse<null>>(
        `${this.endpoint}/${eventId}/register`
      );

      if (response.data.success) {
        return;
      }

      throw new Error(response.data.message || 'Failed to cancel registration');
    } catch (error: any) {
      throw new Error(error.message || 'Failed to cancel registration');
    }
  }

  async getMyEvents(status?: 'upcoming' | 'finished'): Promise<MyEventsResponse> {
    try {
      const params = new URLSearchParams();
      if (status) params.append('status', status);

      const response = await axiosInstance.get<ApiResponse<MyEventsResponse>>(
        `${this.endpoint}/my-events`,
        { params: params.toString() ? params : undefined }
      );

      if (response.data.success && response.data.data) {
        return response.data.data;
      }

      throw new Error(response.data.message || 'Failed to fetch my events');
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch my events');
    }
  }

  async downloadCertificate(eventId: string): Promise<Blob> {
    try {
      const response = await axiosInstance.get(
        `${this.endpoint}/${eventId}/certificate`,
        { responseType: 'blob' }
      );

      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to download certificate');
    }
  }

  async getEventRegistrations(eventId: string): Promise<Registration[]> {
    try {
      const response = await axiosInstance.get<ApiResponse<Registration[]>>(
        `${this.endpoint}/${eventId}/registrations`
      );

      if (response.data.success && response.data.data) {
        return response.data.data;
      }

      throw new Error(response.data.message || 'Failed to fetch registrations');
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch registrations');
    }
  }

  async markAttendance(eventId: string, data: MarkAttendanceRequest): Promise<void> {
    try {
      const validatedData = MarkAttendanceSchema.parse(data);

      const response = await axiosInstance.post<ApiResponse<null>>(
        `${this.endpoint}/${eventId}/attendance`,
        validatedData
      );

      if (response.data.success) {
        return;
      }

      throw new Error(response.data.message || 'Failed to mark attendance');
    } catch (error: any) {
      throw new Error(error.message || 'Failed to mark attendance');
    }
  }

  async closeRegistration(eventId: string): Promise<Event> {
    try {
      const response = await axiosInstance.post<ApiResponse<Event>>(
        `${this.endpoint}/${eventId}/close-registration`
      );

      if (response.data.success && response.data.data) {
        return response.data.data;
      }

      throw new Error(response.data.message || 'Failed to close registration');
    } catch (error: any) {
      throw new Error(error.message || 'Failed to close registration');
    }
  }
}

// EXPORT SINGLETON INSTANCE
export const eventService = new EventService();