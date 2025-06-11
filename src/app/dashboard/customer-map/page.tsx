
"use client";

import React, { useState, useMemo } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { PageHeader } from '@/components/dashboard/page-header';
import { InteractiveHeatmapPlaceholder } from '@/components/dashboard/interactive-heatmap-placeholder';
import { FilterControls } from '@/components/dashboard/filter-controls';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserPlus, Repeat, UserMinus, Ticket, Send, Edit3, Eye, ShoppingBag, TrendingUp as TrendingUpIcon, CalendarDays, DollarSign, MessageSquare, Mail } from 'lucide-react';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart as RechartsBarChart, CartesianGrid, XAxis, YAxis, Legend } from "recharts";
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';


const customerDataByArea = [
  { postcode: "M1 1AA", newCustomers: 150, repeatCustomers: 350, churnRate: "5%" },
  { postcode: "M2 2BB", newCustomers: 200, repeatCustomers: 250, churnRate: "8%" },
  { postcode: "M3 3CC", newCustomers: 100, repeatCustomers: 180, churnRate: "12%" },
  { postcode: "M4 4DD", newCustomers: 250, repeatCustomers: 150, churnRate: "15%" },
];

const atRiskCustomerExamples = [
  { id: "cust1", postcode: "M1 1AA", name: "John D.", lastOrderDaysAgo: 45, phone: "+447700900101", email: "john.d@example.com", phonePreview: "******0101" },
  { id: "cust2", postcode: "M3 3CC", name: "Jane S.", lastOrderDaysAgo: 62, phone: "+447700900102", email: "jane.s@example.com", phonePreview: "******0102" },
  { id: "cust3", postcode: "M4 4DD", name: "Alex J.", lastOrderDaysAgo: 95, phone: "+447700900103", email: "alex.j@example.net", phonePreview: "******0103" },
  { id: "cust4", postcode: "M2 2BB", name: "Sarah B.", lastOrderDaysAgo: 70, phone: "+447700900104", email: "s.brown@example.org", phonePreview: "******0104" },
  { id: "cust5", postcode: "M1 1AA", name: "Mike L.", lastOrderDaysAgo: 50, phone: "+447700900105", phonePreview: "******0105" }, // Example without email
];

const chartConfig = {
  newCustomers: { label: "New Customers", color: "hsl(var(--chart-1))" }, 
  repeatCustomers: { label: "Repeat Customers", color: "hsl(var(--chart-2))" }, 
} satisfies ChartConfig;

const initialCoupons = [
  { id: "SAVE15", name: "15% Off Next Order", code: "SAVE15NOW" },
  { id: "FREEFRIES", name: "Free Fries with Purchase", code: "GETFRIES" },
  { id: "20OFF50", name: "£20 Off Orders over £50", code: "BIGSAVE20" },
];

const smsTemplates = [
  { id: "miss_you_coupon", name: "We Miss You (Coupon)", content: "Hi [Customer Name]! We've missed you at OrderLens. Enjoy {couponDescription} (Code: {couponCode}) on your next order!" },
  { id: "new_offer_alert", name: "New Offer Alert", content: "Great news, [Customer Name]! OrderLens has a new offer: {couponDescription} (Code: {couponCode}). Don't miss out!" },
  { id: "come_back_special", name: "Come Back Special", content: "Hey [Customer Name], it's been a while! Treat yourself with {couponDescription} using code {couponCode} at OrderLens." },
];

const customerSegmentData = {
  newCustomers: {
    count: customerDataByArea.reduce((sum, area) => sum + area.newCustomers, 0),
    topCategories: ["Pizzas", "Burgers", "Soft Drinks"],
    avgOrderValue: 18.50,
  },
  repeatCustomers: {
    count: customerDataByArea.reduce((sum, area) => sum + area.repeatCustomers, 0),
    topCategories: ["Curries", "Rice Dishes", "Sides"],
    avgOrderValue: 25.75,
  },
  overall: {
    mostActiveDay: "Friday",
    totalCustomers: customerDataByArea.reduce((sum, area) => sum + area.newCustomers + area.repeatCustomers, 0),
  }
};

