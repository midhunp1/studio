import { PageHeader } from '@/components/dashboard/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, Map, Brain, Clock } from 'lucide-react';
import Image from 'next/image';

export default function DashboardOverviewPage() {
  const quickLinks = [
    { title: 'Delivery Heatmap', href: '/dashboard/delivery-area', icon: Map, description: 'Visualize your hottest delivery zones.', dataAiHint: 'map location' },
    { title: 'AI Suggestions', href: '/dashboard/ai-suggestions', icon: Brain, description: 'Get smart insights for your business.', dataAiHint: 'artificial intelligence' },
    { title: 'Time-Based Insights', href: '/dashboard/time-based', icon: Clock, description: 'Discover your peak order times.', dataAiHint: 'clock time' },
  ];

  return (
    <div>
      <PageHeader
        title="Welcome to OrderLens"
        description="Your command center for hyperlocal takeaway insights."
      />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="font-headline">Unlock Your Data's Potential</CardTitle>
            <CardDescription>
              OrderLens helps you understand customer behavior, optimize operations, and boost profits by visualizing your order data in powerful new ways.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Navigate through the sidebar to explore various heatmaps, analyze top dishes, and get AI-powered suggestions tailored to your business.
            </p>
            <Image
              src="https://placehold.co/600x300.png"
              alt="Data visualization abstract"
              width={600}
              height={300}
              className="rounded-lg object-cover w-full"
              data-ai-hint="data visualization"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Quick Links</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {quickLinks.map((link) => (
              <Link href={link.href} key={link.href} legacyBehavior>
                <a className="block p-4 rounded-lg border hover:bg-muted transition-colors">
                  <div className="flex items-center gap-3">
                    <link.icon className="h-6 w-6 text-primary" />
                    <div>
                      <h3 className="font-semibold">{link.title}</h3>
                      <p className="text-sm text-muted-foreground">{link.description}</p>
                    </div>
                    <ArrowRight className="ml-auto h-5 w-5 text-muted-foreground" />
                  </div>
                </a>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Getting Started</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
              <li>Explore the <span className="text-primary font-semibold">Delivery Area Heatmap</span> to see where your orders are concentrated.</li>
              <li>Check <span className="text-primary font-semibold">AI Suggestions</span> for tailored advice on promotions and operations.</li>
              <li>Analyze <span className="text-primary font-semibold">Top Dishes by Area</span> to refine your menu for specific zones.</li>
            </ol>
            <Button asChild className="mt-6 bg-accent text-accent-foreground hover:bg-accent/90">
              <Link href="/dashboard/ai-suggestions">
                Get Your First AI Suggestion
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
