
"use client";

import { PageHeader } from '@/components/dashboard/page-header';
import { CssStylizedHeatmap } from '@/components/dashboard/css-stylized-heatmap';
import { FilterControls } from '@/components/dashboard/filter-controls';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { List, BarChartHorizontalBig, LineChart as LineChartIcon } from 'lucide-react';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart as RechartsBarChart, CartesianGrid, XAxis, YAxis, Line, LineChart as RechartsLineChart, Legend } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
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

const allDailyOrdersData: { [postcode: string]: { day: string; orders: number }[] } = {
  "M1 1AA": [
    { day: "Mon", orders: 30 }, { day: "Tue", orders: 45 }, { day: "Wed", orders: 55 },
    { day: "Thu", orders: 40 }, { day: "Fri", orders: 70 }, { day: "Sat", orders: 90 },
    { day: "Sun", orders: 60 },
  ],
  "M2 2BB": [
    { day: "Mon", orders: 20 }, { day: "Tue", orders: 30 }, { day: "Wed", orders: 40 },
    { day: "Thu", orders: 35 }, { day: "Fri", orders: 60 }, { day: "Sat", orders: 75 },
    { day: "Sun", orders: 50 },
  ],
  "M3 3CC": [
    { day: "Mon", orders: 25 }, { day: "Tue", orders: 35 }, { day: "Wed", orders: 50 },
    { day: "Thu", orders: 45 }, { day: "Fri", orders: 65 }, { day: "Sat", orders: 80 },
    { day: "Sun", orders: 55 },
  ],
  "M4 4AB": [
    { day: "Mon", orders: 15 }, { day: "Tue", orders: 25 }, { day: "Wed", orders: 30 },
    { day: "Thu", orders: 20 }, { day: "Fri", orders: 50 }, { day: "Sat", orders: 60 },
    { day: "Sun", orders: 40 },
  ],
  "M5 5CD": [
    { day: "Mon", orders: 10 }, { day: "Tue", orders: 15 }, { day: "Wed", orders: 20 },
    { day: "Thu", orders: 18 }, { day: "Fri", orders: 40 }, { day: "Sat", orders: 55 },
    { day: "Sun", orders: 30 },
  ],
};

const barChartConfig = {
  revenue: { label: "Revenue (£)", color: "hsl(var(--primary))" },
} satisfies ChartConfig;

const lineChartConfig = {
  orders: { label: "Orders", color: "hsl(var(--accent))" },
} satisfies ChartConfig;


export default function DeliveryAreaPage() {
  const [selectedPostcodeForDaily, setSelectedPostcodeForDaily] = React.useState<string>("M1 1AA");

  const dailyOrdersDataForSelectedPostcode = allDailyOrdersData[selectedPostcodeForDaily] || [];
  const availablePostcodesForDailyChart = Object.keys(allDailyOrdersData);

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
              <div> 
                <CardTitle className="font-headline flex items-baseline flex-wrap gap-x-1.5">
                  <LineChartIcon className="mr-1 h-6 w-6 text-accent self-center flex-shrink-0" />
                  <span>Daily Orders - </span>
                  <Select value={selectedPostcodeForDaily} onValueChange={setSelectedPostcodeForDaily}>
                    <SelectTrigger
                      id="postcode-select-daily-title"
                      className="w-auto h-auto p-0 pr-1 m-0 bg-transparent border-0 shadow-none 
                                 font-headline text-2xl font-bold text-accent hover:text-accent/80 
                                 focus:ring-0 focus:outline-none 
                                 inline-flex items-center gap-1"
                    >
                      <SelectValue placeholder="Select Postcode" />
                    </SelectTrigger>
                    <SelectContent>
                      {availablePostcodesForDailyChart.map(pc => (
                        <SelectItem key={pc} value={pc}>{pc}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardTitle>
                <CardDescription className="mt-1">
                  Order trend for the selected postcode over the past week.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <ChartContainer config={lineChartConfig} className="h-[250px] w-full">
                <RechartsLineChart data={dailyOrdersDataForSelectedPostcode} margin={{ left: 0, right: 20 }} accessibilityLayer>
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
                  <Legend />
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

