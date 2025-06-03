
"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Filter } from "lucide-react";
import React from "react";

interface FilterControlsProps {
  onApplyFilters?: (filters: any) => void; // Replace any with specific filter type
}

export function FilterControls({ onApplyFilters }: FilterControlsProps) {
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)), // Default to last 30 days
    to: new Date(),
  });
  const [platform, setPlatform] = React.useState<string>("all");
  const [timeOfDay, setTimeOfDay] = React.useState<string>("all");

  // Define DateRange type locally if not available globally
  type DateRange = { from: Date | undefined; to?: Date | undefined };

  const handleApply = () => {
    if (onApplyFilters) {
      onApplyFilters({ dateRange, platform, timeOfDay });
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="font-headline flex items-center">
          <Filter className="mr-2 h-5 w-5 text-primary" />
          Filters
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <div>
            <Label htmlFor="date-range" className="mb-1 block">Date Range</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date-range"
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !dateRange && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "LLL dd, y")} -{" "}
                        {format(dateRange.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(dateRange.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange?.from}
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Label htmlFor="platform-select" className="mb-1 block">Platform</Label>
            <Select value={platform} onValueChange={setPlatform}>
              <SelectTrigger id="platform-select">
                <SelectValue placeholder="Select platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="foodhub">Foodhub</SelectItem>
                <SelectItem value="own_website">Own Website</SelectItem>
                <SelectItem value="all">All Platforms</SelectItem>
                <SelectItem value="justeat">JustEat</SelectItem>
                <SelectItem value="ubereats">UberEats</SelectItem>
                <SelectItem value="deliveroo">Deliveroo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="time-of-day-select" className="mb-1 block">Time of Day</Label>
            <Select value={timeOfDay} onValueChange={setTimeOfDay}>
              <SelectTrigger id="time-of-day-select">
                <SelectValue placeholder="Select time slot" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Day</SelectItem>
                <SelectItem value="morning">Morning (6 AM - 12 PM)</SelectItem>
                <SelectItem value="afternoon">Afternoon (12 PM - 5 PM)</SelectItem>
                <SelectItem value="evening">Evening (5 PM - 9 PM)</SelectItem>
                <SelectItem value="night">Night (9 PM - 6 AM)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button onClick={handleApply} className="w-full md:w-auto bg-primary hover:bg-primary/90">
            Apply Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Re-add Card components as they are used within FilterControls
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

