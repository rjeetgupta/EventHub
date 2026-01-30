/**
 * Events Redux Slice - Fixed Version
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { eventsApi } from '@/api/events.api';
import {
  Event,
  EventFilters,
  CreateEventRequest,
  UpdateEventRequest,
  Registration,
  EventsResponse,
  MyEventsResponse,
  ApprovalRequest,
  MarkAttendanceRequest,
} from "@/lib/schema/event.schema";

// ============================================================================
// STATE INTERFACE
// ============================================================================

interface EventsState {
  // All events (public listing)
  events: Event[];
  currentEvent: Event | null;
  
  // Department events (for group admin)
  departmentEvents: Event[];
  
  // User's registered events (for students)
  myEvents: Event[];
  myRegistrations: Registration[];
  
  // Pagination
  pagination: {
    total: number;
    page: number;
    totalPages: number;
    limit: number;
  };
  
  // Loading states
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  isRegistering: boolean;
  
  // Errors
  error: string | null;
}

const initialState: EventsState = {
  events: [],
  currentEvent: null,
  departmentEvents: [],
  myEvents: [],
  myRegistrations: [],
  pagination: {
    total: 0,
    page: 1,
    totalPages: 0,
    limit: 10,
  },
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  isRegistering: false,
  error: null,
};

// ============================================================================
// ASYNC THUNKS - EVENT LISTING
// ============================================================================

export const fetchEvents = createAsyncThunk<
  EventsResponse,
  Partial<EventFilters> | undefined,
  { rejectValue: string }
>(
  'events/fetchEvents',
  async (filters, { rejectWithValue }) => {
    try {
      return await eventsApi.getEvents(filters);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch events');
    }
  }
);

export const fetchEventById = createAsyncThunk<
  Event,
  string,
  { rejectValue: string }
>(
  'events/fetchEventById',
  async (id, { rejectWithValue }) => {
    try {
      return await eventsApi.getEventById(id);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch event');
    }
  }
);

// ============================================================================
// ASYNC THUNKS - EVENT MANAGEMENT
// ============================================================================

export const createEvent = createAsyncThunk<
  Event,
  CreateEventRequest,
  { rejectValue: string }
>(
  'events/createEvent',
  async (data, { rejectWithValue }) => {
    try {
      return await eventsApi.createEvent(data);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create event');
    }
  }
);

export const updateEvent = createAsyncThunk<
  Event,
  { id: string; data: UpdateEventRequest },
  { rejectValue: string }
>(
  'events/updateEvent',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await eventsApi.updateEvent(id, data);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update event');
    }
  }
);

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
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete event');
    }
  }
);

export const submitEventForApproval = createAsyncThunk<
  Event,
  string,
  { rejectValue: string }
>(
  'events/submitForApproval',
  async (id, { rejectWithValue }) => {
    try {
      return await eventsApi.submitForApproval(id);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to submit event');
    }
  }
);

export const saveEventDraft = createAsyncThunk<
  Event,
  CreateEventRequest,
  { rejectValue: string }
>(
  'events/saveDraft',
  async (data, { rejectWithValue }) => {
    try {
      return await eventsApi.saveDraft(data);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to save draft');
    }
  }
);

// ============================================================================
// ASYNC THUNKS - DEPARTMENT EVENTS
// ============================================================================

export const fetchDepartmentEvents = createAsyncThunk<
  Event[],
  string | undefined,
  { rejectValue: string }
>(
  'events/fetchDepartmentEvents',
  async (status, { rejectWithValue }) => {
    try {
      return await eventsApi.getDepartmentEvents(status);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch department events');
    }
  }
);

// ============================================================================
// ASYNC THUNKS - APPROVAL (DEPT ADMIN)
// ============================================================================

export const handleEventApproval = createAsyncThunk<
  Event,
  { eventId: string; data: ApprovalRequest },
  { rejectValue: string }
>(
  'events/handleApproval',
  async ({ eventId, data }, { rejectWithValue }) => {
    try {
      return await eventsApi.handleEventApproval(eventId, data);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to process approval');
    }
  }
);

export const publishEvent = createAsyncThunk<
  Event,
  string,
  { rejectValue: string }
>(
  'events/publishEvent',
  async (id, { rejectWithValue }) => {
    try {
      return await eventsApi.publishEvent(id);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to publish event');
    }
  }
);

// ============================================================================
// ASYNC THUNKS - REGISTRATIONS
// ============================================================================

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
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to register');
    }
  }
);

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
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to cancel registration');
    }
  }
);

export const fetchMyEvents = createAsyncThunk<
  MyEventsResponse,
  'upcoming' | 'finished' | undefined,
  { rejectValue: string }
>(
  'events/fetchMyEvents',
  async (status, { rejectWithValue }) => {
    try {
      return await eventsApi.getMyEvents(status);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch my events');
    }
  }
);

// ============================================================================
// ASYNC THUNKS - ATTENDANCE
// ============================================================================

export const markAttendance = createAsyncThunk<
  { eventId: string },
  { eventId: string; data: MarkAttendanceRequest },
  { rejectValue: string }
>(
  'events/markAttendance',
  async ({ eventId, data }, { rejectWithValue }) => {
    try {
      await eventsApi.markAttendance(eventId, data);
      return { eventId };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to mark attendance');
    }
  }
);

export const closeRegistration = createAsyncThunk<
  Event,
  string,
  { rejectValue: string }
>(
  'events/closeRegistration',
  async (eventId, { rejectWithValue }) => {
    try {
      return await eventsApi.closeRegistration(eventId);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to close registration');
    }
  }
);

// ============================================================================
// SLICE
// ============================================================================

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentEvent: (state) => {
      state.currentEvent = null;
    },
    setEventError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    resetEventsState: () => initialState,
  },
  extraReducers: (builder) => {
    // FETCH EVENTS
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.isLoading = false;
        state.events = action.payload.events;
        state.pagination = {
          total: action.payload.total,
          page: action.payload.page,
          totalPages: action.payload.totalPages,
          limit: action.payload.limit,
        };
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch events';
      });

    // FETCH EVENT BY ID
    builder
      .addCase(fetchEventById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchEventById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentEvent = action.payload;
      })
      .addCase(fetchEventById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch event';
      });

    // CREATE EVENT
    builder
      .addCase(createEvent.pending, (state) => {
        state.isCreating = true;
        state.error = null;
      })
      .addCase(createEvent.fulfilled, (state, action) => {
        state.isCreating = false;
        state.departmentEvents.unshift(action.payload);
      })
      .addCase(createEvent.rejected, (state, action) => {
        state.isCreating = false;
        state.error = action.payload || 'Failed to create event';
      });

    // UPDATE EVENT
    builder
      .addCase(updateEvent.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(updateEvent.fulfilled, (state, action) => {
        state.isUpdating = false;
        
        // Update in events list
        const eventIndex = state.events.findIndex(e => e.id === action.payload.id);
        if (eventIndex !== -1) state.events[eventIndex] = action.payload;
        
        // Update in department events
        const deptIndex = state.departmentEvents.findIndex(e => e.id === action.payload.id);
        if (deptIndex !== -1) state.departmentEvents[deptIndex] = action.payload;
        
        // Update current event
        if (state.currentEvent?.id === action.payload.id) {
          state.currentEvent = action.payload;
        }
      })
      .addCase(updateEvent.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload || 'Failed to update event';
      });

    // DELETE EVENT
    builder
      .addCase(deleteEvent.pending, (state) => {
        state.isDeleting = true;
        state.error = null;
      })
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.isDeleting = false;
        state.events = state.events.filter(e => e.id !== action.payload);
        state.departmentEvents = state.departmentEvents.filter(e => e.id !== action.payload);
      })
      .addCase(deleteEvent.rejected, (state, action) => {
        state.isDeleting = false;
        state.error = action.payload || 'Failed to delete event';
      });

    // SUBMIT FOR APPROVAL
    builder
      .addCase(submitEventForApproval.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(submitEventForApproval.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.departmentEvents.findIndex(e => e.id === action.payload.id);
        if (index !== -1) state.departmentEvents[index] = action.payload;
      })
      .addCase(submitEventForApproval.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to submit event';
      });

    // SAVE DRAFT
    builder
      .addCase(saveEventDraft.pending, (state) => {
        state.isCreating = true;
        state.error = null;
      })
      .addCase(saveEventDraft.fulfilled, (state, action) => {
        state.isCreating = false;
        state.departmentEvents.unshift(action.payload);
      })
      .addCase(saveEventDraft.rejected, (state, action) => {
        state.isCreating = false;
        state.error = action.payload || 'Failed to save draft';
      });

    // FETCH DEPARTMENT EVENTS
    builder
      .addCase(fetchDepartmentEvents.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDepartmentEvents.fulfilled, (state, action) => {
        state.isLoading = false;
        state.departmentEvents = action.payload;
      })
      .addCase(fetchDepartmentEvents.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch department events';
      });

    // REGISTER FOR EVENT
    builder
      .addCase(registerForEvent.pending, (state) => {
        state.isRegistering = true;
        state.error = null;
      })
      .addCase(registerForEvent.fulfilled, (state, action) => {
        state.isRegistering = false;
        state.myRegistrations.unshift(action.payload.registration);
        
        // Update current event
        if (state.currentEvent?.id === action.payload.eventId) {
          state.currentEvent.currentRegistrations += 1;
        }
      })
      .addCase(registerForEvent.rejected, (state, action) => {
        state.isRegistering = false;
        state.error = action.payload || 'Failed to register';
      });

    // CANCEL REGISTRATION
    builder
      .addCase(cancelEventRegistration.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(cancelEventRegistration.fulfilled, (state, action) => {
        state.isLoading = false;
        state.myRegistrations = state.myRegistrations.filter(r => r.eventId !== action.payload);
        state.myEvents = state.myEvents.filter(e => e.id !== action.payload);
        
        // Update current event
        if (state.currentEvent?.id === action.payload) {
          state.currentEvent.currentRegistrations = Math.max(0, state.currentEvent.currentRegistrations - 1);
        }
      })
      .addCase(cancelEventRegistration.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to cancel registration';
      });

    // FETCH MY EVENTS
    builder
      .addCase(fetchMyEvents.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMyEvents.fulfilled, (state, action) => {
        state.isLoading = false;
        state.myEvents = action.payload.events;
        state.myRegistrations = action.payload.registrations;
      })
      .addCase(fetchMyEvents.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch my events';
      });

    // HANDLE APPROVAL
    builder
      .addCase(handleEventApproval.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(handleEventApproval.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.departmentEvents.findIndex(e => e.id === action.payload.id);
        if (index !== -1) state.departmentEvents[index] = action.payload;
      })
      .addCase(handleEventApproval.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to process approval';
      });

    // PUBLISH EVENT
    builder
      .addCase(publishEvent.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(publishEvent.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.departmentEvents.findIndex(e => e.id === action.payload.id);
        if (index !== -1) state.departmentEvents[index] = action.payload;
      })
      .addCase(publishEvent.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to publish event';
      });

    // MARK ATTENDANCE
    builder
      .addCase(markAttendance.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(markAttendance.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(markAttendance.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to mark attendance';
      });

    // CLOSE REGISTRATION
    builder
      .addCase(closeRegistration.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(closeRegistration.fulfilled, (state, action) => {
        state.isLoading = false;
        if (state.currentEvent?.id === action.payload.id) {
          state.currentEvent = action.payload;
        }
      })
      .addCase(closeRegistration.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to close registration';
      });
  },
});

export const {
  clearError,
  clearCurrentEvent,
  setEventError,
  resetEventsState,
} = eventsSlice.actions;

export default eventsSlice.reducer;