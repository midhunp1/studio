
"use client";

import React, { useState } from 'react';
import { PageHeader } from '@/components/dashboard/page-header';
import { InteractiveHeatmapPlaceholder } from '@/components/dashboard/interactive-heatmap-placeholder';
import { FilterControls } from '@/components/dashboard/filter-controls';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertTriangle, XCircle, AlertCircle, ThumbsDown, Brain, ListChecks, Sparkles, AlertOctagon, PackageX, BarChartHorizontalBig } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { generateFailureAnalysis, type GenerateFailureAnalysisOutput } from '@/ai/flows/generate-failure-analysis';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart as RechartsBarChart, CartesianGrid, XAxis, YAxis, Legend } from "recharts";

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
  { reason: "Food quality complaint", occurrences: 15, impact: "High" },
];

const itemCancellationData = [
  { id: "item1", itemName: "Spicy Pepperoni Pizza", category: "Pizza", cancellationCount: 8, commonReason: "Item unavailable (ingredient short)" },
  { id: "item2", itemName: "King Prawn Curry", category: "Curry", cancellationCount: 6, commonReason: "Customer complaint - food cold (long delivery)" },
  { id: "item3", itemName: "Large Diet Coke", category: "Drinks", cancellationCount: 5, commonReason: "Missing item from order" },
  { id: "item4", itemName: "Cheesecake Slice", category: "Desserts", cancellationCount: 4, commonReason: "Item damaged in transit" },
  { id: "item5", itemName: "Garlic Bread with Cheese", category: "Sides", cancellationCount: 3, commonReason: "Preparation time too long" },
  { id: "item6", itemName: "Chicken Tikka Masala", category: "Curry", cancellationCount: 7, commonReason: "Incorrect item sent" },
  { id: "item7", itemName: "Mixed Kebab", category: "Starters", cancellationCount: 5, commonReason: "Item unavailable (ran out)" },
];

const itemCancellationChartConfig = {
  cancellationCount: { label: "Cancellations", color: "hsl(var(--destructive))" },
} satisfies ChartConfig;


