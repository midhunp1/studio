
"use client";

import React, { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Image from 'next/image';

import { PageHeader } from '@/components/dashboard/page-header';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { generatePromoBanner, type GeneratePromoBannerOutput } from '@/ai/flows/generate-promo-banner';
import { Brain, ImageIcon, Loader2, AlertTriangle, UploadCloud, CalendarDays } from 'lucide-react';

const promoBannerSchema = z.object({
  promoText: z.string().min(5, "Promo text must be at least 5 characters.").max(100, "Promo text can be at most 100 characters."),
});
type PromoBannerFormValues = z.infer<typeof promoBannerSchema>;

export default function OfferBannerPromotionsPage() {
  const { toast } = useToast();
  const [bannerResult, setBannerResult] = useState<GeneratePromoBannerOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const form = useForm<PromoBannerFormValues>({
    resolver: zodResolver(promoBannerSchema),
    defaultValues: { promoText: "" },
  });

  const onSubmit: SubmitHandler<PromoBannerFormValues> = async (data) => {
    setIsLoading(true);
    setError(null);
    setBannerResult(null);
    setStartDate('');
    setEndDate('');
    try {
      const result = await generatePromoBanner(data);
      setBannerResult(result);
      toast({ title: "Promotional Banner Generated!", description: "Your banner is ready below. Set duration and upload." });
    } catch (err) {
      console.error("Error generating promo banner:", err);
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
      setError(errorMessage);
      toast({ variant: "destructive", title: "Error Generating Banner", description: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadBanner = () => {
    if (!bannerResult?.bannerImageUrl) {
      toast({ variant: "destructive", title: "Error", description: "No banner generated to upload." });
      return;
    }
    if (!startDate || !endDate) {
      toast({ variant: "destructive", title: "Error", description: "Please select both start and end dates." });
      return;
    }
    if (new Date(startDate) >= new Date(endDate)) {
      toast({ variant: "destructive", title: "Error", description: "End date must be after start date." });
      return;
    }

    toast({
      title: "Banner Uploaded (Simulated)",
      description: `Promo "${form.getValues("promoText")}" scheduled from ${startDate} to ${endDate}.`,
    });
  };

  const canUpload = bannerResult?.bannerImageUrl && startDate && endDate && (new Date(startDate) < new Date(endDate)) && !isLoading;

  return (
    <div>
      <PageHeader
        title="Offer Banner Promotions"
        description="Create eye-catching promotional banners with AI. Enter your offer text below."
      />

      <div className="grid grid-cols-1 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline flex items-center">
              <ImageIcon className="mr-2 h-5 w-5 text-primary" />
              Create Your Banner
            </CardTitle>
            <CardDescription>Enter the text you want on your promotional banner.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="promoText"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Promotion Text</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., '50% OFF All Pizzas This Weekend!' or 'Free Delivery on Orders Over £20'"
                          {...field}
                          rows={4}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading} className="w-full bg-primary hover:bg-primary/90">
                  {isLoading && !bannerResult ? ( // Only show generating on the button if it's the initial generation
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating Banner...
                    </>
                  ) : (
                    <>
                      <Brain className="mr-2 h-4 w-4" />
                      Generate Banner
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Generated Banner & Upload</CardTitle>
            <CardDescription>Your AI-generated banner and upload options will appear here.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center min-h-[300px] border-dashed border-2 border-muted rounded-lg p-4">
            {isLoading && !bannerResult && ( // Show this loading state only during initial banner generation
              <div className="flex flex-col items-center text-muted-foreground">
                <Loader2 className="h-12 w-12 animate-spin text-primary mb-2" />
                <p>AI is creating your banner...</p>
                <p className="text-xs">This might take a few moments.</p>
              </div>
            )}
            {error && !isLoading && (
              <div className="text-destructive text-center">
                <AlertTriangle className="h-10 w-10 mx-auto mb-2" />
                <p className="font-semibold">Banner Generation Failed</p>
                <p className="text-sm">{error}</p>
              </div>
            )}
            {!isLoading && !error && bannerResult?.bannerImageUrl && (
              <div className="w-full aspect-[3/1] relative overflow-hidden rounded-md min-h-[180px] sm:min-h-[200px]">
                <Image
                  src={bannerResult.bannerImageUrl}
                  alt="Generated promotional banner"
                  layout="fill"
                  objectFit="contain"
                  data-ai-hint="promotional banner"
                />
              </div>
            )}
            {!isLoading && !error && !bannerResult && (
              <div className="text-center text-muted-foreground">
                <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Your banner will be displayed here once generated.</p>
              </div>
            )}
          </CardContent>
          {bannerResult?.bannerImageUrl && !error && (
            <>
              <Separator className="my-4" />
              <CardFooter className="flex flex-col gap-4 items-stretch">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="start-date" className="flex items-center">
                      <CalendarDays className="mr-2 h-4 w-4 text-muted-foreground" />
                      Start Date
                    </Label>
                    <Input 
                      id="start-date" 
                      type="date" 
                      value={startDate} 
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="end-date" className="flex items-center">
                      <CalendarDays className="mr-2 h-4 w-4 text-muted-foreground" />
                      End Date
                    </Label>
                    <Input 
                      id="end-date" 
                      type="date" 
                      value={endDate} 
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full"
                      min={startDate || undefined} // Prevent end date before start date
                    />
                  </div>
                </div>
                <Button onClick={handleUploadBanner} disabled={!canUpload || isLoading} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                  {isLoading ? (
                     <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <UploadCloud className="mr-2 h-4 w-4" />
                      Upload to Website & App
                    </>
                  )}
                </Button>
              </CardFooter>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}

