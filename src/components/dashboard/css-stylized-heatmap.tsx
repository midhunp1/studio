
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

// 0: very light, 1: light, 2: medium, 3: high, 4: very high intensity
// 20x30 pattern for higher resolution
const defaultHeatmapPattern = [
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,1,1,2,2,1,1,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,1,1,2,2,3,3,3,3,2,2,1,1,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,1,1,2,2,3,3,4,4,4,4,3,3,2,2,1,1,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,1,2,2,3,3,4,4,4,4,4,4,4,4,3,3,2,2,1,0,0,0,0,0,0],
  [0,0,0,0,0,1,2,3,3,4,4,4,3,3,3,3,3,3,4,4,4,3,3,2,1,0,0,0,0,0],
  [0,0,0,0,1,2,3,4,4,3,3,2,1,1,1,1,1,1,2,3,3,4,4,3,2,1,0,0,0,0],
  [0,0,0,1,2,3,4,3,2,1,0,0,0,0,0,0,0,0,0,1,2,3,4,3,2,1,0,0,0,0],
  [0,0,1,2,3,4,3,2,1,0,0,0,0,0,0,0,0,0,0,0,1,2,3,4,3,2,1,0,0,0],
  [0,0,1,2,3,3,2,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,2,3,3,2,1,0,0,0],
  [0,0,1,2,3,3,2,1,0,0,0,0,1,1,1,1,0,0,0,0,0,1,2,3,3,2,1,0,0,0],
  [0,0,1,2,3,4,3,2,1,0,0,0,1,2,2,1,0,0,0,0,1,2,3,4,3,2,1,0,0,0],
  [0,0,0,1,2,3,4,3,2,1,0,0,1,2,3,2,1,0,0,1,2,3,4,3,2,1,0,0,0,0],
  [0,0,0,0,1,2,3,4,4,3,1,1,2,3,3,3,2,1,1,3,4,4,3,2,1,0,0,0,0,0],
  [0,0,0,0,0,1,2,3,3,4,4,2,3,4,4,4,3,2,4,4,3,3,2,1,0,0,0,0,0,0],
  [0,0,0,0,0,0,1,2,2,3,3,4,4,4,4,4,4,4,4,3,3,2,2,1,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,1,1,2,2,3,3,4,4,4,4,3,3,2,2,1,1,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,1,1,2,2,3,3,3,3,2,2,1,1,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,1,1,2,2,1,1,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
];


const intensityColors = [
  'bg-transparent',      // 0 - fully transparent for no activity
  'bg-sky-500/20',       // 1 - light blue, subtle
  'bg-yellow-500/30',    // 2 - medium yellow
  'bg-orange-600/40',    // 3 - orange
  'bg-red-700/50',       // 4 - very high intensity red, 50% transparent
];

export function CssStylizedHeatmap({
  title = "Stylized CSS Heatmap with Background",
  height = "500px",
  backgroundImageUrl = "https://placehold.co/800x600.png",
  dataAiHint = "heatmap overlay",
  backgroundMapDataAiHint = "city map area",
}: CssStylizedHeatmapProps) {
  
  const heatmapPattern = defaultHeatmapPattern;
  const effectiveRows = heatmapPattern.length;
  const effectiveCols = heatmapPattern[0]?.length || 30;

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

        <div
          className="absolute inset-0 z-10 grid"
          style={{
            gridTemplateColumns: `repeat(${effectiveCols}, 1fr)`,
            gridTemplateRows: `repeat(${effectiveRows}, 1fr)`,
          }}
        >
          {Array.from({ length: effectiveRows }).map((_, rowIndex) =>
            Array.from({ length: effectiveCols }).map((_, colIndex) => {
              const intensity = heatmapPattern[rowIndex]?.[colIndex] ?? 0;
              const colorClass = intensityColors[intensity] || intensityColors[0];
              // Using a very subtle border for the overlay cells, or none if preferred
              const cellBorderClass = intensity > 0 ? "border-black/5" : ""; 
              return (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`${colorClass} ${cellBorderClass} ${rowIndex < effectiveRows -1 ? 'border-b' : ''} ${colIndex < effectiveCols -1 ? 'border-r' : ''}`}
                  title={`Cell [${rowIndex + 1},${colIndex + 1}] Intensity: ${intensity}`}
                >
                </div>
              );
            })
          )}
        </div>
      </div>
      <p className="text-xs text-muted-foreground mt-2 text-center">
        Stylized CSS heatmap overlay on map. Demo purposes only.
      </p>
    </div>
  );
}
