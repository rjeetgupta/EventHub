// 'use client';

// import React, { useEffect, useState, useCallback } from 'react';
// import { EventService } from '@/services/eventService';
// import {
//   useCanCreateEvents,
//   useCanEditEvent,
//   useFilterEventsByRole,
//   useCanViewAnalytics,
// } from '@/lib/usePermissions';
// import { useFormErrors } from '@/hooks/useFormErrors';
// import { User } from "@/lib/types/user.types";
// import { Event } from '@/lib/types/event.types';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from '@/components/ui/table';
// import { Alert, AlertDescription } from '@/components/ui/alert';
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from '@/components/ui/dialog';
// import { AlertCircle, Edit2, Trash2, Plus } from 'lucide-react';

// interface EventManagementProps {
//   currentUser: User;
//   onEventCreated?: () => void;
//   onEventUpdated?: () => void;
//   onEditEvent?: (event: Event) => void;
//   refreshKey?: number;
// }

// export function EventManagement({
//   currentUser,
//   onEventCreated,
//   onEventUpdated,
//   onEditEvent,
//   refreshKey = 0,
// }: EventManagementProps) {
//   const { errors, setGeneralError, clearAllErrors } = useFormErrors();
//   const canCreate = useCanCreateEvents(currentUser);
//   const canViewAnalytics = useCanViewAnalytics(currentUser);

//   const [events, setEvents] = useState<Event[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
//   const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
//   const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

//   // Filter events based on user role
//   const visibleEvents = useFilterEventsByRole(currentUser, events);

//   // Fetch events
//   // const fetchEvents = useCallback(async () => {
//   //   setIsLoading(true);
//   //   clearAllErrors();

//   //   try {
//   //     const result = await EventService.getMyEvents(currentUser);

//   //     if (result.success && result.data) {
//   //       setEvents(result.data.events);
//   //     } else {
//   //       setGeneralError(result.message || 'Failed to load events');
//   //     }
//   //   } catch (error) {
//   //     setGeneralError(
//   //       error instanceof Error ? error.message : 'An unexpected error occurred'
//   //     );
//   //   } finally {
//   //     setIsLoading(false);
//   //   }
//   // }, [currentUser, clearAllErrors, setGeneralError]);

//   // Initial load
//   // useEffect(() => {
//   //   fetchEvents();
//   // }, [fetchEvents]);

//   // Delete event
//   const handleDeleteEvent = useCallback(
//     async (eventId: string) => {
//       const event = events.find((e) => e.id === eventId);
//       if (!event) return;

//       setIsProcessing(true);
//       clearAllErrors();

//       try {
//         const result = await EventService.deleteEvent(
//           eventId,
//           currentUser,
//           event.creatorId
//         );

//         if (result.success) {
//           setEvents((prev) => prev.filter((e) => e.id !== eventId));
//           setDeleteConfirmId(null);
//           onEventUpdated?.();
//         } else {
//           setGeneralError(result.message || 'Failed to delete event');
//         }
//       } catch (error) {
//         setGeneralError(
//           error instanceof Error ? error.message : 'Failed to delete event'
//         );
//       } finally {
//         setIsProcessing(false);
//       }
//     },
//     [events, currentUser, clearAllErrors, setGeneralError, onEventUpdated]
//   );

//   const getStatusColor = (status: string) => {
//     const colors: Record<string, string> = {
//       draft: 'bg-gray-500',
//       pending: 'bg-yellow-500',
//       approved: 'bg-green-500',
//       upcoming: 'bg-blue-500',
//       finished: 'bg-gray-400',
//     };
//     return colors[status] || 'bg-gray-500';
//   };

//   const canEditEvent = useCallback(
//     (event: Event) => {
//       return useCanEditEvent(currentUser, event.creatorId);
//     },
//     [currentUser]
//   );

