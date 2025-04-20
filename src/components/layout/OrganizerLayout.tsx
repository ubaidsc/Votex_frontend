import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { OrganizerSidebar } from './OrganizerSidebar';
import { Toaster } from '@/components/ui/sonner';
import { useAuth } from '@/contexts/AuthContext';

interface OrganizerLayoutProps {
  children: React.ReactNode;
}

export function OrganizerLayout({ children }: OrganizerLayoutProps) {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent" />
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'organizer') {
    return <Navigate to="/login/organizer" state={{ from: location }} replace />;
  }

  return (
    <div className="relative flex min-h-screen flex-col">
      <Navbar title="Organizer Dashboard" />
      <div className="flex flex-1">
        <OrganizerSidebar />
        <main className="flex-1 p-6 md:p-8">{children}</main>
      </div>
      <Toaster position="top-right" />
    </div>
  );
}