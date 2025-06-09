
"use client";

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/dashboard/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Store, MapPin, Search as SearchIcon } from 'lucide-react';
// import Link from 'next/link'; // Link is not used in the current version of button action

const mockTakeawaysList = [
  { id: '1', name: 'Speedy Eats', address: '123 Main St, Anytown', description: 'Quick and delicious meals, delivered fast!' },
  { id: '2', name: 'Curry King', address: '456 Oak Ave, Anytown', description: 'Authentic Indian curries and tandoori delights.' },
  { id: '3', name: 'Pizza Planet', address: '789 Pine Ln, Anytown', description: 'Your galaxy of pizza choices, from classic to gourmet.' },
  { id: '4', name: 'Sushi Central', address: '101 Blossom Rd, Anytown', description: 'Fresh sushi, sashimi, and Japanese specialties.' },
  { id: '5', name: 'Burger Barn', address: '202 Farm Rd, Countryside', description: 'Hearty burgers and classic American diner food.' },
  { id: '6', name: 'Noodle House', address: '303 Urban Way, Metro City', description: 'Asian noodles, soups, and stir-fries.' },
];

type Takeaway = typeof mockTakeawaysList[0];

export default function TakeawaysPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTakeaways, setFilteredTakeaways] = useState<Takeaway[]>(mockTakeawaysList);

  useEffect(() => {
    const lowercasedFilter = searchTerm.toLowerCase();
    const filtered = mockTakeawaysList.filter(takeaway =>
      takeaway.name.toLowerCase().includes(lowercasedFilter) ||
      takeaway.description.toLowerCase().includes(lowercasedFilter) ||
      takeaway.address.toLowerCase().includes(lowercasedFilter)
    );
    setFilteredTakeaways(filtered);
  }, [searchTerm]);

  const handleSelectTakeaway = (id: string) => {
    console.log("Selected takeaway ID:", id);
    // Potentially: router.push('/dashboard'); // after setting active takeaway in global state/context
    // For now, this action is a placeholder.
  };

  return (
    <div>
      <PageHeader
        title="Select Your Takeaway"
        description="Choose a takeaway to view its specific dashboard and insights."
      />

      <div className="mb-8">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search takeaways by name, description, or address..."
            className="w-full pl-10 pr-4 py-2 text-base rounded-lg border-2 border-border focus:border-primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {filteredTakeaways.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTakeaways.map((takeaway) => (
            <Card key={takeaway.id} className="flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="font-headline text-2xl flex items-center text-primary">
                  <Store className="mr-3 h-7 w-7" />
                  {takeaway.name}
                </CardTitle>
                <CardDescription className="flex items-center text-sm mt-1 pt-1">
                  <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                  {takeaway.address}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-muted-foreground">{takeaway.description}</p>
              </CardContent>
              <div className="p-6 pt-0 mt-auto">
                <Button
                  onClick={() => handleSelectTakeaway(takeaway.id)}
                  className="w-full bg-primary hover:bg-primary/90 text-lg py-3"
                  // asChild // To allow Link behavior if needed in future
                >
                  {/* <Link href="/dashboard">View Dashboard</Link> */}
                   View Dashboard {/* For prototype, just a button */}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="col-span-full text-center py-12">
          <CardHeader>
            <CardTitle className="font-headline text-xl">No Takeaways Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Your search for "{searchTerm}" did not match any takeaways. Try a different search term.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
