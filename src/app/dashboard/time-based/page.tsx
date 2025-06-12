
"use client"

import React, { useState, useEffect, useMemo } from 'react';
import { PageHeader } from '@/components/dashboard/page-header';
import { FilterControls } from '@/components/dashboard/filter-controls';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Clock, TrendingUp, TrendingDown, BadgePercent, Edit3, X } from 'lucide-react'; 
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart as RechartsBarChart, CartesianGrid, XAxis, YAxis, Line as RechartsLine, LineChart as RechartsLineChartComponent, ResponsiveContainer, Legend } from "recharts" // Aliased Line from recharts to avoid conflict
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from "@/components/ui/checkbox";

const hourlyData = [
  { hour: "00:00", orders: 10, delivery: 8, collection: 2, instore: 3 },
  { hour: "01:00", orders: 12, delivery: 10, collection: 2, instore: 4 },
  { hour: "02:00", orders: 8, delivery: 7, collection: 1, instore: 2 },
  // ... more hours
  { hour: "12:00", orders: 50, delivery: 40, collection: 10, instore: 15 },
  { hour: "13:00", orders: 55, delivery: 45, collection: 10, instore: 12 },
  { hour: "18:00", orders: 120, delivery: 100, collection: 20, instore: 25 },
  { hour: "19:00", orders: 150, delivery: 120, collection: 30, instore: 30 },
  { hour: "20:00", orders: 130, delivery: 110, collection: 20, instore: 20 },
  { hour: "21:00", orders: 90, delivery: 80, collection: 10, instore: 15 },
  { hour: "22:00", orders: 60, delivery: 55, collection: 5, instore: 10 },
  { hour: "23:00", orders: 30, delivery: 28, collection: 2, instore: 5 },
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
  instore: { label: "In-Store Orders", color: "hsl(var(--chart-3))" }, 
  value: { label: "Order Value (£)", color: "hsl(var(--accent))" },
} satisfies ChartConfig;

const identifiedQuieterPeriod = {
  days: "Monday & Tuesday", 
  startTime: "09:00",
  endTime: "11:30",
  fullText: "Monday & Tuesday, 09:00 AM - 11:30 AM"
};

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];


