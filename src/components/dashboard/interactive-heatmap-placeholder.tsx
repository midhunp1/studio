
"use client";

import { MapPin } from 'lucide-react';
import React from 'react';

interface InteractiveHeatmapPlaceholderProps {
  title?: string;
  height?: string;
  dataAiHint?: string;
  gridRows?: number;
  gridCols?: number;
}

export function InteractiveHeatmapPlaceholder({
  title = "Interactive Heatmap",
  height = "400px",
  dataAiHint = "heatmap abstract",
  gridRows = 12, // Increased for better visual density
  gridCols = 18, // Increased for better visual density
}: InteractiveHeatmapPlaceholderProps) {
  const totalCells = gridRows * gridCols;

  return (
    <div
      className="w-full bg-muted/30 border border-dashed border-border rounded-lg flex flex-col items-center justify-between p-4 text-center shadow-inner"
      style={{ height }}
      aria-label={title}
      data-ai-hint={dataAiHint} // Keep the hint for potential future use
    >
      <div className="flex flex-col items-center mb-2">
        <MapPin className="h-8 w-8 text-primary mb-1 md:h-10 md:w-10 md:mb-2" />
        <h3 className="text-base font-semibold text-foreground md:text-lg">{title}</h3>
      </div>

      <div
        className="grid w-full flex-grow border border-border/50 rounded overflow-hidden"
        style={{
          gridTemplateColumns: `repeat(${gridCols}, 1fr)`,
          gridTemplateRows: `repeat(${gridRows}, 1fr)`,
        }}
      >
        {Array.from({ length: totalCells }).map((_, index) => (
          <div
            key={index}
            className="bg-card hover:bg-primary/60 transition-colors duration-100 border-r border-b border-border/20 last:border-r-0 last:border-b-0"
            title={`Heatmap Cell ${index + 1}`}
          >
            {/* Empty cell, interaction is hover based */}
          </div>
        ))}
      </div>
      <p className="text-xs text-muted-foreground mt-2">
        Interactive heatmap placeholder. Hover over cells.
      </p>
    </div>
  );
}
