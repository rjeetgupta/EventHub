// 'use client';

// import React, { useCallback, useState } from 'react';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { z } from 'zod';
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
// import { Checkbox } from '@/components/ui/checkbox';
// import { Alert, AlertDescription } from '@/components/ui/alert';
// import { AlertCircle, CheckCircle } from 'lucide-react';

// // Validation schema for event registration
// const eventRegistrationSchema = z.object({
//   eventId: z.string().uuid(),
//   phoneNumber: z.string().regex(/^\d{10}$/, 'Phone number must be 10 digits'),
//   acceptTerms: z.boolean().refine((val) => val === true, {
//     message: 'You must accept the terms and conditions',
//   }),
// });

// type EventRegistrationInput = z.infer<typeof eventRegistrationSchema>;

// interface EventRegistrationFormProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onSuccess?: () => void;
//   currentUser: User;
//   event: Event;
// }

// export function EventRegistrationForm({
//   isOpen,
//   onClose,
//   onSuccess,
//   currentUser,
//   event,
// }: EventRegistrationFormProps) {
//   const { errors, setGeneralError, clearAllErrors } = useFormErrors();
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [isSuccessful, setIsSuccessful] = useState(false);

//   const form = useForm<EventRegistrationInput>({
//     resolver: zodResolver(eventRegistrationSchema),
//     defaultValues: {
//       eventId: event.id,
//       phoneNumber: '',
//       acceptTerms: false,
//     },
//   });

//   // Handle form submission
//   const onSubmit = useCallback(
//     async (data: EventRegistrationInput) => {
//       setIsProcessing(true);
//       clearAllErrors();
//       setIsSuccessful(false);

//       try {
//         const result = await EventService.registerForEvent(data);

//         if (result.success) {
//           setIsSuccessful(true);
//           form.reset();
//           setTimeout(() => {
//             onSuccess?.();
//             onClose();
//             setIsSuccessful(false);
//           }, 1500);
//         } else if (result.errors) {
//           Object.entries(result.errors).forEach(([field, message]) => {
//             form.setError(field as any, { message: String(message) });
//           });
//           if (result.message) {
//             setGeneralError(result.message);
//           }
//         } else {
//           setGeneralError(result.message || 'Failed to register for event');
//         }
//       } catch (error) {
//         setGeneralError(
//           error instanceof Error ? error.message : 'Failed to register for event'
//         );
//       } finally {
//         setIsProcessing(false);
//       }
//     },
//     [clearAllErrors, setGeneralError, form, onSuccess, onClose]
//   );

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="max-w-md">
//         <DialogHeader>
//           <DialogTitle>Register for Event</DialogTitle>
//         </DialogHeader>

//         {isSuccessful ? (
//           // Success State
//           <div className="flex flex-col items-center justify-center py-8 text-center space-y-3">
//             <CheckCircle className="h-12 w-12 text-green-500" />
//             <div>
//               <h3 className="font-semibold text-lg">Registration Successful!</h3>
//               <p className="text-sm text-muted-foreground mt-1">
//                 You have been registered for {event.title}
//               </p>
//             </div>
//           </div>
//         ) : (
//           <>
//             {/* Error Alert */}
//             {errors.generalError && (
//               <Alert variant="destructive">
//                 <AlertCircle className="h-4 w-4" />
//                 <AlertDescription>{errors.generalError}</AlertDescription>
//               </Alert>
//             )}

//             {/* Event Info */}
//             <div className="bg-muted p-4 rounded-lg">
//               <p className="text-sm font-medium text-muted-foreground">Event</p>
//               <p className="font-semibold">{event.title}</p>
//               <p className="text-xs text-muted-foreground mt-1">
//                 {new Date(event.date).toLocaleDateString()} at {event.startTime}
//               </p>
//             </div>

//             {/* Registration Form */}
//             <Form {...form}>
//               <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
//                 {/* Phone Number */}
//                 <FormField
//                   control={form.control}
//                   name="phoneNumber"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Phone Number *</FormLabel>
//                       <FormControl>
//                         <Input
//                           type="tel"
//                           placeholder="Enter 10-digit phone number"
//                           {...field}
//                           disabled={isProcessing}
//                           maxLength={10}
//                         />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 {/* Terms Acceptance */}
//                 <FormField
//                   control={form.control}
//                   name="acceptTerms"
//                   render={({ field }) => (
//                     <FormItem className="flex flex-row items-start space-x-3">
//                       <FormControl>
//                         <Checkbox
//                           checked={field.value}
//                           onCheckedChange={field.onChange}
//                           disabled={isProcessing}
//                         />
//                       </FormControl>
//                       <div className="space-y-1 leading-none">
//                         <FormLabel className="cursor-pointer">
//                           I accept the terms and conditions
//                         </FormLabel>
//                         <FormDescription>
//                           I confirm I will attend this event
//                         </FormDescription>
//                       </div>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 {/* Dialog Footer */}
//                 <DialogFooter className="mt-6">
//                   <Button
//                     type="button"
//                     variant="outline"
//                     onClick={onClose}
//                     disabled={isProcessing}
//                   >
//                     Cancel
//                   </Button>
//                   <Button
//                     type="submit"
//                     disabled={isProcessing}
//                     className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700"
//                   >
//                     {isProcessing ? 'Registering...' : 'Register'}
//                   </Button>
//                 </DialogFooter>
//               </form>
//             </Form>
//           </>
//         )}
//       </DialogContent>
//     </Dialog>
//   );
// }
