import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { eventsApi } from '@/api/events.api';
import type {
  Event,
  EventFilters,
  CreateEventRequest,
  UpdateEventRequest,
  Registration,
  EventsResponse,
  MyEventsResponse,
} from "@/lib/types/event.types";
import { EventsState } from '@/lib/types/event.types';

/**
 * Initial events state
 */
const initialState: EventsState = {
  events: [],
  currentEvent: null,
  myEvents: [],
  myRegistrations: [],
  departmentEvents: [],
  total: 0,
  page: 1,
  totalPages: 0,
  limit: 10,
  isLoading: false,
  error: null,
  isRegistering: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
};

// ============================================================================
// ASYNC THUNKS - EVENT LISTING
// ============================================================================

/**
 * Fetch all events with filters
 * 
 * @example
 * ```ts
 * dispatch(fetchEvents({ departments: ['btech'], status: 'upcoming' }));
 * ```
 */
export const fetchEvents = createAsyncThunk<
  EventsResponse,
  EventFilters | undefined,
  { rejectValue: string }
>(
  'events/fetchEvents',
  async (filters, { rejectWithValue }) => {
    try {
      const response = await eventsApi.getEvents(filters);
      return response;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch events';
      return rejectWithValue(message);
    }
  }
);

/**
 * Fetch single event by ID
 * 
 * @example
 * ```ts
 * dispatch(fetchEventById('event-123'));
 * ```
 */
export const fetchEventById = createAsyncThunk<
  Event,
  string,
  { rejectValue: string }
>(
  'events/fetchEventById',
  async (id, { rejectWithValue }) => {
    try {
      const event = await eventsApi.getEventById(id);
      return event;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch event';
      return rejectWithValue(message);
    }
  }
);

// ============================================================================
// ASYNC THUNKS - EVENT MANAGEMENT
// ============================================================================

/**
 * Create new event
 * 
 * @example
 * ```ts
 * dispatch(createEvent({ title: 'Workshop', department: 'btech', ... }));
 * ```
 */
export const createEvent = createAsyncThunk<
  Event,
  CreateEventRequest,
  { rejectValue: string }
>(
  'events/createEvent',
  async (data, { rejectWithValue }) => {
    try {
      const event = await eventsApi.createEvent(data);
      return event;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create event';
      return rejectWithValue(message);
    }
  }
);

/**
 * Update existing event
 * 
 * @example
 * ```ts
 * dispatch(updateEvent({ id: 'event-123', data: { maxCapacity: 100 } }));
 * ```
 */
export const updateEvent = createAsyncThunk<
  Event,
  { id: string; data: UpdateEventRequest },
  { rejectValue: string }
>(
  'events/updateEvent',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const event = await eventsApi.updateEvent(id, data);
      return event;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update event';
      return rejectWithValue(message);
    }
  }
);

/**
 * Delete event
 * 
 * @example
 * ```ts
 * dispatch(deleteEvent('event-123'));
 * ```
 */
export const deleteEvent = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>(
  'events/deleteEvent',
  async (id, { rejectWithValue }) => {
    try {
      await eventsApi.deleteEvent(id);
      return id;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete event';
      return rejectWithValue(message);
    }
  }
);

/**
 * Submit event for approval
 * 
 * @example
 * ```ts
 * dispatch(submitEventForApproval('event-123'));
 * ```
 */
export const submitEventForApproval = createAsyncThunk<
  Event,
  string,
  { rejectValue: string }
>(
  'events/submitForApproval',
  async (id, { rejectWithValue }) => {
    try {
      const event = await eventsApi.submitForApproval(id);
      return event;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to submit event';
      return rejectWithValue(message);
    }
  }
);

/**
 * Save event as draft
 * 
 * @example
 * ```ts
 * dispatch(saveEventDraft({ title: 'Draft', ... }));
 * ```
 */
export const saveEventDraft = createAsyncThunk<
  Event,
  CreateEventRequest,
  { rejectValue: string }
>(
  'events/saveDraft',
  async (data, { rejectWithValue }) => {
    try {
      const event = await eventsApi.saveDraft(data);
      return event;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to save draft';
      return rejectWithValue(message);
    }
  }
);

// ============================================================================
// ASYNC THUNKS - DEPARTMENT EVENTS
// ============================================================================

/**
 * Fetch department events
 * 
 * @example
 * ```ts
 * dispatch(fetchDepartmentEvents('approved'));
 * ```
 */
export const fetchDepartmentEvents = createAsyncThunk<
  Event[],
  string | undefined,
  { rejectValue: string }
