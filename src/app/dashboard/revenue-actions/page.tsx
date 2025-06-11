
"use client";

import React, { useState } from 'react';
import { PageHeader } from '@/components/dashboard/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  Lightbulb,
  AlertTriangle,
  TrendingUp,
  Store,
  ShieldCheck,
  Star,
  Clock,
  CheckCircle,
  BarChartHorizontalBig,
  PackageCheck,
  Megaphone,
  Image as ImageIcon,
  Send,
  Download,
  Bell,
  ClipboardCheck,
  Briefcase,
  Layers,
  Percent,
  ThumbsUp,
  ThumbsDown,
} from 'lucide-react';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Legend, ResponsiveContainer } from "recharts";
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

const venueDetails = {
  name: 'Speedy Pizza',
  brand: 'Speedy Pizza Co.',
  address: 'ST1 2AB',
  aggregators: ['Foodhub', 'JustEat'],
  hygieneRating: 5,
  currentReviewScore: 4.2,
  reviewScoreTrend: 'up', // 'up', 'down', 'stable'
  deliveryTime: 45, // minutes
  areaAverageDeliveryTime: 35, // minutes
  availability: 85, // percentage
  competitorAverageAvailability: 92, // percentage
};

const detectedIssues = [
  { id: 'issue1', severity: 'high', title: 'Offline during peak', description: 'Venue was offline between 7 PM - 9 PM on Friday, missing key order window.', icon: <AlertTriangle className="h-4 w-4 text-destructive" /> },
  { id: 'issue2', severity: 'medium', title: 'No active promos', description: 'Currently no promotions are running, potentially reducing new customer acquisition.', icon: <Percent className="h-4 w-4 text-yellow-500" /> },
  { id: 'issue3', severity: 'low', title: 'Low-res hero image', description: 'The main hero image on aggregators is low resolution, impacting appeal.', icon: <ImageIcon className="h-4 w-4 text-blue-500" /> },
  { id: 'issue4', severity: 'medium', title: 'Delivery time above average', description: `Average delivery time of ${venueDetails.deliveryTime} mins is higher than area average of ${venueDetails.areaAverageDeliveryTime} mins.`, icon: <Clock className="h-4 w-4 text-yellow-500" /> },
];

const smartSuggestions = [
  { id: 'sugg1', text: 'Add 20% Off Welcome Promo', action: 'CREATE_PROMO', icon: <Megaphone className="mr-2 h-4 w-4" />, priority: 1, impact: 'High revenue potential' },
  { id: 'sugg2', text: 'Extend Friday Evening Hours by 1hr', action: 'EXTEND_HOURS', icon: <Clock className="mr-2 h-4 w-4" />, priority: 2, impact: 'Capture more peak orders' },
  { id: 'sugg3', text: 'Update Hero Image to High-Res', action: 'UPDATE_IMAGE', icon: <ImageIcon className="mr-2 h-4 w-4" />, priority: 3, impact: 'Improve visual appeal' },
];

const upliftChartData = [
  { name: 'Week -4', currentOrders: 180, currentRevenue: 2700, currentRating: 4.1, postFixOrders: 180, postFixRevenue: 2700, postFixRating: 4.1 },
  { name: 'Week -3', currentOrders: 190, currentRevenue: 2850, currentRating: 4.0, postFixOrders: 190, postFixRevenue: 2850, postFixRating: 4.0 },
  { name: 'Week -2', currentOrders: 185, currentRevenue: 2775, currentRating: 4.2, postFixOrders: 185, postFixRevenue: 2775, postFixRating: 4.2 },
  { name: 'Week -1', currentOrders: 200, currentRevenue: 3000, currentRating: 4.2, postFixOrders: 240, postFixRevenue: 3600, postFixRating: 4.4 },
  { name: 'Projected', currentOrders: 200, currentRevenue: 3000, currentRating: 4.2, postFixOrders: 260, postFixRevenue: 3900, postFixRating: 4.5 },
];

const upliftChartConfig = {
  currentRevenue: { label: "Current Revenue", color: "hsl(var(--muted-foreground))" },
  postFixRevenue: { label: "Post-Fix Revenue", color: "hsl(var(--primary))" },
  currentOrders: { label: "Current Orders", color: "hsl(var(--muted-foreground))",  type: "line", yAxisId: "orders" },
  postFixOrders: { label: "Post-Fix Orders", color: "hsl(var(--accent))", type: "line", yAxisId: "orders" },
} satisfies ChartConfig;

