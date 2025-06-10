
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
import React, { useState, useEffect, useMemo } from 'react'; // Added useState, useEffect, useMemo

// --- Mock Data Definitions for Different Takeaways ---
const defaultTakeawayData = {
  topPostcodesRaw: [
    { postcode: "M1 1AA", orders: 1250, revenue: "£18,750" },
    { postcode: "M2 2BB", orders: 980, revenue: "£14,700" },
    { postcode: "M3 3CC", orders: 750, revenue: "£11,250" },
    { postcode: "M4 4AB", orders: 600, revenue: "£9,000" },
    { postcode: "M5 5CD", orders: 500, revenue: "£7,500" },
  ],
  lowConversionAreas: [
    { postcode: "M4 4DD", views: 500, orders: 10 },
    { postcode: "M5 5EE", views: 350, orders: 5 },
  ],
  allDailyOrdersData: {
    "M1 1AA": [ { day: "Mon", orders: 30 }, { day: "Tue", orders: 45 }, { day: "Wed", orders: 55 }, { day: "Thu", orders: 40 }, { day: "Fri", orders: 70 }, { day: "Sat", orders: 90 }, { day: "Sun", orders: 60 }, ],
    "M2 2BB": [ { day: "Mon", orders: 20 }, { day: "Tue", orders: 30 }, { day: "Wed", orders: 40 }, { day: "Thu", orders: 35 }, { day: "Fri", orders: 60 }, { day: "Sat", orders: 75 }, { day: "Sun", orders: 50 }, ],
    "M3 3CC": [ { day: "Mon", orders: 25 }, { day: "Tue", orders: 35 }, { day: "Wed", orders: 50 }, { day: "Thu", orders: 45 }, { day: "Fri", orders: 65 }, { day: "Sat", orders: 80 }, { day: "Sun", orders: 55 }, ],
    "M4 4AB": [ { day: "Mon", orders: 15 }, { day: "Tue", orders: 25 }, { day: "Wed", orders: 30 }, { day: "Thu", orders: 20 }, { day: "Fri", orders: 50 }, { day: "Sat", orders: 60 }, { day: "Sun", orders: 40 }, ],
    "M5 5CD": [ { day: "Mon", orders: 10 }, { day: "Tue", orders: 15 }, { day: "Wed", orders: 20 }, { day: "Thu", orders: 18 }, { day: "Fri", orders: 40 }, { day: "Sat", orders: 55 }, { day: "Sun", orders: 30 }, ],
  }
};

const takeawaySpecificData: { [key: string]: typeof defaultTakeawayData } = {
  '1': defaultTakeawayData, // Tiger Bite Stoke (uses default)
  '2': { // Curry King
    topPostcodesRaw: [
      { postcode: "CK1 1CK", orders: 800, revenue: "£12,000" },
      { postcode: "CK2 2CK", orders: 650, revenue: "£9,750" },
      { postcode: "CK3 3CK", orders: 500, revenue: "£7,500" },
    ],
    lowConversionAreas: [
      { postcode: "CK4 4DD", views: 300, orders: 5 },
    ],
    allDailyOrdersData: {
      "CK1 1CK": [ { day: "Mon", orders: 20 }, { day: "Tue", orders: 25 }, { day: "Wed", orders: 30 }, { day: "Thu", orders: 35 }, { day: "Fri", orders: 90 }, { day: "Sat", orders: 110 }, { day: "Sun", orders: 70 }, ],
      "CK2 2CK": [ { day: "Mon", orders: 15 }, { day: "Tue", orders: 20 }, { day: "Wed", orders: 25 }, { day: "Thu", orders: 30 }, { day: "Fri", orders: 70 }, { day: "Sat", orders: 90 }, { day: "Sun", orders: 60 }, ],
    }
  },
  '3': { // Pizza Planet
    topPostcodesRaw: [
      { postcode: "PZ1 1PZ", orders: 1500, revenue: "£22,500" },
      { postcode: "PZ2 2PZ", orders: 1100, revenue: "£16,500" },
    ],
    lowConversionAreas: [
      { postcode: "PZ3 3EE", views: 600, orders: 12 },
    ],
    allDailyOrdersData: {
      "PZ1 1PZ": [ { day: "Mon", orders: 50 }, { day: "Tue", orders: 60 }, { day: "Wed", orders: 70 }, { day: "Thu", orders: 80 }, { day: "Fri", orders: 150 }, { day: "Sat", orders: 200 }, { day: "Sun", orders: 120 }, ],
    }
  },
  // Add more takeaway-specific data here for other IDs if needed
};
// --- End of Mock Data Definitions ---

