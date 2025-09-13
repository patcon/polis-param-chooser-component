"use client";

import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { PalettePanel } from "./PalettePanel";
import { PaletteButton } from "./PaletteButton";
import { PALETTE_COLORS } from "@/constants";

type PalettePopoverProps = {
  activeIndex: number;
  onSelectIndex: (index: number) => void;
};

export function PalettePopover({ activeIndex, onSelectIndex }: PalettePopoverProps) {
  return (
    <Popover>
      <PopoverContent align="end" className="w-auto p-1 mb-2" asChild>
        <PalettePanel activeIndex={activeIndex} onSelectIndex={onSelectIndex} />
      </PopoverContent>

      <PopoverTrigger asChild>
        <PaletteButton color={PALETTE_COLORS[activeIndex]} />
      </PopoverTrigger>
    </Popover>
  );
}