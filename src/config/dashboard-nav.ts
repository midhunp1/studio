
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
  Replace, // Added for Switch Takeaway
  Settings,
  TrendingUp, // Added for Actions & Revenue Optimisation
  ClipboardList, // Added for Cost & Inventory Mgmt
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
  {
    href: '/dashboard/revenue-actions',
    label: 'Actions & Revenue Optimisation',
    icon: TrendingUp,
    group: 'Optimisation',
  },
  {
    href: '/dashboard/cost-control',
    label: 'Cost & Inventory Mgmt',
    icon: ClipboardList,
    group: 'Optimisation',
  },
  {
    href: '/takeaways',
    label: 'Switch Takeaway',
    icon: Replace,
    group: 'Configuration',
  },
  // Example for a potential future settings page
  // {
  //   href: '/dashboard/settings',
  //   label: 'Settings',
  //   icon: Settings,
  //   group: 'Configuration',
  // },
];
