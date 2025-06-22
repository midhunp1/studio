import type React from 'react';
import { DashboardSidebarLayout } from '@/components/layout/sidebar-layout';
import { redirect } from 'next/navigation';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Since the dashboard overview is now at the root,
  // redirect any direct access to /dashboard to the root page.
  const path = (children as any)?.props?.childProp?.segment;
  if (path === '__PAGE__') {
    redirect('/');
  }

  return <DashboardSidebarLayout>{children}</DashboardSidebarLayout>;
}
