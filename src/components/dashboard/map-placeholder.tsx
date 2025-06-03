
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
      <div className="relative w-full h-3/5 mb-3"> {/* Adjusted spacing */}
        <Image
          src="/uk-heatmap-demo.jpg" // Changed to .jpg
          alt={title || "UK Heatmap Demo"}
          fill
          className="rounded-md object-cover opacity-90" /* Increased opacity for demo */
          data-ai-hint={dataAiHint} /* Use the passed dataAiHint or a default */
        />
      </div>
      <MapPin className="h-8 w-8 text-primary mb-2" /> {/* Slightly smaller icon */}
      <h3 className="text-lg font-semibold text-foreground mb-1">{title}</h3>
      <p className="text-xs text-muted-foreground px-2">
        Displaying <code className="text-xs bg-muted p-0.5 rounded">uk-heatmap-demo.jpg</code>. Ensure this image is in your <code className="text-xs bg-muted p-0.5 rounded">public</code> folder.
      </p>
    </div>
  );
}
