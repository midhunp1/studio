
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import type { TooltipContentProps } from '@radix-ui/react-tooltip';

interface SidebarNavItemProps {
  href: string;
  label: string;
  icon: LucideIcon;
  tooltip?: string | TooltipContentProps;
}

export function SidebarNavItem({ href, label, icon: Icon, tooltip }: SidebarNavItemProps) {
  const pathname = usePathname();
  const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        isActive={isActive}
        tooltip={tooltip || label}
      >
        <Link href={href}>
          <Icon />
          <span>{label}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
