
"use client";

import { PageHeader } from '@/components/dashboard/page-header';
import { InteractiveHeatmapPlaceholder } from '@/components/dashboard/interactive-heatmap-placeholder';
import { FilterControls } from '@/components/dashboard/filter-controls';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Utensils, Star, TrendingUp } from 'lucide-react';
import Image from 'next/image';

export default function TopDishPage() {
  // Placeholder data
  const topDishesByArea = [
    { postcode: "M1 1AA", dishName: "Pepperoni Pizza", category: "Pizza", orders: 150, revenue: "£1,800", rating: 4.8, imageHint: "pizza pepperoni" },
    { postcode: "M1 1AA", dishName: "Chicken Korma", category: "Curry", orders: 120, revenue: "£1,320", rating: 4.6, imageHint: "chicken korma" },
    { postcode: "M2 2BB", dishName: "Classic Burger", category: "Burgers", orders: 200, revenue: "£1,600", rating: 4.5, imageHint: "burger fries" },
    { postcode: "M2 2BB", dishName: "Pad Thai", category: "Thai", orders: 90, revenue: "£990", rating: 4.7, imageHint: "pad thai" },
    { postcode: "M3 3CC", dishName: "Sushi Platter", category: "Sushi", orders: 70, revenue: "£1,050", rating: 4.9, imageHint: "sushi platter" },
  ];

  // Assume a selected area or show overall top dishes
  const selectedArea = "M1 1AA"; 
  const dishesForSelectedArea = topDishesByArea.filter(d => d.postcode === selectedArea);

  return (
    <div>
      <PageHeader
        title="Top Dishes by Area"
        description="Discover the most popular and profitable menu items in specific delivery zones."
      />
      <FilterControls onApplyFilters={(filters) => console.log("Applying top dish filters:", filters)} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <InteractiveHeatmapPlaceholder title="Dish Popularity by Area" height="500px" dataAiHint="food map items" />
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
    </div>
  );
}
