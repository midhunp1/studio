
"use client";

import { PageHeader } from '@/components/dashboard/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarClock, Info } from 'lucide-react';
import Image from 'next/image';

export default function SeasonalTrendsPage() {
  return (
    <div>
      <PageHeader
        title="Seasonal Trend Predictions"
        description="Analyze seasonal patterns and predict future order trends."
      />
      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center">
            <CalendarClock className="mr-2 h-6 w-6 text-primary" />
            Seasonal Trend Insights
          </CardTitle>
          <CardDescription>
            This feature will help you understand how demand changes across different seasons, holidays, and events, enabling better long-term planning.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center min-h-[300px] text-center">
          <Info className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-lg font-semibold text-muted-foreground">Feature Under Development</p>
          <p className="text-sm text-muted-foreground">
            Check back later for seasonal trend predictions!
          </p>
          <div className="mt-6 rounded-lg shadow-md overflow-hidden w-full max-w-md aspect-[2/1] relative">
            <Image 
              src="https://placehold.co/600x300.png" 
              alt="Placeholder for seasonal trends chart" 
              layout="fill"
              objectFit="cover"
              data-ai-hint="seasonal chart"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
