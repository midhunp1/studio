
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
  orderData: z.string().min(10, "Order data is required (JSON format preferred, e.g., timestamps, order values)"),
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
    defaultValues: { postcode: "", orderData: "" },
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

  const onAdBoostSubmit: SubmitHandler<AdBoostFormValues> = async (data) => {
    setAdBoostError(null);
    setAdBoostResult(null);
    try {
      const result = await generateAdBoostTimeSuggestion(data);
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
              <CardDescription>Input postcode and order data to find the optimal time for an ad boost.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...adBoostForm}>
                <form onSubmit={adBoostForm.handleSubmit(onAdBoostSubmit)} className="space-y-4">
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
                  <FormField
                    control={adBoostForm.control}
                    name="orderData"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Order Data (JSON format recommended)</FormLabel>
                        <FormControl>
                          <Textarea placeholder='e.g., [{"timestamp": "2023-10-26T19:00:00Z", "value": 25.50}, ...]' {...field} rows={4} />
                        </FormControl>
                        <FormDescription>Provide order history with timestamps and values for the specified postcode.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
