
"use client";

import React, { useState, useMemo } from 'react';
import { PageHeader } from '@/components/dashboard/page-header';
import { FilterControls } from '@/components/dashboard/filter-controls';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Star, ThumbsUp, ThumbsDown, AlertTriangle, Lightbulb, MessageSquare, Search, TrendingUp, TrendingDown as TrendingDownIcon, FileText } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

const mockReviewPlatforms = ["All Platforms", "Google", "JustEat", "UberEats", "Own Website"];

const mockOverallSentiment = {
  positivePercentage: 78,
  totalReviews: 2350,
  trend: "improving", // or "declining", "stable"
};

const mockPositiveKeywords = [
  { keyword: "delicious", count: 120, trend: "up" },
  { keyword: "great naan", count: 95, trend: "stable" },
  { keyword: "friendly driver", count: 88, trend: "up" },
  { keyword: "fast delivery", count: 75, trend: "stable" },
  { keyword: "fresh food", count: 60, trend: "down" },
  { keyword: "good value", count: 55, trend: "up" },
];

const mockNegativeKeywords = [
  { keyword: "cold food", count: 45, trend: "stable" },
  { keyword: "late delivery", count: 38, trend: "up" },
  { keyword: "soggy chips", count: 32, trend: "stable" },
  { keyword: "missing items", count: 25, trend: "down" },
  { keyword: "rude staff", count: 18, trend: "up" },
  { keyword: "small portions", count: 15, trend: "stable" },
];

const mockActionableInsights = [
  "Significant increase in 'late delivery' mentions (38 times this period). Review delivery dispatch and driver routes.",
  "'Soggy chips' remains a consistent issue (32 mentions). Explore new packaging or cooking methods.",
  "Positive feedback for 'friendly driver' is up! Commend your delivery team.",
  "Decrease in 'fresh food' comments. Check ingredient sourcing and preparation standards.",
];

const mockRecentSpikeAlert = {
  keyword: "cold food",
  countToday: 7,
  threshold: 5,
  date: new Date().toLocaleDateString(),
};

const mockRecentReviews = [
  { id: "rev1", platform: "Google", rating: 5, snippet: "Absolutely fantastic! The Lamb Tikka Masala was the best I've ever had. Quick delivery too!", sentiment: "positive", date: "2 days ago" },
  { id: "rev2", platform: "JustEat", rating: 2, snippet: "My order arrived an hour late and the pizza was cold. Very disappointed.", sentiment: "negative", date: "1 day ago" },
  { id: "rev3", platform: "UberEats", rating: 4, snippet: "Food was good, but they forgot my drink. Driver was polite though.", sentiment: "neutral", date: "3 hours ago" },
  { id: "rev4", platform: "Own Website", rating: 5, snippet: "Always reliable and delicious. The 'great naan' is truly great!", sentiment: "positive", date: "5 days ago" },
];


