// components/create-event/EventPreview.tsx
import React from 'react';
import { ArrowLeft, Send, Save, Calendar, Clock, MapPin, Globe, Users, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';

interface EventPreviewProps {
  formData: any;
  onBack: () => void;
  onSubmit: () => void;
  onSaveDraft: () => void;
}

export function EventPreview({ formData, onBack, onSubmit, onSaveDraft }: EventPreviewProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Button variant="ghost" onClick={onBack} className="mb-2 hover:bg-orange-500/10">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Edit
            </Button>
            <h1 className="text-3xl md:text-4xl font-bold">Event Preview</h1>
            <p className="text-muted-foreground">Review how your event will appear</p>
          </div>
        </div>

        {/* Preview Card */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-orange-500/20">
              <CardHeader>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="outline" className="border-orange-500/30 text-orange-500">
                    {formData.category || 'Category'}
                  </Badge>
                  <Badge variant="outline" className="border-blue-500/30 text-blue-500">
                    {formData.mode || 'Mode'}
                  </Badge>
                  <Badge variant="outline" className="border-purple-500/30 text-purple-500">
                    {formData.department || 'Department'}
                  </Badge>
                  <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
                    Pending Approval
                  </Badge>
                </div>
                <CardTitle className="text-3xl">{formData.title || 'Event Title'}</CardTitle>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 text-muted-foreground">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5 text-orange-500" />
                    <span>{formData.date || 'Date not set'}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-orange-500" />
                    <span>{formData.time || 'Time not set'}</span>
                  </div>
                  {formData.venue && (
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-5 h-5 text-orange-500" />
                      <span>{formData.venue}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2">
                    <Globe className="w-5 h-5 text-orange-500" />
                    <span>{formData.mode}</span>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <Card className="border-orange-500/20">
              <CardHeader>
                <CardTitle>About This Event</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {formData.description || 'No description provided'}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="border-orange-500/20">
              <CardHeader>
                <CardTitle className="text-lg">Event Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center">
                    <Users className="w-4 h-4 mr-2" />
                    Max Capacity
                  </span>
                  <span className="font-semibold">{formData.maxCapacity || 'Not set'}</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    Deadline
                  </span>
                  <span className="font-semibold text-xs">
                    {formData.registrationDeadline || 'Not set'}
                  </span>
                </div>

                {formData.certificateAvailable && (
                  <div className="flex items-center space-x-2 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                    <Award className="w-5 h-5 text-amber-500" />
                    <span className="text-sm font-semibold">Certificate Available</span>
                  </div>
                )}

                {formData.link && (
                  <div className="pt-3 border-t">
                    <Label className="text-xs text-muted-foreground">Online Link</Label>
                    <p className="text-sm break-all text-blue-500">{formData.link}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <Card className="border-orange-500/20">
              <CardContent className="p-4 space-y-2">
                <Button
                  onClick={onSubmit}
                  className="w-full bg-linear-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Submit for Approval
                </Button>
                <Button
                  variant="outline"
                  onClick={onSaveDraft}
                  className="w-full border-orange-500/30 hover:bg-orange-500/10"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save as Draft
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}