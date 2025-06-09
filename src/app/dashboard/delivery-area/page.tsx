
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


export default function DeliveryAreaPage() {
  const [selectedPostcode1, setSelectedPostcode1] = React.useState<string>("M1 1AA");
  const [selectedPostcode2, setSelectedPostcode2] = React.useState<string>("M2 2BB");
  
  const availablePostcodesForDailyChart = Object.keys(allDailyOrdersData);

  const combinedDailyOrdersData = React.useMemo(() => {
    const dataPC1 = allDailyOrdersData[selectedPostcode1] || [];
    const dataPC2 = allDailyOrdersData[selectedPostcode2] || [];
    const daysOrder = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    return daysOrder.map(day => {
        const entryPC1 = dataPC1.find(d => d.day === day);
        const entryPC2 = dataPC2.find(d => d.day === day);
        return {
            day,
            ordersPC1: entryPC1 ? entryPC1.orders : null,
            ordersPC2: entryPC2 ? entryPC2.orders : null,
        };
    });
  }, [selectedPostcode1, selectedPostcode2]);

  const lineChartConfig = React.useMemo(() => ({
    ordersPC1: { label: selectedPostcode1, color: "hsl(var(--accent))" }, // Gold
    ordersPC2: { label: selectedPostcode2, color: "hsl(var(--chart-1))" }, // Teal variant
  }), [selectedPostcode1, selectedPostcode2]) satisfies ChartConfig;


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

      <Card className="mt-6">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="font-headline flex items-center">
                <LineChartIcon className="mr-2 h-6 w-6 text-primary" />
                Daily Orders Comparison
              </CardTitle>
              <CardDescription className="mt-1">
                Compare daily order trends for two selected postcodes over the past week.
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Select value={selectedPostcode1} onValueChange={setSelectedPostcode1}>
                <SelectTrigger id="postcode-select-1" className="w-full sm:w-[150px]">
                  <SelectValue placeholder="Select Postcode 1" />
                </SelectTrigger>
                <SelectContent>
                  {availablePostcodesForDailyChart.map(pc => (
                    <SelectItem key={`pc1-${pc}`} value={pc} disabled={pc === selectedPostcode2}>
                      {pc}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedPostcode2} onValueChange={setSelectedPostcode2}>
                <SelectTrigger id="postcode-select-2" className="w-full sm:w-[150px]">
                  <SelectValue placeholder="Select Postcode 2" />
                </SelectTrigger>
                <SelectContent>
                  {availablePostcodesForDailyChart.map(pc => (
                    <SelectItem key={`pc2-${pc}`} value={pc} disabled={pc === selectedPostcode1}>
                      {pc}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ChartContainer config={lineChartConfig} className="h-[350px] w-full">
            <RechartsLineChart data={combinedDailyOrdersData} margin={{ left: 0, right: 20 }} accessibilityLayer>
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
              <Line 
                type="monotone" 
                dataKey="ordersPC1" 
                name={selectedPostcode1} 
                stroke="var(--color-ordersPC1)" 
                strokeWidth={2} 
                dot={{ r: 4, fill: "var(--color-ordersPC1)" }} 
                activeDot={{r: 6}} 
                connectNulls 
              />
              <Line 
                type="monotone" 
                dataKey="ordersPC2" 
                name={selectedPostcode2} 
                stroke="var(--color-ordersPC2)" 
                strokeWidth={2} 
                dot={{ r: 4, fill: "var(--color-ordersPC2)" }} 
                activeDot={{r: 6}} 
                connectNulls 
              />
            </RechartsLineChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
