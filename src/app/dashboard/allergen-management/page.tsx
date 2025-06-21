
"use client";

import React, { useState, useMemo } from 'react';
import { PageHeader } from '@/components/dashboard/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShieldAlert, BarChart3, Edit3, Search, Percent, WheatOff, MilkOff, AlertCircle } from 'lucide-react';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart as RechartsBarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip as RechartsTooltip } from "recharts";
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ProductAllergen {
  id: string;
  name: string;
  category: string;
  allergens: string[];
  imageHint: string;
}

const mockProducts: ProductAllergen[] = [
  { id: "prod1", name: "Classic Margherita Pizza", category: "Pizza", allergens: ["Gluten", "Dairy"], imageHint: "margherita pizza" },
  { id: "prod2", name: "Pepperoni Passion Pizza", category: "Pizza", allergens: ["Gluten", "Dairy", "Sulphites"], imageHint: "pepperoni pizza" },
  { id: "prod3", name: "Chicken Tikka Masala", category: "Curry", allergens: ["Dairy", "Nuts (Cashews)"], imageHint: "chicken tikka masala" },
  { id: "prod4", name: "Vegetable Biryani", category: "Rice", allergens: [], imageHint: "vegetable biryani" },
  { id: "prod5", name: "Beef Burger with Cheese", category: "Burgers", allergens: ["Gluten", "Dairy", "Sesame (Bun)"], imageHint: "beef burger cheese" },
  { id: "prod6", name: "Caesar Salad", category: "Salad", allergens: ["Gluten (Croutons)", "Dairy (Dressing, Parmesan)", "Fish (Anchovies in dressing)", "Eggs (Dressing)"], imageHint: "caesar salad" },
  { id: "prod7", name: "Chocolate Fudge Cake", category: "Dessert", allergens: ["Gluten", "Dairy", "Eggs", "Soy (Lecithin)"], imageHint: "chocolate cake" },
  { id: "prod8", name: "Prawn Pad Thai", category: "Thai", allergens: ["Shellfish (Prawns)", "Nuts (Peanuts)", "Soy", "Eggs"], imageHint: "pad thai shrimp" },
  { id: "prod9", name: "Garlic Bread", category: "Sides", allergens: ["Gluten", "Dairy (Butter)"], imageHint: "garlic bread" },
  { id: "prod10", name: "Fries", category: "Sides", allergens: [], imageHint: "fries side dish" },
];

const allPossibleAllergens = [
  "Gluten", "Dairy", "Nuts", "Soy", "Eggs", "Fish", "Shellfish", 
  "Sesame", "Celery", "Mustard", "Lupin", "Sulphites", "Peanuts"
];


const allergenChartConfig: ChartConfig = {
  count: { label: "Dishes", color: "hsl(var(--destructive))" },
};

