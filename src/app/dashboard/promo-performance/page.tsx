"use client";

import { PageHeader } from '@/components/dashboard/page-header';
import { MapPlaceholder } from '@/components/dashboard/map-placeholder';
import { FilterControls } from '@/components/dashboard/filter-controls';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BadgePercent, TrendingUp, Tag } from 'lucide-react';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart as RechartsBarChart, CartesianGrid, XAxis, YAxis, Legend } from "recharts";

const promoPerformanceData = [
  { postcode: "M1 1AA", promoCode: "SAVE10", description: "10% Off Orders > £20", redemptions: 120, revenueLift: "£600", conversionRate: "15%" },
  { postcode: "M1 1AA", promoCode: "FREEPIZZA", description: "Free Pizza with Order > £30", redemptions: 80, revenueLift: "£450", conversionRate: "10%" },
  { postcode: "M2 2BB", promoCode: "SAVE10", description: "10% Off Orders > £20", redemptions: 90, revenueLift: "£400", conversionRate: "12%" },
  { postcode: "M2 2BB", promoCode: "2FOR1BURGERS", description: "2 for 1 Burgers", redemptions: 150, revenueLift: "£700", conversionRate: "20%" },
  { postcode: "M3 3CC", promoCode: "SAVE10", description: "10% Off Orders > £20", redemptions: 50, revenueLift: "£200", conversionRate: "8%" },
];

const chartConfig = {
  redemptions: { label: "Redemptions", color: "hsl(var(--primary))" },
  revenueLift: { label: "Revenue Lift (£)", color: "hsl(var(--accent))" },
} satisfies ChartConfig;

// Simplified data for chart (summing up for each promo code for example)
const chartData = [
    { promoCode: "SAVE10", redemptions: 120 + 90 + 50, revenueLiftNumeric: 600 + 400 + 200},
    { promoCode: "FREEPIZZA", redemptions: 80, revenueLiftNumeric: 450},
    { promoCode: "2FOR1BURGERS", redemptions: 150, revenueLiftNumeric: 700 },
];


export default function PromoPerformancePage() {
  return (
    <div>
      <PageHeader
        title="Offer/Promo Performance by Area"
        description="Analyze which discounts worked best, and where, to optimize your promotion strategies."
      />
      <FilterControls onApplyFilters={(filters) => console.log("Applying promo filters:", filters)} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <MapPlaceholder title="Promo Effectiveness by Zone" height="500px" dataAiHint="map discount offer" />
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="font-headline flex items-center">
              <TrendingUp className="mr-2 h-5 w-5 text-primary" />
              Top Performing Promotions
            </CardTitle>
            <CardDescription>Overall effectiveness of different offers.</CardDescription>
          </CardHeader>
          <CardContent>
             <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <RechartsBarChart data={chartData} accessibilityLayer>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="promoCode" tickLine={false} tickMargin={10} axisLine={false} />
                  <YAxis yAxisId="left" orientation="left" />
                  <YAxis yAxisId="right" orientation="right" dataKey="revenueLiftNumeric" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar yAxisId="left" dataKey="redemptions" fill="var(--color-redemptions)" radius={4} />
                  <Bar yAxisId="right" dataKey="revenueLiftNumeric" name="Revenue Lift (£)" fill="var(--color-revenueLift)" radius={4} />
                </RechartsBarChart>
              </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="font-headline flex items-center">
             <Tag className="mr-2 h-5 w-5 text-primary" />
            Detailed Promotion Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Postcode</TableHead>
                <TableHead>Promo Code</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Redemptions</TableHead>
                <TableHead className="text-right">Revenue Lift</TableHead>
                <TableHead className="text-right">Conversion Rate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {promoPerformanceData.map((promo, index) => (
                <TableRow key={index}>
                  <TableCell>{promo.postcode}</TableCell>
                  <TableCell className="font-medium">{promo.promoCode}</TableCell>
                  <TableCell>{promo.description}</TableCell>
                  <TableCell className="text-right">{promo.redemptions}</TableCell>
                  <TableCell className="text-right text-green-500 font-semibold">{promo.revenueLift}</TableCell>
                  <TableCell className="text-right">{promo.conversionRate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
