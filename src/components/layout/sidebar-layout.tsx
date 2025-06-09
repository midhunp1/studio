"use client";

import React from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarTrigger,
  SidebarContent,
  SidebarMenu,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarInset,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { OrderLensLogo } from '@/components/icons/logo';
import { dashboardNavItems, type NavItem } from '@/config/dashboard-nav';
import { SidebarNavItem } from './sidebar-nav-item';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ThemeToggle } from '@/components/theme-toggle'; // Import ThemeToggle
import { LogOut } from 'lucide-react';

export function DashboardSidebarLayout({ children }: { children: React.ReactNode }) {
  const groupedNavItems = React.useMemo(() => {
    return dashboardNavItems.reduce((acc, item) => {
      const group = item.group || 'General';
      if (!acc[group]) {
        acc[group] = [];
      }
      acc[group].push(item);
      return acc;
    }, {} as Record<string, NavItem[]>);
  }, []);

  // Mock current takeaway name
  const currentTakeawayName = "Speedy Eats";

  return (
    <SidebarProvider defaultOpen>
      <Sidebar>
        <SidebarHeader className="p-4 border-b border-sidebar-border">
          <div className="flex items-center justify-between">
            <OrderLensLogo takeawayName={currentTakeawayName} />
            <SidebarTrigger className="md:hidden" />
          </div>
        </SidebarHeader>
        <SidebarContent>
          <ScrollArea className="h-full">
            {Object.entries(groupedNavItems).map(([groupName, items]) => (
              <SidebarGroup key={groupName}>
                {groupName !== 'General' && <SidebarGroupLabel>{groupName}</SidebarGroupLabel>}
                <SidebarMenu>
                  {items.map((item) => (
                    <SidebarNavItem
                      key={item.href}
                      href={item.href}
                      label={item.label}
                      icon={item.icon}
                    />
                  ))}
                </SidebarMenu>
              </SidebarGroup>
            ))}
          </ScrollArea>
        </SidebarContent>
        {/* Optional Footer Example */}
        {/* <SidebarFooter className="p-4 border-t border-sidebar-border">
          <Button variant="ghost" className="w-full justify-start">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </SidebarFooter> */}
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b bg-background px-4 sm:px-6">
          {/* Left side: Mobile trigger and placeholder for desktop content */}
          <div className="flex items-center">
            <SidebarTrigger className="md:hidden" />
            <div className="hidden md:block">
              {/* This space can be used for breadcrumbs or a dynamic page title if needed later */}
            </div>
          </div>
          {/* Right side: Theme Toggle */}
          <ThemeToggle />
        </header>
        <main className="flex-1 p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