export default function AllergenManagementPage() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = useMemo(() => {
    return mockProducts.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.allergens.some(allergen => allergen.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [searchTerm]);

  const allergenCounts = useMemo(() => {
    const counts: { [key: string]: number } = {};
    allPossibleAllergens.forEach(allergen => counts[allergen] = 0);

    mockProducts.forEach(product => {
      product.allergens.forEach(allergen => {
        // Normalize common variations like "Nuts (Cashews)" to "Nuts" for counting
        const mainAllergen = allergen.split(' (')[0];
        if (counts[mainAllergen] !== undefined) {
          counts[mainAllergen]++;
        } else if (counts[allergen] !== undefined) { // Fallback for specific entries not covered by main
            counts[allergen]++;
        }
      });
    });
    return Object.entries(counts)
      .map(([allergen, count]) => ({ allergen, count }))
      .filter(a => a.count > 0) // Only show allergens present in products
      .sort((a, b) => b.count - a.count);
  }, []);
  
  const allergenFreeStats = useMemo(() => {
    const totalDishes = mockProducts.length;
    const glutenFreeCount = mockProducts.filter(p => !p.allergens.some(a => a.toLowerCase().includes("gluten"))).length;
    const dairyFreeCount = mockProducts.filter(p => !p.allergens.some(a => a.toLowerCase().includes("dairy"))).length;
    const nutFreeCount = mockProducts.filter(p => !p.allergens.some(a => a.toLowerCase().includes("nut") || a.toLowerCase().includes("peanut"))).length;
    
    return [
      { name: "Gluten-Free", count: glutenFreeCount, percentage: Math.round((glutenFreeCount / totalDishes) * 100), icon: WheatOff },
      { name: "Dairy-Free", count: dairyFreeCount, percentage: Math.round((dairyFreeCount / totalDishes) * 100), icon: MilkOff },
      { name: "Nut-Free", count: nutFreeCount, percentage: Math.round((nutFreeCount / totalDishes) * 100), icon: AlertCircle }, // Using AlertCircle as generic "free-from"
    ];
  }, []);

  const handleManageAllergens = (productName: string) => {
    toast({
      title: "Manage Allergens (Simulated)",
      description: `In a real app, this would open an interface to edit allergens for ${productName}.`,
    });
  };

  const getAllergenBadgeVariant = (allergen: string): "default" | "secondary" | "destructive" | "outline" => {
    const lowerAllergen = allergen.toLowerCase();
    if (["nuts", "peanuts", "shellfish", "fish"].some(a => lowerAllergen.includes(a))) return "destructive";
    if (["gluten", "dairy", "soy", "eggs"].some(a => lowerAllergen.includes(a))) return "secondary";
    return "outline";
  };


  return (
    <div>
      <PageHeader
        title="Allergen Management & Insights"
        description="View and manage product allergens, and analyze allergen distribution across your menu."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="font-headline flex items-center">
              <BarChart3 className="mr-2 h-5 w-5 text-primary" />
              Allergen Statistics
            </CardTitle>
            <CardDescription>Frequency of common allergens in your dishes.</CardDescription>
          </CardHeader>
          <CardContent>
            {allergenCounts.length > 0 ? (
                <ChartContainer config={allergenChartConfig} className="h-[250px] w-full">
                <RechartsBarChart data={allergenCounts.slice(0, 5)} layout="vertical" margin={{ right: 20, left: 20 }}>
                    <CartesianGrid horizontal={false} />
                    <XAxis type="number" dataKey="count" />
                    <YAxis dataKey="allergen" type="category" width={80} className="text-xs"/>
                    <RechartsTooltip 
                        cursor={{fill: 'hsl(var(--muted))'}}
                        content={<ChartTooltipContent indicator="line" />}
                    />
                    <Bar dataKey="count" fill="var(--color-count)" radius={4} />
                </RechartsBarChart>
                </ChartContainer>
            ) : (
                <p className="text-muted-foreground text-sm">No allergen data to display for chart.</p>
            )}
            <div className="mt-4 pt-4 border-t">
              <h3 className="text-sm font-semibold text-muted-foreground mb-2">Allergen-Free Options:</h3>
              <div className="space-y-2">
                {allergenFreeStats.map(stat => {
                  const Icon = stat.icon;
                  return (
                    <div key={stat.name} className="flex items-center justify-between text-xs p-2 bg-muted/50 rounded-md">
                      <div className="flex items-center">
                         <Icon className="mr-2 h-4 w-4 text-primary" />
                         <span>{stat.name}</span>
                      </div>
                      <Badge variant="secondary">{stat.count} dishes ({stat.percentage}%)</Badge>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="font-headline flex items-center">
              <ShieldAlert className="mr-2 h-5 w-5 text-primary" />
              Product Allergen List
            </CardTitle>
            <CardDescription>Search and view allergens for each product.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search by product name, category, or allergen..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-full"
                />
              </div>
            </div>
            <ScrollArea className="h-[400px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Allergens</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>
                        {product.allergens.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {product.allergens.map(allergen => (
                              <Badge key={allergen} variant={getAllergenBadgeVariant(allergen)} className="text-xs">
                                {allergen}
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          <Badge variant="outline" className="text-xs border-green-500 text-green-600 bg-green-500/10">None Listed</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => handleManageAllergens(product.name)}>
                          <Edit3 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredProducts.length === 0 && (
                     <TableRow>
                        <TableCell colSpan={4} className="text-center text-muted-foreground">
                        No products match your search.
                        </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