export default function TimeBasedPage() {
  const { toast } = useToast();
  const [isOfferDialogOpen, setIsOfferDialogOpen] = useState(false);
  const [offerName, setOfferName] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState('');
  const [couponCode, setCouponCode] = useState('');

  const [isEditingPeriod, setIsEditingPeriod] = useState(false);
  const [customDays, setCustomDays] = useState<string[]>([]);
  const [customStartTime, setCustomStartTime] = useState(identifiedQuieterPeriod.startTime);
  const [customEndTime, setCustomEndTime] = useState(identifiedQuieterPeriod.endTime);

  const formatTimeForDisplay = (time: string) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const h = parseInt(hours, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const displayHours = h % 12 || 12; 
    return `${String(displayHours).padStart(2, '0')}:${minutes} ${ampm}`;
  };

  const activePeriodDescription = useMemo(() => {
    const formattedStart = formatTimeForDisplay(customStartTime);
    const formattedEnd = formatTimeForDisplay(customEndTime);
    if (isEditingPeriod) {
      const daysString = customDays.length > 0 ? customDays.join(', ') : "No days selected";
      return `Selected Days: ${daysString}, ${formattedStart || "Start Time"} - ${formattedEnd || "End Time"}`;
    }
    return identifiedQuieterPeriod.fullText;
  }, [isEditingPeriod, customDays, customStartTime, customEndTime, identifiedQuieterPeriod.fullText]);

  const handleDayCheckboxChange = (day: string, checked: boolean) => {
    setCustomDays(prevDays => {
      if (checked) {
        return [...prevDays, day].sort((a, b) => daysOfWeek.indexOf(a) - daysOfWeek.indexOf(b));
      } else {
        return prevDays.filter(d => d !== day);
      }
    });
  };
  
  const parsePredefinedDays = (daysString: string): string[] => {
    const parsed = daysString.split(/&|,/g).map(d => d.trim()).filter(Boolean);
    return parsed.filter(day => daysOfWeek.includes(day)).sort((a, b) => daysOfWeek.indexOf(a) - daysOfWeek.indexOf(b));
  };


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

    let periodForToast = identifiedQuieterPeriod.fullText;
    let finalCustomDays = customDays;

    if (isEditingPeriod) {
        if (customDays.length === 0) {
            toast({ variant: "destructive", title: "Error", description: "Please select at least one custom day."});
            return;
        }
        if (!customStartTime) {
            toast({ variant: "destructive", title: "Error", description: "Custom start time is required."});
            return;
        }
        if (!customEndTime) {
            toast({ variant: "destructive", title: "Error", description: "Custom end time is required."});
            return;
        }
        if (customStartTime >= customEndTime) {
            toast({ variant: "destructive", title: "Error", description: "Custom start time must be before custom end time."});
            return;
        }
        periodForToast = `${customDays.join(', ')}, ${formatTimeForDisplay(customStartTime)} - ${formatTimeForDisplay(customEndTime)}`;
    } else {
      finalCustomDays = parsePredefinedDays(identifiedQuieterPeriod.days);
    }


    console.log("Creating offer:", { 
        offerName, 
        discountType, 
        discountValue: numDiscountValue, 
        couponCode,
        period: periodForToast,
        isCustomPeriod: isEditingPeriod,
        customPeriodDetails: { days: finalCustomDays, startTime: customStartTime, endTime: customEndTime } 
    });
    toast({
      title: "Off-Peak Promotion Created (Simulated)",
      description: `Promotion "${offerName}" (${numDiscountValue}${discountType === 'percentage' ? '%' : '£'} off) ${couponCode ? `with code ${couponCode} ` : ''}is ready for ${periodForToast}.`,
    });
    setIsOfferDialogOpen(false);
    setOfferName('');
    setDiscountType('percentage');
    setDiscountValue('');
    setCouponCode('');
    setIsEditingPeriod(false); 
    setCustomDays([]);
    setCustomStartTime(identifiedQuieterPeriod.startTime);
    setCustomEndTime(identifiedQuieterPeriod.endTime);
  };

  const toggleEditPeriod = () => {
    const newEditingState = !isEditingPeriod;
    setIsEditingPeriod(newEditingState);
    if (newEditingState) { 
        setCustomDays(parsePredefinedDays(identifiedQuieterPeriod.days));
        setCustomStartTime(identifiedQuieterPeriod.startTime);
        setCustomEndTime(identifiedQuieterPeriod.endTime);
    } else { 
        setCustomDays([]); 
        setCustomStartTime(identifiedQuieterPeriod.startTime);
        setCustomEndTime(identifiedQuieterPeriod.endTime);
    }
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
            <CardDescription>Orders by hour of the day, broken down by type.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <RechartsBarChart data={hourlyData} accessibilityLayer>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="hour" tickLine={false} tickMargin={10} axisLine={false} />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Bar dataKey="delivery" fill="var(--color-delivery)" radius={4} stackId="a" />
                <Bar dataKey="collection" fill="var(--color-collection)" radius={4} stackId="a" />
                <Bar dataKey="instore" fill="var(--color-instore)" radius={4} stackId="a" />
              </RechartsBarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline flex items-center">
              <LineChart className="mr-2 h-5 w-5 text-primary" />
              Daily Order Volume & Value
            </CardTitle>
            <CardDescription>Total orders and revenue by day of the week</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
               <RechartsLineChartComponent data={dailyData} accessibilityLayer margin={{ left: 12, right: 12 }}>
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
                <RechartsLine yAxisId="left" type="monotone" dataKey="orders" name={chartConfig.orders.label as string} stroke="var(--color-orders)" strokeWidth={2} dot={false} />
                <RechartsLine yAxisId="right" type="monotone" dataKey="value" name={chartConfig.value.label as string} stroke="var(--color-value)" strokeWidth={2} dot={false} />
              </RechartsLineChartComponent>
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
                <p className="text-sm text-muted-foreground">Lowest activity observed on <span className="text-primary">{identifiedQuieterPeriod.fullText}</span>.</p>
                <p className="text-sm text-muted-foreground mt-1">Opportunity for targeted promotions to boost orders during off-peak hours.</p>
              </div>
            </div>
            <Dialog open={isOfferDialogOpen} onOpenChange={(open) => {
                setIsOfferDialogOpen(open);
                if (!open) { 
                    setIsEditingPeriod(false);
                    setCustomDays([]);
                    setCustomStartTime(identifiedQuieterPeriod.startTime);
                    setCustomEndTime(identifiedQuieterPeriod.endTime);
                }
            }}>
              <DialogTrigger asChild>
                <Button variant="outline" className="mt-4 w-full sm:w-auto">
                  <BadgePercent className="mr-2 h-4 w-4" /> Create Promotion for Quieter Periods
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>Create Promotion for Quieter Periods</DialogTitle>
                  <DialogDescription className="space-y-1">
                    <div className="flex items-center gap-2">
                       <Clock className="h-4 w-4 text-primary flex-shrink-0" />
                        <span>Targeting the period: </span>
                        <strong className="text-primary">{activePeriodDescription}</strong>
                    </div>
                     <div>
                        <Button variant="link" size="sm" onClick={toggleEditPeriod} className="p-0 h-auto text-xs text-accent hover:text-accent/80">
                          {isEditingPeriod ? <><X className="mr-1 h-3 w-3"/> Use Predefined Period</> : <><Edit3 className="mr-1 h-3 w-3" /> Edit Period Manually</>}
                        </Button>
                    </div>
                    <div>
                        If you add a coupon code, customers must use it. Otherwise, the discount can be automatically applied during these hours (simulated).
                    </div>
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto pr-2">
                    {isEditingPeriod && (
                    <div className="p-4 border rounded-md bg-muted/50 space-y-4">
                        <h4 className="text-sm font-medium text-foreground">Customize Promotion Period</h4>
                        <div>
                        <Label className="mb-2 block">Days of the Week</Label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2">
                            {daysOfWeek.map(day => (
                            <div key={day} className="flex items-center space-x-2">
                                <Checkbox
                                id={`day-${day}`}
                                checked={customDays.includes(day)}
                                onCheckedChange={(checked) => handleDayCheckboxChange(day, !!checked)}
                                />
                                <Label htmlFor={`day-${day}`} className="font-normal text-sm">{day}</Label>
                            </div>
                            ))}
                        </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                        <div>
                            <Label htmlFor="custom-start-time">Start Time</Label>
                            <Input 
                            id="custom-start-time" 
                            type="time" 
                            value={customStartTime} 
                            onChange={(e) => setCustomStartTime(e.target.value)}
                            className="mt-1"
                            />
                        </div>
                        <div>
                            <Label htmlFor="custom-end-time">End Time</Label>
                            <Input 
                            id="custom-end-time" 
                            type="time" 
                            value={customEndTime} 
                            onChange={(e) => setCustomEndTime(e.target.value)}
                            className="mt-1"
                            />
                        </div>
                        </div>
                    </div>
                    )}
                    
                    <Separator className={isEditingPeriod ? '' : 'hidden'} />

                    <div className="grid gap-4">
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
                </div>
                <DialogFooter className="border-t pt-4">
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

