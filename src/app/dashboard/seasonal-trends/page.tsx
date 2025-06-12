
"use client";

import { PageHeader } from '@/components/dashboard/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CalendarClock, Sun, Snowflake, CloudRain, Gift, Moon, Sparkles, TrendingUp, Info, ListChecks, Check } from 'lucide-react';

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
      icon: Sparkles, // Using Sparkles as Flame might be too specific or less festive
    },
    {
      name: "Easter",
      items: ["Roast Lamb (if offered)", "Chocolate Eggs & Desserts", "Hot Cross Buns (if bakery items)", "Spring Vegetable Dishes", "Family Meal Deals"],
      icon: Gift, // Re-using Gift, or could be a generic 'CalendarDays'
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
            Item Sales Seasonality Analysis
          </CardTitle>
          <CardDescription>
            Understanding demand shifts across different times of the year and specific conditions.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          
          {/* Summer vs. Winter */}
          <section>
            <h2 className="text-xl font-semibold text-primary mb-3 flex items-center">
              <Sun className="mr-2 h-5 w-5 text-amber-500" /> / <Snowflake className="mr-2 h-5 w-5 text-blue-400" />
              Summer vs. Winter Trends
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
              Weather-Driven Demand Shifts
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
              Festive Period Peaks
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

          {/* General Seasonal Tips */}
          <section>
            <h2 className="text-xl font-semibold text-primary mb-3 flex items-center">
              <TrendingUp className="mr-2 h-5 w-5 text-green-600" />
              General Seasonal Tips & Opportunities
            </h2>
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="pt-6">
                <ul className="space-y-2.5 text-sm text-foreground/90">
                  {seasonalInsightsData.generalTips.map((tip, index) => (
                    <li key={index} className="flex items-start">
                      <ListChecks className="h-4 w-4 mr-2.5 mt-0.5 text-primary flex-shrink-0" />
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
