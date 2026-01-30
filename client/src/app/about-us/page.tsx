// app/about/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Users, Target, Zap, Award, TrendingUp, CheckCircle, Sparkles, Calendar, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function AboutPage() {
  const features = [
    {
      icon: Zap,
      title: 'Centralized Platform',
      description: 'All campus events in one place. No more scattered information across multiple channels.',
      color: 'from-orange-500 to-amber-500'
    },
    {
      icon: Users,
      title: 'Role-Based Access',
      description: 'Tailored experiences for students, group admins, and department admins with clear permissions.',
      color: 'from-amber-500 to-orange-600'
    },
    {
      icon: Target,
      title: 'Smart Organization',
      description: 'Filter by department, category, date, and mode to find exactly what you need.',
      color: 'from-orange-600 to-red-500'
    },
    {
      icon: Award,
      title: 'Digital Certificates',
      description: 'Automatic certificate generation for event participation with instant downloads.',
      color: 'from-red-500 to-orange-500'
    },
    {
      icon: TrendingUp,
      title: 'Real-Time Analytics',
      description: 'Track participation, engagement, and performance metrics across all departments.',
      color: 'from-orange-500 to-amber-500'
    },
    {
      icon: CheckCircle,
      title: 'Seamless Workflow',
      description: 'From event creation to approval to participation - everything flows smoothly.',
      color: 'from-amber-500 to-orange-600'
    }
  ];

  const team = [
    {
      role: 'Students',
      description: 'Discover, register, and participate in campus events with just a few clicks.',
      icon: Users,
      count: '5,000+'
    },
    {
      role: 'Group Admins',
      description: 'Create and manage department events with multi-step approval workflows.',
      icon: Calendar,
      count: '50+'
    },
    {
      role: 'Department Admins',
      description: 'Review, approve, and monitor events with comprehensive oversight tools.',
      icon: CheckCircle,
      count: '10+'
    }
  ];

  const stats = [
    { label: 'Active Users', value: '5,000+', icon: Users },
    { label: 'Events Hosted', value: '1,200+', icon: Calendar },
    { label: 'Departments', value: '50+', icon: Target },
    { label: 'Satisfaction Rate', value: '98%', icon: Award }
  ];

  const values = [
    {
      title: 'Simplicity',
      description: 'We believe event management should be simple, not complicated. Our intuitive interface makes it easy for everyone.',
      icon: Zap
    },
    {
      title: 'Transparency',
      description: 'Complete visibility into event status, approvals, and participation metrics for all stakeholders.',
      icon: CheckCircle
    },
    {
      title: 'Engagement',
      description: 'Maximizing student participation through smart notifications, recommendations, and seamless registration.',
      icon: Sparkles
    },
    {
      title: 'Innovation',
      description: 'Continuously evolving with cutting-edge features like QR attendance, AI recommendations, and mobile integration.',
      icon: TrendingUp
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 overflow-hidden">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
        {/* Hero Section */}
        <section className="text-center space-y-6 animate-in fade-in slide-in-from-bottom duration-1000">
          <Badge className="bg-orange-500/10 text-orange-500 border-orange-500/20 hover:bg-orange-500/20 transition-all duration-300 hover:scale-105 px-4 py-2">
            <Sparkles className="w-4 h-4 mr-2 inline animate-pulse" />
            About EventHub
          </Badge>
          
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight">
            <span className="inline-block hover:scale-105 transition-transform duration-300">
              Revolutionizing Campus
            </span>
            <br />
            <span className="bg-linear-to-r from-orange-500 via-amber-500 to-orange-600 bg-clip-text text-transparent inline-block hover:scale-105 transition-transform duration-300">
              Event Management
            </span>
          </h1>
          
          <p className="text-md md:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            A comprehensive platform that brings students, organizers, and administrators together to create, manage, and participate in campus events seamlessly.
          </p>
        </section>

        {/* Stats Section */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom duration-1000 delay-200">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <Card 
                key={i} 
                className="border-orange-500/20 hover:border-orange-500/40 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-orange-500/10 group cursor-pointer"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <CardContent className="pt-6 text-center space-y-2">
                  <Icon className="w-8 h-8 text-orange-500 mx-auto group-hover:scale-110 transition-transform duration-300" />
                  <div className="text-3xl md:text-4xl font-bold bg-linear-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            );
          })}
        </section>

        {/* Mission Section */}
        <section className="text-center space-y-6">
          <Badge className="bg-orange-500/10 text-orange-500 border-orange-500/20">
            Our Mission
          </Badge>
          <h2 className="text-xl md:text-3xl font-bold">
            Making Campus Events Accessible to Everyone
          </h2>
          <p className="text-md text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            We believe every student should have easy access to campus events and every organizer should have powerful tools to create engaging experiences. EventHub eliminates information gaps, reduces administrative overhead, and maximizes participation through intelligent automation and user-friendly design.
          </p>
        </section>

        {/* Features Grid */}
        <section className="space-y-8">
          <div className="text-center space-y-4">
            <Badge className="bg-orange-500/10 text-orange-500 border-orange-500/20">
              Platform Features
            </Badge>
            <h2 className="text-xl md:text-3xl font-bold">
              Built for Modern Campus Life
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <Card 
                  key={i} 
                  className="border-orange-500/20 hover:border-orange-500/40 transition-all duration-500 hover:scale-105 hover:shadow-xl hover:shadow-orange-500/20 group cursor-pointer relative overflow-hidden"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-linear-to-br ${feature.color} opacity-10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700`} />
                  <CardHeader>
                    <div className={`w-14 h-14 rounded-xl bg-linear-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <CardTitle className="text-xl group-hover:text-orange-500 transition-colors duration-300">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* User Roles Section */}
        <section className="space-y-8">
          <div className="text-center space-y-4">
            <Badge className="bg-orange-500/10 text-orange-500 border-orange-500/20">
              For Everyone
            </Badge>
            <h2 className="text-xl md:text-3xl font-bold">
              Tailored Experiences for Every Role
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {team.map((member, i) => {
              const Icon = member.icon;
              return (
                <Card 
                  key={i} 
                  className="border-orange-500/20 hover:border-orange-500/40 transition-all duration-500 hover:scale-105 hover:shadow-xl hover:shadow-orange-500/20 group cursor-pointer"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-lg bg-linear-to-br from-orange-500/20 to-amber-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Icon className="w-6 h-6 text-orange-500" />
                      </div>
                      <Badge className="bg-orange-500/10 text-orange-500 border-orange-500/20">
                        {member.count}
                      </Badge>
                    </div>
                    <CardTitle className="text-2xl group-hover:text-orange-500 transition-colors duration-300">
                      {member.role}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {member.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Values Section */}
        <section className="space-y-8">
          <div className="text-center space-y-4">
            <Badge className="bg-orange-500/10 text-orange-500 border-orange-500/20">
              Our Values
            </Badge>
            <h2 className="text-xl md:text-3xl font-bold">
              What Drives Us Forward
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {values.map((value, i) => {
              const Icon = value.icon;
              return (
                <Card 
                  key={i} 
                  className="border-orange-500/20 hover:border-orange-500/40 transition-all duration-500 hover:scale-105 hover:shadow-xl hover:shadow-orange-500/20 group cursor-pointer"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-lg bg-linear-to-br from-orange-500/20 to-amber-500/20 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                        <Icon className="w-6 h-6 text-orange-500" />
                      </div>
                      <CardTitle className="text-xl group-hover:text-orange-500 transition-colors duration-300">
                        {value.title}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12">
          <Card className="border-orange-500/20 shadow-2xl shadow-orange-500/10 relative overflow-hidden group">
            <div className="absolute inset-0 bg-linear-to-br from-orange-500/10 via-amber-500/5 to-orange-600/10" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
            <CardContent className="relative p-12 text-center space-y-6">
              <Sparkles className="w-12 h-12 text-orange-500 mx-auto animate-pulse" />
              <h2 className="text-3xl md:text-4xl font-bold">
                Ready to Transform Your Campus Experience?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Join thousands of students and organizers using EventHub to make campus life more engaging and organized.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-linear-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-10 py-6 text-lg font-semibold shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 transition-all duration-300 hover:scale-105 group">
                  Get Started
                  <Sparkles className="ml-2 w-5 h-5 group-hover:rotate-12 transition-transform" />
                </Button>
                <Button 
                  variant="outline" 
                  className="px-10 py-6 text-lg font-semibold border-orange-500/30 hover:bg-orange-500/10 hover:border-orange-500 transition-all duration-300 hover:scale-105"
                >
                  Contact Us
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}