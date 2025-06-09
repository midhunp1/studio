
import type React from 'react';

export default function TakeawaysFullScreenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
