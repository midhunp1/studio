
"use client";

import React from 'react';
import { PageHeader } from '@/components/dashboard/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { InteractiveHeatmapPlaceholder } from '@/components/dashboard/interactive-heatmap-placeholder';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { BarChart2, BellRing, Briefcase, DollarSign, ExternalLink, ShieldAlert, Users2, LineChart } from 'lucide-react';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart as RechartsBarChart, CartesianGrid, XAxis, YAxis, Legend } from "recharts";
import { Button } from '@/components/ui/button';

const platformPerformanceData = [
  { platform: "Foodhub", orders: 120, avgOrderValue: "£22.50", commission: "2%", netRevenue: "£2646" },
  { platform: "JustEat", orders: 95, avgOrderValue: "£25.00", commission: "18%", netRevenue: "£1947.50" },
  { platform: "Own Website", orders: 130, avgOrderValue: "£20.00", commission: "0%", netRevenue: "£2600" },
  { platform: "UberEats", orders: 70, avgOrderValue: "£28.00", commission: "25%", netRevenue: "£1470" },
];

const platformPerformanceChartConfig = {
  orders: { label: "Orders", color: "hsl(var(--chart-1))" },
} satisfies ChartConfig;

const platformPerformanceChartData = platformPerformanceData.map(p => ({
  platform: p.platform,
  orders: p.orders,
}));

const competitorActivity = [
  { id: "comp1", name: "Pizza Palace", postcode: "M1 2XY", activity: "Launched new '2 for 1 Tuesday' offer.", date: "2 days ago", platform: "JustEat" },
  { id: "comp2", name: "Curry Corner", postcode: "M1 3YZ", activity: "Expanded delivery radius to include M2.", date: "5 days ago", platform: "UberEats" },
  { id: "comp3", name: "Burger Bistro", postcode: "M2 1AB", activity: "New restaurant launched on Foodhub.", date: "1 week ago", platform: "Foodhub" },
];

// Helper function to parse currency string to number, removing £ and commas
const parseCurrencyToNum = (value: string): number => {
  if (!value) return 0;
  return parseFloat(value.replace(/£|,/g, ''));
};

const commissionImpactData = platformPerformanceData.map(p => {
  const avgOrderValueNum = parseCurrencyToNum(p.avgOrderValue);
  const grossRevenue = p.orders * avgOrderValueNum;
  const netRevenueNum = parseCurrencyToNum(p.netRevenue);
  const commissionPaid = grossRevenue - netRevenueNum;

  return {
    platform: p.platform,
    commissionPaid: commissionPaid,
    netRevenue: netRevenueNum,
  };
});

const commissionImpactChartConfig = {
  netRevenue: { label: "Your Net Revenue", color: "hsl(var(--chart-1))" }, // Primary color for what you earn
  commissionPaid: { label: "Aggregator Commission", color: "hsl(var(--chart-4))" }, // A distinct color for cost
} satisfies ChartConfig;


export default function AggregatorIntelligencePage() {
  return (
    <div>
      <PageHeader
        title="Aggregator Intelligence"
        description="Benchmark performance and get market alerts for your restaurants. This information is typically based on public data sources or aggregated market trends."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="font-headline flex items-center">
              <BarChart2 className="mr-2 h-6 w-6 text-primary" />
              Platform Benchmarking
            </CardTitle>
            <CardDescription>Performance across aggregators and competitor distribution. This information is typically based on public data sources or aggregated market trends.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="font-semibold text-lg mb-2 text-primary">Restaurant Performance by Aggregator</h4>
               <ChartContainer config={platformPerformanceChartConfig} className="h-[250px] w-full">
                <RechartsBarChart data={platformPerformanceChartData} layout="vertical">
                  <CartesianGrid horizontal={false} />
                  <YAxis
                    dataKey="platform"
                    type="category"
                    tickLine={false}
                    tickMargin={5}
                    axisLine={false}
                    width={80}
                    className="text-xs"
                  />
                  <XAxis type="number" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar
                    dataKey="orders"
                    fill="var(--color-orders)"
                    radius={[0, 4, 4, 0]}
                  />
                </RechartsBarChart>
              </ChartContainer>
            </div>
            <div className="pt-4 border-t">
              <h4 className="font-semibold text-lg mb-2 text-primary">Competitor Distribution (Placeholder)</h4>
              <InteractiveHeatmapPlaceholder title="Competitor Density Map" height="250px" dataAiHint="competitor map" />
              <p className="text-xs text-muted-foreground mt-2 text-center">Visual representation of competitor presence in key areas.</p>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="font-headline flex items-center">
              <DollarSign className="mr-2 h-6 w-6 text-primary" />
              Aggregator Commission Impact
            </CardTitle>
            <CardDescription>
              How commissions affect your profit. Foodhub's significantly lower rate (now 2% in this example) often means much more in your pocket.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ChartContainer config={commissionImpactChartConfig} className="h-[250px] w-full">
              <RechartsBarChart data={commissionImpactData} layout="vertical">
                <CartesianGrid horizontal={false} />
                <YAxis
                  dataKey="platform"
                  type="category"
                  tickLine={false}
                  tickMargin={5}
                  axisLine={false}
                  width={80}
                  className="text-xs"
                />
                <XAxis type="number" unit="£" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Bar dataKey="netRevenue" fill="var(--color-netRevenue)" stackId="a" radius={[4, 0, 0, 4]} />
                <Bar dataKey="commissionPaid" fill="var(--color-commissionPaid)" stackId="a" radius={[0, 4, 4, 0]} />
              </RechartsBarChart>
            </ChartContainer>
            <p className="text-xs text-muted-foreground text-center pt-2 border-t">
              Foodhub (now just 2% commission in this example) yields substantially higher net profit compared to platforms like JustEat (18%) or UberEats (25%).
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center">
            <BellRing className="mr-2 h-6 w-6 text-destructive" />
            Market-Change Alerts
          </CardTitle>
          <CardDescription>
            Automated notifications for publicly announced or platform-observed competitor activities, such as new restaurant launches on aggregators, widely advertised promotions, or significant service changes in your area. This information is typically based on public data sources or aggregated market trends.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {competitorActivity.length > 0 ? (
            <ul className="space-y-3">
              {competitorActivity.map((activity) => (
                <li key={activity.id} className="p-4 border rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-foreground">{activity.name} <span className="text-xs text-muted-foreground">({activity.postcode})</span></p>
                      <p className="text-sm text-muted-foreground">{activity.activity}</p>
                    </div>
                    <div className="text-right flex-shrink-0 ml-4">
                       <p className="text-xs text-muted-foreground">{activity.date}</p>
                       <span className={`text-xs px-2 py-0.5 rounded-full mt-1 inline-block ${activity.platform === 'JustEat' ? 'bg-orange-500/20 text-orange-600' : activity.platform === 'UberEats' ? 'bg-green-500/20 text-green-600' : 'bg-blue-500/20 text-blue-600'}`}>
                           {activity.platform}
                       </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground">No recent market-change alerts.</p>
          )}
           <Button variant="secondary" className="w-full mt-6">
                <Users2 className="mr-2 h-4 w-4" /> Manage Alert Preferences
            </Button>
        </CardContent>
      </Card>
    </div>
  );
}
