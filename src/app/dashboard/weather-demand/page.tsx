
"use client";

import { PageHeader } from '@/components/dashboard/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CloudSun, Info } from 'lucide-react';
import Image from 'next/image';

export default function WeatherDemandPage() {
  return (
    <div>
      <PageHeader
        title="Weather-Adjusted Demand Predictions"
        description="Forecast order demand based on weather patterns and historical data."
      />
      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center">
            <CloudSun className="mr-2 h-6 w-6 text-primary" />
            Weather Demand Forecast
          </CardTitle>
          <CardDescription>
            This feature will provide insights into how weather conditions (e.g., rain, temperature) typically affect your order volume, helping you anticipate demand.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center min-h-[300px] text-center">
          <Info className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-lg font-semibold text-muted-foreground">Feature Under Development</p>
          <p className="text-sm text-muted-foreground">
            Check back later for weather-adjusted demand predictions!
          </p>
          <div className="mt-6 rounded-lg shadow-md overflow-hidden w-full max-w-md aspect-[2/1] relative">
            <Image 
              src="https://placehold.co/600x300.png" 
              alt="Placeholder for weather forecast chart" 
              layout="fill"
              objectFit="cover"
              data-ai-hint="weather chart" 
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
