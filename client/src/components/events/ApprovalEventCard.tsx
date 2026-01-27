// app/dashboard/overview/page.tsx
'use client';

import React from 'react';
import { TrendingUp, Calendar, Users, Award, CheckCircle, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface DepartmentStats {
  name: string;
  totalEvents: number;
  participants: number;
  completionRate: number;
  avgRating: number;
}

export default function ApprovalEventCard() {
  // Mock data - replace with API call
  const overallStats = {
    totalEvents: 45,
    totalParticipants: 3200,
    avgCompletionRate: 87,
    activeDepartments: 5
  };

  const departmentStats: DepartmentStats[] = [
    {
      name: 'Computer Science',
      totalEvents: 15,
      participants: 1200,
      completionRate: 92,
      avgRating: 4.8
    },
    {
      name: 'Electronics',
      totalEvents: 10,
      participants: 800,
      completionRate: 88,
      avgRating: 4.6
    },
    {
      name: 'Mechanical',
      totalEvents: 8,
      participants: 600,
      completionRate: 85,
      avgRating: 4.5
    },
    {
      name: 'Civil',
      totalEvents: 7,
      participants: 400,
      completionRate: 82,
      avgRating: 4.4
    },
    {
      name: 'MBA',
      totalEvents: 5,
      participants: 200,
      completionRate: 78,
      avgRating: 4.3
    }
  ];

  const recentEvents = [
    { name: 'AI Workshop', participants: 245, date: '2024-12-20' },
    { name: 'Tech Fest', participants: 890, date: '2024-12-18' },
    { name: 'Hackathon', participants: 120, date: '2024-12-15' },
    { name: 'Cultural Night', participants: 567, date: '2024-12-12' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-linear-to-br from-orange-500/20 to-amber-500/20 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-orange-500" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold">Department Overview</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Monitor performance across all departments
          </p>
        </div>

        {/* Overall Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="border-orange-500/20">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Calendar className="w-8 h-8 text-orange-500" />
                  <TrendingUp className="w-5 h-5 text-green-500" />
                </div>
                <div className="text-3xl font-bold">{overallStats.totalEvents}</div>
                <div className="text-sm text-muted-foreground">Total Events</div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-orange-500/20">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Users className="w-8 h-8 text-blue-500" />
                  <TrendingUp className="w-5 h-5 text-green-500" />
                </div>
                <div className="text-3xl font-bold">{overallStats.totalParticipants.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Total Participants</div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-orange-500/20">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                  <TrendingUp className="w-5 h-5 text-green-500" />
                </div>
                <div className="text-3xl font-bold">{overallStats.avgCompletionRate}%</div>
                <div className="text-sm text-muted-foreground">Completion Rate</div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-orange-500/20">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Target className="w-8 h-8 text-purple-500" />
                  <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Active</Badge>
                </div>
                <div className="text-3xl font-bold">{overallStats.activeDepartments}</div>
                <div className="text-sm text-muted-foreground">Active Departments</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Department Performance Cards */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Department Performance</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {departmentStats.map((dept, index) => (
              <Card
                key={dept.name}
                className="border-orange-500/20 hover:border-orange-500/40 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-orange-500/20 group cursor-pointer"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="group-hover:text-orange-500 transition-colors">
                      {dept.name}
                    </span>
                    {index === 0 && (
                      <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20">
                        <Award className="w-3 h-3 mr-1" />
                        Top
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Events</p>
                      <p className="text-2xl font-bold">{dept.totalEvents}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Participants</p>
                      <p className="text-2xl font-bold">{dept.participants}</p>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Completion Rate</span>
                      <span className="text-sm font-semibold">{dept.completionRate}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-linear-to-r from-orange-500 to-amber-500 transition-all duration-500"
                        style={{ width: `${dept.completionRate}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t">
                    <span className="text-sm text-muted-foreground">Avg Rating</span>
                    <div className="flex items-center space-x-1">
                      <span className="text-lg font-bold">{dept.avgRating}</span>
                      <span className="text-yellow-500">★</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Events */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Recent Events</h2>
          <Card className="border-orange-500/20">
            <CardContent className="p-0">
              <div className="divide-y">
                {recentEvents.map((event, index) => (
                  <div
                    key={index}
                    className="p-4 hover:bg-orange-500/5 transition-colors cursor-pointer flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-lg bg-linear-to-br from-orange-500/20 to-amber-500/20 flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-orange-500" />
                      </div>
                      <div>
                        <p className="font-semibold">{event.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(event.date).toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span className="font-semibold">{event.participants}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Department Comparison Chart Placeholder */}
        <Card className="border-orange-500/20">
          <CardHeader>
            <CardTitle>Department Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-muted/30 rounded-lg">
              <p className="text-muted-foreground">
                Chart visualization would go here (integrate with recharts)
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}