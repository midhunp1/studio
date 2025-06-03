
"use client";

import { MapPin } from 'lucide-react';
import React from 'react';

interface CssStylizedHeatmapProps {
  title?: string;
  height?: string;
  rows?: number;
  cols?: number;
  dataAiHint?: string;
}

// 0: very light, 1: light, 2: medium, 3: high, 4: very high intensity
// New 20x30 pattern for higher resolution
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
  'bg-muted/10',       // 0 - very light
  'bg-yellow-400/40',  // 1 - light
  'bg-orange-500/50',  // 2 - medium
  'bg-red-500/60',     // 3 - high
  'bg-red-700/70',     // 4 - very high
];

export function CssStylizedHeatmap({
  title = "Stylized CSS Heatmap",
  height = "500px",
  rows = 20, // Increased default rows
  cols = 30, // Increased default columns
  dataAiHint = "stylized heatmap high resolution",
}: CssStylizedHeatmapProps) {
  
  const heatmapPattern = defaultHeatmapPattern; // Using the new 20x30 pattern

  // Ensure the provided rows/cols match the pattern dimensions or fallback gracefully
  const effectiveRows = heatmapPattern.length;
  const effectiveCols = heatmapPattern[0]?.length || cols;

  return (
    <div
      className="w-full bg-card border border-border rounded-lg flex flex-col items-center justify-between p-4 text-center shadow-sm"
      style={{ height }}
      aria-label={title}
      data-ai-hint={dataAiHint}
    >
      <div className="flex flex-col items-center mb-2">
        <MapPin className="h-8 w-8 text-primary mb-1 md:h-10 md:w-10 md:mb-2" />
        <h3 className="text-base font-semibold text-foreground md:text-lg">{title}</h3>
      </div>

      <div
        className="grid w-full flex-grow border border-border/50 rounded overflow-hidden shadow-inner"
        style={{
          gridTemplateColumns: `repeat(${effectiveCols}, 1fr)`,
          gridTemplateRows: `repeat(${effectiveRows}, 1fr)`,
          aspectRatio: `${effectiveCols}/${effectiveRows}`, // Maintain aspect ratio
        }}
      >
        {Array.from({ length: effectiveRows }).map((_, rowIndex) =>
          Array.from({ length: effectiveCols }).map((_, colIndex) => {
            const intensity = heatmapPattern[rowIndex]?.[colIndex] ?? 0;
            const colorClass = intensityColors[intensity] || intensityColors[0];
            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`border-r border-b border-border/20 last:border-r-0 last:border-b-0 ${colorClass}`}
                title={`Cell [${rowIndex + 1},${colIndex + 1}] Intensity: ${intensity}`}
              >
                {/* Cell content can be added here if needed */}
              </div>
            );
          })
        )}
      </div>
      <p className="text-xs text-muted-foreground mt-2">
        CSS-based stylized heatmap demo. Not a real map.
      </p>
    </div>
  );
}

