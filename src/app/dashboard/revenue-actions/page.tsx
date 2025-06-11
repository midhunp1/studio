
"use client";

import React, { useState, useMemo } from 'react';
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
  PowerOff,
  Printer,
  Ban,
  UserX,
  TrendingDown as TrendingDownIcon,
  AlertCircle,
  Smartphone,
  Mail,
  MessageSquare,
} from 'lucide-react';
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"; 
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Legend, ResponsiveContainer, TooltipProps } from "recharts";
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
import { Separator } from '@/components/ui/separator';

const venueDetails = {
  name: 'Speedy Pizza',
  brand: 'Speedy Pizza Co.',
  address: 'ST1 2AB',
  aggregators: ['Foodhub', 'JustEat'],
  hygieneRating: 5,
  currentReviewScore: 4.2,
  reviewScoreTrend: 'up', 
  deliveryTime: 45, 
  areaAverageDeliveryTime: 35, 
  availability: 85, 
  competitorAverageAvailability: 92, 
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
  currentRating: { label: "Current Rating", color: "hsl(var(--muted-foreground))" }, 
  postFixRating: { label: "Post-Fix Rating", color: "hsl(var(--chart-3))" }, 
};

interface AlertSettingDetail {
  enabled: boolean;
  threshold?: number;
  label: string;
  unit?: string;
  description: string;
  icon: React.ElementType;
  notifyWhatsApp: boolean; 
  notifyEmail: boolean;    
}

interface AlertSettings {
  avgDeliveryTime: AlertSettingDetail;
  driverAvailability: AlertSettingDetail;
  orderQueueCongestion: AlertSettingDetail;
  prepTimeSpike: AlertSettingDetail;
  noOrdersInMinutes: AlertSettingDetail;
  dailySalesDip: AlertSettingDetail;
  posDisconnected: Omit<AlertSettingDetail, 'threshold' | 'unit'>;
  printerOffline: Omit<AlertSettingDetail, 'threshold' | 'unit'>;
}

const CustomUpliftTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    const dataPoint = payload[0].payload;
    const isDivergent = 
      dataPoint.currentRevenue !== dataPoint.postFixRevenue ||
      dataPoint.currentOrders !== dataPoint.postFixOrders ||
      dataPoint.currentRating !== dataPoint.postFixRating;

    return (
      <div className="rounded-lg border bg-background p-2.5 shadow-xl text-xs">
        <p className="mb-1.5 font-medium text-foreground">{label}</p>
        {isDivergent ? (
          <>
            <div className="mb-2">
              <p className="font-semibold text-muted-foreground">Without Action:</p>
              <p className="text-muted-foreground">Revenue: £{dataPoint.currentRevenue?.toLocaleString()}</p>
              <p className="text-muted-foreground">Orders: {dataPoint.currentOrders?.toLocaleString()}</p>
              <p className="text-muted-foreground">Rating: {dataPoint.currentRating} ★</p>
            </div>
            <div>
              <p className="font-semibold text-primary">With Action (Projected):</p>
              <p className="text-primary-foreground bg-primary/80 px-1 rounded-sm inline-block">Revenue: £{dataPoint.postFixRevenue?.toLocaleString()}</p>
              <p className="text-accent-foreground bg-accent/80 px-1 rounded-sm inline-block mt-0.5">Orders: {dataPoint.postFixOrders?.toLocaleString()}</p>
              <p className="text-foreground mt-0.5">Rating: {dataPoint.postFixRating} ★</p>
            </div>
          </>
        ) : (
          <>
            <p className="text-foreground">Revenue: £{dataPoint.currentRevenue?.toLocaleString()}</p>
            <p className="text-foreground">Orders: {dataPoint.currentOrders?.toLocaleString()}</p>
            <p className="text-foreground">Rating: {dataPoint.currentRating} ★</p>
          </>
        )}
      </div>
    );
  }
  return null;
};


