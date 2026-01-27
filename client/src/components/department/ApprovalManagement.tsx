// 'use client';

// import React, { useEffect, useState, useCallback } from 'react';
// import { ApprovalService } from '@/services/approvalService';
// import { useCanApproveEvent } from '@/lib/usePermissions';
// import { useFormErrors } from '@/hooks/useFormErrors';
// import { User } from "@/lib/types/user.types";
// import { Event } from '@/lib/types/event.types';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from '@/components/ui/dialog';
// import { Alert, AlertDescription } from '@/components/ui/alert';
// import { Textarea } from '@/components/ui/textarea';
// import { Label } from '@/components/ui/label';
// import {
//   AlertCircle,
//   CheckCircle,
//   XCircle,
//   Calendar,
//   Users,
// } from 'lucide-react';

// interface ApprovalManagementProps {
//   currentUser: User;
//   onApprovalComplete?: () => void;
// }

// export function ApprovalManagement({
//   currentUser,
//   onApprovalComplete,
// }: ApprovalManagementProps) {
//   const { errors, setGeneralError, clearAllErrors } = useFormErrors();
//   const canApprove = useCanApproveEvent(currentUser);

//   const [pendingEvents, setPendingEvents] = useState<Event[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
//   const [feedback, setFeedback] = useState('');
//   const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);
//   const [isDialogOpen, setIsDialogOpen] = useState(false);

//   // Fetch pending events
//   // const fetchPendingEvents = useCallback(async () => {
//   //   setIsLoading(true);
//   //   clearAllErrors();

//   //   try {
//   //     const result = await ApprovalService.getPendingEvents(
//   //       { page: 1, limit: 50 },
//   //       currentUser
//   //     );

//   //     if (result.success && result.data) {
//   //       setPendingEvents(result.data.events);
//   //     } else {
//   //       setGeneralError(result.message || 'Failed to load pending events');
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
//   //   if (canApprove) {
//   //     fetchPendingEvents();
//   //   }
//   // }, [canApprove, fetchPendingEvents]);

//   // Handle approve action
//   const handleOpenApproveDialog = useCallback((event: Event) => {
//     setSelectedEvent(event);
//     setActionType('approve');
//     setFeedback('');
//     setIsDialogOpen(true);
//     clearAllErrors();
//   }, [clearAllErrors]);

//   // Handle reject action
//   const handleOpenRejectDialog = useCallback((event: Event) => {
//     setSelectedEvent(event);
//     setActionType('reject');
//     setFeedback('');
//     setIsDialogOpen(true);
//     clearAllErrors();
//   }, [clearAllErrors]);

//   // Close dialog
//   const handleCloseDialog = useCallback(() => {
//     setIsDialogOpen(false);
//     setSelectedEvent(null);
//     setFeedback('');
//     setActionType(null);
//   }, []);

//   // Submit approval/rejection
//   const handleSubmitAction = useCallback(async () => {
//     if (!selectedEvent || !actionType) return;

//     setIsProcessing(true);
//     clearAllErrors();

//     try {
//       let result;

//       if (actionType === 'approve') {
//         result = await ApprovalService.approveEvent(
//           {
//             eventId: selectedEvent.id,
//             feedback: feedback || undefined,
//           },
//           currentUser
//         );
//       } else {
//         result = await ApprovalService.rejectEvent(
//           {
//             eventId: selectedEvent.id,
//             feedback,
//           },
//           currentUser
//         );
//       }

//       if (result.success) {
//         // Remove from pending list
//         setPendingEvents((prev) =>
//           prev.filter((e) => e.id !== selectedEvent.id)
//         );
//         handleCloseDialog();
//         onApprovalComplete?.();
//       } else {
//         setGeneralError(result.message || `Failed to ${actionType} event`);
//       }
//     } catch (error) {
//       setGeneralError(
//         error instanceof Error
//           ? error.message
//           : `Failed to ${actionType} event`
//       );
//     } finally {
//       setIsProcessing(false);
//     }
//   }, [selectedEvent, actionType, feedback, currentUser, clearAllErrors, setGeneralError, handleCloseDialog, onApprovalComplete]);

//   // Access denied
//   if (!canApprove) {
//     return (
//       <Alert variant="destructive">
//         <AlertCircle className="h-4 w-4" />
//         <AlertDescription>
//           You do not have permission to approve events. Only department admins and admins can
//           access this feature.
//         </AlertDescription>
//       </Alert>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div>
//         <h2 className="text-2xl font-bold tracking-tight">Event Approvals</h2>
//         <p className="text-sm text-muted-foreground mt-1">
//           Review and approve pending events
//         </p>
//       </div>

//       {/* Error Alert */}
//       {errors.generalError && (
//         <Alert variant="destructive">
//           <AlertCircle className="h-4 w-4" />
//           <AlertDescription>{errors.generalError}</AlertDescription>
//         </Alert>
//       )}