const newCouponSchema = z.object({
  name: z.string().min(3, "Coupon name must be at least 3 characters.").max(50, "Coupon name too long."),
  code: z.string().min(3, "Code must be at least 3 characters.").max(20, "Code too long.").regex(/^[A-Z0-9]+$/, "Code must be uppercase alphanumeric (e.g., SAVE10)."),
});
type NewCouponFormValues = z.infer<typeof newCouponSchema>;


export default function CustomerMapPage() {
  const { toast } = useToast();
  const [coupons, setCoupons] = useState(initialCoupons);
  const [selectedCouponId, setSelectedCouponId] = useState<string>(coupons[0]?.id || "");
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(smsTemplates[0]?.id || "");
  const [isCreateCouponDialogOpen, setIsCreateCouponDialogOpen] = useState(false);

  const newCouponForm = useForm<NewCouponFormValues>({
    resolver: zodResolver(newCouponSchema),
    defaultValues: { name: "", code: "" },
  });

  const selectedCoupon = useMemo(() => {
    return coupons.find(c => c.id === selectedCouponId);
  }, [selectedCouponId, coupons]);

  const formattedSmsTemplate = useMemo(() => {
    const currentTemplate = smsTemplates.find(t => t.id === selectedTemplateId);
    if (!currentTemplate) {
      return "Select a template and coupon to see the preview.";
    }

    let templateContent = currentTemplate.content;
    if (selectedCoupon) {
      templateContent = templateContent.replace(/{couponDescription}/g, selectedCoupon.name);
      templateContent = templateContent.replace(/{couponCode}/g, selectedCoupon.code);
    } else {
      templateContent = templateContent.replace(/{couponDescription}/g, "a special discount");
      templateContent = templateContent.replace(/{couponCode}/g, "SPECIALOFFER");
    }
    return templateContent.replace(/\[Customer Name\]/g, "Valued Customer"); 
  }, [selectedTemplateId, selectedCoupon, smsTemplates]);

  const handleSendPromotion = () => {
    const couponDescription = selectedCoupon ? selectedCoupon.name : "a special discount";
    toast({
      title: "Promotion Sent (Simulated)",
      description: `Successfully sent promotion for "${couponDescription}" to ${atRiskCustomerExamples.length} lapsed customers.`,
      action: <ToastAction altText="Dismiss">Dismiss</ToastAction>,
    });
  };

  const onSubmitNewCoupon: SubmitHandler<NewCouponFormValues> = (data) => {
    const newCoupon = {
      id: data.code, 
      name: data.name,
      code: data.code,
    };
    setCoupons(prevCoupons => [...prevCoupons, newCoupon]);
    setSelectedCouponId(newCoupon.id); 
    toast({
      title: "Coupon Created!",
      description: `Coupon "${newCoupon.name}" with code "${newCoupon.code}" has been added.`,
    });
    newCouponForm.reset();
    setIsCreateCouponDialogOpen(false);
  };


  const handleEditTemplate = () => {
     toast({
      title: "Edit SMS Template",
      description: "SMS template editing functionality will be available here.",
      variant: "default",
    });
  };

  const handlePreviewSms = () => {
    toast({
      title: "SMS Preview",
      description: <pre className="whitespace-pre-wrap text-xs">{formattedSmsTemplate}</pre>,
      duration: 9000, 
    });
  };

  
  const ToastAction = ({ altText, children }: { altText: string, children: React.ReactNode }) => (
    <Button variant="outline" size="sm" asChild>
      <div>{children}</div>
    </Button>
  );


  return (
    <TooltipProvider>
      <div>
        <PageHeader
          title="Repeat vs. New Customer Map"
          description="Distinguish loyal vs. one-time customers and track retention or churn rates by area."
        />
        <FilterControls onApplyFilters={(filters) => console.log("Applying customer map filters:", filters)} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <InteractiveHeatmapPlaceholder title="Customer Type Distribution" height="500px" dataAiHint="customer distribution map" />
            <Card>
              <CardHeader>
                <CardTitle className="font-headline flex items-center">
                  <TrendingUpIcon className="mr-2 h-6 w-6 text-primary" />
                  Customer Segments Overview
                </CardTitle>
                <CardDescription>Insights into new and repeat customer behaviors.</CardDescription>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4 p-4 border rounded-lg bg-card shadow-sm">
                  <h3 className="text-lg font-semibold flex items-center text-primary">
                    <UserPlus className="mr-2 h-5 w-5" /> New Customers ({customerSegmentData.newCustomers.count})
                  </h3>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground flex items-center">
                      <ShoppingBag className="mr-2 h-4 w-4 text-accent" /> Top Categories:
                    </p>
                    <ul className="list-disc list-inside text-sm ml-4">
                      {customerSegmentData.newCustomers.topCategories.map(cat => <li key={`new-${cat}`}>{cat}</li>)}
                    </ul>
                  </div>
                  <p className="text-sm flex items-center">
                    <DollarSign className="mr-2 h-4 w-4 text-green-500" />
                    Avg. Order Value: <span className="font-semibold ml-1">£{customerSegmentData.newCustomers.avgOrderValue.toFixed(2)}</span>
                  </p>
                </div>

                <div className="space-y-4 p-4 border rounded-lg bg-card shadow-sm">
                  <h3 className="text-lg font-semibold flex items-center text-primary">
                    <Repeat className="mr-2 h-5 w-5" /> Repeat Customers ({customerSegmentData.repeatCustomers.count})
                  </h3>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground flex items-center">
                      <ShoppingBag className="mr-2 h-4 w-4 text-accent" /> Top Categories:
                    </p>
                    <ul className="list-disc list-inside text-sm ml-4">
                      {customerSegmentData.repeatCustomers.topCategories.map(cat => <li key={`repeat-${cat}`}>{cat}</li>)}
                    </ul>
                  </div>
                  <p className="text-sm flex items-center">
                     <DollarSign className="mr-2 h-4 w-4 text-green-500" />
                    Avg. Order Value: <span className="font-semibold ml-1">£{customerSegmentData.repeatCustomers.avgOrderValue.toFixed(2)}</span>
                  </p>
                </div>
                
                <div className="md:col-span-2 mt-2 p-4 border rounded-lg bg-muted/50">
                   <h3 className="text-lg font-semibold flex items-center text-foreground mb-2">
                    <Users className="mr-2 h-5 w-5 text-primary" /> General Insights
                  </h3>
                  <p className="text-sm flex items-center">
                    <CalendarDays className="mr-2 h-4 w-4 text-accent" />
                    Most Active Day Overall: <span className="font-semibold ml-1">{customerSegmentData.overall.mostActiveDay}</span>
                  </p>
                   <p className="text-sm flex items-center mt-1">
                    <Users className="mr-2 h-4 w-4 text-primary" />
                    Total Unique Customers Profiled: <span className="font-semibold ml-1">{customerSegmentData.overall.totalCustomers}</span>
                  </p>
                </div>
              </CardContent>
            </Card>
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
                {customerDataByArea.map(area => ( 
                  <div key={area.postcode} className="p-3 bg-muted/30 rounded-lg">
                    <h4 className="font-semibold text-primary">{area.postcode}</h4>
                    <p className="text-sm">
                      <UserPlus className="inline h-4 w-4 mr-1 text-primary" /> New: {area.newCustomers} | 
                      <Repeat className="inline h-4 w-4 ml-2 mr-1 text-accent" /> Repeat: {area.repeatCustomers}
                    </p>
                    <p className="text-sm text-muted-foreground">Churn Rate: {area.churnRate}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
        
        <Card className="mt-6"> 
          <CardHeader>
            <CardTitle className="font-headline flex items-center">
              <UserMinus className="mr-2 h-5 w-5 text-destructive" />
              Engage Lapsed Customers
            </CardTitle>
            <CardDescription>Identify and re-engage customers who haven't ordered recently with targeted promotions. Select a template and coupon below.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Showing {atRiskCustomerExamples.slice(0, 3).length} customers who haven't ordered in over 40 days.
              </p>
              {atRiskCustomerExamples.slice(0, 3).map(customer => (
                <div key={customer.id} className="p-3 bg-muted/50 rounded-md text-sm border border-border">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-foreground">{customer.name} ({customer.postcode})</span>
                    <span className="text-xs text-destructive">{customer.lastOrderDaysAgo} days ago</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    {customer.phone && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="flex items-center gap-1 cursor-default">
                            <MessageSquare className="h-3.5 w-3.5 text-green-500" /> {customer.phonePreview}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Phone: {customer.phone}</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                    {customer.email && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="flex items-center gap-1 cursor-default">
                            <Mail className="h-3.5 w-3.5 text-blue-500" /> 
                            {customer.email.length > 15 ? `${customer.email.substring(0,customer.email.indexOf('@') > 12 ? 12 : customer.email.indexOf('@'))}...` : customer.email}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Email: {customer.email}</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                    {!customer.phone && !customer.email && (
                        <span>No contact details</span>
                    )}
                  </div>
                </div>
              ))}
              {atRiskCustomerExamples.length > 3 && (
                  <p className="text-xs text-center text-muted-foreground">...and {atRiskCustomerExamples.length - 3} more.</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-border pt-6">
              <div className="space-y-4">
                 <div>
                  <Label htmlFor="sms-template-select" className="font-semibold flex items-center">
                    <MessageSquare className="mr-2 h-4 w-4 text-primary" /> Choose Content Template
                  </Label>
                  <Select value={selectedTemplateId} onValueChange={setSelectedTemplateId}>
                    <SelectTrigger id="sms-template-select" className="mt-1">
                      <SelectValue placeholder="Select a template" />
                    </SelectTrigger>
                    <SelectContent>
                      {smsTemplates.map(template => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="coupon-select" className="font-semibold flex items-center">
                    <Ticket className="mr-2 h-4 w-4 text-primary" /> Choose Coupon
                  </Label>
                  <Select value={selectedCouponId} onValueChange={setSelectedCouponId}>
                    <SelectTrigger id="coupon-select" className="mt-1">
                      <SelectValue placeholder="Select a coupon" />
                    </SelectTrigger>
                    <SelectContent>
                      {coupons.map(coupon => (
                        <SelectItem key={coupon.id} value={coupon.id}>
                          {coupon.name} ({coupon.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                 <Dialog open={isCreateCouponDialogOpen} onOpenChange={setIsCreateCouponDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full">
                      <Ticket className="mr-2 h-4 w-4" /> Create New Coupon
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Create New Coupon</DialogTitle>
                      <DialogDescription>
                        Add a new promotional coupon. Click save when you're done.
                      </DialogDescription>
                    </DialogHeader>
                    <Form {...newCouponForm}>
                      <form onSubmit={newCouponForm.handleSubmit(onSubmitNewCoupon)} className="space-y-4 py-4">
                        <FormField
                          control={newCouponForm.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Coupon Name</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., Summer Discount 10%" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={newCouponForm.control}
                          name="code"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Coupon Code</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., SUMMER10" {...field} />
                              </FormControl>
                               <FormDescription>Must be uppercase alphanumeric.</FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button type="button" variant="outline">Cancel</Button>
                          </DialogClose>
                          <Button type="submit" disabled={newCouponForm.formState.isSubmitting}>
                            {newCouponForm.formState.isSubmitting ? "Saving..." : "Save Coupon"}
                          </Button>
                        </DialogFooter>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="sms-template-preview" className="font-semibold">Content Preview</Label>
                  <Textarea
                    id="sms-template-preview"
                    value={formattedSmsTemplate}
                    readOnly
                    rows={5}
                    className="mt-1 bg-muted/30 text-sm"
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleEditTemplate} variant="outline" className="flex-1">
                    <Edit3 className="mr-2 h-4 w-4" /> Edit
                  </Button>
                  <Button onClick={handlePreviewSms} variant="outline" className="flex-1">
                    <Eye className="mr-2 h-4 w-4" /> Preview
                  </Button>
                </div>
              </div>
            </div>
            
            <Button onClick={handleSendPromotion} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground whitespace-normal h-auto py-3 text-base mt-4">
              <Send className="mr-2 h-5 w-5" />
              Send Promotion to {atRiskCustomerExamples.length} Lapsed Customers
              <Ticket className="ml-2 h-5 w-5" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
}

