import type React from 'react';
import { DashboardSidebarLayout } from '@/components/layout/sidebar-layout';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardSidebarLayout>{children}</DashboardSidebarLayout>;
}