//       {/* Pending Events */}
//       <div className="space-y-3">
//         {isLoading ? (
//           <Card>
//             <CardContent className="flex items-center justify-center py-8">
//               <p className="text-muted-foreground">Loading pending events...</p>
//             </CardContent>
//           </Card>
//         ) : pendingEvents.length === 0 ? (
//           <Card>
//             <CardContent className="flex flex-col items-center justify-center py-8">
//               <CheckCircle className="h-8 w-8 text-green-500 mb-2" />
//               <p className="text-muted-foreground">No pending events</p>
//             </CardContent>
//           </Card>
//         ) : (
//           pendingEvents.map((event) => (
//             <Card key={event.id} className="border-yellow-500/20 hover:border-yellow-500/40 transition-all">
//               <CardContent className="pt-6">
//                 <div className="space-y-4">
//                   {/* Event Info */}
//                   <div className="space-y-2">
//                     <div className="flex items-start justify-between">
//                       <div>
//                         <h3 className="text-lg font-semibold">{event.title}</h3>
//                         <p className="text-sm text-muted-foreground">
//                           {event.description.substring(0, 100)}...
//                         </p>
//                       </div>
//                       <Badge variant="outline" className="bg-yellow-500/10">
//                         Pending
//                       </Badge>
//                     </div>
//                   </div>

//                   {/* Event Details */}
//                   <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
//                     <div>
//                       <p className="text-muted-foreground">Organizer</p>
//                       <p className="font-medium">{event.creatorName}</p>
//                     </div>
//                     <div>
//                       <p className="text-muted-foreground">
//                         <Calendar className="inline w-3 h-3 mr-1" />
//                         Date
//                       </p>
//                       <p className="font-medium">
//                         {new Date(event.date).toLocaleDateString()}
//                       </p>
//                     </div>
//                     <div>
//                       <p className="text-muted-foreground">Mode</p>
//                       <p className="font-medium">{event.mode}</p>
//                     </div>
//                     <div>
//                       <p className="text-muted-foreground">
//                         <Users className="inline w-3 h-3 mr-1" />
//                         Capacity
//                       </p>
//                       <p className="font-medium">{event.maxCapacity}</p>
//                     </div>
//                   </div>

//                   {/* Actions */}
//                   <div className="flex gap-2 pt-2">
//                     <Button
//                       onClick={() => handleOpenApproveDialog(event)}
//                       disabled={isProcessing}
//                       className="bg-green-600 hover:bg-green-700"
//                     >
//                       <CheckCircle className="w-4 h-4 mr-2" />
//                       Approve
//                     </Button>
//                     <Button
//                       onClick={() => handleOpenRejectDialog(event)}
//                       disabled={isProcessing}
//                       variant="destructive"
//                     >
//                       <XCircle className="w-4 h-4 mr-2" />
//                       Reject
//                     </Button>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           ))
//         )}
//       </div>

//       {/* Action Dialog */}
//       <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
//         <DialogContent className="max-w-md">
//           <DialogHeader>
//             <DialogTitle>
//               {actionType === 'approve' ? 'Approve Event' : 'Reject Event'}
//             </DialogTitle>
//           </DialogHeader>

//           <div className="space-y-4 py-4">
//             {selectedEvent && (
//               <>
//                 <div className="bg-muted p-3 rounded-lg">
//                   <p className="font-medium">{selectedEvent.title}</p>
//                   <p className="text-sm text-muted-foreground mt-1">
//                     {selectedEvent.description.substring(0, 80)}...
//                   </p>
//                 </div>

//                 {actionType === 'approve' && (
//                   <div className="space-y-2">
//                     <Label htmlFor="feedback">
//                       Feedback (Optional)
//                     </Label>
//                     <Textarea
//                       id="feedback"
//                       placeholder="Add any feedback for the organizer"
//                       value={feedback}
//                       onChange={(e) => setFeedback(e.target.value)}
//                       disabled={isProcessing}
//                       className="resize-none"
//                     />
//                   </div>
//                 )}

//                 {actionType === 'reject' && (
//                   <div className="space-y-2">
//                     <Label htmlFor="feedback">
//                       Reason for Rejection *
//                     </Label>
//                     <Textarea
//                       id="feedback"
//                       placeholder="Provide a reason for rejecting this event"
//                       value={feedback}
//                       onChange={(e) => setFeedback(e.target.value)}
//                       disabled={isProcessing}
//                       className="resize-none border-red-500"
//                     />
//                     <p className="text-xs text-muted-foreground">
//                       Required to notify the organizer
//                     </p>
//                   </div>
//                 )}
//               </>
//             )}
//           </div>

//           <DialogFooter>
//             <Button
//               variant="outline"
//               onClick={handleCloseDialog}
//               disabled={isProcessing}
//             >
//               Cancel
//             </Button>
//             <Button
//               onClick={handleSubmitAction}
//               disabled={isProcessing || (actionType === 'reject' && !feedback.trim())}
//               className={
//                 actionType === 'approve'
//                   ? 'bg-green-600 hover:bg-green-700'
//                   : 'bg-red-600 hover:bg-red-700'
//               }
//             >
//               {isProcessing ? 'Processing...' : 'Confirm'}
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }
