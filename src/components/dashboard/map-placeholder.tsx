import { MapPin } from 'lucide-react';
import Image from 'next/image';

interface MapPlaceholderProps {
  title?: string;
  height?: string;
  dataAiHint?: string;
}

export function MapPlaceholder({ title = "Map Data Visualization", height = "400px", dataAiHint = "map abstract" }: MapPlaceholderProps) {
  return (
    <div 
      className="w-full bg-muted/50 border border-dashed border-border rounded-lg flex flex-col items-center justify-center p-8 text-center shadow-inner"
      style={{ height }}
      aria-label={title}
    >
      <Image 
        src={`https://placehold.co/600x${parseInt(height) * 0.8}.png`}
        alt="Abstract map placeholder"
        width={600}
        height={parseInt(height) * 0.8}
        className="rounded-md mb-4 opacity-70"
        data-ai-hint={dataAiHint}
      />
      <MapPin className="h-12 w-12 text-primary mb-4" />
      <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground">Interactive map will be displayed here.</p>
    </div>
  );
}