const parseRevenue = (revenueString: string) => parseFloat(revenueString.replace('£', '').replace(',', ''));

const barChartConfig = {
  revenue: { label: "Revenue (£)", color: "hsl(var(--primary))" },
} satisfies ChartConfig;


export default function DeliveryAreaPage() {
  const [currentTakeawayId, setCurrentTakeawayId] = useState<string | null>(null);
  const [pageData, setPageData] = useState(defaultTakeawayData);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedId = localStorage.getItem('selectedTakeawayId');
      setCurrentTakeawayId(storedId);
      setPageData(takeawaySpecificData[storedId || ''] || defaultTakeawayData);
    }
  }, []);
  
  // Memoize derived data to recompute only when pageData changes
  const topPostcodesChartData = useMemo(() => 
    pageData.topPostcodesRaw.map(area => ({
      postcode: area.postcode,
      revenue: parseRevenue(area.revenue),
      orders: area.orders,
    })), [pageData.topPostcodesRaw]);

  const [selectedPostcode1, setSelectedPostcode1] = useState<string>("");
  const [selectedPostcode2, setSelectedPostcode2] = useState<string>("");

  // Update available postcodes and default selections when pageData changes
  const availablePostcodesForDailyChart = useMemo(() => Object.keys(pageData.allDailyOrdersData), [pageData.allDailyOrdersData]);

  useEffect(() => {
    if (availablePostcodesForDailyChart.length > 0) {
      setSelectedPostcode1(availablePostcodesForDailyChart[0]);
      if (availablePostcodesForDailyChart.length > 1) {
        setSelectedPostcode2(availablePostcodesForDailyChart[1]);
      } else {
        setSelectedPostcode2(""); // Reset if only one postcode available
      }
    } else {
      setSelectedPostcode1("");
      setSelectedPostcode2("");
    }
  }, [availablePostcodesForDailyChart]);


  const combinedDailyOrdersData = useMemo(() => {
    const dataPC1 = pageData.allDailyOrdersData[selectedPostcode1] || [];
    const dataPC2 = pageData.allDailyOrdersData[selectedPostcode2] || [];
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
  }, [selectedPostcode1, selectedPostcode2, pageData.allDailyOrdersData]);

  const lineChartConfig = useMemo(() => ({
    ordersPC1: { label: selectedPostcode1 || "PC1", color: "hsl(var(--accent))" }, 
    ordersPC2: { label: selectedPostcode2 || "PC2", color: "hsl(var(--chart-1))" }, 
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
              {pageData.lowConversionAreas.map((area) => (
                <li key={area.postcode} className="text-sm">
                  <span className="font-semibold">{area.postcode}:</span> {area.orders} orders from {area.views} views.
                </li>
              ))}
              </ul>
               {pageData.lowConversionAreas.length === 0 && <p className="text-sm">No specific low conversion areas identified for this takeaway.</p>}
            </AlertDescription>
          </Alert>
        </div>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <div className="flex flex-col gap-4">
            <div>
              <CardTitle className="font-headline flex items-center">
                <LineChartIcon className="mr-2 h-6 w-6 text-primary" />
                Daily Orders Comparison
              </CardTitle>
              <CardDescription className="mt-1">
                Compare daily order trends for two selected postcodes over the past week.
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Select value={selectedPostcode1} onValueChange={setSelectedPostcode1} disabled={availablePostcodesForDailyChart.length === 0}>
                <SelectTrigger id="postcode-select-1" className="w-full sm:w-[180px]">
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
              <Select value={selectedPostcode2} onValueChange={setSelectedPostcode2} disabled={availablePostcodesForDailyChart.length === 0}>
                <SelectTrigger id="postcode-select-2" className="w-full sm:w-[180px]">
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
                name={selectedPostcode1 || "Postcode 1"} 
                stroke="var(--color-ordersPC1)" 
                strokeWidth={2} 
                dot={{ r: 4, fill: "var(--color-ordersPC1)" }} 
                activeDot={{r: 6}} 
                connectNulls 
              />
              <Line 
                type="monotone" 
                dataKey="ordersPC2" 
                name={selectedPostcode2 || "Postcode 2"} 
                stroke="var(--color-ordersPC2)" 
                strokeWidth={2} 
                dot={{ r: 4, fill: "var(--color-ordersPC2)" }} 
                activeDot={{r: 6}} 
                connectNulls 
              />
            </RechartsLineChart>
          </ChartContainer>
            {availablePostcodesForDailyChart.length === 0 && (
                <p className="text-muted-foreground text-center mt-4">No daily order data available for the selected takeaway.</p>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
