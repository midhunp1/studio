
"use client";

import { PageHeader } from '@/components/dashboard/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Store, MapPin } from 'lucide-react';
import Link from 'next/link';

const mockTakeaways = [
  { id: '1', name: 'Speedy Eats', address: '123 Main St, Anytown', description: 'Quick and delicious meals, delivered fast!' },
  { id: '2', name: 'Curry King', address: '456 Oak Ave, Anytown', description: 'Authentic Indian curries and tandoori delights.' },
  { id: '3', name: 'Pizza Planet', address: '789 Pine Ln, Anytown', description: 'Your galaxy of pizza choices, from classic to gourmet.' },
  { id: '4', name: 'Sushi Central', address: '101 Blossom Rd, Anytown', description: 'Fresh sushi, sashimi, and Japanese specialties.' },
];

export default function TakeawaysPage() {
  // In a real app, clicking a takeaway would set it as active and redirect or update state.
  // For this prototype, we'll just list them.
  const handleSelectTakeaway = (id: string) => {
    console.log("Selected takeaway ID:", id);
    // Potentially: router.push('/dashboard'); // after setting active takeaway in global state/context
  };

  return (
    <div>
      <PageHeader
        title="Select a Takeaway"
        description="Choose a takeaway to view its specific dashboard and insights."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockTakeaways.map((takeaway) => (
          <Card key={takeaway.id} className="flex flex-col">
            <CardHeader>
              <CardTitle className="font-headline flex items-center">
                <Store className="mr-2 h-6 w-6 text-primary" />
                {takeaway.name}
              </CardTitle>
              <CardDescription className="flex items-center text-sm mt-1">
                <MapPin className="mr-1 h-4 w-4 text-muted-foreground" />
                {takeaway.address}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-muted-foreground">{takeaway.description}</p>
            </CardContent>
            <div className="p-6 pt-0">
              {/* In a real app, this button might link to a specific dashboard or set the active takeaway */}
              <Button 
                onClick={() => handleSelectTakeaway(takeaway.id)} 
                className="w-full bg-primary hover:bg-primary/90"
                asChild // To allow Link behavior if needed in future
              >
                {/* <Link href="/dashboard">Select & View Dashboard</Link> */}
                 Select & View Dashboard {/* For prototype, just a button */}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
