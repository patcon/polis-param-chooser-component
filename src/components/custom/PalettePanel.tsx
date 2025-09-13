"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { PALETTE_COLORS } from "@/constants";

type PalettePanelProps = {
  activeIndex: number;
  onSelectIndex?: (index: number) => void;
} & React.ComponentPropsWithoutRef<typeof Card>; // allow extra props

export const PalettePanel = React.forwardRef<HTMLDivElement, PalettePanelProps>(
  ({ activeIndex, onSelectIndex, className, ...props }, ref) => {
    return (
      <Card ref={ref} className={`p-1 inline-block ${className ?? ""}`} {...props}>
        <div className="grid grid-cols-2 gap-1">
          {PALETTE_COLORS.map((color, index) => {
            const isSelected = index === activeIndex;
            return (
              <button
                key={color}
                onClick={() => onSelectIndex?.(index)}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-white"
                title={color}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    isSelected ? "bg-gray-200" : "hover:bg-gray-200"
                  }`}
                >
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: color }} />
                </div>
              </button>
            );
          })}
        </div>
      </Card>
    );
  }
);

PalettePanel.displayName = "PalettePanel";
