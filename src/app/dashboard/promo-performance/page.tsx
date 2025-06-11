
"use client";

import React, { useMemo } from 'react'; // Added useMemo
import { PageHeader } from '@/components/dashboard/page-header';
import { InteractiveHeatmapPlaceholder } from '@/components/dashboard/interactive-heatmap-placeholder';
import { FilterControls } from '@/components/dashboard/filter-controls';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BadgePercent, TrendingUp, Tag, Activity, Award, DollarSign, BarChart2, Info, Gift, MapPin as MapPinIcon, Percent } from 'lucide-react'; // Added new icons
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart as RechartsBarChart, CartesianGrid, XAxis, YAxis, Legend } from "recharts";

const promoPerformanceData = [
  { postcode: "M1 1AA", promoCode: "SAVE10", description: "10% Off Orders > £20", redemptions: 120, revenueLift: "£600", conversionRate: "15%" },
  { postcode: "M1 1AA", promoCode: "FREEPIZZA", description: "Free Pizza with Order > £30", redemptions: 80, revenueLift: "£450", conversionRate: "10%" },
  { postcode: "M2 2BB", promoCode: "SAVE10", description: "10% Off Orders > £20", redemptions: 90, revenueLift: "£400", conversionRate: "12%" },
  { postcode: "M2 2BB", promoCode: "2FOR1BURGERS", description: "2 for 1 Burgers", redemptions: 150, revenueLift: "£700", conversionRate: "20%" },
  { postcode: "M3 3CC", promoCode: "SAVE10", description: "10% Off Orders > £20", redemptions: 50, revenueLift: "£200", conversionRate: "8%" },
  { postcode: "M4 4DD", promoCode: "WELCOME15", description: "15% Off First Order", redemptions: 200, revenueLift: "£800", conversionRate: "25%"},
  { postcode: "M4 4DD", promoCode: "FREEPIZZA", description: "Free Pizza with Order > £30", redemptions: 60, revenueLift: "£300", conversionRate: "9%" },
];

const parseRevenue = (revenueString: string): number => {
  if (!revenueString) return 0;
  return parseFloat(revenueString.replace('£', '').replace(',', ''));
};

const parsePercentage = (percentageString: string): number => {
  if (!percentageString) return 0;
  return parseFloat(percentageString.replace('%', ''));
};

const chartConfig = {
  redemptions: { label: "Redemptions", color: "hsl(0, 90%, 60%)" }, // Vibrant Red
  revenueLiftNumeric: { label: "Revenue Lift (£)", color: "hsl(60, 100%, 50%)" }, // Standard Yellow
} satisfies ChartConfig;

