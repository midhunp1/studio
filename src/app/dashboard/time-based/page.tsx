
"use client"

import React, { useState } from 'react'; // Added useState
import { PageHeader } from '@/components/dashboard/page-header';
import { FilterControls } from '@/components/dashboard/filter-controls';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, LineChart as LineChartIconLucide, Clock, TrendingUp, TrendingDown, BadgePercent } from 'lucide-react'; // Added BadgePercent
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart as RechartsBarChart, CartesianGrid, XAxis, YAxis, Line, LineChart as RechartsLineChart, ResponsiveContainer, Legend } from "recharts"
import { Button } from '@/components/ui/button'; // Added Button
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog'; // Added Dialog components
import { Input } from '@/components/ui/input'; // Added Input
import { Label } from '@/components/ui/label'; // Added Label
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'; // Added Select components
import { useToast } from '@/hooks/use-toast'; // Added useToast

const hourlyData = [
  { hour: "00:00", orders: 10, delivery: 8, collection: 2 },
  { hour: "01:00", orders: 12, delivery: 10, collection: 2 },
  { hour: "02:00", orders: 8, delivery: 7, collection: 1 },
  // ... more hours
  { hour: "12:00", orders: 50, delivery: 40, collection: 10 },
  { hour: "13:00", orders: 55, delivery: 45, collection: 10 },
  { hour: "18:00", orders: 120, delivery: 100, collection: 20 },
  { hour: "19:00", orders: 150, delivery: 120, collection: 30 },
  { hour: "20:00", orders: 130, delivery: 110, collection: 20 },
  { hour: "21:00", orders: 90, delivery: 80, collection: 10 },
  { hour: "22:00", orders: 60, delivery: 55, collection: 5 },
  { hour: "23:00", orders: 30, delivery: 28, collection: 2 },
];

const dailyData = [
  { day: "Mon", orders: 300, value: 4500 },
  { day: "Tue", orders: 350, value: 5250 },
  { day: "Wed", orders: 400, value: 6000 },
  { day: "Thu", orders: 420, value: 6300 },
  { day: "Fri", orders: 600, value: 9000 },
  { day: "Sat", orders: 750, value: 11250 },
  { day: "Sun", orders: 700, value: 10500 },
];

const chartConfig = {
  orders: { label: "Total Orders", color: "hsl(var(--primary))" },
  delivery: { label: "Delivery Orders", color: "hsl(var(--chart-1))" },
  collection: { label: "Collection Orders", color: "hsl(var(--chart-2))" },
  value: { label: "Order Value (£)", color: "hsl(var(--accent))" },
} satisfies ChartConfig;


