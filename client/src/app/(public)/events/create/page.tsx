'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, ArrowRight, Save, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { StepIndicator } from '@/components/events/StepIndicator';
import { fetchDepartments } from '@/store/slices/departmentSlice';
import { createEvent, saveEventDraft } from '@/store/slices/eventsSlice';
import {
  CreateEventFormData,
  CreateEventFormSchema,
} from '@/lib/schema/event.schema';
import { EventMode } from '@/lib/types/common.types';
import { EventFormFields } from "@/components/forms/EventForm";
import { toast } from 'sonner';
import { useAppDispatch, useAppSelector } from '@/store/hook';

const STEPS = ['Basic Info', 'Event Details', 'Settings', 'Review'];

// Review Step Component
function ReviewStep({ form }: { form: any }) {
  const formValues = form.getValues();

  return (
    <div className="space-y-4">
      <Alert className="border-orange-500/20 bg-orange-500/5">
        <AlertCircle className="h-4 w-4 text-orange-500" />
        <AlertDescription>
          Please review your event details before submitting for approval.
        </AlertDescription>
      </Alert>

      <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
        <div className="grid gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Title</p>
            <p className="font-semibold">{formValues.title || 'Not provided'}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Description</p>
            <p className="text-sm">{formValues.description || 'Not provided'}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Category</p>
              <p className="text-sm">{formValues.category || 'Not provided'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Mode</p>
              <p className="text-sm">{formValues.mode}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Date & Time</p>
              <p className="text-sm">
                {formValues.date && formValues.time
                  ? `${new Date(formValues.date).toLocaleDateString()} at ${
                      formValues.time
                    }`
                  : 'Not provided'}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Capacity</p>
              <p className="text-sm">{formValues.maxCapacity} participants</p>
            </div>
          </div>

          {formValues.venue && (
            <div>
              <p className="text-sm text-muted-foreground">Venue</p>
              <p className="text-sm">{formValues.venue}</p>
            </div>
          )}

          {formValues.link && (
            <div>
              <p className="text-sm text-muted-foreground">Meeting Link</p>
              <p className="text-sm break-all">{formValues.link}</p>
            </div>
          )}

          <div>
            <p className="text-sm text-muted-foreground">Registration Deadline</p>
            <p className="text-sm">
              {formValues.registrationDeadline
                ? new Date(formValues.registrationDeadline).toLocaleString()
                : 'Not provided'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CreateEventPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [currentStep, setCurrentStep] = useState(0);
  const [localError, setLocalError] = useState<string | null>(null);

  const { departments, isLoading: isDepartmentsLoading } = useAppSelector(
    (state) => state.departments
  );
  const { isCreating } = useAppSelector((state) => state.events);

  const form = useForm<CreateEventFormData>({
    resolver: zodResolver(CreateEventFormSchema),
    mode: 'onChange',
    defaultValues: {
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
    },
  });

  // Fetch departments on mount
  useEffect(() => {
    if (departments.length === 0) {
      dispatch(fetchDepartments());
    }
  }, [dispatch, departments.length]);

  const handleNext = async () => {
    // Validate current step fields before moving forward
    let fieldsToValidate: (keyof CreateEventFormData)[] = [];

    switch (currentStep) {
      case 0: // Basic Info
        fieldsToValidate = ['title', 'description', 'category'];
        break;
      case 1: // Event Details
        fieldsToValidate = ['date', 'time', 'mode', 'venue', 'link'];
        break;
      case 2: // Settings
        fieldsToValidate = ['registrationDeadline', 'maxCapacity'];
        break;
    }

    const isValid = await form.trigger(fieldsToValidate);
    
    if (isValid && currentStep < STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSaveDraft = async () => {
    try {
      setLocalError(null);
      const data = form.getValues();

      const result = await dispatch(saveEventDraft(data)).unwrap();

      toast.success('Draft saved successfully');
      router.push('/events');
    } catch (error: any) {
      const errorMessage = error?.message || error || 'Failed to save draft';
      setLocalError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const onSubmit = async (data: CreateEventFormData) => {
    try {
      setLocalError(null);

      const result = await dispatch(createEvent(data)).unwrap();

      toast.success('Event created and submitted for approval');
      router.push('/events');
    } catch (error: any) {
      const errorMessage = error?.message || error || 'Failed to create event';
      setLocalError(errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="mb-2 hover:bg-orange-500/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h1 className="text-3xl md:text-4xl font-bold bg-linear-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
              Create New Event
            </h1>
            <p className="text-muted-foreground">
              Fill in the details to create your event
            </p>
          </div>
          <Button
            variant="outline"
            onClick={handleSaveDraft}
            disabled={isCreating}
            className="border-orange-500/30 hover:bg-orange-500/10"
          >
            {isCreating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Draft
              </>
            )}
          </Button>
        </div>

        {/* Step Indicator */}
        <StepIndicator steps={STEPS} currentStep={currentStep} />

        {/* Error Alert */}
        {localError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{localError}</AlertDescription>
          </Alert>
        )}

        {/* Form */}
        <Card className="border-orange-500/20">
          <CardHeader>
            <CardTitle>{STEPS[currentStep]}</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Step 0: Basic Info - Title, Description, Category */}
                {currentStep === 0 && (
                  <EventFormFields
                    form={form}
                    step="basic"
                    departments={departments}
                    isProcessing={isCreating}
                  />
                )}

                {/* Step 1: Event Details - Date, Time, Mode, Venue/Link */}
                {currentStep === 1 && (
                  <EventFormFields
                    form={form}
                    step="details"
                    departments={departments}
                    isProcessing={isCreating}
                  />
                )}

                {/* Step 2: Settings - Registration Deadline & Max Capacity */}
                {currentStep === 2 && (
                  <EventFormFields
                    form={form}
                    step="settings"
                    departments={departments}
                    isProcessing={isCreating}
                  />
                )}

                {/* Step 3: Review */}
                {currentStep === 3 && <ReviewStep form={form} />}

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-6 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentStep === 0 || isCreating}
                    className="border-orange-500/30 hover:bg-orange-500/10"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Previous
                  </Button>

                  {currentStep === STEPS.length - 1 ? (
                    <Button
                      type="submit"
                      disabled={isCreating}
                      className="bg-linear-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                    >
                      {isCreating ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Submit for Approval
                        </>
                      )}
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={handleNext}
                      disabled={isCreating}
                      className="bg-linear-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                    >
                      Next
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}