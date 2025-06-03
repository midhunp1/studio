
import { MapPin } from 'lucide-react';
import Image from 'next/image';

interface MapPlaceholderProps {
  title?: string;
  height?: string;
  dataAiHint?: string;
}

export function MapPlaceholder({ title = "Map Data Visualization", height = "400px", dataAiHint = "London heatmap" }: MapPlaceholderProps) {
  return (
    <div
      className="w-full bg-muted/50 border border-dashed border-border rounded-lg flex flex-col items-center justify-center p-8 text-center shadow-inner"
      style={{ height }}
      aria-label={title}
    >
      <Image
        src={`https://placehold.co/600x${Math.max(100, parseInt(height) * 0.6)}.png`} // Ensure placeholder image height is reasonable
        alt="Abstract map placeholder"
        width={600}
        height={Math.max(100, parseInt(height) * 0.6)} // Ensure placeholder image height is reasonable
        className="rounded-md mb-4 opacity-70 object-cover" // Added object-cover
        data-ai-hint={dataAiHint}
      />
      <MapPin className="h-12 w-12 text-primary mb-4" />
      <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground">Static map placeholder. Interactive version coming soon.</p>
    </div>
  );
}

