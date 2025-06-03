
"use client";

import { PageHeader } from '@/components/dashboard/page-header';
import { InteractiveHeatmapPlaceholder } from '@/components/dashboard/interactive-heatmap-placeholder';
import { FilterControls } from '@/components/dashboard/filter-controls';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertTriangle, XCircle, AlertCircle,ThumbsDown } from 'lucide-react';

export default function OrderFailurePage() {
  // Placeholder data
  const failureDataByArea = [
    { postcode: "M4 4DD", type: "Cancelled", count: 15, reason: "Customer request", dataAiHint: "map cancel" },
    { postcode: "M5 5EE", type: "Rejected", count: 25, reason: "Restaurant too busy", dataAiHint: "map reject" },
    { postcode: "M4 4DD", type: "Refunded", count: 8, reason: "Late delivery", dataAiHint: "map refund" },
    { postcode: "M6 6FF", type: "Rejected", count: 12, reason: "Item unavailable", dataAiHint: "map unavailable" },
    { postcode: "M5 5EE", type: "Cancelled", count: 5, reason: "Payment issue", dataAiHint: "map payment issue" },
  ];

  const commonFailureReasons = [
    { reason: "Restaurant too busy", occurrences: 45, impact: "High" },
    { reason: "Late delivery", occurrences: 30, impact: "Medium" },
    { reason: "Item unavailable", occurrences: 22, impact: "Medium" },
    { reason: "Customer request (pre-prep)", occurrences: 18, impact: "Low" },
  ];

  return (
    <div>
      <PageHeader
        title="Order Failure Heatmap"
        description="Identify zones where orders are frequently cancelled, rejected, or refunded."
      />
      <FilterControls onApplyFilters={(filters) => console.log("Applying order failure filters:", filters)} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <InteractiveHeatmapPlaceholder title="Order Failure Hotspots" height="500px" dataAiHint="map error alert" />
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline flex items-center">
                <AlertTriangle className="mr-2 h-5 w-5 text-destructive" />
                High Failure Zones
              </CardTitle>
              <CardDescription>Areas with notable order issues.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {failureDataByArea.slice(0, 3).map((item, index) => ( 
                  <li key={index} className="p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-primary">{item.postcode}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        item.type === 'Cancelled' ? 'bg-yellow-500/20 text-yellow-400' :
                        item.type === 'Rejected' ? 'bg-red-500/20 text-red-400' :
                        'bg-orange-500/20 text-orange-400'
                      }`}>{item.type}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Count: {item.count} | Reason: {item.reason}</p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
           <Card>
            <CardHeader>
              <CardTitle className="font-headline flex items-center">
                <ThumbsDown className="mr-2 h-5 w-5 text-destructive" />
                Common Failure Reasons
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {commonFailureReasons.map((item) => (
                  <li key={item.reason} className="flex justify-between items-center text-sm">
                    <span>{item.reason}</span>
                    <span className="font-semibold text-muted-foreground">{item.occurrences} times</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="font-headline">Detailed Failure Log</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Postcode</TableHead>
                <TableHead>Failure Type</TableHead>
                <TableHead className="text-right">Count</TableHead>
                <TableHead>Most Common Reason</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {failureDataByArea.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.postcode}</TableCell>
                  <TableCell>
                     <span className={`flex items-center ${
                        item.type === 'Cancelled' ? 'text-yellow-400' :
                        item.type === 'Rejected' ? 'text-red-400' :
                        'text-orange-400'
                      }`}>
                      {item.type === 'Cancelled' && <XCircle className="mr-2 h-4 w-4" />}
                      {item.type === 'Rejected' && <AlertCircle className="mr-2 h-4 w-4" />}
                      {item.type === 'Refunded' && <AlertTriangle className="mr-2 h-4 w-4" />}
                      {item.type}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">{item.count}</TableCell>
                  <TableCell>{item.reason}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
