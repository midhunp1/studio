
"use client";

import React, { useState } from 'react';
import { PageHeader } from '@/components/dashboard/page-header';
import { FilterControls } from '@/components/dashboard/filter-controls';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from '@/components/ui/textarea';
import { LineChart, BarChartHorizontalBig, Trash2, Edit3, DollarSign, Package, TrendingDown, TrendingUp as TrendingUpIcon, FileText, PlusCircle, AlertCircle, ShoppingBasket, CalendarCheck, Bell } from 'lucide-react';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Line, LineChart as RechartsLineChart, CartesianGrid, XAxis, YAxis, Legend, ResponsiveContainer, Bar, BarChart as RechartsBarChart } from "recharts";
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const cogsData = [
  { month: "Jan", cogsPercentage: 32 },
  { month: "Feb", cogsPercentage: 31 },
  { month: "Mar", cogsPercentage: 33 },
  { month: "Apr", cogsPercentage: 30 },
  { month: "May", cogsPercentage: 29 },
  { month: "Jun", cogsPercentage: 30 },
];

const cogsChartConfig = {
  cogsPercentage: { label: "COGS %", color: "hsl(var(--primary))" },
} satisfies ChartConfig;

type Ingredient = { name: string; cost: number };
type RecipeItem = {
  id: string;
  name: string;
  category: string;
  costPrice: number;
  sellingPrice: number;
  ingredients: Ingredient[];
};

const recipeCostData: RecipeItem[] = [
  { 
    id: "dish1", 
    name: "Margherita Pizza", 
    category: "Pizza", 
    costPrice: 2.50, 
    sellingPrice: 10.00,
    ingredients: [
      { name: "Pizza Dough", cost: 0.80 },
      { name: "Tomato Sauce", cost: 0.50 },
      { name: "Mozzarella Cheese", cost: 1.00 },
      { name: "Herbs & Spices", cost: 0.20 },
    ]
  },
  { 
    id: "dish2", 
    name: "Chicken Tikka Masala", 
    category: "Curry", 
    costPrice: 3.80, 
    sellingPrice: 12.50,
    ingredients: [
      { name: "Chicken Breast", cost: 1.50 },
      { name: "Tikka Masala Sauce", cost: 1.20 },
      { name: "Cream", cost: 0.60 },
      { name: "Spices", cost: 0.30 },
      { name: "Garnish", cost: 0.20 },
    ]
  },
  { 
    id: "dish3", 
    name: "Classic Beef Burger", 
    category: "Burger", 
    costPrice: 3.10, 
    sellingPrice: 9.00,
    ingredients: [
      { name: "Beef Patty", cost: 1.50 },
      { name: "Burger Bun", cost: 0.50 },
      { name: "Lettuce", cost: 0.20 },
      { name: "Tomato Slice", cost: 0.15 },
      { name: "Cheese Slice", cost: 0.40 },
      { name: "Burger Sauce", cost: 0.35 },
    ] 
  },
  { 
    id: "dish4", 
    name: "Caesar Salad", 
    category: "Salad", 
    costPrice: 1.80, 
    sellingPrice: 7.50,
    ingredients: [
      { name: "Lettuce", cost: 0.50 },
      { name: "Croutons", cost: 0.30 },
      { name: "Parmesan Cheese", cost: 0.50 },
      { name: "Caesar Dressing", cost: 0.40 },
      { name: "Optional Chicken", cost: 0.00 }, 
    ]
  },
  { 
    id: "dish5", 
    name: "Fries", 
    category: "Sides", 
    costPrice: 0.50, 
    sellingPrice: 3.00,
    ingredients: [
      { name: "Potatoes", cost: 0.30 },
      { name: "Oil & Seasoning", cost: 0.20 },
    ]
  },
];

const wasteLogData = [
    { id: "waste1", item: "Tomatoes", quantity: "2 kg", reason: "Spoiled", cost: 3.00, date: "2024-07-28" },
    { id: "waste2", item: "Pizza Dough", quantity: "5 units", reason: "Over-proofed", cost: 2.50, date: "2024-07-27" },
    { id: "waste3", item: "Lettuce", quantity: "1 head", reason: "Expired", cost: 0.80, date: "2024-07-26" },
];