export default function TimeBasedPage() {
  const { toast } = useToast();
  const [isOfferDialogOpen, setIsOfferDialogOpen] = useState(false);
  const [offerName, setOfferName] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState('');
  const [couponCode, setCouponCode] = useState('');

  const handleCreateOffer = () => {
    if (!offerName.trim()) {
      toast({ variant: "destructive", title: "Error", description: "Offer name is required." });
      return;
    }
    const numDiscountValue = parseFloat(discountValue);
    if (isNaN(numDiscountValue) || numDiscountValue <= 0) {
      toast({ variant: "destructive", title: "Error", description: "Please enter a valid positive discount value." });
      return;
    }
    if (discountType === 'percentage' && (numDiscountValue > 100)) {
       toast({ variant: "destructive", title: "Error", description: "Percentage discount cannot exceed 100." });
      return;
    }

    // Simulation of offer creation
    console.log("Creating offer:", { offerName, discountType, discountValue: numDiscountValue, couponCode });
    toast({
      title: "Off-Peak Promotion Created (Simulated)",
      description: `Promotion "${offerName}" (${numDiscountValue}${discountType === 'percentage' ? '%' : '£'} off) ${couponCode ? `with code ${couponCode} ` : ''}is ready for quieter periods.`,
    });
    setIsOfferDialogOpen(false);
    // Reset form fields
    setOfferName('');
    setDiscountType('percentage');
    setDiscountValue('');
    setCouponCode('');
  };

  return (
    <div>
      <PageHeader
        title="Time-Based Heatmap"
        description="Visualize peak hours/days based on order volume and value."
      />
      <FilterControls onApplyFilters={(filters) => console.log("Applying time-based filters:", filters)} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline flex items-center">
              <Clock className="mr-2 h-5 w-5 text-primary" />
              Hourly Order Volume
            </CardTitle>
            <CardDescription>Orders by hour of the day</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <RechartsBarChart data={hourlyData} accessibilityLayer>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="hour" tickLine={false} tickMargin={10} axisLine={false} />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Bar dataKey="delivery" fill="var(--color-delivery)" radius={4} />
                <Bar dataKey="collection" fill="var(--color-collection)" radius={4} />
              </RechartsBarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline flex items-center">
              <BarChart className="mr-2 h-5 w-5 text-primary" />
              Daily Order Volume & Value
            </CardTitle>
            <CardDescription>Total orders and revenue by day of the week</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
               <RechartsLineChart data={dailyData} accessibilityLayer margin={{ left: 12, right: 12 }}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="day"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <YAxis yAxisId="left" orientation="left" />
                <YAxis yAxisId="right" orientation="right" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="orders" stroke="var(--color-orders)" strokeWidth={2} dot={false} />
                <Line yAxisId="right" type="monotone" dataKey="value" stroke="var(--color-value)" strokeWidth={2} dot={false} />
              </RechartsLineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="font-headline">Key Insights</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          <div className="flex flex-col items-start p-4 bg-muted/30 rounded-lg">
            <div className="flex items-start w-full">
              <TrendingUp className="h-8 w-8 text-green-500 mr-3 mt-1 flex-shrink-0" />
              <div className="flex-grow">
                <h4 className="font-semibold">Peak Performance</h4>
                <p className="text-sm text-muted-foreground">Highest order volumes are typically on <span className="text-primary">Friday and Saturday evenings (7 PM - 9 PM)</span>.</p>
                <p className="text-sm text-muted-foreground mt-1">Consider increasing staff and delivery capacity during these times.</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-start p-4 bg-muted/30 rounded-lg">
             <div className="flex items-start w-full">
              <TrendingDown className="h-8 w-8 text-red-500 mr-3 mt-1 flex-shrink-0" />
              <div className="flex-grow">
                <h4 className="font-semibold">Quieter Periods</h4>
                <p className="text-sm text-muted-foreground">Lowest activity observed on <span className="text-primary">Monday and Tuesday mornings</span>.</p>
                <p className="text-sm text-muted-foreground mt-1">Opportunity for targeted promotions to boost orders during off-peak hours.</p>
              </div>
            </div>
            <Dialog open={isOfferDialogOpen} onOpenChange={setIsOfferDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="mt-4 w-full sm:w-auto">
                  <BadgePercent className="mr-2 h-4 w-4" /> Create Promotion for Quieter Periods
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[480px]">
                <DialogHeader>
                  <DialogTitle>Create Promotion for Quieter Periods</DialogTitle>
                  <DialogDescription>
                    Boost sales during identified quieter times (e.g., <Clock className="inline h-3.5 w-3.5 mr-0.5 align-text-bottom"/>Monday and Tuesday mornings).
                    If you add a coupon code, customers must use it. Otherwise, the discount can be automatically applied during these hours (simulated).
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="offer-name">Promotion Name / Description</Label>
                    <Input
                      id="offer-name"
                      placeholder="e.g., Midweek Morning Boost"
                      value={offerName}
                      onChange={(e) => setOfferName(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="discount-type">Discount Type</Label>
                    <Select value={discountType} onValueChange={(value) => setDiscountType(value as 'percentage' | 'fixed')}>
                      <SelectTrigger id="discount-type">
                        <SelectValue placeholder="Select discount type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">Percentage Off</SelectItem>
                        <SelectItem value="fixed">Fixed Amount Off (£)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="discount-value">
                      Discount Value {discountType === 'percentage' ? '(%)' : '(£)'}
                    </Label>
                    <Input
                      id="discount-value"
                      type="number"
                      placeholder={discountType === 'percentage' ? "e.g., 15" : "e.g., 5.00"}
                      value={discountValue}
                      onChange={(e) => setDiscountValue(e.target.value)}
                      min="0"
                      step={discountType === 'percentage' ? "1" : "0.01"}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="coupon-code">Coupon Code (Optional)</Label>
                    <Input
                      id="coupon-code"
                      placeholder="e.g., QUIETMORNING20"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                    />
                     <p className="text-xs text-muted-foreground">Leave blank for an automatic timed discount; fill for a redeemable coupon.</p>
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button type="button" onClick={handleCreateOffer}>Create Promotion</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

