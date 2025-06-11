
"use client";

import React from 'react';
import { PageHeader } from '@/components/dashboard/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { InteractiveHeatmapPlaceholder } from '@/components/dashboard/interactive-heatmap-placeholder';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { BarChart2, BellRing, Briefcase, ExternalLink, ShieldAlert, Users2, LineChart } from 'lucide-react';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart as RechartsBarChart, CartesianGrid, XAxis, YAxis, Legend } from "recharts";
import { Button } from '@/components/ui/button';

const platformPerformanceData = [
  { platform: "Foodhub", orders: 120, avgOrderValue: "£22.50", commission: "15%", netRevenue: "£2295" },
  { platform: "JustEat", orders: 95, avgOrderValue: "£25.00", commission: "18%", netRevenue: "£1947.50" },
  { platform: "Own Website", orders: 150, avgOrderValue: "£20.00", commission: "0%", netRevenue: "£3000" },
  { platform: "UberEats", orders: 70, avgOrderValue: "£28.00", commission: "25%", netRevenue: "£1470" },
];

const platformPerformanceChartConfig = {
  orders: { label: "Orders", color: "hsl(var(--chart-1))" },
  netRevenue: { label: "Net Revenue (£)", color: "hsl(var(--chart-2))" },
} satisfies ChartConfig;

const platformPerformanceChartData = platformPerformanceData.map(p => ({
  platform: p.platform,
  orders: p.orders,
  netRevenue: parseFloat(p.netRevenue.replace('£', '')),
}));

const competitorActivity = [
  { id: "comp1", name: "Pizza Palace", postcode: "M1 2XY", activity: "Launched new '2 for 1 Tuesday' offer.", date: "2 days ago", platform: "JustEat" },
  { id: "comp2", name: "Curry Corner", postcode: "M1 3YZ", activity: "Expanded delivery radius to include M2.", date: "5 days ago", platform: "UberEats" },
  { id: "comp3", name: "Burger Bistro", postcode: "M2 1AB", activity: "New restaurant launched on Foodhub.", date: "1 week ago", platform: "Foodhub" },
];

const churnData = [
    { restaurant: "Kebab King", action: "Joined JustEat", date: "2024-07-15", previousPlatform: "N/A" },
    { restaurant: "Noodle Bar", action: "Switched to UberEats", date: "2024-07-10", previousPlatform: "Deliveroo" },
    { restaurant: "Pizza Place", action: "Left Foodhub", date: "2024-07-01", previousPlatform: "Foodhub" },
];


export default function AggregatorIntelligencePage() {
  return (
    <div>
      <PageHeader
        title="Aggregator Intelligence"
        description="Benchmark performance, track churn, and get market alerts for your restaurants."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="font-headline flex items-center">
              <BarChart2 className="mr-2 h-6 w-6 text-primary" />
              Platform Benchmarking
            </CardTitle>
            <CardDescription>Performance across aggregators and competitor distribution.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="font-semibold text-lg mb-2 text-primary">Restaurant Performance by Aggregator</h4>
               <ChartContainer config={platformPerformanceChartConfig} className="h-[250px] w-full">
                <RechartsBarChart data={platformPerformanceChartData} accessibilityLayer layout="vertical">
                  <CartesianGrid horizontal={false} />
                  <YAxis 
                    dataKey="platform" 
                    type="category" 
                    tickLine={false} 
                    tickMargin={5} 
                    axisLine={false} 
                    width={80} 
                    className="text-xs" 
                    id="platformYAxis" 
                  />
                  <XAxis type="number" id="ordersXAxis" />
                  <XAxis type="number" id="revenueXAxis" orientation="top" className="text-xs" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar dataKey="orders" xAxisId="ordersXAxis" yAxisId="platformYAxis" fill="var(--color-orders)" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="netRevenue" xAxisId="revenueXAxis" yAxisId="platformYAxis" fill="var(--color-netRevenue)" radius={[0, 4, 4, 0]} />
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
              <ShieldAlert className="mr-2 h-6 w-6 text-accent" />
              Churn & Exclusivity Analytics
            </CardTitle>
            <CardDescription>Monitor platform switches and ensure exclusivity compliance.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Track when restaurants join, leave, or switch between aggregator platforms.
              This helps in understanding market dynamics and enforcing exclusivity agreements.
            </p>
             <div className="max-h-80 overflow-y-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>Restaurant</TableHead>
                        <TableHead>Action</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Previous/New Platform</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {churnData.map((item, index) => (
                        <TableRow key={index}>
                            <TableCell className="font-medium">{item.restaurant}</TableCell>
                            <TableCell>{item.action}</TableCell>
                            <TableCell>{item.date}</TableCell>
                            <TableCell>{item.previousPlatform}</TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <Button variant="outline" className="w-full">
                <ExternalLink className="mr-2 h-4 w-4" /> View Full Churn Report
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center">
            <BellRing className="mr-2 h-6 w-6 text-destructive" />
            Market-Change Alerts
          </CardTitle>
          <CardDescription>Automated notifications for new, expanded, or promotional competitor activity.</CardDescription>
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
