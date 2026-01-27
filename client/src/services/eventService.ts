// import { eventsApi } from '@/api/events.api';
// import { User } from '@/lib/types/user.types'; 
// import {
//   createEventSchema,
//   updateEventSchema,
//   eventFiltersSchema,
//   registerForEventSchema,
//   type CreateEventInput,
//   type UpdateEventInput,
//   type EventFiltersInput,
//   type RegisterForEventInput,
// } from '@/lib/validators/event.validators';
// import {
//   useCanEditEvent,
//   useCanCreateEvents,
//   useFilterEventsByRole,
//   useAccessibleDepartments,
// } from '@/lib/usePermissions';
// import { ZodError } from 'zod';
// import { UserRole } from '@/lib/types/common.types';

// // ============ EVENT SERVICE ============

// export class EventService {
//   /**
//    * Fetch events with role-based filtering
//    */
//   static async getEvents(
//     filters: EventFiltersInput,
//     currentUser: User | null
//   ) {
//     try {
//       const validatedFilters = eventFiltersSchema.parse(filters);
//       const response = await eventsApi.getEvents(validatedFilters as any);

//       // Apply role-based filtering client-side
//       if (currentUser) {
//         const filtered = this.filterEventsByUserRole(
//           response.events,
//           currentUser
//         );
//         return {
//           success: true,
//           data: {
//             ...response,
//             events: filtered,
//           },
//         };
//       }

//       return {
//         success: true,
//         data: response,
//       };
//     } catch (error) {
//       return this.handleError(error);
//     }
//   }

//   /**
//    * Get single event by ID
//    */
//   static async getEventById(id: string) {
//     try {
//       const event = await eventsApi.getEventById(id);
//       return {
//         success: true,
//         data: event,
//       };
//     } catch (error) {
//       return this.handleError(error);
//     }
//   }

//   /**
//    * Create event with role-based validation
//    */
//   static async createEvent(
//     data: CreateEventInput,
//     currentUser: User | null
//   ) {
//     try {
//       // Check permission
//       if (!currentUser || !['groupAdmin', 'admin'].includes(currentUser.role)) {
//         return {
//           success: false,
//           message: 'You do not have permission to create events',
//         };
//       }

//       const validatedData = createEventSchema.parse(data);

//       // Add creator info
//       const eventData = {
//         ...validatedData,
//         organizerId: currentUser.id,
//         organizerName: currentUser.fullName,
//         organizerEmail: currentUser.email,
//         status: currentUser.role === UserRole.SUPER_ADMIN ? 'approved' : 'pending',
//       };

//       const event = await eventsApi.createEvent(validatedData as any);

//       return {
//         success: true,
//         data: event,
//       };
//     } catch (error) {
//       return this.handleError(error);
//     }
//   }

//   /**
//    * Update event with role-based authorization
//    * DeptAdmin has permission to everything event-related
//    */
//   static async updateEvent(
//     id: string,
//     data: UpdateEventInput,
//     currentUser: User | null,
//     eventOwnerId?: string
//   ) {
//     try {
//       // Check permission
//       const canEdit =
//         currentUser &&
//         (currentUser.role === UserRole.SUPER_ADMIN ||
//           currentUser.role === UserRole.DEPARTMENT_ADMIN ||
//           (currentUser.role === UserRole.GROUP_ADMIN && currentUser.id === eventOwnerId));

//       if (!canEdit) {
//         return {
//           success: false,
//           message: 'You do not have permission to edit this event',
//         };
//       }

//       const validatedData = updateEventSchema.parse(data);
//       const event = await eventsApi.updateEvent(id, validatedData as any);

//       return {
//         success: true,
//         data: event,
//       };
//     } catch (error) {
//       return this.handleError(error);
//     }
//   }

//   /**
//    * Delete event with role-based authorization
//    * DeptAdmin has permission to everything event-related
//    */
//   static async deleteEvent(
//     id: string,
//     currentUser: User | null,
//     eventOwnerId?: string
//   ) {
//     try {
//       // Check permission
//       const canDelete =
//         currentUser &&
//         (currentUser.role === UserRole.SUPER_ADMIN ||
//           currentUser.role === UserRole.DEPARTMENT_ADMIN ||
//           (currentUser.role === UserRole.GROUP_ADMIN && currentUser.id === eventOwnerId));

//       if (!canDelete) {
//         return {
//           success: false,
//           message: 'You do not have permission to delete this event',
//         };
//       }

//       await eventsApi.deleteEvent(id);

//       return {
//         success: true,
//         message: 'Event deleted successfully',
//       };
//     } catch (error) {
//       return this.handleError(error);
//     }
//   }

//   /**
//    * Register for event with validation
//    */
//   static async registerForEvent(data: RegisterForEventInput) {
//     try {
//       const validatedData = registerForEventSchema.parse(data);
//       const registration = await eventsApi.registerForEvent(validatedData as any);

//       return {
//         success: true,
//         data: registration,
//       };
//     } catch (error) {
//       return this.handleError(error);
//     }
//   }

//   /**
//    * Get user's events based on role
//    */
//   static async getMyEvents(currentUser: User | null) {
//     try {
//       if (!currentUser) {
//         return {
//           success: false,
//           message: 'User not authenticated',
//         };
//       }

//       const response = await eventsApi.getMyEvents();

//       // Filter based on role
//       const filtered = this.filterEventsByUserRole(
//         response.events,
//         currentUser
//       );

//       return {
//         success: true,
//         data: {
//           ...response,
//           events: filtered,
//         },
//       };
//     } catch (error) {
//       return this.handleError(error);
//     }
//   }

//   /**
//    * Filter events based on user role
//    */
//   private static filterEventsByUserRole(events: any[], user: User) {
//     if (user.role === UserRole.SUPER_ADMIN) {
//       return events;
//     }

//     if (user.role === UserRole.DEPARTMENT_ADMIN) {
//       return events.filter((e) => e.department === user.departmentId);
//     }

//     if (user.role === UserRole.GROUP_ADMIN) {
//       return events.filter(
//         (e) =>
//           e.organizerId === user.id ||
//           e.status === 'approved' ||
//           e.status === 'upcoming'
//       );
//     }

//     // Student
//     return events.filter(
//       (e) =>
//         e.status === 'approved' ||
//         e.status === 'upcoming' ||
//         e.registeredUsers?.includes(user.id)
//     );
//   }

//   /**
//    * Handle errors with proper formatting
//    */
//   private static handleError(error: any) {
//     if (error instanceof ZodError) {
//       const fieldErrors: Record<string, string> = {};
//       error.issues.forEach((err) => {
//         const path = err.path[0] as string;
//         fieldErrors[path] = err.message;
//       });

//       return {
//         success: false,
//         errors: fieldErrors,
//         message: 'Validation failed',
//       };
//     }

//     if (error instanceof Error) {
//       return {
//         success: false,
//         message: error.message,
//       };
//     }

//     return {
//       success: false,
//       message: 'An unexpected error occurred',
//     };
//   }
// }