export default function RevenueActionsPageRevamped() {
  const { toast } = useToast();
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
  const [whatsAppNumberInput, setWhatsAppNumberInput] = useState<string>("+447012345678");
  const [emailAddressInput, setEmailAddressInput] = useState<string>("manager@example.com");

  const [alertSettings, setAlertSettings] = useState<AlertSettings>({
    avgDeliveryTime: { enabled: true, threshold: 45, label: "Avg. Delivery Time", unit: "min", description: "Alert if avg. delivery time exceeds set minutes.", icon: Clock, notifyWhatsApp: true, notifyEmail: false },
    driverAvailability: { enabled: true, threshold: 2, label: "Driver Availability", unit: "drivers", description: "Alert if available drivers drop below set number.", icon: UserX, notifyWhatsApp: false, notifyEmail: true },
    orderQueueCongestion: { enabled: true, threshold: 10, label: "Order Queue Congestion", unit: "orders", description: "Alert if pending orders exceed set count.", icon: Layers, notifyWhatsApp: true, notifyEmail: true },
    prepTimeSpike: { enabled: true, threshold: 15, label: "Prep Time Spike", unit: "min", description: "Alert if avg. prep time exceeds set minutes.", icon: AlertTriangle, notifyWhatsApp: false, notifyEmail: false },
    noOrdersInMinutes: { enabled: true, threshold: 30, label: "No Orders", unit: "min", description: "Alert if no orders for set minutes (during ops hours).", icon: Ban, notifyWhatsApp: true, notifyEmail: false },
    dailySalesDip: { enabled: true, threshold: 20, label: "Daily Sales Dip", unit: "%", description: "Alert if sales are set % below daily average.", icon: TrendingDownIcon, notifyWhatsApp: true, notifyEmail: true },
    posDisconnected: { enabled: true, label: "POS Disconnected", description: "Alert if Point of Sale system goes offline.", icon: PowerOff, notifyWhatsApp: true, notifyEmail: true },
    printerOffline: { enabled: true, label: "Printer Offline", description: "Alert if order printer goes offline.", icon: Printer, notifyWhatsApp: true, notifyEmail: false },
  });

  const handleAlertSettingChange = (
    key: keyof AlertSettings,
    field: 'threshold' | 'enabled' | 'notifyWhatsApp' | 'notifyEmail',
    value: number | boolean
  ) => {
    setAlertSettings(prev => {
      const currentSetting = prev[key];
      let updatedValue: number | boolean = value;

      if (field === 'threshold' && 'threshold' in currentSetting) {
        updatedValue = Number(value);
        return { ...prev, [key]: { ...currentSetting, threshold: updatedValue as number } };
      } else if (field === 'enabled' || field === 'notifyWhatsApp' || field === 'notifyEmail') {
         return { ...prev, [key]: { ...currentSetting, [field]: updatedValue as boolean } };
      }
      return prev; 
    });
  };

  const handleSaveAlerts = () => {
    // In a real app, you'd save whatsAppNumberInput and emailAddressInput too
    toast({
      title: "Alert Settings Saved (Simulated)",
      description: "Your auto-alert and notification preferences have been updated.",
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

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="font-headline flex items-center">
                <AlertCircle className="mr-2 h-6 w-6 text-destructive" />
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
                    <ChartTooltip content={<CustomUpliftTooltip />} />
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

          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="font-headline flex items-center">
                <Bell className="mr-2 h-6 w-6 text-primary" />
                Auto-Alert Configuration
              </CardTitle>
              <CardDescription>Live alert settings. Click below to modify specific alert thresholds and notification channels.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <ul className="space-y-2 text-sm max-h-[180px] overflow-y-auto pr-2 mb-3">
                {Object.entries(alertSettings).map(([key, setting]) => {
                  const Icon = setting.icon;
                  const thresholdText = 'threshold' in setting ? `${setting.threshold} ${setting.unit || ''}` : 'Enabled';
                  return (
                    <li key={key} className="flex items-center justify-between p-2 bg-muted/30 rounded-md">
                      <div className="flex items-center">
                        <Icon className={`mr-2 h-4 w-4 ${setting.enabled ? 'text-primary' : 'text-muted-foreground'}`} />
                        <span className={`${setting.enabled ? 'text-foreground' : 'text-muted-foreground'}`}>{setting.label}:</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {setting.enabled && setting.notifyWhatsApp && <MessageSquare className="h-3 w-3 text-green-500" />}
                        {setting.enabled && setting.notifyEmail && <Mail className="h-3 w-3 text-blue-500" />}
                        <Badge variant={setting.enabled ? 'default' : 'secondary'} className={`text-xs ${setting.enabled ? 'bg-primary/20 text-primary-foreground border-primary/30' : ''}`}>
                          {setting.enabled ? thresholdText : 'Disabled'}
                        </Badge>
                      </div>
                    </li>
                  );
                })}
              </ul>
              <Dialog open={isAlertDialogOpen} onOpenChange={setIsAlertDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full">
                    <Bell className="mr-2 h-4 w-4" /> Configure Alert Details
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="flex items-center">
                      <Bell className="mr-2 h-5 w-5 text-primary" /> Configure Alert Details
                    </DialogTitle>
                    <DialogDescription>
                      Set thresholds and enable/disable specific alert notifications. Contact details are managed on the main page.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4 max-h-[65vh] overflow-y-auto pr-3">
                    {Object.entries(alertSettings).map(([key, setting]) => {
                      const typedKey = key as keyof AlertSettings;
                      const Icon = setting.icon;
                       return (
                        <div key={key} className="space-y-3 p-4 border rounded-md shadow-sm">
                          <div className="flex items-center justify-between">
                            <Label htmlFor={`${key}-enabled`} className="flex items-center gap-2 text-base font-semibold">
                              <Icon className="h-5 w-5 text-primary" />
                              {setting.label}
                            </Label>
                            <Switch
                              id={`${key}-enabled`}
                              checked={setting.enabled}
                              onCheckedChange={(checked) => handleAlertSettingChange(typedKey, 'enabled', checked)}
                            />
                          </div>
                          <p className="text-xs text-muted-foreground pl-7">{setting.description}</p>
                          
                          {'threshold' in setting && (
                            <div className={`pl-7 mt-2 ${!setting.enabled ? 'opacity-50 pointer-events-none' : ''}`}>
                              <Label htmlFor={`${key}-threshold`} className="text-xs text-muted-foreground">
                                Threshold ({setting.unit})
                              </Label>
                              <Input
                                id={`${key}-threshold`}
                                type="number"
                                value={setting.threshold}
                                onChange={(e) => handleAlertSettingChange(typedKey, 'threshold', parseInt(e.target.value) || 0)}
                                className="w-full text-sm mt-1"
                                disabled={!setting.enabled}
                              />
                            </div>
                          )}

                          <div className={`pl-7 mt-3 space-y-2 ${!setting.enabled ? 'opacity-50 pointer-events-none' : ''}`}>
                             <p className="text-xs text-muted-foreground">Notify via:</p>
                             <div className="flex items-center gap-6">
                                <div className="flex items-center space-x-2">
                                  <Switch
                                    id={`${key}-notifyWhatsApp`}
                                    checked={setting.notifyWhatsApp}
                                    onCheckedChange={(checked) => handleAlertSettingChange(typedKey, 'notifyWhatsApp', checked)}
                                    disabled={!setting.enabled}
                                  />
                                  <Label htmlFor={`${key}-notifyWhatsApp`} className="flex items-center text-sm">
                                    <MessageSquare className="mr-1.5 h-4 w-4 text-green-600" /> WhatsApp
                                  </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Switch
                                    id={`${key}-notifyEmail`}
                                    checked={setting.notifyEmail}
                                    onCheckedChange={(checked) => handleAlertSettingChange(typedKey, 'notifyEmail', checked)}
                                    disabled={!setting.enabled}
                                  />
                                  <Label htmlFor={`${key}-notifyEmail`} className="flex items-center text-sm">
                                     <Mail className="mr-1.5 h-4 w-4 text-blue-600" /> Email
                                  </Label>
                                </div>
                              </div>
                          </div>
                        </div>
                       );
                    })}
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button type="button" variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button type="button" onClick={handleSaveAlerts}>Save Settings</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Separator className="my-4" />
              <div className="space-y-3">
                <div>
                  <Label htmlFor="whatsapp-number" className="text-sm font-medium flex items-center mb-1">
                    <Smartphone className="mr-2 h-4 w-4 text-primary" /> WhatsApp Notification Number
                  </Label>
                  <Input
                    id="whatsapp-number"
                    type="tel"
                    placeholder="+12345678900"
                    value={whatsAppNumberInput}
                    onChange={(e) => setWhatsAppNumberInput(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="email-address" className="text-sm font-medium flex items-center mb-1">
                    <Mail className="mr-2 h-4 w-4 text-primary" /> Email Notification Address
                  </Label>
                  <Input
                    id="email-address"
                    type="email"
                    placeholder="alerts@example.com"
                    value={emailAddressInput}
                    onChange={(e) => setEmailAddressInput(e.target.value)}
                  />
                </div>
                 {/* Consider adding a "Save Contacts" button here if needed */}
              </div>
            </CardContent>
          </Card>
        </div>
        
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

