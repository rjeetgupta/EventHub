// 'use client';

// import React, { useEffect, useCallback } from 'react';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import {
//   createEventSchema,
//   updateEventSchema,
//   type CreateEventInput,
//   type UpdateEventInput,
// } from '@/lib/validators/event.validators';
// import { useFormErrors } from '@/hooks/useFormErrors';
// import { EventService } from '@/services/eventService';
// import { User, Event } from '@/types/api';
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from '@/components/ui/dialog';
// import { Button } from '@/components/ui/button';
// import {
//   Form,
//   FormControl,
//   FormDescription,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from '@/components/ui/form';
// import { Input } from '@/components/ui/input';
// import { Textarea } from '@/components/ui/textarea';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';
// import { Alert, AlertDescription } from '@/components/ui/alert';
// import { AlertCircle } from 'lucide-react';

// interface EventFormProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onSuccess?: (event: Event) => void;
//   currentUser: User;
//   existingEvent?: Event;
// }

// export function EventForm({
//   isOpen,
//   onClose,
//   onSuccess,
//   currentUser,
//   existingEvent,
// }: EventFormProps) {
//   const { errors, setGeneralError, clearAllErrors, handleZodError } = useFormErrors();
//   const isEdit = !!existingEvent;
//   const schema = isEdit ? updateEventSchema : createEventSchema;

//   const form = useForm<CreateEventInput | UpdateEventInput>({
//     resolver: zodResolver(schema),
//     defaultValues: existingEvent
//       ? {
//           title: existingEvent.title,
//           description: existingEvent.description,
//           date: new Date(existingEvent.date).toISOString().split('T')[0],
//           startTime: existingEvent.startTime,
//           endTime: existingEvent.endTime,
//           capacity: existingEvent.maxCapacity,
//           mode: existingEvent.mode as 'Online' | 'Offline' | 'Hybrid',
//           registrationDeadline: new Date(existingEvent.registrationDeadline)
//             .toISOString()
//             .split('T')[0],
//           location: existingEvent.location,
//         }
//       : {
//           title: '',
//           description: '',
//           date: '',
//           startTime: '',
//           endTime: '',
//           capacity: 0,
//           mode: 'Online',
//           registrationDeadline: '',
//           location: '',
//         },
//   });

//   const [isProcessing, setIsProcessing] = React.useState(false);

//   // Reset form when dialog opens
//   useEffect(() => {
//     if (isOpen) {
//       clearAllErrors();
//       if (!isEdit) {
//         form.reset();
//       }
//     }
//   }, [isOpen, clearAllErrors, form, isEdit]);

//   // Handle form submission
//   const onSubmit = useCallback(
//     async (data: CreateEventInput | UpdateEventInput) => {
//       setIsProcessing(true);
//       clearAllErrors();

//       try {
//         let result;

//         if (isEdit && existingEvent) {
//           result = await EventService.updateEvent(
//             existingEvent.id,
//             data as UpdateEventInput,
//             currentUser,
//             existingEvent.createdBy
//           );
//         } else {
//           result = await EventService.createEvent(
//             data as CreateEventInput,
//             currentUser
//           );
//         }

//         if (result.success && result.data) {
//           onSuccess?.(result.data);
//           form.reset();
//           onClose();
//         } else if (result.errors) {
//           // Field-level errors from service
//           Object.entries(result.errors).forEach(([field, message]) => {
//             form.setError(field as any, { message: String(message) });
//           });
//           if (result.message) {
//             setGeneralError(result.message);
//           }
//         } else {
//           setGeneralError(result.message || `Failed to ${isEdit ? 'update' : 'create'} event`);
//         }
//       } catch (error) {
//         if (error instanceof Error) {
//           // Check if it's a Zod error by looking for the shape
//           if ('errors' in error) {
//             handleZodError(error as any);
//           } else {
//             setGeneralError(error.message);
//           }
//         } else {
//           setGeneralError(`Failed to ${isEdit ? 'update' : 'create'} event`);
//         }
//       } finally {
//         setIsProcessing(false);
//       }
//     },
//     [isEdit, existingEvent, currentUser, clearAllErrors, setGeneralError, handleZodError, onSuccess, form, onClose]
//   );

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
//         <DialogHeader>
//           <DialogTitle>{isEdit ? 'Edit Event' : 'Create New Event'}</DialogTitle>
//         </DialogHeader>

