import React from 'react';
import { Navbar } from './Navbar';
import { Toaster } from '@/components/ui/sonner';

interface PageLayoutProps {
  children: React.ReactNode;
}

export function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Toaster position="top-right" />
    </div>
  );
}