
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
  Replace, 
  Settings,
  TrendingUp, 
  ClipboardList, 
  Megaphone, 
  CloudSun, 
  CalendarClock, 
  Star, 
  ShieldAlert, // Added for Allergen Management
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
    href: '/dashboard/review-analyzer',
    label: 'Review Analyzer',
    icon: Star,
    group: 'Insights',
  },
  {
    href: '/dashboard/aggregator-intelligence',
    label: 'Aggregator Intelligence',
    icon: LayoutDashboard, // Consider a more specific icon if available e.g. 'Network' or 'Briefcase'
    group: 'Market Analysis',
  },
  {
    href: '/dashboard/weather-demand',
    label: 'Weather Demand Forecast',
    icon: CloudSun,
    group: 'Forecasting',
  },
  {
    href: '/dashboard/seasonal-trends',
    label: 'Seasonal Trend Insights',
    icon: CalendarClock,
    group: 'Forecasting',
  },
  {
    href: '/dashboard/ai-suggestions',
    label: 'AI Suggestions',
    icon: Brain,
    group: 'Tools',
  },
  {
    href: '/dashboard/offer-banner-promotions',
    label: 'Offer Banner Promotions',
    icon: Megaphone,
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
    href: '/dashboard/allergen-management', // New Allergen Management page
    label: 'Allergen Management',
    icon: ShieldAlert,
    group: 'Optimisation', // Or 'Menu Management' / 'Compliance'
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

    