export default function OrderFailurePage() {
  const { toast } = useToast();
  const [analysisResult, setAnalysisResult] = useState<GenerateFailureAnalysisOutput | null>(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const handleAnalyzeFailures = async () => {
    setAnalysisLoading(true);
    setAnalysisError(null);
    setAnalysisResult(null);

    try {
      const inputForAI = {
        failureSummary: "Analyze order failures based on the provided area data, common reasons, and item-specific cancellations. Identify problematic items/categories, explain why food might not reach customers as expected, and suggest operational improvements.",
        failureDataByArea: failureDataByArea,
        commonFailureReasons: commonFailureReasons,
        itemCancellationData: itemCancellationData, 
      };
      const result = await generateFailureAnalysis({ failureDataJSON: JSON.stringify(inputForAI) });
      setAnalysisResult(result);
      toast({ title: "AI Analysis Complete", description: "Insights generated successfully." });
    } catch (error) {
      console.error("Error generating failure analysis:", error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred during AI analysis.";
      setAnalysisError(errorMessage);
      toast({ variant: "destructive", title: "AI Analysis Error", description: errorMessage });
    } finally {
      setAnalysisLoading(false);
    }
  };


  return (
    <div>
      <PageHeader
        title="Order Failure Heatmap"
        description="Identify zones where orders are frequently cancelled, rejected, or refunded. Leverage AI for deeper insights."
      />
      <FilterControls onApplyFilters={(filters) => console.log("Applying order failure filters:", filters)} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <InteractiveHeatmapPlaceholder title="Order Failure Hotspots" height="500px" dataAiHint="failure area map" />
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
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="font-headline flex items-center">
                <Brain className="mr-2 h-6 w-6 text-accent" />
                AI Failure Analysis & Recommendations
              </CardTitle>
              <CardDescription>Get AI-driven insights into failure reasons and suggestions for improvement. Click titles to expand.</CardDescription>
            </div>
            <Button onClick={handleAnalyzeFailures} disabled={analysisLoading} className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground">
              {analysisLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Get AI Analysis
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {analysisLoading && (
            <div className="flex items-center justify-center p-8 text-muted-foreground">
              <svg className="animate-spin mr-3 h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              AI is thinking... please wait.
            </div>
          )}
          {analysisError && (
            <div className="p-4 my-4 text-sm text-destructive-foreground bg-destructive rounded-md flex items-center">
              <AlertOctagon className="mr-2 h-5 w-5" />
              <p><strong>Error:</strong> {analysisError}</p>
            </div>
          )}
          {analysisResult && !analysisLoading && (
             <Accordion type="multiple" className="w-full space-y-4" defaultValue={["item-suggestions", "overall-suggestions"]}>
              <AccordionItem value="item-suggestions">
                <AccordionTrigger className="text-xl font-semibold text-primary hover:no-underline p-4 bg-muted/20 rounded-t-lg">
                  <div className="flex items-center">
                    <ListChecks className="mr-2 h-6 w-6" />
                    Potentially Problematic Items/Categories
                  </div>
                </AccordionTrigger>
                <AccordionContent className="p-4 border border-t-0 rounded-b-lg border-muted/50">
                  {analysisResult.problematicItems && analysisResult.problematicItems.length > 0 ? (
                    <ul className="space-y-4">
                      {analysisResult.problematicItems.map((item, index) => (
                        <li key={index} className="p-4 bg-muted/50 rounded-lg border border-border">
                          <p className="font-semibold text-foreground">{item.itemOrCategoryGuess}</p>
                          <p className="text-sm text-muted-foreground"><span className="font-medium text-foreground/80">Reason:</span> {item.associatedFailureReason}</p>
                          <p className="text-sm text-primary mt-1"><span className="font-medium">Suggestion:</span> {item.suggestedAction}</p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted-foreground">No specific problematic items identified by AI, or data was too sparse for item-level analysis.</p>
                  )}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="overall-suggestions">
                <AccordionTrigger className="text-xl font-semibold text-primary hover:no-underline p-4 bg-muted/20 rounded-t-lg">
                   <div className="flex items-center">
                    <Sparkles className="mr-2 h-6 w-6" />
                    Overall Fulfillment Suggestions
                  </div>
                </AccordionTrigger>
                <AccordionContent className="p-4 border border-t-0 rounded-b-lg border-muted/50">
                  {analysisResult.overallSuggestions && analysisResult.overallSuggestions.length > 0 ? (
                    <ul className="space-y-3 list-disc list-inside text-muted-foreground">
                      {analysisResult.overallSuggestions.map((suggestion, index) => (
                        <li key={index} className="text-foreground/90">{suggestion}</li>
                      ))}
                    </ul>
                  ) : (
                     <p className="text-muted-foreground">No overall suggestions provided by AI at this time.</p>
                  )}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}
          {!analysisResult && !analysisLoading && !analysisError && (
            <p className="text-muted-foreground text-center py-4">Click "Get AI Analysis" to generate insights.</p>
          )}
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="font-headline flex items-center">
            <PackageX className="mr-2 h-6 w-6 text-destructive" />
            Item-Specific Cancellation Insights
          </CardTitle>
          <CardDescription>Items frequently involved in cancellations and their common reasons.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="font-semibold text-lg mb-2 text-primary">Cancellation Breakdown by Item</h4>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Cancellations</TableHead>
                    <TableHead>Common Reason</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {itemCancellationData.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium whitespace-nowrap">{item.itemName}</TableCell>
                      <TableCell className="whitespace-nowrap">{item.category}</TableCell>
                      <TableCell className="text-right text-destructive">{item.cancellationCount}</TableCell>
                      <TableCell className="text-xs text-muted-foreground whitespace-nowrap">{item.commonReason}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
          <div>
             <h4 className="font-semibold text-lg mb-2 text-primary flex items-center">
                <BarChartHorizontalBig className="mr-2 h-5 w-5" />
                Cancellation Chart
             </h4>
            <ChartContainer config={itemCancellationChartConfig} className="h-[400px] w-full"> 
              <RechartsBarChart
                data={itemCancellationData}
                layout="vertical"
                margin={{ left: 20, right: 10, top: 5, bottom: 5 }} 
                accessibilityLayer
              >
                <CartesianGrid horizontal={false} />
                <YAxis
                  dataKey="itemName"
                  type="category"
                  tickLine={false}
                  tickMargin={5}
                  axisLine={false}
                  className="text-xs"
                  width={150} 
                  interval={0} 
                />
                <XAxis dataKey="cancellationCount" type="number" />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="line" />}
                />
                <Bar dataKey="cancellationCount" fill="var(--color-cancellationCount)" radius={4} barSize={20} />
              </RechartsBarChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="font-headline">Detailed Failure Log</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
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
                    <TableCell className="whitespace-nowrap">{item.postcode}</TableCell>
                    <TableCell className="whitespace-nowrap">
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
                    <TableCell className="whitespace-nowrap">{item.reason}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
