"use client";

import * as React from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Card } from "@/components/ui/card";

type PaletteColor = {
  name: string;
  hex: string;
};

type PalettePopoverProps = {
  activeColor: string;
  onSelectColor?: (color: PaletteColor) => void;
};

export function PalettePopover({
  activeColor,
  onSelectColor,
}: PalettePopoverProps) {
  const colors: PaletteColor[] = [
    { name: "Red", hex: "#ef4444" },
    { name: "Orange", hex: "#f97316" },
    { name: "Amber", hex: "#f59e0b" },
    { name: "Yellow", hex: "#eab308" },
    { name: "Lime", hex: "#84cc16" },
    { name: "Green", hex: "#22c55e" },
    { name: "Teal", hex: "#14b8a6" },
    { name: "Cyan", hex: "#06b6d4" },
    { name: "Sky", hex: "#0ea5e9" },
    { name: "Blue", hex: "#3b82f6" },
    { name: "Indigo", hex: "#6366f1" },
    { name: "Purple", hex: "#8b5cf6" },
  ];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="px-3 py-2 bg-white border rounded-md shadow-sm text-sm">
          Palette
        </button>
      </PopoverTrigger>

      <PopoverContent asChild align="start">
        <Card className="p-1 w-auto">
          <div className="grid grid-cols-2 gap-1">
            {colors.map((color) => {
              const isSelected = color.hex === activeColor;
              return (
                <button
                  key={color.hex}
                  onClick={() => onSelectColor?.(color)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-white"
                  title={color.name}
                >
                  {/* Outer square: shading on hover or selected */}
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      isSelected ? "bg-gray-200" : "hover:bg-gray-200"
                    }`}
                  >
                    {/* Inner small circle */}
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: color.hex }}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </Card>
      </PopoverContent>
    </Popover>
  );
}
