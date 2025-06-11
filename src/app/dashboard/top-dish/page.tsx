
"use client";

import React, { useState, useCallback } from 'react'; // Added useState, useCallback
import { PageHeader } from '@/components/dashboard/page-header';
import { InteractiveHeatmapPlaceholder } from '@/components/dashboard/interactive-heatmap-placeholder';
import { FilterControls } from '@/components/dashboard/filter-controls';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Utensils, Star, TrendingUp, TrendingDown, PieChart as PieChartIcon, BadgePercent } from 'lucide-react'; // Added BadgePercent
import Image from 'next/image';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell, Legend, Sector } from "recharts"; 
import { Button } from '@/components/ui/button'; // Added Button
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog'; // Added Dialog components
import { Input } from '@/components/ui/input'; // Added Input
import { Label } from '@/components/ui/label'; // Added Label
import { useToast } from '@/hooks/use-toast'; // Added useToast

// Define type for low performing dish for clarity in state
type LowPerformingDish = {
  dishName: string;
  category: string;
  orders: number;
  revenue: string;
  rating: number;
  reason: string;
  imageHint: string;
};


export default function TopDishPage() {
  const { toast } = useToast();
  const [isDiscountDialogOpen, setIsDiscountDialogOpen] = useState(false);
  const [selectedDishForDiscount, setSelectedDishForDiscount] = useState<LowPerformingDish | null>(null);
  const [discountPercentage, setDiscountPercentage] = useState('');
  const [fixedAmount, setFixedAmount] = useState('');

  // Placeholder data
  const topDishesByArea = [
    { postcode: "M1 1AA", dishName: "Pepperoni Pizza", category: "Pizza", orders: 150, revenue: "£1,800", rating: 4.8, imageHint: "pizza pepperoni" },
    { postcode: "M1 1AA", dishName: "Chicken Korma", category: "Curry", orders: 120, revenue: "£1,320", rating: 4.6, imageHint: "chicken korma" },
    { postcode: "M1 1AA", dishName: "Fries", category: "Sides", orders: 90, revenue: "£270", rating: 4.3, imageHint: "fries side" },
    { postcode: "M2 2BB", dishName: "Classic Burger", category: "Burgers", orders: 200, revenue: "£1,600", rating: 4.5, imageHint: "burger fries" },
    { postcode: "M2 2BB", dishName: "Pad Thai", category: "Thai", orders: 90, revenue: "£990", rating: 4.7, imageHint: "pad thai" },
    { postcode: "M3 3CC", dishName: "Sushi Platter", category: "Sushi", orders: 70, revenue: "£1,050", rating: 4.9, imageHint: "sushi platter" },
  ];

  const lowPerformingDishes: LowPerformingDish[] = [
    { dishName: "Vegetable Spring Rolls", category: "Starters", orders: 15, revenue: "£45", rating: 3.2, reason: "Low visibility", imageHint: "spring rolls" },
    { dishName: "Tuna Sandwich", category: "Sandwiches", orders: 8, revenue: "£32", rating: 2.8, reason: "Unpopular", imageHint: "tuna sandwich" },
    { dishName: "Diet Lemonade", category: "Drinks", orders: 25, revenue: "£25", rating: 3.5, reason: "Low margin, often out of stock", imageHint: "lemonade drink" },
    { dishName: "Plain Naan", category: "Sides", orders: 30, revenue: "£60", rating: 4.0, reason: "Usually ordered with curry", imageHint: "naan bread" },
    { dishName: "Mushroom Soup", category: "Soups", orders: 5, revenue: "£20", rating: 2.5, reason: "Seasonal, low demand", imageHint: "mushroom soup" },
  ];

  const selectedArea = "M1 1AA"; 
  const dishesForSelectedArea = topDishesByArea.filter(d => d.postcode === selectedArea);

  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);

  const pieChartData = React.useMemo(() => {
    return dishesForSelectedArea.map(dish => ({
      name: dish.dishName,
      value: dish.orders,
    }));
  }, [dishesForSelectedArea]);

  const pieChartConfig = React.useMemo(() => {
    const config: ChartConfig = {};
    const chartColors = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"];
    dishesForSelectedArea.forEach((dish, index) => {
      config[dish.dishName] = {
        label: dish.dishName,
        color: chartColors[index % chartColors.length],
      };
    });
    return config;
  }, [dishesForSelectedArea]);

  const onPieEnter = React.useCallback((_: any, index: number) => {
    setActiveIndex(index);
  }, [setActiveIndex]);

  const onPieLeave = React.useCallback(() => {
    setActiveIndex(null);
  }, [setActiveIndex]);

  const renderActiveShape = (props: any) => {
    const RADIAN = Math.PI / 180;
    const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent } = props;
    
    const labelRadius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const lx = cx + labelRadius * Math.cos(-midAngle * RADIAN);
    const ly = cy + labelRadius * Math.sin(-midAngle * RADIAN);

    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius - 2} 
          outerRadius={outerRadius + 6} 
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
          stroke="hsl(var(--accent))" 
          strokeWidth={2}
        />
        {percent > 0.05 && (
           <text 
            x={lx} 
            y={ly} 
            fill="hsl(var(--accent-foreground))" 
            textAnchor="middle" 
            dominantBaseline="central" 
            className="text-xs font-bold pointer-events-none"
          >
            {`${(percent * 100).toFixed(0)}%`}
          </text>
        )}
      </g>
    );
  };

  const handleOpenDiscountDialog = (dish: LowPerformingDish) => {
    setSelectedDishForDiscount(dish);
    setDiscountPercentage(''); 
    setFixedAmount('');
    setIsDiscountDialogOpen(true);
  };

  const handleApplyDiscount = () => {
    if (!selectedDishForDiscount) return;

    const percValue = parseFloat(discountPercentage);
    const fixedVal = parseFloat(fixedAmount);

    if (isNaN(percValue) && isNaN(fixedVal)) {
      toast({
        variant: "destructive",
        title: "Input Error",
        description: "Please enter a valid percentage or fixed amount.",
      });
      return;
    }
    if (!isNaN(percValue) && (percValue <= 0 || percValue > 100)) {
       toast({
        variant: "destructive",
        title: "Input Error",
        description: "Percentage must be between 1 and 100.",
      });
      return;
    }
     if (!isNaN(fixedVal) && fixedVal <= 0) {
       toast({
        variant: "destructive",
        title: "Input Error",
        description: "Fixed amount must be greater than 0.",
      });
      return;
    }


    let discountAppliedDescription = "";
    if (!isNaN(percValue)) {
      discountAppliedDescription = `${percValue}% off`;
    }
    if (!isNaN(fixedVal)) {
      if (discountAppliedDescription) discountAppliedDescription += " or ";
      discountAppliedDescription += `£${fixedVal.toFixed(2)} off`;
    }
    
    toast({
      title: "Discount Applied (Simulated)",
      description: `${discountAppliedDescription} set for ${selectedDishForDiscount.dishName}.`,
    });
    setIsDiscountDialogOpen(false);
    setSelectedDishForDiscount(null);
  };


  return (
    <div>
      <PageHeader
        title="Top Dishes by Area"
        description="Discover the most popular and profitable menu items in specific delivery zones."
      />
      <FilterControls onApplyFilters={(filters) => console.log("Applying top dish filters:", filters)} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <InteractiveHeatmapPlaceholder title="Dish Popularity by Area" height="500px" dataAiHint="dish popularity map" />
        </div>
        <div className="space-y-6"> 
          <Card>
            <CardHeader>
              <CardTitle className="font-headline flex items-center">
                <Utensils className="mr-2 h-5 w-5 text-primary" />
                Top Dishes in {selectedArea}
              </CardTitle>
              <CardDescription>Most ordered items in the selected area.</CardDescription>
            </CardHeader>
            <CardContent>
              {dishesForSelectedArea.length > 0 ? (
                <ul className="space-y-4">
                  {dishesForSelectedArea.map((dish) => (
                    <li key={dish.dishName} className="flex items-center gap-4 p-3 bg-muted/30 rounded-lg">
                      <Image 
                        src={`https://placehold.co/64x64.png`}
                        alt={dish.dishName}
                        width={64}
                        height={64}
                        className="rounded-md object-cover"
                        data-ai-hint={dish.imageHint}
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold">{dish.dishName}</h4>
                        <p className="text-sm text-muted-foreground">{dish.category}</p>
                        <div className="flex items-center text-sm text-amber-500">
                          <Star className="h-4 w-4 mr-1 fill-current" /> {dish.rating}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-primary">{dish.revenue}</p>
                        <p className="text-sm text-muted-foreground">{dish.orders} orders</p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">No specific dish data for this area in the selected period.</p>
              )}
            </CardContent>
          </Card>
        </div> 
      </div> 

      {pieChartData.length > 0 && (
        <Card className="mt-6 lg:w-2/3">
          <CardHeader>
            <CardTitle className="font-headline flex items-center">
              <PieChartIcon className="mr-2 h-5 w-5 text-primary" />
              Dish Order Breakdown for {selectedArea}
            </CardTitle>
            <CardDescription>Proportion of orders by dish. Hover for details.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer 
              config={pieChartConfig} 
              className="mx-auto aspect-square h-[420px]"
            >
              <PieChart accessibilityLayer>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                  data={pieChartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={190} 
                  innerRadius={80} 
                  activeIndex={activeIndex ?? undefined}
                  activeShape={renderActiveShape}
                  onMouseEnter={onPieEnter}
                  onMouseLeave={onPieLeave}
                  label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
                    if (index === activeIndex || percent < 0.05) return null;
                    const RADIAN = Math.PI / 180;
                    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                    const x = cx + radius * Math.cos(-midAngle * RADIAN);
                    const y = cy + radius * Math.sin(-midAngle * RADIAN);
                    return (
                      <text x={x} y={y} fill="hsl(var(--card-foreground))" textAnchor="middle" dominantBaseline="central" className="text-xs font-medium pointer-events-none">
                        {`${(percent * 100).toFixed(0)}%`}
                      </text>
                    );
                  }}
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={pieChartConfig[entry.name]?.color || "hsl(var(--muted))"} />
                  ))}
                </Pie>
                <Legend content={({ payload }) => {
                  if (!payload) return null;
                  return (
                    <ul className="flex flex-wrap gap-x-4 gap-y-1 justify-center text-xs mt-4">
                      {payload.map((entry, index) => (
                        <li key={`item-${index}`} className="flex items-center gap-1.5">
                          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                          <span>{entry.value}</span>
                        </li>
                      ))}
                    </ul>
                  );
                }} />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      )}

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="font-headline flex items-center">
            <TrendingUp className="mr-2 h-5 w-5 text-primary" />
            Overall Top Performing Dishes
          </CardTitle>
          <CardDescription>Across all selected areas and filters.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Postcode</TableHead>
                <TableHead>Dish Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Orders</TableHead>
                <TableHead className="text-right">Revenue</TableHead>
                <TableHead className="text-right">Avg. Rating</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topDishesByArea.map((dish) => (
                <TableRow key={`${dish.postcode}-${dish.dishName}`}>
                  <TableCell>{dish.postcode}</TableCell>
                  <TableCell className="font-medium">{dish.dishName}</TableCell>
                  <TableCell>{dish.category}</TableCell>
                  <TableCell className="text-right">{dish.orders}</TableCell>
                  <TableCell className="text-right text-primary font-semibold">{dish.revenue}</TableCell>
                  <TableCell className="text-right">{dish.rating}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="font-headline flex items-center">
            <TrendingDown className="mr-2 h-5 w-5 text-destructive" />
            Overall Low Performing Dishes
          </CardTitle>
          <CardDescription>Items with low orders or revenue. You can add discounts directly from this table to help boost their performance.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Dish Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Orders</TableHead>
                <TableHead className="text-right">Revenue</TableHead>
                <TableHead className="text-right">Avg. Rating</TableHead>
                <TableHead>Reason / Note</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lowPerformingDishes.map((dish, index) => (
                <TableRow key={`${dish.dishName}-${index}`}>
                  <TableCell className="font-medium">{dish.dishName}</TableCell>
                  <TableCell>{dish.category}</TableCell>
                  <TableCell className="text-right">{dish.orders}</TableCell>
                  <TableCell className="text-right text-destructive">{dish.revenue}</TableCell>
                  <TableCell className="text-right">{dish.rating}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{dish.reason}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" onClick={() => handleOpenDiscountDialog(dish)}>
                      <BadgePercent className="mr-2 h-4 w-4" /> Add Discount
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDiscountDialogOpen} onOpenChange={setIsDiscountDialogOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>Add Discount for {selectedDishForDiscount?.dishName || "Item"}</DialogTitle>
            <DialogDescription>
              Set a percentage or fixed amount discount. This will be active until manually removed (simulation).
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="discount-percentage" className="text-right col-span-1">
                Percentage
              </Label>
              <Input
                id="discount-percentage"
                type="number"
                placeholder="e.g., 10 for 10%"
                value={discountPercentage}
                onChange={(e) => setDiscountPercentage(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="relative col-span-4 my-1">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or
                </span>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="fixed-amount" className="text-right col-span-1">
                Fixed Amt (£)
              </Label>
              <Input
                id="fixed-amount"
                type="number"
                placeholder="e.g., 2.50 for £2.50 off"
                value={fixedAmount}
                onChange={(e) => setFixedAmount(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="button" onClick={handleApplyDiscount}>Apply Discount</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
    
