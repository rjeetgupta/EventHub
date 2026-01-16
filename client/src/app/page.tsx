"use client"

import React, { useState, useEffect } from 'react';
import { Calendar, Users, MapPin, Clock, Search, Filter, X, Sparkles, TrendingUp, Bell, ChevronDown, Moon, Sun, ArrowRight, CheckCircle, UserPlus, LogIn, Award, Trophy, Star, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import HeroSection from '@/components/Home/HeroSection';
import UpcomingEvent from '@/components/Home/UpcomingEvent';
import RecentFinishEvent from '@/components/Home/RecentFinishEvent';
import { HowItWorks } from '@/components/Home/HowItWorks';
import FAQ from '@/components/Home/FAQ';
import { CTA } from '@/components/Home/CTA';
import { NotificationBanner } from '@/components/common/NotificationBanner';

export default function EventPlatformLanding() {
  const [isDark, setIsDark] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showNotification, setShowNotification] = useState(true);


  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 overflow-hidden">
      {/* Animated Background */}
      {/* <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-linear-to-br from-orange-500/5 via-background to-amber-500/5" />
        <div 
          className="absolute w-96 h-96 bg-orange-500/20 rounded-full blur-3xl transition-all duration-1000"
          style={{
            left: `${mousePosition.x - 192}px`,
            top: `${mousePosition.y - 192}px`,
            opacity: 0.2
          }}
        />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzg4ODg4OCIgc3Ryb2tlLXdpZHRoPSIwLjUiIG9wYWNpdHk9IjAuMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-40" />
      </div> */}


      {/* Notification Banner */}
      {/* {showNotification && (
        <NotificationBanner
      )} */}

     <HeroSection />
      <UpcomingEvent />
      <RecentFinishEvent />
      <HowItWorks />
      <FAQ />
      <CTA />
    </div>
  );
}