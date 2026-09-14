'use client';

import React, { useEffect } from 'react';
import { useForm, Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';
import {
  CreateEventFormData,
  CreateEventFormSchema,
  Event,
} from '@/lib/schema/event.schema';
import { EventMode } from '@/lib/types/common.types';
import { EventFormFields } from '@/components/forms/EventForm';
import { createEvent, saveEventDraft, updateEvent } from '@/store/slices/eventsSlice';
import { fetchDepartments } from '@/store/slices/departmentSlice';
import { toast } from 'sonner';
import { useAppDispatch, useAppSelector } from '@/store/hook';

interface EventFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: (event: Event) => void;
  /** When provided, the dialog edits this event instead of creating a new one. */
  event?: Event | null;
}

function toFormDefaults(event?: Event | null): CreateEventFormData {
  if (!event) {
    return {
      title: '',
      description: '',
      category: '',
      date: '',
      time: '',
      mode: EventMode.OFFLINE,
      venue: '',
      link: '',
      registrationDeadline: '',
      maxCapacity: 50,
      departmentId: '',
    };
  }

  return {
    title: event.title,
    description: event.description,
    category: event.category,
    date: event.date.slice(0, 10),
    time: event.time,
    mode: event.mode,
    venue: event.venue || '',
    link: event.link || '',
    registrationDeadline: event.registrationDeadline.slice(0, 10),
    maxCapacity: event.maxCapacity,
  };
}

export function EventFormDialog({
  open,
  onClose,
  onSuccess,
  event = null,
}: EventFormDialogProps) {
  const dispatch = useAppDispatch();
  const isEditMode = Boolean(event);
  const { departments, isLoading: isDepartmentsLoading } = useAppSelector(
    (state) => state.departments
  );
  const { isCreating, isUpdating } = useAppSelector((state) => state.events);
  const { user } = useAppSelector((state) => state.auth);
  const isSuperAdmin = user?.role === 'SUPER_ADMIN';
  const isProcessing = isEditMode ? isUpdating : isCreating;

  const [localError, setLocalError] = React.useState<string | null>(null);

  const form = useForm<CreateEventFormData>({
    resolver: zodResolver(CreateEventFormSchema) as Resolver<CreateEventFormData>,
    defaultValues: toFormDefaults(event),
  });

  // Fetch departments on mount
  useEffect(() => {
    if (open && departments.length === 0) {
      dispatch(fetchDepartments());
    }
  }, [open, dispatch, departments.length]);

  // Reset form whenever the dialog opens (for the correct event) or closes
  useEffect(() => {
    if (open) {
      form.reset(toFormDefaults(event));
      setLocalError(null);
    }
  }, [open, event, form]);

  // Handle submit (create -> submit for approval, or update existing event)
  const handleSubmit = async (data: CreateEventFormData) => {
    try {
      setLocalError(null);

      if (!isEditMode && isSuperAdmin && !data.departmentId) {
        setLocalError('Please select a department for this event');
        return;
      }

      const result = isEditMode
        ? await dispatch(updateEvent({ id: event!.id, data })).unwrap()
        : await dispatch(createEvent(data)).unwrap();

      toast.success(isEditMode ? 'Event updated successfully' : 'Event submitted for approval');
      onSuccess?.(result);
      onClose();
    } catch (error: any) {
      const message = error?.message || error || (isEditMode ? 'Failed to update event' : 'Failed to submit event');
      setLocalError(message);
      toast.error(message);
    }
  };

  // Handle save as draft (create flow only)
  const handleSaveDraft = async () => {
    try {
      setLocalError(null);
      const data = form.getValues();

      if (isSuperAdmin && !data.departmentId) {
        setLocalError('Please select a department before saving as draft');
        return;
      }

      const result = await dispatch(saveEventDraft(data)).unwrap();

      toast.success('Draft saved successfully');
      onSuccess?.(result);
      onClose();
    } catch (error: any) {
      const message = error?.message || error || 'Failed to save draft';
      setLocalError(message);
      toast.error(message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-linear-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
            {isEditMode ? 'Edit Event' : 'Create New Event'}
          </DialogTitle>
        </DialogHeader>

        {/* Error Alert */}
        {localError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{localError}</AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            {/* All form fields in one view */}
            <EventFormFields
              form={form}
              step="all"
              departments={departments}
              isProcessing={isProcessing}
              showDepartmentSelect={isSuperAdmin && !isEditMode}
            />

            {/* Dialog Footer */}
            <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isProcessing}
                className="border-orange-500/30 hover:bg-orange-500/10"
              >
                Cancel
              </Button>

              <div className="flex gap-2">
                {!isEditMode && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleSaveDraft}
                    disabled={isProcessing}
                    className="border-orange-500/30 hover:bg-orange-500/10"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Save as Draft'
                    )}
                  </Button>
                )}

                <Button
                  type="submit"
                  disabled={isProcessing}
                  className="bg-linear-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {isEditMode ? 'Saving...' : 'Submitting...'}
                    </>
                  ) : isEditMode ? (
                    'Save Changes'
                  ) : (
                    'Submit for Approval'
                  )}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
