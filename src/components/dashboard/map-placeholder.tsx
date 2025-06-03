
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
      className="w-full bg-muted/50 border border-dashed border-border rounded-lg flex flex-col items-center justify-center p-6 text-center shadow-inner"
      style={{ height }}
      aria-label={title}
    >
      <div className="w-full flex justify-center mb-3">
        <Image
          src="/uk-heatmap-demo.jpg" 
          alt={title || "UK Heatmap Demo"}
          width={400} 
          height={300} 
          className="rounded-md opacity-90 border-4 border-red-500" // Added prominent border for visibility
          data-ai-hint={dataAiHint}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            console.error('Image failed to load:', target.src);
          }}
        />
      </div>
      <MapPin className="h-8 w-8 text-primary mb-2" />
      <h3 className="text-lg font-semibold text-foreground mb-1">{title}</h3>
      <p className="text-xs text-muted-foreground px-2">
        Attempting to display <code className="text-xs bg-muted p-0.5 rounded">uk-heatmap-demo.jpg</code> from the <code className="text-xs bg-muted p-0.5 rounded">public</code> folder.
      </p>
    </div>
  );
}