interface AlertSettings {
  avgDeliveryTime: { enabled: boolean; threshold: number };
  driverAvailability: { enabled: boolean; threshold: number };
  orderQueueCongestion: { enabled: boolean; threshold: number };
  prepTimeSpike: { enabled: boolean; threshold: number };
  noOrdersInMinutes: { enabled: boolean; threshold: number };
  dailySalesDip: { enabled: boolean; threshold: number };
  posDisconnected: { enabled: boolean };
  printerOffline: { enabled: boolean };
}


export default function RevenueActionsPageRevamped() {
  const { toast } = useToast();
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);

  const [alertSettings, setAlertSettings] = useState<AlertSettings>({
    avgDeliveryTime: { enabled: true, threshold: 45 },
    driverAvailability: { enabled: true, threshold: 2 },
    orderQueueCongestion: { enabled: true, threshold: 10 },
    prepTimeSpike: { enabled: true, threshold: 15 },
    noOrdersInMinutes: { enabled: true, threshold: 30 },
    dailySalesDip: { enabled: true, threshold: 20 },
    posDisconnected: { enabled: true },
    printerOffline: { enabled: true },
  });

  const handleAlertSettingChange = (
    key: keyof AlertSettings,
    field: 'threshold' | 'enabled',
    value: number | boolean
  ) => {
    setAlertSettings(prev => {
      const currentSetting = prev[key];
      // Type assertion for threshold to ensure it's treated as a number
      const updatedValue = field === 'threshold' ? Number(value) : value;
      const updatedSetting = { ...currentSetting, [field]: updatedValue };
      return {
        ...prev,
        [key]: updatedSetting,
      };
    });
  };

  const handleSaveAlerts = () => {
    toast({
      title: "Alert Settings Saved (Simulated)",
      description: "Your auto-alert preferences have been updated.",
    });
    setIsAlertDialogOpen(false);
  };


  const handleSmartSuggestionAction = (suggestion: typeof smartSuggestions[0]) => {
    toast({
      title: "Action Triggered (Simulated)",
      description: `Attempting to "${suggestion.text}". This would typically open a modal or assign a task.`,
    });
  };

  const handleQuickAction = (actionName: string) => {
     toast({
      title: "Quick Action (Simulated)",
      description: `${actionName} triggered. In a real app, this would perform the action.`,
    });
  };

  return (
    <TooltipProvider>
      <div>
        <PageHeader
          title="Actions &amp; Revenue Optimisation"
          description="Identify underperforming venues and prioritize actions for maximum revenue impact."
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Venue Snapshot Card */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="font-headline flex items-center">
                <Store className="mr-2 h-6 w-6 text-primary" />
                Venue Snapshot
              </CardTitle>
              <CardDescription>{venueDetails.name} - {venueDetails.address}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm">
                <p className="flex items-center"><Briefcase className="mr-2 h-4 w-4 text-muted-foreground" /> <strong>Brand:</strong> {venueDetails.brand}</p>
                <p className="flex items-center"><Layers className="mr-2 h-4 w-4 text-muted-foreground" /> <strong>Aggregators:</strong> {venueDetails.aggregators.join(', ')}</p>
              </div>
              <div className="text-sm">
                 <p className="flex items-center"><ShieldCheck className="mr-2 h-4 w-4 text-green-500" /> <strong>Hygiene Rating:</strong> {venueDetails.hygieneRating}/5</p>
              </div>
              <div className="text-sm">
                <p className="flex items-center">
                  <Star className="mr-2 h-4 w-4 text-amber-400" /> <strong>Review Score:</strong> {venueDetails.currentReviewScore}
                  {venueDetails.reviewScoreTrend === 'up' && <TrendingUp className="ml-1 h-4 w-4 text-green-500" />}
                  {venueDetails.reviewScoreTrend === 'down' && <ThumbsDown className="ml-1 h-4 w-4 text-red-500" />}
                </p>
              </div>
               <div className="text-sm p-3 bg-muted/50 rounded-md">
                <p className="flex items-center justify-between">
                  <span className="flex items-center"><Clock className="mr-2 h-4 w-4 text-muted-foreground" /> Delivery Time:</span>
                  <span className={`font-semibold ${venueDetails.deliveryTime > venueDetails.areaAverageDeliveryTime ? 'text-destructive' : 'text-green-500'}`}>
                    {venueDetails.deliveryTime} mins
                  </span>
                </p>
                <p className="text-xs text-muted-foreground text-right">(Area Avg: {venueDetails.areaAverageDeliveryTime} mins)</p>
              </div>
              <div className="text-sm p-3 bg-muted/50 rounded-md">
                 <p className="flex items-center justify-between">
                   <span className="flex items-center"><PackageCheck className="mr-2 h-4 w-4 text-muted-foreground" /> Availability:</span>
                   <span className={`font-semibold ${venueDetails.availability < venueDetails.competitorAverageAvailability ? 'text-destructive' : 'text-green-500'}`}>
                    {venueDetails.availability}%
                   </span>
                </p>
                <p className="text-xs text-muted-foreground text-right">(Competitor Avg: {venueDetails.competitorAverageAvailability}%)</p>
              </div>
            </CardContent>
          </Card>

          {/* Detected Issues Card */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="font-headline flex items-center">
                <AlertTriangle className="mr-2 h-6 w-6 text-destructive" />
                Detected Issues
              </CardTitle>
              <CardDescription>Key areas needing attention for {venueDetails.name}.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {detectedIssues.map(issue => (
                <Tooltip key={issue.id}>
                  <TooltipTrigger asChild>
                    <div className="p-3 border rounded-lg hover:bg-muted/30 cursor-help flex items-start gap-3">
                        <span className="mt-0.5">{issue.icon}</span>
                        <div>
                            <p className={`font-semibold ${issue.severity === 'high' ? 'text-destructive' : issue.severity === 'medium' ? 'text-yellow-600 dark:text-yellow-400' : 'text-blue-600 dark:text-blue-400'}`}>
                                {issue.title}
                            </p>
                            <p className="text-xs text-muted-foreground hidden sm:block">{issue.description.length > 80 ? issue.description.substring(0,80) + "..." : issue.description}</p>
                        </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="top" align="start" className="max-w-xs">
                    <p className="font-semibold">{issue.title}</p>
                    <p className="text-sm">{issue.description}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
              {detectedIssues.length === 0 && <p className="text-muted-foreground">No major issues detected currently.</p>}
            </CardContent>
          </Card>
        </div>

        {/* Smart Suggestions Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="font-headline flex items-center">
              <Lightbulb className="mr-2 h-6 w-6 text-accent" />
              Smart Suggestions
            </CardTitle>
            <CardDescription>Ranked fixes to improve performance, based on potential impact.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {smartSuggestions.map(suggestion => (
                <div key={suggestion.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg gap-3">
                  <div className="flex-1">
                    <p className="font-semibold text-foreground flex items-center">
                      {suggestion.icon}
                      {suggestion.text}
                    </p>
                    <p className="text-xs text-muted-foreground ml-6 sm:ml-0">{suggestion.impact}</p>
                  </div>
                  <Button onClick={() => handleSmartSuggestionAction(suggestion)} size="sm" className="w-full sm:w-auto">
                    Take Action
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Simulated Uplift Module Card */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="font-headline flex items-center">
                <BarChartHorizontalBig className="mr-2 h-6 w-6 text-primary" />
                Simulated Uplift
              </CardTitle>
              <CardDescription>Projected performance improvements after implementing top suggestions.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4 text-center">
                <p className="text-2xl font-bold text-green-500">+£360 potential weekly revenue uplift</p>
                <p className="text-sm text-muted-foreground">(Based on projected +60 orders/week and +0.3 rating)</p>
              </div>
              <ChartContainer config={upliftChartConfig} className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={upliftChartData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" tick={{fontSize: 12}} />
                    <YAxis yAxisId="left" stroke="hsl(var(--primary))" tickFormatter={(value) => `£${value/1000}k`} tick={{fontSize: 12}} domain={['auto', 'auto']}/>
                    <YAxis yAxisId="orders" orientation="right" stroke="hsl(var(--accent))" tickFormatter={(value) => `${value}`}  tick={{fontSize: 12}} domain={['auto', 'auto']} />
                    <ChartTooltip
                      content={
                        <ChartTooltipContent
                          formatter={(value, name, props) => {
                            if (name === "currentRevenue" || name === "postFixRevenue") return `£${(value as number).toLocaleString()}`;
                            if (name === "currentRating" || name === "postFixRating") return `${value} ★`;
                            return `${value} orders`;
                          }}
                        />
                      }
                    />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="currentRevenue" stroke="var(--color-currentRevenue)" strokeDasharray="5 5" activeDot={{ r: 6 }} />
                    <Line yAxisId="left" type="monotone" dataKey="postFixRevenue" stroke="var(--color-postFixRevenue)" strokeWidth={2} activeDot={{ r: 8 }} />
                    <Line yAxisId="orders" type="monotone" dataKey="currentOrders" strokeDasharray="5 5" stroke="var(--color-currentOrders)" activeDot={{ r: 6 }} />
                    <Line yAxisId="orders" type="monotone" dataKey="postFixOrders" strokeWidth={2} stroke="var(--color-postFixOrders)" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Auto-Alert Configuration Card */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="font-headline flex items-center">
                <Bell className="mr-2 h-6 w-6 text-primary" />
                Auto-Alert Configuration
              </CardTitle>
              <CardDescription>Manage your automated operational notifications. You'll receive WhatsApp and email alerts.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center h-full">
               <Dialog open={isAlertDialogOpen} onOpenChange={setIsAlertDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full py-6 text-base">
                      <Bell className="mr-2 h-5 w-5" /> Configure Alerts
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[525px]">
                    <DialogHeader>
                      <DialogTitle className="flex items-center">
                        <Bell className="mr-2 h-5 w-5 text-primary" /> Configure Auto-Alerts
                      </DialogTitle>
                      <DialogDescription>
                        Set thresholds for critical operational metrics. You'll receive WhatsApp and email notifications
                        when these limits are breached, helping you take timely action.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-6 py-4 max-h-[60vh] overflow-y-auto pr-2">
                      {/* Average Delivery Time */}
                      <div className="grid grid-cols-3 items-center gap-4">
                        <Label htmlFor="avgDeliveryTimeThreshold" className="col-span-2">
                          Avg. Delivery Time Exceeds
                          <p className="text-xs text-muted-foreground">Alert if avg. delivery time is over X mins.</p>
                        </Label>
                        <div className="flex items-center gap-2">
                          <Input
                            id="avgDeliveryTimeThreshold"
                            type="number"
                            value={alertSettings.avgDeliveryTime.threshold}
                            onChange={(e) => handleAlertSettingChange('avgDeliveryTime', 'threshold', parseInt(e.target.value) || 0)}
                            className="w-20 text-center"
                          />
                          <span className="text-sm text-muted-foreground">min</span>
                        </div>
                      </div>

                      {/* Driver Availability */}
                      <div className="grid grid-cols-3 items-center gap-4">
                        <Label htmlFor="driverAvailabilityThreshold" className="col-span-2">
                          Driver Availability Drops Below
                          <p className="text-xs text-muted-foreground">Alert if available drivers are less than X.</p>
                        </Label>
                         <div className="flex items-center gap-2">
                            <Input
                              id="driverAvailabilityThreshold"
                              type="number"
                              value={alertSettings.driverAvailability.threshold}
                              onChange={(e) => handleAlertSettingChange('driverAvailability', 'threshold', parseInt(e.target.value) || 0)}
                              className="w-20 text-center"
                            />
                             <span className="text-sm text-muted-foreground">drivers</span>
                        </div>
                      </div>

                      {/* Order Queue Congestion */}
                      <div className="grid grid-cols-3 items-center gap-4">
                        <Label htmlFor="orderQueueThreshold" className="col-span-2">
                          Order Queue Exceeds
                           <p className="text-xs text-muted-foreground">Alert if pending orders are more than X.</p>
                        </Label>
                        <div className="flex items-center gap-2">
                            <Input
                              id="orderQueueThreshold"
                              type="number"
                              value={alertSettings.orderQueueCongestion.threshold}
                              onChange={(e) => handleAlertSettingChange('orderQueueCongestion', 'threshold', parseInt(e.target.value) || 0)}
                              className="w-20 text-center"
                            />
                            <span className="text-sm text-muted-foreground">orders</span>
                        </div>
                      </div>
                      
                      {/* Prep Time Spike */}
                      <div className="grid grid-cols-3 items-center gap-4">
                        <Label htmlFor="prepTimeSpikeThreshold" className="col-span-2">
                          Prep Time Spike Exceeds
                          <p className="text-xs text-muted-foreground">Alert if avg. prep time is over X mins.</p>
                        </Label>
                         <div className="flex items-center gap-2">
                            <Input
                              id="prepTimeSpikeThreshold"
                              type="number"
                              value={alertSettings.prepTimeSpike.threshold}
                              onChange={(e) => handleAlertSettingChange('prepTimeSpike', 'threshold', parseInt(e.target.value) || 0)}
                              className="w-20 text-center"
                            />
                            <span className="text-sm text-muted-foreground">min</span>
                        </div>
                      </div>

                      {/* No Orders in X Minutes */}
                      <div className="grid grid-cols-3 items-center gap-4">
                        <Label htmlFor="noOrdersThreshold" className="col-span-2">
                          No Orders For
                          <p className="text-xs text-muted-foreground">Alert if no orders for X mins (during ops).</p>
                        </Label>
                        <div className="flex items-center gap-2">
                            <Input
                              id="noOrdersThreshold"
                              type="number"
                              value={alertSettings.noOrdersInMinutes.threshold}
                              onChange={(e) => handleAlertSettingChange('noOrdersInMinutes', 'threshold', parseInt(e.target.value) || 0)}
                              className="w-20 text-center"
                            />
                            <span className="text-sm text-muted-foreground">min</span>
                        </div>
                      </div>

                      {/* Daily Sales Dip */}
                      <div className="grid grid-cols-3 items-center gap-4">
                        <Label htmlFor="salesDipThreshold" className="col-span-2">
                          Daily Sales Dip Below
                           <p className="text-xs text-muted-foreground">Alert if sales are X% below daily avg.</p>
                        </Label>
                        <div className="flex items-center gap-2">
                            <Input
                              id="salesDipThreshold"
                              type="number"
                              value={alertSettings.dailySalesDip.threshold}
                              onChange={(e) => handleAlertSettingChange('dailySalesDip', 'threshold', parseInt(e.target.value) || 0)}
                              className="w-20 text-center"
                            />
                            <span className="text-sm text-muted-foreground">%</span>
                        </div>
                      </div>

                      {/* POS Disconnected */}
                      <div className="flex items-center justify-between gap-4 pt-2 mt-2 border-t">
                        <Label htmlFor="posDisconnectedAlert" className="flex flex-col">
                          POS Disconnected Alert
                          <span className="text-xs text-muted-foreground">Alert if the Point of Sale system goes offline.</span>
                        </Label>
                        <Switch
                          id="posDisconnectedAlert"
                          checked={alertSettings.posDisconnected.enabled}
                          onCheckedChange={(checked) => handleAlertSettingChange('posDisconnected', 'enabled', checked)}
                        />
                      </div>

                      {/* Printer Offline */}
                      <div className="flex items-center justify-between gap-4 pt-2 mt-2 border-t">
                        <Label htmlFor="printerOfflineAlert" className="flex flex-col">
                          Printer Offline Alert
                           <span className="text-xs text-muted-foreground">Alert if the order printer goes offline.</span>
                        </Label>
                        <Switch
                          id="printerOfflineAlert"
                          checked={alertSettings.printerOffline.enabled}
                          onCheckedChange={(checked) => handleAlertSettingChange('printerOffline', 'enabled', checked)}
                        />
                      </div>

                    </div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button type="button" variant="outline">Cancel</Button>
                      </DialogClose>
                      <Button type="button" onClick={handleSaveAlerts}>Save Settings</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
            </CardContent>
          </Card>
        </div>
        
        {/* Quick Actions Card */}
        <Card>
            <CardHeader>
                <CardTitle className="font-headline flex items-center">
                    <CheckCircle className="mr-2 h-6 w-6 text-green-500" />
                    Quick Actions
                </CardTitle>
                <CardDescription>Central hub for operational tasks related to this venue.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3">
                <Button variant="outline" onClick={() => handleQuickAction('Apply Top Fix')} className="flex-col h-auto py-3">
                    <ThumbsUp className="mb-1 h-5 w-5" /> Apply Top Fix
                </Button>
                <Button variant="outline" onClick={() => handleQuickAction('Send to Ops Team')} className="flex-col h-auto py-3">
                    <Send className="mb-1 h-5 w-5" /> Send to Ops
                </Button>
                <Button variant="outline" onClick={() => handleQuickAction('Export Issue Report')} className="flex-col h-auto py-3">
                    <Download className="mb-1 h-5 w-5" /> Export Report
                </Button>
                <Button variant="outline" onClick={() => handleQuickAction('Log Fix Completion')} className="flex-col h-auto py-3">
                    <ClipboardCheck className="mb-1 h-5 w-5" /> Log Fix
                </Button>
            </CardContent>
        </Card>

      </div>
    </TooltipProvider>
  );
}

