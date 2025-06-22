
"use client"; // Add this to make it a client component

import React, { useState, useEffect } from 'react'; // Import useState and useEffect
import { PageHeader } from '@/components/dashboard/page-header';
import { Card, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import {
  Map,
  Clock,
  Utensils,
  Users,
  AlertTriangle,
  BadgePercent,
  Brain,
  LayoutDashboard,
  TrendingUp,
  ClipboardList,
  Megaphone,
  CloudSun, 
  CalendarClock, 
  Star, 
  ShieldAlert, // Added for Allergen Management
} from 'lucide-react';

interface InsightCardItem {
  title: string;
  href: string;
  icon: React.ElementType;
  description: string;
  dataAiHint: string;
}

export default function DashboardOverviewPage() {
  const [displayedTakeawayName, setDisplayedTakeawayName] = useState<string>("Your Takeaway");

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedName = localStorage.getItem('selectedTakeawayName');
      setDisplayedTakeawayName(storedName || "Tiger Bite Stoke"); // Default if nothing selected
    }
  }, []);

  const insightCards: InsightCardItem[] = [
    {
      title: 'Delivery Area Heatmap',
      href: '/dashboard/delivery-area',
      icon: Map,
      description: 'Visualize order density by postcode, highlighting high-frequency and revenue areas.',
      dataAiHint: 'map delivery orders',
    },
    {
      title: 'Time-Based Heatmap',
      href: '/dashboard/time-based',
      icon: Clock,
      description: 'Analyze peak hours and days by order volume and value to optimize staffing and promotions.',
      dataAiHint: 'clock time orders',
    },
    {
      title: 'Top Dish by Area',
      href: '/dashboard/top-dish',
      icon: Utensils,
      description: 'Discover the most popular and profitable menu items in specific delivery zones.',
      dataAiHint: 'food dish popularity',
    },
    {
      title: 'Customer Map',
      href: '/dashboard/customer-map',
      icon: Users,
      description: 'Distinguish loyal vs. one-time customers and track retention or churn rates by area.',
      dataAiHint: 'customer user analytics',
    },
    {
      title: 'Order Failure Heatmap',
      href: '/dashboard/order-failure',
      icon: AlertTriangle,
      description: 'Identify zones where orders are frequently cancelled, rejected, or refunded, and get AI analysis.',
      dataAiHint: 'map error alert analysis',
    },
    {
      title: 'Promo Performance',
      href: '/dashboard/promo-performance',
      icon: BadgePercent,
      description: 'Analyze which discounts worked best and where to optimize your promotion strategies.',
      dataAiHint: 'discount promotion success',
    },
     {
      title: 'Review Analyzer',
      href: '/dashboard/review-analyzer',
      icon: Star,
      description: 'Analyze customer review sentiment and keywords from Google, JustEat, etc., to identify actionable feedback.',
      dataAiHint: 'review star sentiment',
    },
    {
      title: 'AI Suggestions',
      href: '/dashboard/ai-suggestions',
      icon: Brain,
      description: 'Get smart insights like ad boost times and combo meal ideas powered by generative AI.',
      dataAiHint: 'brain artificial intelligence suggestions',
    },
    {
      title: 'Offer Banner Promotions',
      href: '/dashboard/offer-banner-promotions',
      icon: Megaphone,
      description: 'Create eye-catching promotional banners with AI for your website and app.',
      dataAiHint: 'megaphone banner promotion ai',
    },
    {
      title: 'Actions & Revenue Optimisation',
      href: '/dashboard/revenue-actions',
      icon: TrendingUp,
      description: 'Identify underperforming venues and prioritize actions for maximum revenue impact.',
      dataAiHint: 'revenue actions optimization',
    },
    {
      title: 'Cost & Inventory Mgmt',
      href: '/dashboard/cost-control',
      icon: ClipboardList,
      description: 'Analyze COGS, track waste, manage supplier prices, and optimize recipe profitability.',
      dataAiHint: 'cost inventory management',
    },
    {
      title: 'Allergen Management', // New Card
      href: '/dashboard/allergen-management',
      icon: ShieldAlert,
      description: 'Track and manage product allergens, view statistics, and ensure compliance.',
      dataAiHint: 'allergen shield safety',
    },
    {
      title: 'Weather Demand Forecast',
      href: '/dashboard/weather-demand',
      icon: CloudSun,
      description: 'Predict order demand based on weather forecasts and historical data.',
      dataAiHint: 'weather cloud forecast',
    },
    {
      title: 'Seasonal Trend Insights',
      href: '/dashboard/seasonal-trends',
      icon: CalendarClock,
      description: 'Analyze seasonal patterns and predict future order trends.',
      dataAiHint: 'calendar season trends',
    },
  ];

  return (
    <div>
      <PageHeader
        title={`${displayedTakeawayName} Dashboard`}
        description="Explore your hyperlocal takeaway insights. Select a module below to get started."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {insightCards.map((item) => (
          <Link href={item.href} key={item.href} legacyBehavior>
            <a className="block h-full" data-ai-hint={item.dataAiHint}>
              <Card className="flex flex-col h-full p-6 text-center items-center justify-center hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-in-out cursor-pointer bg-card hover:bg-muted/50">
                <item.icon className="h-16 w-16 text-primary mb-4" />
                <CardTitle className="font-headline text-xl mb-3">{item.title}</CardTitle>
                <p className="text-sm text-muted-foreground leading-relaxed flex-grow">
                  {item.description}
                </p>
              </Card>
            </a>
          </Link>
        ))}
      </div>
    </div>
  );
}
