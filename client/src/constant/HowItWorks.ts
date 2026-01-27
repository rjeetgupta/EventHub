import { Calendar,  CheckCircle, UserPlus, LogIn } from 'lucide-react';

export const howItWorksSteps = [
    {
      icon: UserPlus,
      title: 'Register Yourself',
      description: 'Create your account with college email and complete your profile',
      color: 'from-orange-500 to-amber-500'
    },
    {
      icon: LogIn,
      title: 'Login to Platform',
      description: 'Access your personalized dashboard with all campus events',
      color: 'from-amber-500 to-orange-600'
    },
    {
      icon: Calendar,
      title: 'Browse Events',
      description: 'Explore upcoming events, filter by category, and check details',
      color: 'from-orange-600 to-red-500'
    },
    {
      icon: CheckCircle,
      title: 'Register for Event',
      description: 'One-click registration and get instant confirmation notification',
      color: 'from-red-500 to-orange-500'
    }
  ];