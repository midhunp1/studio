import type { LucideIcon } from 'lucide-react';
import {
  LayoutDashboard,
  Map,
  Clock,
  Utensils,
  Users,
  Brain,
  AlertTriangle,
  BadgePercent,
  Settings, // Example for a potential settings page
} from 'lucide-react';

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  group?: string;
}

export const dashboardNavItems: NavItem[] = [
  {
    href: '/dashboard',
    label: 'Overview',
    icon: LayoutDashboard,
    group: 'Insights',
  },
  {
    href: '/dashboard/delivery-area',
    label: 'Delivery Area Heatmap',
    icon: Map,
    group: 'Insights',
  },
  {
    href: '/dashboard/time-based',
    label: 'Time-Based Heatmap',
    icon: Clock,
    group: 'Insights',
  },
  {
    href: '/dashboard/top-dish',
    label: 'Top Dish by Area',
    icon: Utensils,
    group: 'Insights',
  },
  {
    href: '/dashboard/customer-map',
    label: 'Customer Map',
    icon: Users,
    group: 'Insights',
  },
  {
    href: '/dashboard/order-failure',
    label: 'Order Failure Heatmap',
    icon: AlertTriangle,
    group: 'Insights',
  },
  {
    href: '/dashboard/promo-performance',
    label: 'Promo Performance',
    icon: BadgePercent,
    group: 'Insights',
  },
  {
    href: '/dashboard/ai-suggestions',
    label: 'AI Suggestions',
    icon: Brain,
    group: 'Tools',
  },
  // Example for a potential future settings page
  // {
  //   href: '/dashboard/settings',
  //   label: 'Settings',
  //   icon: Settings,
  //   group: 'Configuration',
  // },
];