export default function ReviewAnalyzerPage() {
  const [selectedPlatform, setSelectedPlatform] = useState(mockReviewPlatforms[0]);
  const [searchTerm, setSearchTerm] = useState('');

  // In a real app, these would be filtered by date/platform from FilterControls
  const filteredPositiveKeywords = useMemo(() => {
    return mockPositiveKeywords.filter(kw => kw.keyword.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [searchTerm]);

  const filteredNegativeKeywords = useMemo(() => {
    return mockNegativeKeywords.filter(kw => kw.keyword.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [searchTerm]);

  const handleFiltersApplied = (filters: any) => {
    // console.log("Filters applied in Review Analyzer:", filters);
    // Potentially set selectedPlatform from filters if FilterControls is adapted
  };

  return (
    <div>
      <PageHeader
        title="Customer Review Sentiment Analyzer"
        description="Analyze keywords and sentiment from reviews across platforms to gain actionable insights."
      />
      
      {/* 
        Note: The standard FilterControls component would need adaptation to include 
        a 'Review Platform' select. For this example, we'll simulate its presence
        or one could add a dedicated platform selector here.
      */}
      <div className="mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline flex items-center">
              <Search className="mr-2 h-5 w-5 text-primary" />
              Filter Reviews
            </CardTitle>
          </CardHeader>
          <CardContent>
             <p className="text-sm text-muted-foreground">
               Use the global date filter above. Platform-specific filtering and advanced keyword search would be integrated here.
             </p>
          </CardContent>
        </Card>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle className="font-headline flex items-center">
              <Star className="mr-2 h-5 w-5 text-yellow-400" />
              Overall Sentiment
            </CardTitle>
            <CardDescription>Based on {mockOverallSentiment.totalReviews.toLocaleString()} analyzed reviews.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-green-500">Positive</span>
              <span className="text-sm font-medium text-destructive">Negative</span>
            </div>
            <Progress value={mockOverallSentiment.positivePercentage} aria-label={`${mockOverallSentiment.positivePercentage}% positive sentiment`} className="h-3" />
            <div className="flex items-center justify-between mt-1">
              <span className="text-lg font-bold text-green-500">{mockOverallSentiment.positivePercentage}%</span>
              <span className="text-lg font-bold text-destructive">{100 - mockOverallSentiment.positivePercentage}%</span>
            </div>
             <p className={`text-xs text-muted-foreground mt-2 text-center ${mockOverallSentiment.trend === "improving" ? "text-green-500" : mockOverallSentiment.trend === "declining" ? "text-red-500" : ""}`}>
              Sentiment is currently {mockOverallSentiment.trend}.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline flex items-center">
              <ThumbsUp className="mr-2 h-5 w-5 text-green-500" />
              Top Positive Keywords
            </CardTitle>
            <CardDescription>Most frequent positive terms in reviews.</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[180px]">
              <div className="space-y-2">
                {filteredPositiveKeywords.map(kw => (
                  <div key={kw.keyword} className="flex justify-between items-center text-sm">
                    <Badge variant="outline" className="text-green-600 border-green-400 bg-green-500/10 font-normal">{kw.keyword}</Badge>
                    <div className="flex items-center text-muted-foreground">
                      <span>{kw.count}</span>
                      {kw.trend === "up" && <TrendingUp className="ml-1 h-3.5 w-3.5 text-green-500" />}
                      {kw.trend === "down" && <TrendingDownIcon className="ml-1 h-3.5 w-3.5 text-red-500" />}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline flex items-center">
              <ThumbsDown className="mr-2 h-5 w-5 text-destructive" />
              Top Negative Keywords
            </CardTitle>
             <CardDescription>Most frequent negative terms in reviews.</CardDescription>
          </CardHeader>
          <CardContent>
             <ScrollArea className="h-[180px]">
              <div className="space-y-2">
                {filteredNegativeKeywords.map(kw => (
                  <div key={kw.keyword} className="flex justify-between items-center text-sm">
                    <Badge variant="destructive" className="font-normal">{kw.keyword}</Badge>
                     <div className="flex items-center text-muted-foreground">
                      <span>{kw.count}</span>
                      {kw.trend === "up" && <TrendingUp className="ml-1 h-3.5 w-3.5 text-red-500" />}
                      {kw.trend === "down" && <TrendingDownIcon className="ml-1 h-3.5 w-3.5 text-green-500" />}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline flex items-center">
              <Lightbulb className="mr-2 h-5 w-5 text-accent" />
              Actionable Insights
            </CardTitle>
            <CardDescription>Key takeaways from recent review analysis.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {mockActionableInsights.map((insight, index) => (
                <li key={index} className="flex items-start text-sm">
                  <Lightbulb className="h-4 w-4 text-accent mr-2.5 mt-0.5 flex-shrink-0" />
                  <span>{insight}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline flex items-center">
                <AlertTriangle className="mr-2 h-5 w-5 text-destructive" />
                Recent Alerts & Spikes (Simulated)
            </CardTitle>
            <CardDescription>Notifications for unusual keyword activity.</CardDescription>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Keyword Spike Detected!</AlertTitle>
              <AlertDescription>
                The term <strong className="text-destructive-foreground">"{mockRecentSpikeAlert.keyword}"</strong>
                was mentioned <strong className="text-destructive-foreground">{mockRecentSpikeAlert.countToday} times</strong> today ({mockRecentSpikeAlert.date}),
                exceeding the threshold of {mockRecentSpikeAlert.threshold}.
                Consider investigating related orders.
              </AlertDescription>
            </Alert>
             <p className="text-xs text-muted-foreground mt-3 text-center">
                Real-time alert automation would be configured in settings.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center">
            <MessageSquare className="mr-2 h-5 w-5 text-primary" />
            Recent Review Snippets
          </CardTitle>
          <CardDescription>A glimpse of the latest customer feedback.</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[250px] w-full pr-3">
            <div className="space-y-4">
              {mockRecentReviews.map(review => (
                <div key={review.id} className="p-3 border rounded-md bg-muted/50">
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex items-center">
                      <Star className={`mr-1 h-4 w-4 ${review.rating >= 4 ? 'text-yellow-400 fill-yellow-400' : review.rating >=3 ? 'text-yellow-400' : 'text-destructive'}`} />
                      <span className="font-semibold text-sm">{review.rating}/5</span>
                      <span className="text-xs text-muted-foreground mx-2">|</span>
                      <Badge variant="secondary" className="text-xs">{review.platform}</Badge>
                    </div>
                    <span className="text-xs text-muted-foreground">{review.date}</span>
                  </div>
                  <p className="text-sm text-foreground/90">{review.snippet}</p>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
        <CardFooter>
            <p className="text-xs text-muted-foreground">Showing latest {mockRecentReviews.length} reviews. Full review history available via export or direct platform integration (future feature).</p>
        </CardFooter>
      </Card>

    </div>
  );
}

