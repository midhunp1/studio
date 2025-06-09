
"use client";

import React, { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { PageHeader } from '@/components/dashboard/page-header';
import { AISuggestionCard } from '@/components/dashboard/ai-suggestion-card';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';

import { generateComboSuggestion, type GenerateComboSuggestionOutput } from '@/ai/flows/generate-combo-suggestion';
import { generateAdBoostTimeSuggestion, type GenerateAdBoostTimeSuggestionOutput } from '@/ai/flows/generate-insight';
import { Brain } from 'lucide-react';

const comboSuggestionSchema = z.object({
  area: z.string().min(1, "Area is required (e.g., postcode or neighborhood)"),
  salesData: z.string().min(10, "Sales data is required (e.g., list of popular items, order trends)"),
});
type ComboSuggestionFormValues = z.infer<typeof comboSuggestionSchema>;

const adBoostSchema = z.object({
  postcode: z.string().min(1, "Postcode is required"),
  order1_date: z.string().optional(),
  order1_time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time (HH:MM)").optional(),
  order1_value: z.coerce.number().positive("Value must be positive").optional(),
  order2_date: z.string().optional(),
  order2_time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time (HH:MM)").optional(),
  order2_value: z.coerce.number().positive("Value must be positive").optional(),
  order3_date: z.string().optional(),
  order3_time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time (HH:MM)").optional(),
  order3_value: z.coerce.number().positive("Value must be positive").optional(),
})
.refine(data => !(data.order1_date && (!data.order1_time || data.order1_value === undefined || isNaN(data.order1_value))), {
  path: ["order1_date"], // Or a more general path / message
  message: "If Order 1 Date is filled, Time and Value are also required.",
})
.refine(data => !(data.order2_date && (!data.order2_time || data.order2_value === undefined || isNaN(data.order2_value))), {
  path: ["order2_date"],
  message: "If Order 2 Date is filled, Time and Value are also required.",
})
.refine(data => !(data.order3_date && (!data.order3_time || data.order3_value === undefined || isNaN(data.order3_value))), {
  path: ["order3_date"],
  message: "If Order 3 Date is filled, Time and Value are also required.",
});

type AdBoostFormValues = z.infer<typeof adBoostSchema>;

export default function AISuggestionsPage() {
  const { toast } = useToast();
  const [comboResult, setComboResult] = useState<GenerateComboSuggestionOutput | null>(null);
  const [comboError, setComboError] = useState<string | null>(null);
  const [adBoostResult, setAdBoostResult] = useState<GenerateAdBoostTimeSuggestionOutput | null>(null);
  const [adBoostError, setAdBoostError] = useState<string | null>(null);

  const comboForm = useForm<ComboSuggestionFormValues>({
    resolver: zodResolver(comboSuggestionSchema),
    defaultValues: { area: "", salesData: "" },
  });

  const adBoostForm = useForm<AdBoostFormValues>({
    resolver: zodResolver(adBoostSchema),
    defaultValues: {
      postcode: "",
      order1_date: "", order1_time: "", order1_value: undefined,
      order2_date: "", order2_time: "", order2_value: undefined,
      order3_date: "", order3_time: "", order3_value: undefined,
    },
  });

  const onComboSubmit: SubmitHandler<ComboSuggestionFormValues> = async (data) => {
    setComboError(null);
    setComboResult(null);
    try {
      const result = await generateComboSuggestion(data);
      setComboResult(result);
      toast({ title: "Combo Suggestion Generated!", description: "Check the card below for details." });
    } catch (error) {
      console.error("Error generating combo suggestion:", error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      setComboError(errorMessage);
      toast({ variant: "destructive", title: "Error", description: `Failed to generate combo suggestion: ${errorMessage}` });
    }
  };

  const onAdBoostSubmit: SubmitHandler<AdBoostFormValues> = async (formData) => {
    setAdBoostError(null);
    setAdBoostResult(null);

    const orders = [];
    const processOrder = (dateStr?: string, timeStr?: string, value?: number) => {
      if (dateStr && timeStr && value !== undefined && !isNaN(value) && value > 0) {
        // Construct timestamp in YYYY-MM-DDTHH:MM:SS format (AI might be flexible)
        // For simplicity, not adding 'Z' or handling timezones explicitly here.
        orders.push({ timestamp: `${dateStr}T${timeStr}:00`, value });
      }
    };

    processOrder(formData.order1_date, formData.order1_time, formData.order1_value);
    processOrder(formData.order2_date, formData.order2_time, formData.order2_value);
    processOrder(formData.order3_date, formData.order3_time, formData.order3_value);

    if (orders.length === 0) {
      const errMessage = "Please provide at least one complete order entry (date, time, and value).";
      setAdBoostError(errMessage);
      toast({ variant: "destructive", title: "Input Error", description: errMessage });
      adBoostForm.trigger(); // Re-trigger validation to show specific field errors if `refine` caught them
      return;
    }

    const orderDataJSON = JSON.stringify(orders);

    try {
      const result = await generateAdBoostTimeSuggestion({ postcode: formData.postcode, orderData: orderDataJSON });
      setAdBoostResult(result);
      toast({ title: "Ad Boost Suggestion Generated!", description: "Check the card below for details." });
    } catch (error) {
      console.error("Error generating ad boost suggestion:", error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      setAdBoostError(errorMessage);
      toast({ variant: "destructive", title: "Error", description: `Failed to generate ad boost suggestion: ${errorMessage}` });
    }
  };

  return (
    <div>
      <PageHeader
        title="AI-Powered Suggestions"
        description="Get smart insights like ad boost times and combo meal ideas."
      />

      <div className="grid md:grid-cols-2 gap-8">
        {/* Combo Suggestion Form and Card */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Generate Combo Meal Suggestion</CardTitle>
              <CardDescription>Input area and sales data to get a tailored combo meal idea.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...comboForm}>
                <form onSubmit={comboForm.handleSubmit(onComboSubmit)} className="space-y-4">
                  <FormField
                    control={comboForm.control}
                    name="area"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Area (Postcode/Neighborhood)</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., M1 2AB or Downtown" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={comboForm.control}
                    name="salesData"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sales Data</FormLabel>
                        <FormControl>
                          <Textarea placeholder="e.g., Popular items: Pizza, Burgers. Peak time: Evenings." {...field} rows={4} />
                        </FormControl>
                        <FormDescription>Describe sales trends, popular items, customer preferences for this area.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={comboForm.formState.isSubmitting} className="w-full bg-primary hover:bg-primary/90">
                    {comboForm.formState.isSubmitting ? "Generating..." : "Generate Combo Suggestion"}
                    <Brain className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
          <AISuggestionCard
            title="Combo Meal Suggestion"
            suggestion={comboResult?.comboSuggestion}
            reasoning={comboResult?.reasoning}
            isLoading={comboForm.formState.isSubmitting}
            error={comboError}
          />
        </div>

        {/* Ad Boost Suggestion Form and Card */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Suggest Ad Boost Time</CardTitle>
              <CardDescription>Input postcode and sample order data (up to 3 entries) to find the optimal time for an ad boost.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...adBoostForm}>
                <form onSubmit={adBoostForm.handleSubmit(onAdBoostSubmit)} className="space-y-6">
                  <FormField
                    control={adBoostForm.control}
                    name="postcode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Postcode</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., SW1A 1AA" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormDescription>Enter up to 3 sample orders. Date, Time (HH:MM), and Value are required for each entered order.</FormDescription>

                  {/* Order Entry 1 */}
                  <div className="space-y-3 p-4 border rounded-md">
                    <h4 className="text-sm font-medium text-muted-foreground">Order 1</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <FormField control={adBoostForm.control} name="order1_date" render={({ field }) => (
                        <FormItem> <FormLabel>Date</FormLabel> <FormControl><Input type="date" {...field} /></FormControl> <FormMessage /> </FormItem>
                      )}/>
                      <FormField control={adBoostForm.control} name="order1_time" render={({ field }) => (
                        <FormItem> <FormLabel>Time (HH:MM)</FormLabel> <FormControl><Input type="time" {...field} /></FormControl> <FormMessage /> </FormItem>
                      )}/>
                      <FormField control={adBoostForm.control} name="order1_value" render={({ field }) => (
                        <FormItem> <FormLabel>Value (£)</FormLabel> <FormControl><Input type="number" step="0.01" placeholder="e.g., 25.50" {...field} onChange={e => field.onChange(e.target.value === '' ? undefined : parseFloat(e.target.value))} /></FormControl> <FormMessage /> </FormItem>
                      )}/>
                    </div>
                  </div>

                  {/* Order Entry 2 */}
                   <div className="space-y-3 p-4 border rounded-md">
                    <h4 className="text-sm font-medium text-muted-foreground">Order 2 (Optional)</h4>
                     <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <FormField control={adBoostForm.control} name="order2_date" render={({ field }) => (
                        <FormItem> <FormLabel>Date</FormLabel> <FormControl><Input type="date" {...field} /></FormControl> <FormMessage /> </FormItem>
                      )}/>
                      <FormField control={adBoostForm.control} name="order2_time" render={({ field }) => (
                        <FormItem> <FormLabel>Time (HH:MM)</FormLabel> <FormControl><Input type="time" {...field} /></FormControl> <FormMessage /> </FormItem>
                      )}/>
                      <FormField control={adBoostForm.control} name="order2_value" render={({ field }) => (
                        <FormItem> <FormLabel>Value (£)</FormLabel> <FormControl><Input type="number" step="0.01" placeholder="e.g., 15.75" {...field} onChange={e => field.onChange(e.target.value === '' ? undefined : parseFloat(e.target.value))} /></FormControl> <FormMessage /> </FormItem>
                      )}/>
                    </div>
                  </div>

                  {/* Order Entry 3 */}
                  <div className="space-y-3 p-4 border rounded-md">
                    <h4 className="text-sm font-medium text-muted-foreground">Order 3 (Optional)</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <FormField control={adBoostForm.control} name="order3_date" render={({ field }) => (
                        <FormItem> <FormLabel>Date</FormLabel> <FormControl><Input type="date" {...field} /></FormControl> <FormMessage /> </FormItem>
                      )}/>
                      <FormField control={adBoostForm.control} name="order3_time" render={({ field }) => (
                        <FormItem> <FormLabel>Time (HH:MM)</FormLabel> <FormControl><Input type="time" {...field} /></FormControl> <FormMessage /> </FormItem>
                      )}/>
                      <FormField control={adBoostForm.control} name="order3_value" render={({ field }) => (
                        <FormItem> <FormLabel>Value (£)</FormLabel> <FormControl><Input type="number" step="0.01" placeholder="e.g., 32.00" {...field} onChange={e => field.onChange(e.target.value === '' ? undefined : parseFloat(e.target.value))} /></FormControl> <FormMessage /> </FormItem>
                      )}/>
                    </div>
                  </div>
                  
                  {(adBoostForm.formState.errors.order1_date?.message && adBoostForm.formState.errors.order1_date.type === 'custom') && <FormMessage>{adBoostForm.formState.errors.order1_date.message}</FormMessage>}
                  {(adBoostForm.formState.errors.order2_date?.message && adBoostForm.formState.errors.order2_date.type === 'custom') && <FormMessage>{adBoostForm.formState.errors.order2_date.message}</FormMessage>}
                  {(adBoostForm.formState.errors.order3_date?.message && adBoostForm.formState.errors.order3_date.type === 'custom') && <FormMessage>{adBoostForm.formState.errors.order3_date.message}</FormMessage>}


                  <Button type="submit" disabled={adBoostForm.formState.isSubmitting} className="w-full bg-primary hover:bg-primary/90">
                    {adBoostForm.formState.isSubmitting ? "Generating..." : "Suggest Ad Boost Time"}
                    <Brain className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
          <AISuggestionCard
            title="Ad Boost Time Suggestion"
            suggestion={adBoostResult?.suggestion}
            reasoning={adBoostResult?.reasoning}
            isLoading={adBoostForm.formState.isSubmitting}
            error={adBoostError}
          />
        </div>
      </div>
    </div>
  );
}

    