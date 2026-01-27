// 'use client';

// import React, { useCallback, useState } from 'react';
// import { EventForm } from '@/components/forms/EventForm';
// import { EventManagement } from '@/components/department/EventManagement';
// import { useCanCreateEvents } from '@/lib/usePermissions';
// import { User } from "@/lib/types/user.types";
// import { Event } from '@/lib/types/event.types';
// import { Button } from '@/components/ui/button';
// import { Plus, Calendar } from 'lucide-react';

// interface DashboardEventsProps {
//   currentUser: User;
// }

// export function DashboardEvents({ currentUser }: DashboardEventsProps) {
//   const canCreate = useCanCreateEvents(currentUser);
//   const [isFormOpen, setIsFormOpen] = useState(false);
//   const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
//   const [refreshKey, setRefreshKey] = useState(0);

//   // Handle create new event
//   const handleCreateClick = useCallback(() => {
//     setSelectedEvent(null);
//     setIsFormOpen(true);
//   }, []);

//   // Handle edit event
//   const handleEditEvent = useCallback((event: Event) => {
//     setSelectedEvent(event);
//     setIsFormOpen(true);
//   }, []);

//   // Handle form close
//   const handleFormClose = useCallback(() => {
//     setIsFormOpen(false);
//     setSelectedEvent(null);
//   }, []);

//   // Handle event creation/update success
//   const handleEventSuccess = useCallback((event: Event) => {
//     setRefreshKey((prev) => prev + 1);
//     handleFormClose();
//   }, [handleFormClose]);

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
//             <Calendar className="w-8 h-8" />
//             Events
//           </h1>
//           <p className="text-muted-foreground mt-1">
//             Manage and organize your events
//           </p>
//         </div>

//         {canCreate && (
//           <Button
//             onClick={handleCreateClick}
//             className="bg-linear-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700"
//           >
//             <Plus className="w-4 h-4 mr-2" />
//             Create Event
//           </Button>
//         )}
//       </div>

//       {/* Event Management Component */}
//       <EventManagement
//         currentUser={currentUser}
//         onEditEvent={handleEditEvent}
//         refreshKey={refreshKey}
//       />

//       {/* Event Form Dialog */}
//       <EventForm
//         isOpen={isFormOpen}
//         onClose={handleFormClose}
//         onSuccess={handleEventSuccess}
//         currentUser={currentUser}
//         existingEvent={selectedEvent || undefined}
//       />
//     </div>
//   );
// }