//         {/* Error Alert */}
//         {errors.generalError && (
//           <Alert variant="destructive">
//             <AlertCircle className="h-4 w-4" />
//             <AlertDescription>{errors.generalError}</AlertDescription>
//           </Alert>
//         )}

//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
//             {/* Title */}
//             <FormField
//               control={form.control}
//               name="title"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Event Title *</FormLabel>
//                   <FormControl>
//                     <Input
//                       placeholder="Enter event title"
//                       {...field}
//                       disabled={isProcessing}
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             {/* Description */}
//             <FormField
//               control={form.control}
//               name="description"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Description *</FormLabel>
//                   <FormControl>
//                     <Textarea
//                       placeholder="Enter event description"
//                       rows={4}
//                       {...field}
//                       disabled={isProcessing}
//                       className="resize-none"
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             {/* Date & Time Row */}
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               <FormField
//                 control={form.control}
//                 name="date"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Event Date *</FormLabel>
//                     <FormControl>
//                       <Input
//                         type="date"
//                         {...field}
//                         disabled={isProcessing}
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <FormField
//                 control={form.control}
//                 name="startTime"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Start Time *</FormLabel>
//                     <FormControl>
//                       <Input
//                         type="time"
//                         {...field}
//                         disabled={isProcessing}
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <FormField
//                 control={form.control}
//                 name="endTime"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>End Time *</FormLabel>
//                     <FormControl>
//                       <Input
//                         type="time"
//                         {...field}
//                         disabled={isProcessing}
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//             </div>

//             {/* Mode & Capacity Row */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <FormField
//                 control={form.control}
//                 name="mode"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Event Mode *</FormLabel>
//                     <Select
//                       onValueChange={field.onChange}
//                       defaultValue={field.value}
//                       disabled={isProcessing}
//                     >
//                       <FormControl>
//                         <SelectTrigger>
//                           <SelectValue placeholder="Select mode" />
//                         </SelectTrigger>
//                       </FormControl>
//                       <SelectContent>
//                         <SelectItem value="Online">Online</SelectItem>
//                         <SelectItem value="Offline">Offline</SelectItem>
//                         <SelectItem value="Hybrid">Hybrid</SelectItem>
//                       </SelectContent>
//                     </Select>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <FormField
//                 control={form.control}
//                 name="capacity"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Max Capacity *</FormLabel>
//                     <FormControl>
//                       <Input
//                         type="number"
//                         placeholder="Enter max capacity"
//                         {...field}
//                         onChange={(e) => field.onChange(parseInt(e.target.value))}
//                         disabled={isProcessing}
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//             </div>

//             {/* Location */}
//             <FormField
//               control={form.control}
//               name="location"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Location</FormLabel>
//                   <FormControl>
//                     <Input
//                       placeholder="Enter location (for offline/hybrid events)"
//                       {...field}
//                       disabled={isProcessing}
//                     />
//                   </FormControl>
//                   <FormDescription>
//                     Required for offline and hybrid events
//                   </FormDescription>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             {/* Registration Deadline */}
//             <FormField
//               control={form.control}
//               name="registrationDeadline"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Registration Deadline *</FormLabel>
//                   <FormControl>
//                     <Input
//                       type="date"
//                       {...field}
//                       disabled={isProcessing}
//                     />
//                   </FormControl>
//                   <FormDescription>
//                     Must be before event date
//                   </FormDescription>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             {/* Dialog Footer */}
//             <DialogFooter className="mt-6">
//               <Button
//                 type="button"
//                 variant="outline"
//                 onClick={onClose}
//                 disabled={isProcessing}
//               >
//                 Cancel
//               </Button>
//               <Button
//                 type="submit"
//                 disabled={isProcessing}
//                 className="bg-linear-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700"
//               >
//                 {isProcessing
//                   ? 'Processing...'
//                   : isEdit
//                     ? 'Update Event'
//                     : 'Create Event'}
//               </Button>
//             </DialogFooter>
//           </form>
//         </Form>
//       </DialogContent>
//     </Dialog>
//   );
// }