const supplierPriceData = [
  { id: "sup1", ingredient: "Chicken Breast", supplier: "FreshMeats Ltd.", lastPrice: 5.50, prevPrice: 5.20, unit: "kg", lastUpdated: "2024-07-25" },
  { id: "sup2", ingredient: "Mozzarella Cheese", supplier: "DairyBest Inc.", lastPrice: 7.00, prevPrice: 7.00, unit: "kg", lastUpdated: "2024-07-20" },
  { id: "sup3", ingredient: "Pizza Flour (Type 00)", supplier: "Millers Choice", lastPrice: 15.00, prevPrice: 14.50, unit: "25kg bag", lastUpdated: "2024-07-15" },
  { id: "sup4", ingredient: "Tomatoes (Plum)", supplier: "FarmFresh Co.", lastPrice: 2.20, prevPrice: 2.50, unit: "kg", lastUpdated: "2024-07-28" },
];

const batchExpiryData = [
  { id: "batch1", ingredientName: "Chicken Breast", batchId: "CB240730A", purchaseDate: "2024-07-30", expiryDate: "2024-08-05", quantity: "10 kg", status: "Fresh" },
  { id: "batch2", ingredientName: "Fresh Cream", batchId: "CRM240728B", purchaseDate: "2024-07-28", expiryDate: "2024-08-02", quantity: "2 L", status: "Nearing Expiry" },
  { id: "batch3", ingredientName: "Tomatoes", batchId: "TOM240725C", purchaseDate: "2024-07-25", expiryDate: "2024-07-31", quantity: "5 kg", status: "Use Soon" },
  { id: "batch4", ingredientName: "Pizza Dough Mix", batchId: "PDM240701D", purchaseDate: "2024-07-01", expiryDate: "2024-12-01", quantity: "1 bag", status: "Good" },
  { id: "batch5", ingredientName: "Cheddar Cheese", batchId: "CH240715E", purchaseDate: "2024-07-15", expiryDate: "2024-07-29", quantity: "1 kg", status: "Expired" },
];