export default function PromoPerformancePage() {

  const overallStats = useMemo(() => {
    if (promoPerformanceData.length === 0) {
      return {
        totalActivePromotions: 0,
        totalRedemptions: 0,
        totalRevenueLift: 0,
        mostEffectivePromo: "N/A",
        highestRevenueLiftPromo: "N/A",
        overallAvgConversionRate: "0.0%",
        promoAggregates: [],
      };
    }

    const uniquePromos = new Set(promoPerformanceData.map(p => p.promoCode));
    const totalRedemptions = promoPerformanceData.reduce((sum, p) => sum + p.redemptions, 0);
    const totalRevenueLift = promoPerformanceData.reduce((sum, p) => sum + parseRevenue(p.revenueLift), 0);

    const promoAggregates = Array.from(uniquePromos).map(code => {
      const promosForCode = promoPerformanceData.filter(p => p.promoCode === code);
      const totalRedemptionsForCode = promosForCode.reduce((sum, p) => sum + p.redemptions, 0);
      const totalRevenueLiftForCode = promosForCode.reduce((sum, p) => sum + parseRevenue(p.revenueLift), 0);
      const totalConversionRateSum = promosForCode.reduce((sum, p) => sum + parsePercentage(p.conversionRate), 0);
      
      return {
        promoCode: code,
        description: promosForCode[0]?.description || 'N/A',
        totalRedemptions: totalRedemptionsForCode,
        totalRevenueLift: totalRevenueLiftForCode,
        avgConversionRate: promosForCode.length > 0 ? (totalConversionRateSum / promosForCode.length) : 0,
        activeAreas: new Set(promosForCode.map(p => p.postcode)).size,
      };
    });

    const mostEffectiveByRedemptions = promoAggregates.reduce(
      (max, p) => (p.totalRedemptions > max.totalRedemptions ? p : max),
      promoAggregates[0] || { promoCode: 'N/A', totalRedemptions: 0 }
    );
    const highestRevenueLiftPromo = promoAggregates.reduce(
      (max, p) => (p.totalRevenueLift > max.totalRevenueLift ? p : max),
      promoAggregates[0] || { promoCode: 'N/A', totalRevenueLift: 0 }
    );
    
    const overallAvgConversion = promoPerformanceData.length > 0 
      ? promoPerformanceData.reduce((sum, p) => sum + parsePercentage(p.conversionRate), 0) / promoPerformanceData.length 
      : 0;

    return {
      totalActivePromotions: uniquePromos.size,
      totalRedemptions,
      totalRevenueLift,
      mostEffectivePromo: mostEffectiveByRedemptions.promoCode,
      highestRevenueLiftPromo: highestRevenueLiftPromo.promoCode,
      overallAvgConversionRate: overallAvgConversion.toFixed(1) + '%',
      promoAggregates
    };
  }, []);

  const chartData = useMemo(() => {
    return overallStats.promoAggregates.map(p => ({
      promoCode: p.promoCode,
      redemptions: p.totalRedemptions,
      revenueLiftNumeric: p.totalRevenueLift
    })).sort((a,b) => b.redemptions - a.redemptions).slice(0, 5); // Show top 5 promos in chart for brevity
  }, [overallStats.promoAggregates]);

  return (
    <div>
      <PageHeader
        title="Offer/Promo Performance by Area"
        description="Analyze which discounts worked best, and where, to optimize your promotion strategies."
      />
      <FilterControls onApplyFilters={(filters) => console.log("Applying promo filters:", filters)} />
      
      <Card className="mb-6 shadow-md">
        <CardHeader>
          <CardTitle className="font-headline flex items-center">
            <Info className="mr-2 h-6 w-6 text-primary" />
            Overall Promo Statistics
          </CardTitle>
          <CardDescription>A high-level summary of your promotion performance.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 text-center">
          <div className="p-4 bg-muted/30 rounded-lg">
            <Activity className="h-8 w-8 text-accent mx-auto mb-2" />
            <p className="text-2xl font-bold">{overallStats.totalActivePromotions}</p>
            <p className="text-xs text-muted-foreground">Active Promotions</p>
          </div>
          <div className="p-4 bg-muted/30 rounded-lg">
            <Gift className="h-8 w-8 text-accent mx-auto mb-2" />
            <p className="text-2xl font-bold">{overallStats.totalRedemptions.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Total Redemptions</p>
          </div>
          <div className="p-4 bg-muted/30 rounded-lg">
            <DollarSign className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <p className="text-2xl font-bold">£{overallStats.totalRevenueLift.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Total Revenue Lift</p>
          </div>
          <div className="p-4 bg-muted/30 rounded-lg">
            <Percent className="h-8 w-8 text-accent mx-auto mb-2" />
            <p className="text-2xl font-bold">{overallStats.overallAvgConversionRate}</p>
            <p className="text-xs text-muted-foreground">Avg. Conversion Rate</p>
          </div>
          <div className="p-4 bg-muted/30 rounded-lg">
            <Award className="h-8 w-8 text-primary mx-auto mb-2" />
            <p className="text-lg font-semibold truncate" title={`Redemptions: ${overallStats.mostEffectivePromo}`}>
              {overallStats.mostEffectivePromo}
            </p>
            <p className="text-xs text-muted-foreground">Top Promo (Redemptions)</p>
          </div>
          {/* Consider adding Highest Revenue Lift Promo if space allows or combining */}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <InteractiveHeatmapPlaceholder title="Promo Effectiveness by Zone" height="450px" dataAiHint="promo effectiveness map" />
        </div>
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="font-headline flex items-center">
              <BarChart2 className="mr-2 h-5 w-5 text-primary" />
              Top Promotions Summary
            </CardTitle>
            <CardDescription>Effectiveness of different offers (Top 5 by redemptions).</CardDescription>
          </CardHeader>
          <CardContent>
             <ChartContainer config={chartConfig} className="h-[350px] w-full">
                <RechartsBarChart data={chartData} accessibilityLayer margin={{ right: 10, left: -10, bottom: 20 }}>
                  <CartesianGrid vertical={false} />
                  <XAxis 
                    dataKey="promoCode" 
                    tickLine={false} 
                    tickMargin={5} 
                    axisLine={false} 
                    className="text-xs" 
                    interval={0} 
                    angle={-30} 
                    textAnchor="end"
                    height={50} // Provide space for angled labels
                  />
                  <YAxis yAxisId="left" orientation="left" className="text-xs" />
                  <YAxis yAxisId="right" orientation="right" dataKey="revenueLiftNumeric" className="text-xs" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend wrapperStyle={{fontSize: "0.75rem"}}/>
                  <Bar yAxisId="left" dataKey="redemptions" fill="var(--color-redemptions)" radius={4} />
                  <Bar yAxisId="right" dataKey="revenueLiftNumeric" name="Revenue Lift (£)" fill="var(--color-revenueLiftNumeric)" radius={4} />
                </RechartsBarChart>
              </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6 shadow-md">
        <CardHeader>
          <CardTitle className="font-headline flex items-center">
             <BadgePercent className="mr-2 h-5 w-5 text-primary" />
            Promotions Overview
          </CardTitle>
          <CardDescription>Aggregated performance for each unique promotion across all areas.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Promo Code</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Total Redemptions</TableHead>
                <TableHead className="text-right">Total Revenue Lift (£)</TableHead>
                <TableHead className="text-right">Avg. Conversion (%)</TableHead>
                <TableHead className="text-right">Active Areas</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {overallStats.promoAggregates.map((promo) => (
                <TableRow key={promo.promoCode}>
                  <TableCell className="font-medium">{promo.promoCode}</TableCell>
                  <TableCell>{promo.description}</TableCell>
                  <TableCell className="text-right">{promo.totalRedemptions.toLocaleString()}</TableCell>
                  <TableCell className="text-right text-green-500 font-semibold">£{promo.totalRevenueLift.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{promo.avgConversionRate.toFixed(1)}%</TableCell>
                  <TableCell className="text-right">{promo.activeAreas}</TableCell>
                </TableRow>
              ))}
               {overallStats.promoAggregates.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">No promotion data available.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>


      <Card className="mt-6 shadow-md">
        <CardHeader>
          <CardTitle className="font-headline flex items-center">
             <Tag className="mr-2 h-5 w-5 text-primary" />
            Detailed Promotion Performance by Area
          </CardTitle>
          <CardDescription>Breakdown of each promotion's performance in specific postcodes.</CardDescription>
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
              {promoPerformanceData.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">No detailed promotion data available.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

