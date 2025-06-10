
"use client";

import { MapPin } from 'lucide-react';
import React from 'react';
import Image from 'next/image';

interface CssStylizedHeatmapProps {
  title?: string;
  height?: string;
  backgroundImageUrl?: string;
  dataAiHint?: string; 
  backgroundMapDataAiHint?: string;
}

const DEFAULT_BACKGROUND_URL = "https://i.dailymail.co.uk/i/pix/2014/06/12/article-2656375-1EB4337D00000578-312_964x612.jpg";

export function CssStylizedHeatmap({
  title = "Stylized CSS Heatmap with Background",
  height = "500px",
  backgroundImageUrl = DEFAULT_BACKGROUND_URL,
  dataAiHint = "map visualization", // General hint for the component's purpose
  backgroundMapDataAiHint = "UK map", // Specific hint for the background image
}: CssStylizedHeatmapProps) {
  
  return (
    <div
      className="w-full bg-card border border-border rounded-lg flex flex-col p-4 shadow-sm"
      style={{ height }}
      aria-label={title}
      data-ai-hint={dataAiHint}
    >
      <div className="flex flex-col items-center mb-2 text-center">
        <MapPin className="h-8 w-8 text-primary mb-1 md:h-10 md:w-10 md:mb-2" />
        <h3 className="text-base font-semibold text-foreground md:text-lg">{title}</h3>
      </div>

      <div className="relative w-full flex-grow rounded overflow-hidden shadow-inner border border-border/50">
        <Image
          src={backgroundImageUrl}
          alt="Background Map"
          layout="fill"
          objectFit="cover"
          className="z-0"
          data-ai-hint={backgroundMapDataAiHint}
        />
        {/* Overlay grid has been removed */}
      </div>
      <p className="text-xs text-muted-foreground mt-2 text-center">
        Map background for delivery area visualization.
      </p>
    </div>
  );
}