export default function CostControlPage() {
  const { toast } = useToast();
  const [wasteItem, setWasteItem] = useState('');
  const [wasteQuantity, setWasteQuantity] = useState('');
  const [wasteReason, setWasteReason] = useState('');
  const [wasteEstCost, setWasteEstCost] = useState('');

  const [isIngredientDialogOpen, setIsIngredientDialogOpen] = useState(false);
  const [selectedDishForIngredients, setSelectedDishForIngredients] = useState<RecipeItem | null>(null);

  const handleLogWaste = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!wasteItem || !wasteQuantity || !wasteReason || !wasteEstCost) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please fill out all fields to log waste.",
      });
      return;
    }
    console.log({ wasteItem, wasteQuantity, wasteReason, wasteEstCost });
    toast({
      title: "Waste Logged",
      description: `${wasteQuantity} of ${wasteItem} logged as waste. Reason: ${wasteReason}. Estimated Cost: £${parseFloat(wasteEstCost).toFixed(2)}`,
    });
    setWasteItem('');
    setWasteQuantity('');
    setWasteReason('');
    setWasteEstCost('');
  };
  
  const calculateProfit = (cost: number, selling: number) => {
    const profit = selling - cost;
    const gpPercentage = selling > 0 ? (profit / selling) * 100 : 0;
    return { profit: profit.toFixed(2), gpPercentage: gpPercentage.toFixed(1) + '%' };
  };

  const handleViewIngredients = (dish: RecipeItem) => {
    setSelectedDishForIngredients(dish);
    setIsIngredientDialogOpen(true);
  };

  const totalIngredientCost = selectedDishForIngredients?.ingredients.reduce((sum, ing) => sum + ing.cost, 0) || 0;

  const handleLogNewBatch = () => {
    toast({
      title: "Log New Batch (Simulated)",
      description: "In a real application, this would open a form to log new ingredient batches.",
    });
  };

  const getStatusBadgeVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status.toLowerCase()) {
      case "fresh":
      case "good":
        return "default"; // Or a success-like color if you add one
      case "nearing expiry":
      case "use soon":
        return "secondary"; // Yellow-ish
      case "expired":
        return "destructive"; // Red
      default:
        return "outline";
    }
  };


  return (
    <div>
      <PageHeader
        title="Cost Control & Inventory Management"
        description="Analyze COGS, track waste, manage supplier prices, and optimize recipe profitability."
      />
      <FilterControls onApplyFilters={(filters) => console.log("Applying cost control filters:", filters)} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline flex items-center">
              <LineChart className="mr-2 h-5 w-5 text-primary" />
              COGS Analysis
            </CardTitle>
            <CardDescription>Cost of Goods Sold percentage over recent months.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={cogsChartConfig} className="h-[250px] w-full">
              <RechartsLineChart data={cogsData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false}/>
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" tick={{fontSize: 12}}/>
                <YAxis unit="%" stroke="hsl(var(--muted-foreground))" tick={{fontSize: 12}} domain={['auto', 'auto']}/>
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Line type="monotone" dataKey="cogsPercentage" stroke="var(--color-cogsPercentage)" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </RechartsLineChart>
            </ChartContainer>
             <div className="mt-4 pt-4 border-t text-center">
                <p className="text-sm text-muted-foreground">Current Average COGS: <span className="font-semibold text-primary">{(cogsData.reduce((acc, curr) => acc + curr.cogsPercentage, 0) / cogsData.length).toFixed(1)}%</span></p>
             </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline flex items-center">
              <DollarSign className="mr-2 h-5 w-5 text-primary" />
              Recipe Costing & Profitability
            </CardTitle>
            <CardDescription>Analyze cost, selling price, and profit for menu items. Click a row for ingredient breakdown.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="max-h-[300px] overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Dish</TableHead>
                    <TableHead className="text-right">Cost (£)</TableHead>
                    <TableHead className="text-right">Selling (£)</TableHead>
                    <TableHead className="text-right">GP (£)</TableHead>
                    <TableHead className="text-right">GP %</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recipeCostData.map((item) => {
                    const { profit, gpPercentage } = calculateProfit(item.costPrice, item.sellingPrice);
                    return (
                        <TableRow 
                          key={item.id} 
                          onClick={() => handleViewIngredients(item)}
                          className="cursor-pointer hover:bg-muted/50"
                        >
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell className="text-right">{item.costPrice.toFixed(2)}</TableCell>
                          <TableCell className="text-right">{item.sellingPrice.toFixed(2)}</TableCell>
                          <TableCell className={`text-right font-semibold ${parseFloat(profit) < 0 ? 'text-destructive' : 'text-green-500'}`}>{profit}</TableCell>
                          <TableCell className={`text-right font-semibold ${parseFloat(profit) < 0 ? 'text-destructive' : 'text-green-500'}`}>{gpPercentage}</TableCell>
                        </TableRow>
                    );
                   })}
                </TableBody>
              </Table>
            </div>
            <Button variant="outline" className="w-full mt-4">
              <FileText className="mr-2 h-4 w-4" /> View Detailed Recipe Costs
            </Button>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isIngredientDialogOpen} onOpenChange={setIsIngredientDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <ShoppingBasket className="mr-2 h-5 w-5 text-primary" />
              Ingredient Breakdown: {selectedDishForIngredients?.name}
            </DialogTitle>
            <DialogDescription>
              Costs for each ingredient used in {selectedDishForIngredients?.name || "this dish"}.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-3">
            {selectedDishForIngredients?.ingredients && selectedDishForIngredients.ingredients.length > 0 ? (
              <div className="max-h-[250px] overflow-y-auto pr-2">
                {selectedDishForIngredients.ingredients.map((ingredient, index) => (
                  <div key={index} className="flex justify-between items-center text-sm py-1.5 border-b border-border/50">
                    <span className="text-muted-foreground">{ingredient.name}</span>
                    <span className="font-medium text-foreground">£{ingredient.cost.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No ingredient details available for this dish.</p>
            )}
            <Separator className="my-2" />
            <div className="flex justify-between items-center font-semibold text-base">
              <span className="text-primary">Total Ingredient Cost:</span>
              <span className="text-primary">£{totalIngredientCost.toFixed(2)}</span>
            </div>
             <p className="text-xs text-muted-foreground text-center pt-2">
              This total cost matches the 'Cost (£)' shown in the main table for {selectedDishForIngredients?.name}.
            </p>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>


      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="font-headline flex items-center">
              <Trash2 className="mr-2 h-5 w-5 text-destructive" />
              Waste Tracking
            </CardTitle>
            <CardDescription>Log food waste and view recent entries.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogWaste} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 mb-6 items-end p-4 border rounded-lg bg-muted/30">
              <div className="space-y-1 sm:col-span-2 md:col-span-1">
                <Label htmlFor="waste-item">Item Name</Label>
                <Input id="waste-item" placeholder="e.g., Tomatoes" value={wasteItem} onChange={(e) => setWasteItem(e.target.value)} />
              </div>
              <div className="space-y-1 md:col-span-1">
                <Label htmlFor="waste-quantity">Quantity</Label>
                <Input id="waste-quantity" placeholder="e.g., 2 kg" value={wasteQuantity} onChange={(e) => setWasteQuantity(e.target.value)} />
              </div>
              <div className="space-y-1 sm:col-span-2 md:col-span-1">
                <Label htmlFor="waste-reason">Reason</Label>
                 <Select value={wasteReason} onValueChange={setWasteReason}>
                    <SelectTrigger id="waste-reason">
                        <SelectValue placeholder="Select reason" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="spoiled">Spoiled/Expired</SelectItem>
                        <SelectItem value="over-production">Over-production</SelectItem>
                        <SelectItem value="cooking-error">Cooking Error</SelectItem>
                        <SelectItem value="damaged">Damaged</SelectItem>
                        <SelectItem value="customer-return">Customer Return</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                </Select>
              </div>
               <div className="space-y-1 md:col-span-1">
                <Label htmlFor="waste-cost">Est. Cost (£)</Label>
                <Input id="waste-cost" type="number" step="0.01" placeholder="e.g., 3.50" value={wasteEstCost} onChange={(e) => setWasteEstCost(e.target.value)} />
              </div>
              <Button type="submit" className="w-full sm:col-span-2 md:col-span-1 bg-destructive hover:bg-destructive/90">
                <PlusCircle className="mr-2 h-4 w-4" /> Log Waste
              </Button>
            </form>
            
            <h4 className="font-semibold text-lg mb-2 text-muted-foreground">Recent Waste Logs:</h4>
            {wasteLogData.length > 0 ? (
                 <div className="max-h-[200px] overflow-y-auto">
                    <Table>
                        <TableHeader>
                        <TableRow>
                            <TableHead>Item</TableHead>
                            <TableHead>Qty</TableHead>
                            <TableHead>Reason</TableHead>
                            <TableHead className="text-right">Cost (£)</TableHead>
                            <TableHead>Date</TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                        {wasteLogData.map((log) => (
                            <TableRow key={log.id}>
                            <TableCell className="font-medium">{log.item}</TableCell>
                            <TableCell>{log.quantity}</TableCell>
                            <TableCell>{log.reason}</TableCell>
                            <TableCell className="text-right text-destructive">{log.cost.toFixed(2)}</TableCell>
                            <TableCell className="text-xs text-muted-foreground">{log.date}</TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                </div>
            ) : (
                 <p className="text-sm text-muted-foreground">No waste logged recently.</p>
            )}
            <Button variant="secondary" className="w-full mt-4">
              <FileText className="mr-2 h-4 w-4" /> View Full Waste Report
            </Button>
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader>
             <CardTitle className="font-headline flex items-center">
                <AlertCircle className="mr-2 h-5 w-5 text-amber-500" />
                Key Cost Insights
             </CardTitle>
             <CardDescription>Summary of important cost-related metrics.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 bg-muted/30 rounded-lg">
                <p className="text-sm text-muted-foreground">Highest Cost Dish (GP %)</p>
                <p className="font-semibold text-destructive">Caesar Salad (24% GP)</p>
            </div>
             <div className="p-3 bg-muted/30 rounded-lg">
                <p className="text-sm text-muted-foreground">Most Profitable Dish (GP %)</p>
                <p className="font-semibold text-green-500">Fries (83.3% GP)</p>
            </div>
            <div className="p-3 bg-muted/30 rounded-lg">
                <p className="text-sm text-muted-foreground">Total Estimated Waste (Last 7 Days)</p>
                <p className="font-semibold text-destructive">£{(wasteLogData.reduce((sum, item) => sum + item.cost, 0)).toFixed(2)}</p>
            </div>
             <div className="p-3 bg-muted/30 rounded-lg">
                <p className="text-sm text-muted-foreground">Supplier with Most Price Increases</p>
                <p className="font-semibold text-amber-600">FreshMeats Ltd.</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="font-headline flex items-center">
            <CalendarCheck className="mr-2 h-5 w-5 text-primary" />
            Batch & Expiry Management (Simulated)
          </CardTitle>
          <CardDescription>Track ingredient batches and expiry dates to reduce spoilage and ensure freshness.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-semibold text-lg text-muted-foreground">Current Batch Overview:</h4>
            <Button variant="outline" onClick={handleLogNewBatch}>
              <PlusCircle className="mr-2 h-4 w-4" /> Log New Batch
            </Button>
          </div>
          {batchExpiryData.length > 0 ? (
            <div className="max-h-[300px] overflow-y-auto mb-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ingredient</TableHead>
                    <TableHead>Batch ID</TableHead>
                    <TableHead>Purchase Date</TableHead>
                    <TableHead>Expiry Date</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {batchExpiryData.map((batch) => (
                    <TableRow key={batch.id}>
                      <TableCell className="font-medium">{batch.ingredientName}</TableCell>
                      <TableCell>{batch.batchId}</TableCell>
                      <TableCell>{batch.purchaseDate}</TableCell>
                      <TableCell>{batch.expiryDate}</TableCell>
                      <TableCell>{batch.quantity}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(batch.status)}>{batch.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">No batch data logged.</p>
          )}
          
          <Separator className="my-4" />

          <div>
            <h4 className="font-semibold text-lg mb-2 text-muted-foreground flex items-center">
              <Bell className="mr-2 h-5 w-5 text-destructive" />
              Expiry Alerts (Simulated)
            </h4>
            <div className="space-y-3">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Nearing Expiry: Fresh Cream!</AlertTitle>
                <AlertDescription>
                  Batch CRM240728B (2 L) is due to expire on 2024-08-02. Prioritize its use.
                </AlertDescription>
              </Alert>
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Use Soon: Tomatoes</AlertTitle>
                <AlertDescription>
                  Batch TOM240725C (5 kg) expires on 2024-07-31. Plan recipes accordingly.
                </AlertDescription>
              </Alert>
               <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Expired: Cheddar Cheese</AlertTitle>
                <AlertDescription>
                  Batch CH240715E (1 kg) expired on 2024-07-29. Please remove from stock and log as waste.
                </AlertDescription>
              </Alert>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center">
            <Package className="mr-2 h-5 w-5 text-primary" />
            Supplier Price Analysis
          </CardTitle>
          <CardDescription>Track price fluctuations for key ingredients from your suppliers.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="max-h-[400px] overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ingredient</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead className="text-right">Last Price (£)</TableHead>
                  <TableHead className="text-right">Prev. Price (£)</TableHead>
                  <TableHead className="text-right">Change</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {supplierPriceData.map((item) => {
                  const priceChange = item.lastPrice - item.prevPrice;
                  const changePercentage = item.prevPrice > 0 ? (priceChange / item.prevPrice) * 100 : 0;
                  return (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.ingredient}</TableCell>
                      <TableCell>{item.supplier}</TableCell>
                      <TableCell className="text-right">{item.lastPrice.toFixed(2)}</TableCell>
                      <TableCell className="text-right">{item.prevPrice.toFixed(2)}</TableCell>
                      <TableCell className={`text-right font-semibold ${priceChange > 0 ? 'text-destructive' : priceChange < 0 ? 'text-green-500' : 'text-muted-foreground'}`}>
                        {priceChange > 0 && <TrendingUpIcon className="inline h-4 w-4 mr-1" />}
                        {priceChange < 0 && <TrendingDown className="inline h-4 w-4 mr-1" />}
                        {priceChange !== 0 ? `${changePercentage.toFixed(1)}%` : '-'}
                      </TableCell>
                      <TableCell>{item.unit}</TableCell>
                      <TableCell className="text-xs">{item.lastUpdated}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" onClick={() => toast({ title: "Action: Edit Supplier", description: `Editing details for ${item.ingredient} from ${item.supplier}` })}>
                          <Edit3 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          <Button variant="outline" className="w-full mt-4">
            <PlusCircle className="mr-2 h-4 w-4" /> Add/Manage Suppliers & Ingredients
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

