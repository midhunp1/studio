
"use client";

import { MapPin } from 'lucide-react';
import React from 'react';
import Image from 'next/image';

interface InteractiveHeatmapPlaceholderProps {
  title?: string;
  height?: string;
  dataAiHint?: string; // This hint is for the image itself
}

const DEFAULT_MAP_URL = "https://i.dailymail.co.uk/i/pix/2014/06/12/article-2656375-1EB4337D00000578-312_964x612.jpg";

export function InteractiveHeatmapPlaceholder({
  title = "Interactive Heatmap",
  height = "400px",
  dataAiHint = "UK map", // Default hint for the map image
}: InteractiveHeatmapPlaceholderProps) {
  return (
    <div
      className="w-full bg-card border border-border rounded-lg flex flex-col items-center justify-between p-4 text-center shadow-sm"
      style={{ height }}
      aria-label={title}
    >
      <div className="flex flex-col items-center mb-2">
        <MapPin className="h-8 w-8 text-primary mb-1 md:h-10 md:w-10 md:mb-2" />
        <h3 className="text-base font-semibold text-foreground md:text-lg">{title}</h3>
      </div>

      <div className="relative w-full flex-grow rounded overflow-hidden shadow-inner border border-border/50">
        <Image
          src={DEFAULT_MAP_URL}
          alt={title || "Heatmap Placeholder"}
          layout="fill"
          objectFit="cover"
          className="opacity-80"
          data-ai-hint={dataAiHint}
        />
      </div>
      <p className="text-xs text-muted-foreground mt-2">
        Placeholder map visualization.
      </p>
    </div>
  );
}