>(
  'events/fetchDepartmentEvents',
  async (status, { rejectWithValue }) => {
    try {
      const events = await eventsApi.getDepartmentEvents(status);
      return events;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch department events';
      return rejectWithValue(message);
    }
  }
);

// ============================================================================
// ASYNC THUNKS - REGISTRATIONS
// ============================================================================

/**
 * Register for event
 * 
 * @example
 * ```ts
 * dispatch(registerForEvent('event-123'));
 * ```
 */
export const registerForEvent = createAsyncThunk<
  { eventId: string; registration: Registration },
  string,
  { rejectValue: string }
>(
  'events/registerForEvent',
  async (eventId, { rejectWithValue }) => {
    try {
      const registration = await eventsApi.registerForEvent(eventId);
      return { eventId, registration };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to register';
      return rejectWithValue(message);
    }
  }
);

/**
 * Cancel registration
 * 
 * @example
 * ```ts
 * dispatch(cancelEventRegistration('event-123'));
 * ```
 */
export const cancelEventRegistration = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>(
  'events/cancelRegistration',
  async (eventId, { rejectWithValue }) => {
    try {
      await eventsApi.cancelRegistration(eventId);
      return eventId;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to cancel registration';
      return rejectWithValue(message);
    }
  }
);

/**
 * Fetch user's events
 * 
 * @example
 * ```ts
 * dispatch(fetchMyEvents('upcoming'));
 * ```
 */
export const fetchMyEvents = createAsyncThunk<
  MyEventsResponse,
  'upcoming' | 'finished' | undefined,
  { rejectValue: string }
>(
  'events/fetchMyEvents',
  async (status, { rejectWithValue }) => {
    try {
      const response = await eventsApi.getMyEvents(status);
      return response;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch my events';
      return rejectWithValue(message);
    }
  }
);

/**
 * Download certificate
 * 
 * @example
 * ```ts
 * dispatch(downloadEventCertificate('event-123'));
 * ```
 */
export const downloadEventCertificate = createAsyncThunk<
  void,
  string,
  { rejectValue: string }
>(
  'events/downloadCertificate',
  async (eventId, { rejectWithValue }) => {
    try {
      const blob = await eventsApi.downloadCertificate(eventId);
      
      // Create and trigger download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `certificate-${eventId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to download certificate';
      return rejectWithValue(message);
    }
  }
);

