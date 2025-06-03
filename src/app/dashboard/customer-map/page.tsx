"use client";

import { PageHeader } from '@/components/dashboard/page-header';
import { MapPlaceholder } from '@/components/dashboard/map-placeholder';
import { FilterControls } from '@/components/dashboard/filter-controls';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserPlus, Repeat } from 'lucide-react';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart as RechartsBarChart, CartesianGrid, XAxis, YAxis, Legend } from "recharts";

const customerDataByArea = [
  { postcode: "M1 1AA", newCustomers: 150, repeatCustomers: 350, churnRate: "5%" },
  { postcode: "M2 2BB", newCustomers: 200, repeatCustomers: 250, churnRate: "8%" },
  { postcode: "M3 3CC", newCustomers: 100, repeatCustomers: 180, churnRate: "12%" },
  { postcode: "M4 4DD", newCustomers: 250, repeatCustomers: 150, churnRate: "15%" },
];

const chartConfig = {
  newCustomers: { label: "New Customers", color: "hsl(var(--chart-1))" },
  repeatCustomers: { label: "Repeat Customers", color: "hsl(var(--primary))" },
} satisfies ChartConfig;

export default function CustomerMapPage() {
  return (
    <div>
      <PageHeader
        title="Repeat vs. New Customer Map"
        description="Distinguish loyal vs. one-time customers and track retention or churn rates by area."
      />
      <FilterControls onApplyFilters={(filters) => console.log("Applying customer map filters:", filters)} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <MapPlaceholder title="Customer Type Distribution" height="500px" dataAiHint="people map customer types" />
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline flex items-center">
                <Users className="mr-2 h-5 w-5 text-primary" />
                Customer Breakdown by Area
              </CardTitle>
              <CardDescription>New vs. Repeat customers in key postcodes.</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <RechartsBarChart data={customerDataByArea} layout="vertical" accessibilityLayer>
                  <CartesianGrid horizontal={false} />
                  <YAxis dataKey="postcode" type="category" tickLine={false} tickMargin={10} axisLine={false} width={60} />
                  <XAxis type="number" />
                  <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar dataKey="newCustomers" fill="var(--color-newCustomers)" radius={4} />
                  <Bar dataKey="repeatCustomers" fill="var(--color-repeatCustomers)" radius={4} />
                </RechartsBarChart>
              </ChartContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Retention Insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {customerDataByArea.slice(0,2).map(area => ( // Show a couple of examples
                <div key={area.postcode} className="p-3 bg-muted/30 rounded-lg">
                  <h4 className="font-semibold text-primary">{area.postcode}</h4>
                  <p className="text-sm">
                    <UserPlus className="inline h-4 w-4 mr-1 text-green-500" /> New: {area.newCustomers} | 
                    <Repeat className="inline h-4 w-4 ml-2 mr-1 text-blue-500" /> Repeat: {area.repeatCustomers}
                  </p>
                  <p className="text-sm text-muted-foreground">Churn Rate: {area.churnRate}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