//   if (!canCreate) {
//     return (
//       <Alert>
//         <AlertCircle className="h-4 w-4" />
//         <AlertDescription>
//           You do not have permission to manage events. Only group admins and department
//           admins can create and manage events.
//         </AlertDescription>
//       </Alert>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h2 className="text-2xl font-bold tracking-tight">Event Management</h2>
//           <p className="text-sm text-muted-foreground mt-1">
//             Create and manage your events
//           </p>
//         </div>
//         <Button
//           onClick={() => setIsCreateDialogOpen(true)}
//           className="bg-linear-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
//         >
//           <Plus className="w-4 h-4 mr-2" />
//           Create Event
//         </Button>
//       </div>

//       {/* Error Alert */}
//       {errors.generalError && (
//         <Alert variant="destructive">
//           <AlertCircle className="h-4 w-4" />
//           <AlertDescription>{errors.generalError}</AlertDescription>
//         </Alert>
//       )}

//       {/* Events Table */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Your Events</CardTitle>
//         </CardHeader>
//         <CardContent>
//           {isLoading ? (
//             <div className="text-center py-8">
//               <p className="text-muted-foreground">Loading events...</p>
//             </div>
//           ) : visibleEvents.length === 0 ? (
//             <div className="text-center py-8">
//               <p className="text-muted-foreground">No events found</p>
//             </div>
//           ) : (
//             <div className="overflow-x-auto">
//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead>Title</TableHead>
//                     <TableHead>Date</TableHead>
//                     <TableHead>Status</TableHead>
//                     <TableHead>Registrations</TableHead>
//                     <TableHead>Mode</TableHead>
//                     <TableHead className="text-right">Actions</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {visibleEvents.map((event) => (
//                     <TableRow key={event.id}>
//                       <TableCell className="font-medium">{event.title}</TableCell>
//                       <TableCell>{new Date(event.date).toLocaleDateString()}</TableCell>
//                       <TableCell>
//                         <Badge className={getStatusColor(event.status)}>
//                           {event.status}
//                         </Badge>
//                       </TableCell>
//                       <TableCell>
//                         {event.registrations}/{event.maxCapacity}
//                       </TableCell>
//                       <TableCell>
//                         <Badge variant="outline">{event.mode}</Badge>
//                       </TableCell>
//                       <TableCell className="text-right">
//                         <div className="flex justify-end gap-2">
//                           {canEditEvent(event) && (
//                             <>
//                               <Button
//                                 size="sm"
//                                 variant="outline"
//                                 onClick={() => setSelectedEvent(event)}
//                                 disabled={isProcessing}
//                                 className="h-8 w-8 p-0"
//                               >
//                                 <Edit2 className="h-4 w-4" />
//                               </Button>
//                               <Button
//                                 size="sm"
//                                 variant="destructive"
//                                 onClick={() => setDeleteConfirmId(event.id)}
//                                 disabled={isProcessing}
//                                 className="h-8 w-8 p-0"
//                               >
//                                 <Trash2 className="h-4 w-4" />
//                               </Button>
//                             </>
//                           )}
//                         </div>
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </div>
//           )}
//         </CardContent>
//       </Card>

//       {/* Delete Confirmation Dialog */}
//       <Dialog open={!!deleteConfirmId} onOpenChange={(open) => !open && setDeleteConfirmId(null)}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Delete Event</DialogTitle>
//           </DialogHeader>

//           <p className="text-sm text-muted-foreground">
//             Are you sure you want to delete this event? This action cannot be undone.
//           </p>

//           <DialogFooter>
//             <Button
//               variant="outline"
//               onClick={() => setDeleteConfirmId(null)}
//               disabled={isProcessing}
//             >
//               Cancel
//             </Button>
//             <Button
//               variant="destructive"
//               onClick={() =>
//                 deleteConfirmId && handleDeleteEvent(deleteConfirmId)
//               }
//               disabled={isProcessing}
//             >
//               {isProcessing ? 'Deleting...' : 'Delete Event'}
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }
