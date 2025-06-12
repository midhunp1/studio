
"use client";

import { PageHeader } from '@/components/dashboard/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CalendarClock, Sun, Snowflake, CloudRain, Gift, Moon, Sparkles, TrendingUp, Info, ListChecks, Check, BarChart3, DollarSign, Repeat as RepeatIcon, ArrowUpCircle, ArrowDownCircle, MinusCircle } from 'lucide-react';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend as RechartsLegend,
  ResponsiveContainer
} from 'recharts';
import { ChartContainer, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';

const seasonalInsightsData = {
  summerVsWinter: {
    summer: {
      title: "Summer Sellers",
      items: ["Ice Cream & Lollies", "Fresh Salads", "Cold Brew Coffee", "Grilled Chicken Wraps", "Fruit Smoothies", "Iced Teas"],
      icon: Sun,
    },
    winter: {
      title: "Winter Warmers",
      items: ["Hot Soups (e.g., Tomato, Chicken)", "Hearty Curries & Stews", "Hot Chocolate", "Shepherd's Pie", "Warm Pies", "Mulled Spiced Drinks (non-alc)"],
      icon: Snowflake,
    },
  },
  weatherDriven: {
    rainy: {
      title: "Rainy Day Comforts",
      items: ["Pizzas (higher delivery rates)", "Pasta Bakes", "Warm Desserts (e.g., Apple Crumble)", "Hot Drinks (Tea, Coffee)", "Comfort Food Combos"],
      icon: CloudRain,
    },
    hot: {
      title: "Hot Weather Choices",
      items: ["Fruit Salads & Platters", "Smoothies & Milkshakes", "Iced Coffees & Teas", "Light Sandwiches & Wraps", "Gazpacho / Cold Soups", "Yogurt Parfaits"],
      icon: Sun,
    },
  },
  festivePeaks: [
    {
      name: "Christmas & New Year",
      items: ["Roast Dinners (pre-order if possible)", "Mince Pies", "Festive Party Platters", "Sparkling Drinks", "Chocolate Yule Logs"],
      icon: Gift,
    },
    {
      name: "Eid (al-Fitr & al-Adha)",
      items: ["Biryani (Chicken, Lamb, Veg)", "Kebab Platters & Grills", "Sweet Dishes (e.g., Sheer Khurma, Gulab Jamun)", "Samosas & Pakoras", "Haleem (for Eid al-Adha if applicable)"],
      icon: Moon,
    },
    {
      name: "Diwali",
      items: ["Indian Sweets (Mithai boxes)", "Samosas & Chaat", "Festive Thalis/Meal Combos", "Pakoras & Bhajis", "Speciality Curries"],
      icon: Sparkles, 
    },
    {
      name: "Easter",
      items: ["Roast Lamb (if offered)", "Chocolate Eggs & Desserts", "Hot Cross Buns (if bakery items)", "Spring Vegetable Dishes", "Family Meal Deals"],
      icon: Gift, 
    },
  ],
  generalTips: [
    "Promote 'Veganuary' specials in January for plant-based items.",
    "BBQ season (late spring/summer) typically boosts orders for grilled items, burgers, corn on the cob, and coleslaw.",
    "Back-to-school periods (late Aug/early Sep) can increase demand for quick family meals and lunchbox-friendly items.",
    "Major sporting events often drive sales of shareable platters, pizzas, and finger foods.",
    "Monitor local events (festivals, markets) for opportunities to offer themed specials or adjust stock.",
  ]
};

const monthlyOrderVolumeData = [
  { month: "Jan", volume: 1200 }, { month: "Feb", volume: 1150 }, { month: "Mar", volume: 1300 },
  { month: "Apr", volume: 1400 }, { month: "May", volume: 1550 }, { month: "Jun", volume: 1600 },
  { month: "Jul", volume: 1500 }, { month: "Aug", volume: 1450 }, { month: "Sep", volume: 1350 },
  { month: "Oct", volume: 1400 }, { month: "Nov", volume: 1650 }, { month: "Dec", volume: 1800 },
];

const monthlyOrderVolumeChartConfig = {
  volume: { label: "Order Volume", color: "hsl(var(--primary))" },
} satisfies ChartConfig;

const averageOrderValueBySeason = {
  spring: { value: 22.50, trend: "stable", icon: MinusCircle, color: "text-yellow-500" },
  summer: { value: 25.75, trend: "up", icon: ArrowUpCircle, color: "text-green-500" },
  autumn: { value: 23.00, trend: "stable", icon: MinusCircle, color: "text-yellow-500" },
  winter: { value: 28.50, trend: "down", icon: ArrowDownCircle, color: "text-red-500" }, // Example with a down trend
};

const reorderGapByQuarter = {
  q1: { days: 35, note: "Slightly longer post-holidays" },
  q2: { days: 28, note: "Improving with new offers" },
  q3: { days: 30, note: "Summer vacation impact" },
  q4: { days: 25, note: "Festive season loyalty" },
};

export default function SeasonalTrendsPage() {
  return (
    <div>
      <PageHeader
        title="Seasonal Trend Insights & Predictions"
        description="Analyze how item sales vary with seasons, weather, and festive events to optimize inventory and promotions."
      />
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline flex items-center">
            <CalendarClock className="mr-3 h-7 w-7 text-primary" />
            Seasonal Analysis Dashboard
          </CardTitle>
          <CardDescription>
            Understanding demand shifts and customer behavior across different times of the year and specific conditions.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          
          {/* Summer vs. Winter */}
          <section>
            <h2 className="text-xl font-semibold text-primary mb-3 flex items-center">
              <Sun className="mr-2 h-5 w-5 text-amber-500" /> / <Snowflake className="mr-2 h-5 w-5 text-blue-400" />
              Summer vs. Winter Item Trends
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-muted/30">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <seasonalInsightsData.summerVsWinter.summer.icon className="mr-2 h-5 w-5 text-amber-500" />
                    {seasonalInsightsData.summerVsWinter.summer.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1.5 text-sm text-foreground/80">
                    {seasonalInsightsData.summerVsWinter.summer.items.map(item => (
                      <li key={item} className="flex items-center">
                        <Check className="h-4 w-4 mr-2 text-green-500 flex-shrink-0" /> {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              <Card className="bg-muted/30">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <seasonalInsightsData.summerVsWinter.winter.icon className="mr-2 h-5 w-5 text-blue-400" />
                    {seasonalInsightsData.summerVsWinter.winter.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1.5 text-sm text-foreground/80">
                    {seasonalInsightsData.summerVsWinter.winter.items.map(item => (
                       <li key={item} className="flex items-center">
                        <Check className="h-4 w-4 mr-2 text-green-500 flex-shrink-0" /> {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>

          <Separator />

          {/* Weather-Driven Demand */}
          <section>
            <h2 className="text-xl font-semibold text-primary mb-3 flex items-center">
              <CloudRain className="mr-2 h-5 w-5 text-sky-500" /> / <Sun className="mr-2 h-5 w-5 text-orange-500" />
              Weather-Driven Item Demand
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-muted/30">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <seasonalInsightsData.weatherDriven.rainy.icon className="mr-2 h-5 w-5 text-sky-500" />
                    {seasonalInsightsData.weatherDriven.rainy.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1.5 text-sm text-foreground/80">
                    {seasonalInsightsData.weatherDriven.rainy.items.map(item => (
                       <li key={item} className="flex items-center">
                        <Check className="h-4 w-4 mr-2 text-green-500 flex-shrink-0" /> {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              <Card className="bg-muted/30">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <seasonalInsightsData.weatherDriven.hot.icon className="mr-2 h-5 w-5 text-orange-500" />
                    {seasonalInsightsData.weatherDriven.hot.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1.5 text-sm text-foreground/80">
                    {seasonalInsightsData.weatherDriven.hot.items.map(item => (
                       <li key={item} className="flex items-center">
                        <Check className="h-4 w-4 mr-2 text-green-500 flex-shrink-0" /> {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>

          <Separator />

          {/* Festive Period Peaks */}
          <section>
            <h2 className="text-xl font-semibold text-primary mb-4 flex items-center">
              <Gift className="mr-2 h-5 w-5 text-pink-500" />
              Festive Period Item Preferences
            </h2>
            <ScrollArea className="h-[300px] w-full pr-4">
              <div className="space-y-4">
                {seasonalInsightsData.festivePeaks.map(festival => {
                  const IconComponent = festival.icon;
                  return (
                    <Card key={festival.name} className="bg-muted/40">
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center">
                          <IconComponent className="mr-2 h-5 w-5 text-accent" />
                          {festival.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-2">Popular items during {festival.name}:</p>
                        <ul className="space-y-1 text-sm text-foreground/90 list-disc list-inside ml-2">
                          {festival.items.map(item => <li key={item}>{item}</li>)}
                        </ul>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </ScrollArea>
          </section>

          <Separator />

          {/* Seasonal Customer Behavior */}
          <section>
            <h2 className="text-xl font-semibold text-primary mb-4 flex items-center">
              <TrendingUp className="mr-2 h-5 w-5 text-green-600" />
              Seasonal Customer Behavior Trends
            </h2>
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <BarChart3 className="mr-2 h-5 w-5 text-accent" />
                    Monthly Order Volume
                  </CardTitle>
                  <CardDescription>Estimated order count fluctuation throughout the year.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={monthlyOrderVolumeChartConfig} className="h-[300px] w-full">
                    <RechartsBarChart data={monthlyOrderVolumeData} accessibilityLayer>
                      <CartesianGrid vertical={false} />
                      <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} className="text-xs" />
                      <YAxis tickLine={false} axisLine={false} className="text-xs" />
                      <RechartsTooltip 
                        cursor={false} 
                        content={<ChartTooltipContent indicator="dashed" />} 
                      />
                      <RechartsLegend verticalAlign="top" height={36} content={({ payload }) => (
                         <ul className="flex flex-wrap gap-x-4 justify-center text-xs">
                          {payload?.map((entry, index) => (
                            <li key={`item-${index}`} className="flex items-center gap-1.5">
                              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                              <span>{entry.value}</span>
                            </li>
                          ))}
                        </ul>
                      )} />
                      <Bar dataKey="volume" fill="var(--color-volume)" radius={4} />
                    </RechartsBarChart>
                  </ChartContainer>
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <DollarSign className="mr-2 h-5 w-5 text-accent" />
                      Average Order Value (AOV) by Season
                    </CardTitle>
                     <CardDescription>How AOV shifts with changing seasons.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {Object.entries(averageOrderValueBySeason).map(([season, data]) => {
                      const SeasonIcon = data.icon;
                      return (
                        <div key={season} className="p-3 bg-muted/50 rounded-md flex justify-between items-center">
                          <span className="capitalize font-medium text-foreground">{season}:</span>
                          <div className="flex items-center gap-1">
                             <span className="font-semibold text-lg text-primary">£{data.value.toFixed(2)}</span>
                             <SeasonIcon className={`h-4 w-4 ${data.color}`} />
                          </div>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                       <RepeatIcon className="mr-2 h-5 w-5 text-accent" />
                      Reorder Gap Over Time
                    </CardTitle>
                    <CardDescription>Average days between repeat orders, by quarter.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {Object.entries(reorderGapByQuarter).map(([quarter, data]) => (
                      <div key={quarter} className="p-3 bg-muted/50 rounded-md">
                        <div className="flex justify-between items-center">
                           <span className="uppercase font-medium text-foreground">{quarter}:</span>
                           <span className="font-semibold text-lg text-primary">{data.days} days</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">{data.note}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          <Separator />
          
          {/* General Seasonal Tips */}
          <section>
            <h2 className="text-xl font-semibold text-primary mb-3 flex items-center">
              <ListChecks className="mr-2 h-5 w-5 text-blue-600" />
              General Seasonal Tips & Opportunities
            </h2>
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="pt-6">
                <ul className="space-y-2.5 text-sm text-foreground/90">
                  {seasonalInsightsData.generalTips.map((tip, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-4 w-4 mr-2.5 mt-0.5 text-primary flex-shrink-0" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </section>

          <Separator />
          
          <div className="text-center text-muted-foreground text-xs pt-4">
             <Info className="inline h-4 w-4 mr-1"/>
            Note: These insights are based on general trends and mock data. Actual performance may vary. Use your own sales data for precise analysis.
          </div>

        </CardContent>
      </Card>
    </div>
  );
}


    