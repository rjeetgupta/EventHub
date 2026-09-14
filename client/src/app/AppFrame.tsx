'use client';
import { usePathname } from 'next/navigation';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
export default function AppFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboard = pathname.includes('/dashboard') || ['/admin', '/department', '/group-admin', '/student'].some((route) => pathname === route || pathname.startsWith(`${route}/`));
  return isDashboard ? <>{children}</> : <><Navbar /><main className="grow container mx-auto px-4 py-8">{children}</main><Footer /></>;
}
