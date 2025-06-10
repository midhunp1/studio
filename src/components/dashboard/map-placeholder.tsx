
import { MapPin } from 'lucide-react';
import Image from 'next/image';

interface MapPlaceholderProps {
  title?: string;
  height?: string;
  dataAiHint?: string;
}

export function MapPlaceholder({ title = "Map Data Visualization", height = "400px", dataAiHint = "UK map" }: MapPlaceholderProps) {
  return (
    <div
      className="w-full bg-muted/50 border border-dashed border-border rounded-lg flex flex-col items-center justify-center p-6 text-center shadow-inner"
      style={{ height }}
      aria-label={title}
    >
      <div className="relative w-[300px] h-[225px] sm:w-[400px] sm:h-[300px] rounded-md overflow-hidden border-2 border-primary/50 mb-3">
        <Image
          src="https://placehold.co/600x450.png" 
          alt={title || "Map Placeholder"}
          layout="fill"
          objectFit="cover"
          className="opacity-90"
          data-ai-hint={dataAiHint}
        />
      </div>
      <MapPin className="h-8 w-8 text-primary mb-2" />
      <h3 className="text-lg font-semibold text-foreground mb-1">{title}</h3>
      <p className="text-xs text-muted-foreground px-2">
        Map visualization placeholder.
      </p>
    </div>
  );
}
