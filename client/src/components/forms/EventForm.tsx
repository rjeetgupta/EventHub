'use client';

import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CreateEventFormData } from '@/lib/schema/event.schema';
import { EventMode } from '@/lib/types/common.types';
import { Button } from '@/components/ui/button';

interface Department {
  id: string;
  name: string;
  code: string;
}

interface EventFormFieldsProps {
  form: UseFormReturn<CreateEventFormData>;
  step: 'basic' | 'details' | 'settings' | 'all';
  departments?: Department[];
  isProcessing?: boolean;
}

// Event categories constant
export const EVENT_CATEGORIES = [
  'Technical',
  'Cultural',
  'Sports',
  'Workshop',
  'Seminar',
  'Hackathon',
  'Competition',
  'Social',
  'Other',
] as const;

export function EventFormFields({
  form,
  step,
  departments = [],
  isProcessing = false,
}: EventFormFieldsProps) {
  const watchMode = form.watch('mode');

  // STEP 1: Basic Info - Title, Description, Category
  if (step === 'basic') {
    return (
      <div className="space-y-6">
        {/* Title */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Title *</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter event title"
                  {...field}
                  disabled={isProcessing}
                  className="border-orange-500/20 focus-visible:ring-orange-500"
                />
              </FormControl>
              <FormDescription>
                Minimum 3 characters, maximum 200 characters
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description *</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe your event..."
                  rows={6}
                  {...field}
                  disabled={isProcessing}
                  className="border-orange-500/20 focus-visible:ring-orange-500 resize-none"
                />
              </FormControl>
              <FormDescription>
                Minimum 10 characters, maximum 2000 characters
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Category */}
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category *</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={isProcessing}
              >
                <FormControl>
                  <SelectTrigger className="border-orange-500/20 focus:ring-orange-500">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {EVENT_CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    );
  }

  // STEP 2: Event Details - Date, Time, Mode, Venue/Link
  if (step === 'details') {
    return (
      <div className="space-y-6">
        {/* Date & Time Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event Date *</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    {...field}
                    disabled={isProcessing}
                    className="border-orange-500/20 focus-visible:ring-orange-500"
                  />
                </FormControl>
                <FormDescription>Must be in the future</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event Time *</FormLabel>
                <FormControl>
                  <Input
                    type="time"
                    {...field}
                    disabled={isProcessing}
                    className="border-orange-500/20 focus-visible:ring-orange-500"
                  />
                </FormControl>
                <FormDescription>Format: HH:MM (24-hour)</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Event Mode */}
        <FormField
          control={form.control}
          name="mode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Mode *</FormLabel>
              <div className="flex gap-3">
                {Object.values(EventMode).map((mode) => (
                  <Button
                    key={mode}
                    type="button"
                    variant={field.value === mode ? 'default' : 'outline'}
                    onClick={() => field.onChange(mode)}
                    disabled={isProcessing}
                    className={
                      field.value === mode
                        ? 'bg-linear-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600'
                        : 'border-orange-500/30 hover:bg-orange-500/10'
                    }
                  >
                    {mode}
                  </Button>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Venue (for OFFLINE or HYBRID) */}
        {(watchMode === EventMode.OFFLINE || watchMode === EventMode.HYBRID) && (
          <FormField
            control={form.control}
            name="venue"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Venue *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter venue location"
                    {...field}
                    value={field.value || ''}
                    disabled={isProcessing}
                    className="border-orange-500/20 focus-visible:ring-orange-500"
                  />
                </FormControl>
                <FormDescription>
                  Required for offline and hybrid events
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Link (for ONLINE or HYBRID) */}
        {(watchMode === EventMode.ONLINE || watchMode === EventMode.HYBRID) && (
          <FormField
            control={form.control}
            name="link"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Meeting Link {watchMode === EventMode.ONLINE ? '*' : ''}
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://meet.google.com/..."
                    {...field}
                    value={field.value || ''}
                    disabled={isProcessing}
                    className="border-orange-500/20 focus-visible:ring-orange-500"
                  />
                </FormControl>
                <FormDescription>
                  {watchMode === EventMode.ONLINE
                    ? 'Required for online events'
                    : 'Required for hybrid events'}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </div>
    );
  }

  // STEP 3: Settings - Registration Deadline & Max Capacity
  if (step === 'settings') {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="registrationDeadline"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Registration Deadline *</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    {...field}
                    disabled={isProcessing}
                    className="border-orange-500/20 focus-visible:ring-orange-500"
                  />
                </FormControl>
                <FormDescription>Must be before event date</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="maxCapacity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Maximum Capacity *</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="e.g., 100"
                    {...field}
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(value === '' ? 0 : parseInt(value, 10));
                    }}
                    disabled={isProcessing}
                    className="border-orange-500/20 focus-visible:ring-orange-500"
                  />
                </FormControl>
                <FormDescription>Maximum: 10,000 participants</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    );
  }

  // ALL fields (for dialog/single page form)
  return (
    <div className="space-y-6">
      {/* Title */}
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Event Title *</FormLabel>
            <FormControl>
              <Input
                placeholder="Enter event title"
                {...field}
                disabled={isProcessing}
                className="border-orange-500/20 focus-visible:ring-orange-500"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Description */}
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description *</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Describe your event..."
                rows={6}
                {...field}
                disabled={isProcessing}
                className="border-orange-500/20 focus-visible:ring-orange-500 resize-none"
              />
            </FormControl>
            <FormDescription>
              Minimum 10 characters, maximum 2000 characters
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Category */}
      <FormField
        control={form.control}
        name="category"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Category *</FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
              disabled={isProcessing}
            >
              <FormControl>
                <SelectTrigger className="border-orange-500/20 focus:ring-orange-500">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {EVENT_CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Date & Time Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Date *</FormLabel>
              <FormControl>
                <Input
                  type="date"
                  {...field}
                  disabled={isProcessing}
                  className="border-orange-500/20 focus-visible:ring-orange-500"
                />
              </FormControl>
              <FormDescription>Must be in the future</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="time"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Time *</FormLabel>
              <FormControl>
                <Input
                  type="time"
                  {...field}
                  disabled={isProcessing}
                  className="border-orange-500/20 focus-visible:ring-orange-500"
                />
              </FormControl>
              <FormDescription>Format: HH:MM (24-hour)</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Event Mode */}
      <FormField
        control={form.control}
        name="mode"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Event Mode *</FormLabel>
            <div className="flex gap-3">
              {Object.values(EventMode).map((mode) => (
                <Button
                  key={mode}
                  type="button"
                  variant={field.value === mode ? 'default' : 'outline'}
                  onClick={() => field.onChange(mode)}
                  disabled={isProcessing}
                  className={
                    field.value === mode
                      ? 'bg-linear-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600'
                      : 'border-orange-500/30 hover:bg-orange-500/10'
                  }
                >
                  {mode}
                </Button>
              ))}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Venue (for OFFLINE or HYBRID) */}
      {(watchMode === EventMode.OFFLINE || watchMode === EventMode.HYBRID) && (
        <FormField
          control={form.control}
          name="venue"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Venue *</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter venue location"
                  {...field}
                  value={field.value || ''}
                  disabled={isProcessing}
                  className="border-orange-500/20 focus-visible:ring-orange-500"
                />
              </FormControl>
              <FormDescription>
                Required for offline and hybrid events
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      {/* Link (for ONLINE or HYBRID) */}
      {(watchMode === EventMode.ONLINE || watchMode === EventMode.HYBRID) && (
        <FormField
          control={form.control}
          name="link"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Meeting Link {watchMode === EventMode.ONLINE ? '*' : ''}
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="https://meet.google.com/..."
                  {...field}
                  value={field.value || ''}
                  disabled={isProcessing}
                  className="border-orange-500/20 focus-visible:ring-orange-500"
                />
              </FormControl>
              <FormDescription>
                {watchMode === EventMode.ONLINE
                  ? 'Required for online events'
                  : 'Required for hybrid events'}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      {/* Registration Deadline & Max Capacity Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="registrationDeadline"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Registration Deadline *</FormLabel>
              <FormControl>
                <Input
                  type="date"
                  {...field}
                  disabled={isProcessing}
                  className="border-orange-500/20 focus-visible:ring-orange-500"
                />
              </FormControl>
              <FormDescription>Must be before event date</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="maxCapacity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Maximum Capacity *</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="e.g., 100"
                  {...field}
                  onChange={(e) => {
                    const value = e.target.value;
                    field.onChange(value === '' ? 0 : parseInt(value, 10));
                  }}
                  disabled={isProcessing}
                  className="border-orange-500/20 focus-visible:ring-orange-500"
                />
              </FormControl>
              <FormDescription>Maximum: 10,000 participants</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}