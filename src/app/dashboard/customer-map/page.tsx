
"use client";

import React from 'react';
import { PageHeader } from '@/components/dashboard/page-header';
import { InteractiveHeatmapPlaceholder } from '@/components/dashboard/interactive-heatmap-placeholder';
import { FilterControls } from '@/components/dashboard/filter-controls';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserPlus, Repeat, UserMinus, Ticket, Send } from 'lucide-react';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart as RechartsBarChart, CartesianGrid, XAxis, YAxis, Legend } from "recharts";
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const customerDataByArea = [
  { postcode: "M1 1AA", newCustomers: 150, repeatCustomers: 350, churnRate: "5%" },
  { postcode: "M2 2BB", newCustomers: 200, repeatCustomers: 250, churnRate: "8%" },
  { postcode: "M3 3CC", newCustomers: 100, repeatCustomers: 180, churnRate: "12%" },
  { postcode: "M4 4DD", newCustomers: 250, repeatCustomers: 150, churnRate: "15%" },
];

const atRiskCustomerExamples = [
  { id: "cust1", postcode: "M1 1AA", name: "John D.", lastOrderDaysAgo: 45, phonePreview: "******7890" },
  { id: "cust2", postcode: "M3 3CC", name: "Jane S.", lastOrderDaysAgo: 62, phonePreview: "******1234" },
  { id: "cust3", postcode: "M4 4DD", name: "Alex J.", lastOrderDaysAgo: 95, phonePreview: "******5678" },
  { id: "cust4", postcode: "M2 2BB", name: "Sarah B.", lastOrderDaysAgo: 70, phonePreview: "******3456" },
];

const chartConfig = {
  newCustomers: { label: "New Customers", color: "hsl(var(--chart-1))" }, // Teal variant
  repeatCustomers: { label: "Repeat Customers", color: "hsl(var(--chart-2))" }, // Gold variant
} satisfies ChartConfig;

export default function CustomerMapPage() {
  const { toast } = useToast();

  const handleSendPromoSmS = () => {
    toast({
      title: "Promotional SMS Sent (Simulated)",
      description: `Successfully sent promo codes to ${atRiskCustomerExamples.length} lapsed customers.`,
      action: <ToastAction altText="Dismiss">Dismiss</ToastAction>,
    });
  };

  // Simple component to avoid type error with ToastAction
  const ToastAction = ({ altText, children }: { altText: string, children: React.ReactNode }) => (
    <Button variant="outline" size="sm" asChild>
      <div>{children}</div>
    </Button>
  );


  return (
    <div>
      <PageHeader
        title="Repeat vs. New Customer Map"
        description="Distinguish loyal vs. one-time customers and track retention or churn rates by area."
      />
      <FilterControls onApplyFilters={(filters) => console.log("Applying customer map filters:", filters)} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <InteractiveHeatmapPlaceholder title="Customer Type Distribution" height="500px" dataAiHint="people map customer types" />
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
              {customerDataByArea.slice(0,2).map(area => ( 
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

          <Card>
            <CardHeader>
              <CardTitle className="font-headline flex items-center">
                <UserMinus className="mr-2 h-5 w-5 text-destructive" />
                Engage Lapsed Customers
              </CardTitle>
              <CardDescription>Identify and re-engage customers who haven't ordered recently.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-4">
                <p className="text-sm text-muted-foreground">
                  Consider sending a special offer to customers who haven't ordered in over 40 days.
                </p>
                {atRiskCustomerExamples.slice(0, 3).map(customer => (
                  <div key={customer.id} className="p-3 bg-muted/50 rounded-md text-sm">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-foreground">{customer.name} ({customer.postcode})</span>
                      <span className="text-xs text-destructive">{customer.lastOrderDaysAgo} days ago</span>
                    </div>
                    <p className="text-muted-foreground text-xs">Phone: {customer.phonePreview}</p>
                  </div>
                ))}
                {atRiskCustomerExamples.length > 3 && (
                   <p className="text-xs text-center text-muted-foreground">...and {atRiskCustomerExamples.length - 3} more.</p>
                )}
              </div>
              <Button onClick={handleSendPromoSmS} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                <Send className="mr-2 h-4 w-4" />
                Send Promo SMS to Lapsed Customers
                <Ticket className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
