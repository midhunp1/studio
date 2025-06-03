
"use client";

import { PageHeader } from '@/components/dashboard/page-header';
import { CssStylizedHeatmap } from '@/components/dashboard/css-stylized-heatmap'; // Updated import
import { FilterControls } from '@/components/dashboard/filter-controls';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { List } from 'lucide-react';

export default function DeliveryAreaPage() {
  // Placeholder data
  const topPostcodes = [
    { postcode: "M1 1AA", orders: 1250, revenue: "£18,750" },
    { postcode: "M2 2BB", orders: 980, revenue: "£14,700" },
    { postcode: "M3 3CC", orders: 750, revenue: "£11,250" },
  ];

  const lowConversionAreas = [
    { postcode: "M4 4DD", views: 500, orders: 10 },
    { postcode: "M5 5EE", views: 350, orders: 5 },
  ];

  return (
    <div>
      <PageHeader
        title="Delivery Area Heatmap"
        description="Visualize order density by postcode, highlighting high-frequency and revenue areas."
      />
      <FilterControls onApplyFilters={(filters) => console.log("Applying filters:", filters)} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {/* Changed to CssStylizedHeatmap */}
          <CssStylizedHeatmap title="Manchester Area Heatmap (CSS Demo)" height="500px" dataAiHint="Manchester heatmap stylized" />
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline flex items-center">
                <List className="mr-2 h-5 w-5 text-primary" />
                Top Performing Postcodes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {topPostcodes.map((area) => (
                  <li key={area.postcode} className="flex justify-between items-center p-2 bg-muted/30 rounded-md">
                    <div>
                      <span className="font-semibold">{area.postcode}</span>
                      <p className="text-sm text-muted-foreground">{area.orders} orders</p>
                    </div>
                    <span className="font-semibold text-primary">{area.revenue}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Alert>
            <List className="h-4 w-4" />
            <AlertTitle className="font-headline">Low Conversion Areas</AlertTitle>
            <AlertDescription>
              <ul className="space-y-1 mt-2">
              {lowConversionAreas.map((area) => (
                <li key={area.postcode} className="text-sm">
                  <span className="font-semibold">{area.postcode}:</span> {area.orders} orders from {area.views} views.
                </li>
              ))}
              </ul>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  );
}
