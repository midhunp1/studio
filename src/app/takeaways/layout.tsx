import type React from 'react';
import { DashboardSidebarLayout } from '@/components/layout/sidebar-layout';

export default function TakeawaysLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardSidebarLayout>{children}</DashboardSidebarLayout>;
}
