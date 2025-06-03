
"use client";

import { PageHeader } from '@/components/dashboard/page-header';
import { CssStylizedHeatmap } from '@/components/dashboard/css-stylized-heatmap';
import { FilterControls } from '@/components/dashboard/filter-controls';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { List, BarChartHorizontalBig, LineChart as LineChartIcon } from 'lucide-react';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart as RechartsBarChart, CartesianGrid, XAxis, YAxis, Line, LineChart as RechartsLineChart, Legend } from "recharts";
import React from 'react';

const topPostcodesRaw = [
  { postcode: "M1 1AA", orders: 1250, revenue: "£18,750" },
  { postcode: "M2 2BB", orders: 980, revenue: "£14,700" },
  { postcode: "M3 3CC", orders: 750, revenue: "£11,250" },
  { postcode: "M4 4AB", orders: 600, revenue: "£9,000" },
  { postcode: "M5 5CD", orders: 500, revenue: "£7,500" },
];

const parseRevenue = (revenueString: string) => parseFloat(revenueString.replace('£', '').replace(',', ''));

const topPostcodesChartData = topPostcodesRaw.map(area => ({
  postcode: area.postcode,
  revenue: parseRevenue(area.revenue),
  orders: area.orders,
}));


const lowConversionAreas = [
  { postcode: "M4 4DD", views: 500, orders: 10 },
  { postcode: "M5 5EE", views: 350, orders: 5 },
];

const dailyOrdersData = [
  { day: "Mon", orders: 30 },
  { day: "Tue", orders: 45 },
  { day: "Wed", orders: 55 },
  { day: "Thu", orders: 40 },
  { day: "Fri", orders: 70 },
  { day: "Sat", orders: 90 },
  { day: "Sun", orders: 60 },
];

const barChartConfig = {
  revenue: { label: "Revenue (£)", color: "hsl(var(--primary))" },
} satisfies ChartConfig;

const lineChartConfig = {
  orders: { label: "Orders", color: "hsl(var(--accent))" },
} satisfies ChartConfig;


export default function DeliveryAreaPage() {
  return (
    <div>
      <PageHeader
        title="Delivery Area Heatmap"
        description="Visualize order density by postcode, highlighting high-frequency and revenue areas."
      />
      <FilterControls onApplyFilters={(filters) => console.log("Applying filters:", filters)} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CssStylizedHeatmap 
            title="Manchester Area Heatmap Overlay" 
            height="500px" 
            backgroundImageUrl="https://placehold.co/1200x800.png" 
            backgroundMapDataAiHint="Manchester street map satellite"
            dataAiHint="Manchester heatmap overlay" 
          />
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline flex items-center">
                <BarChartHorizontalBig className="mr-2 h-5 w-5 text-primary" />
                Revenue by Top Postcode
              </CardTitle>
              <CardDescription>Visualizing revenue generated from top performing postcodes.</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={barChartConfig} className="h-[250px] w-full">
                <RechartsBarChart
                  data={topPostcodesChartData}
                  layout="vertical"
                  margin={{ left: 10, right: 10 }}
                  accessibilityLayer
                >
                  <CartesianGrid horizontal={false} />
                  <YAxis
                    dataKey="postcode"
                    type="category"
                    tickLine={false}
                    tickMargin={5}
                    axisLine={false}
                    className="text-xs"
                    width={60}
                  />
                  <XAxis dataKey="revenue" type="number" />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="line" />}
                  />
                  <Bar dataKey="revenue" fill="var(--color-revenue)" radius={4} />
                </RechartsBarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-headline flex items-center">
                <LineChartIcon className="mr-2 h-5 w-5 text-accent" />
                Daily Orders - M1 1AA
              </CardTitle>
              <CardDescription>Order trend for postcode M1 1AA over the past week.</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={lineChartConfig} className="h-[250px] w-full">
                <RechartsLineChart data={dailyOrdersData} margin={{ left: 0, right: 20 }} accessibilityLayer>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="day"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    className="text-xs"
                  />
                  <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="orders" stroke="var(--color-orders)" strokeWidth={2} dot={{ r: 4, fill: "var(--color-orders)" }} activeDot={{r: 6}} />
                </RechartsLineChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Alert>
            <List className="h-4 w-4" />
            <AlertTitle className="font-headline">Low Conversion Areas</AlertTitle>
            <AlertDescription>
              <ul className="space-y-1 mt-2">
              {lowConversionAreas.map((area) => (
                <li key={area.postcode} className="text-sm">
                  <span className="font-semibold">{area.postcode}:</span> {area.orders} orders from {area.views} views.
                </li>
              ))}
              </ul>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  );
}