// ============================================================================
// SLICE DEFINITION
// ============================================================================

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    /**
     * Clear any event errors
     */
    clearError: (state) => {
      state.error = null;
    },
    
    /**
     * Clear current event
     */
    clearCurrentEvent: (state) => {
      state.currentEvent = null;
    },
    
    /**
     * Set event error manually
     */
    setEventError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    
    /**
     * Reset events state
     */
    resetEventsState: (state) => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    // ========================================================================
    // FETCH EVENTS
    // ========================================================================
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.isLoading = false;
        state.events = action.payload.events;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.totalPages = action.payload.totalPages;
        state.limit = action.payload.limit;
        state.error = null;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch events';
      });

    // ========================================================================
    // FETCH EVENT BY ID
    // ========================================================================
    builder
      .addCase(fetchEventById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchEventById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentEvent = action.payload;
        state.error = null;
      })
      .addCase(fetchEventById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch event';
      });

    // ========================================================================
    // CREATE EVENT
    // ========================================================================
    builder
      .addCase(createEvent.pending, (state) => {
        state.isCreating = true;
        state.error = null;
      })
      .addCase(createEvent.fulfilled, (state, action) => {
        state.isCreating = false;
        state.events.unshift(action.payload);
        state.departmentEvents.unshift(action.payload);
        state.error = null;
      })
      .addCase(createEvent.rejected, (state, action) => {
        state.isCreating = false;
        state.error = action.payload || 'Failed to create event';
      });

    // ========================================================================
    // UPDATE EVENT
    // ========================================================================
    builder
      .addCase(updateEvent.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(updateEvent.fulfilled, (state, action) => {
        state.isUpdating = false;
        
        // Update in events list
        const eventIndex = state.events.findIndex(e => e.id === action.payload.id);
        if (eventIndex !== -1) {
          state.events[eventIndex] = action.payload;
        }
        
        // Update in department events
        const deptIndex = state.departmentEvents.findIndex(e => e.id === action.payload.id);
        if (deptIndex !== -1) {
          state.departmentEvents[deptIndex] = action.payload;
        }
        
        // Update current event if it's the same
        if (state.currentEvent?.id === action.payload.id) {
          state.currentEvent = action.payload;
        }
        
        state.error = null;
      })
      .addCase(updateEvent.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload || 'Failed to update event';
      });

    // ========================================================================
    // DELETE EVENT
    // ========================================================================
    builder
      .addCase(deleteEvent.pending, (state) => {
        state.isDeleting = true;
        state.error = null;
      })
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.isDeleting = false;
        state.events = state.events.filter(e => e.id !== action.payload);
        state.departmentEvents = state.departmentEvents.filter(e => e.id !== action.payload);
        state.error = null;
      })
      .addCase(deleteEvent.rejected, (state, action) => {
        state.isDeleting = false;
        state.error = action.payload || 'Failed to delete event';
      });

    // ========================================================================
    // SUBMIT FOR APPROVAL
    // ========================================================================
    builder
      .addCase(submitEventForApproval.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(submitEventForApproval.fulfilled, (state, action) => {
        state.isLoading = false;
        
        const index = state.departmentEvents.findIndex(e => e.id === action.payload.id);
        if (index !== -1) {
          state.departmentEvents[index] = action.payload;
        }
        
        state.error = null;
      })
      .addCase(submitEventForApproval.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to submit event';
      });

    // ========================================================================
    // SAVE DRAFT
    // ========================================================================
    builder
      .addCase(saveEventDraft.pending, (state) => {
        state.isCreating = true;
        state.error = null;
      })
      .addCase(saveEventDraft.fulfilled, (state, action) => {
        state.isCreating = false;
        state.departmentEvents.unshift(action.payload);
        state.error = null;
      })
      .addCase(saveEventDraft.rejected, (state, action) => {
        state.isCreating = false;
        state.error = action.payload || 'Failed to save draft';
      });

    // ========================================================================
    // FETCH DEPARTMENT EVENTS
    // ========================================================================
    builder
      .addCase(fetchDepartmentEvents.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDepartmentEvents.fulfilled, (state, action) => {
        state.isLoading = false;
        state.departmentEvents = action.payload;
        state.error = null;
      })
      .addCase(fetchDepartmentEvents.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch department events';
      });

    // ========================================================================
    // REGISTER FOR EVENT
    // ========================================================================
    builder
      .addCase(registerForEvent.pending, (state) => {
        state.isRegistering = true;
        state.error = null;
      })
      .addCase(registerForEvent.fulfilled, (state, action) => {
        state.isRegistering = false;
        state.myRegistrations.unshift(action.payload.registration);
        
        // Update current event registration count
        if (state.currentEvent?.id === action.payload.eventId) {
          state.currentEvent.currentRegistrations += 1;
          state.currentEvent.registeredUsers = [
            ...(state.currentEvent.registeredUsers || []),
            action.payload.registration.userId,
          ];
        }
        
        state.error = null;
      })
      .addCase(registerForEvent.rejected, (state, action) => {
        state.isRegistering = false;
        state.error = action.payload || 'Failed to register';
      });

    // ========================================================================
    // CANCEL REGISTRATION
    // ========================================================================
    builder
      .addCase(cancelEventRegistration.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(cancelEventRegistration.fulfilled, (state, action) => {
        state.isLoading = false;
        state.myRegistrations = state.myRegistrations.filter(
          r => r.eventId !== action.payload
        );
        state.myEvents = state.myEvents.filter(e => e.id !== action.payload);
        
        // Update current event registration count
        if (state.currentEvent?.id === action.payload) {
          state.currentEvent.currentRegistrations = Math.max(
            0,
            state.currentEvent.currentRegistrations - 1
          );
        }
        
        state.error = null;
      })
      .addCase(cancelEventRegistration.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to cancel registration';
      });

    // ========================================================================
    // FETCH MY EVENTS
    // ========================================================================
    builder
      .addCase(fetchMyEvents.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMyEvents.fulfilled, (state, action) => {
        state.isLoading = false;
        state.myEvents = action.payload.events;
        state.myRegistrations = action.payload.registrations;
        state.error = null;
      })
      .addCase(fetchMyEvents.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch my events';
      });

    // ========================================================================
    // DOWNLOAD CERTIFICATE
    // ========================================================================
    builder
      .addCase(downloadEventCertificate.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(downloadEventCertificate.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(downloadEventCertificate.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to download certificate';
      });
  },
});

// ============================================================================
// EXPORTS
// ============================================================================

export const {
  clearError,
  clearCurrentEvent,
  setEventError,
  resetEventsState,
} = eventsSlice.actions;

export default eventsSlice.reducer;