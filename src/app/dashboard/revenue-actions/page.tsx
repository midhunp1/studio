
"use client";

import { PageHeader } from '@/components/dashboard/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb, ListChecks, DollarSign, AlertCircle, TrendingUp } from 'lucide-react';

export default function RevenueActionsPage() {
  return (
    <div>
      <PageHeader
        title="Actions & Revenue Optimisation"
        description="Identify underperforming venues and prioritize actions for maximum revenue impact."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline flex items-center">
              <ListChecks className="mr-2 h-6 w-6 text-primary" />
              Actions Report
            </CardTitle>
            <CardDescription>
              Identifies underperforming venues (e.g., high delivery times, low availability, poor reviews, missing tags) and estimates the revenue uplift from resolving these issues.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-semibold text-foreground flex items-center">
                  <AlertCircle className="mr-2 h-5 w-5 text-destructive" />
                  Venue: Speedy Pizza (ST1 2AB)
                </h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Issue: High average delivery time (45 mins).
                  <br />
                  Estimated Uplift: +£250/week by reducing to 30 mins.
                </p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-semibold text-foreground flex items-center">
                  <AlertCircle className="mr-2 h-5 w-5 text-yellow-500" />
                  Venue: Burger Bonanza (ST4 5CD)
                </h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Issue: Frequent "item unavailable" on popular burgers.
                  <br />
                  Estimated Uplift: +£180/week by improving stock management.
                </p>
              </div>
               <p className="text-sm text-muted-foreground italic text-center">More detailed reports will be available here.</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline flex items-center">
              <TrendingUp className="mr-2 h-6 w-6 text-accent" />
              Prioritisation Insights
            </CardTitle>
            <CardDescription>
              Highlights exactly which restaurant needs attention and which issue to resolve for maximum impact.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
                <div className="p-4 bg-primary/10 rounded-lg border border-primary/30">
                    <h4 className="font-semibold text-primary flex items-center">
                        <Lightbulb className="mr-2 h-5 w-5" />
                        Top Priority: Speedy Pizza (ST1 2AB)
                    </h4>
                    <p className="text-sm text-primary/80 mt-1">
                        Focus on: Reducing delivery times.
                        <br />
                        Impact Potential: Highest immediate revenue gain.
                    </p>
                </div>
                 <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-semibold text-foreground">
                        Next Up: Burger Bonanza (ST4 5CD)
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1">
                        Focus on: Inventory for popular burgers.
                        <br />
                        Impact Potential: Significant customer satisfaction and order completion improvement.
                    </p>
                </div>
                 <p className="text-sm text-muted-foreground italic text-center">Prioritized action list will be displayed here.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
