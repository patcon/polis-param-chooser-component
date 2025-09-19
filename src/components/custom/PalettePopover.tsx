"use client";

import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { PalettePanel } from "./PalettePanel";
import { PaletteButton } from "./PaletteButton";
import { PALETTE_COLORS, UNPAINTED_COLOR } from "@/constants";

type PalettePopoverProps = {
  activeIndex: number;
  onSelectIndex: (index: number) => void;
  disabled?: boolean; // 👈 add this
};

export function PalettePopover({ activeIndex, onSelectIndex, disabled = false }: PalettePopoverProps) {
  // Use UNPAINTED_COLOR when eraser is selected (activeIndex === -1)
  const displayColor = activeIndex === -1 ? UNPAINTED_COLOR : PALETTE_COLORS[activeIndex];

  return (
    <Popover>
      <PopoverContent align="end" className="w-auto p-1 mb-2" asChild>
        <PalettePanel activeIndex={activeIndex} onSelectIndex={onSelectIndex} />
      </PopoverContent>

      <PopoverTrigger asChild disabled={disabled}>
        <PaletteButton color={displayColor} disabled={disabled} />
      </PopoverTrigger>
    </Popover>
  );
}