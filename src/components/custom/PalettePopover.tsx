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
      <PopoverTrigger asChild>
        <PaletteButton color={PALETTE_COLORS[activeIndex]} />
      </PopoverTrigger>

      <PopoverContent align="end" className="w-auto p-1" asChild>
        <PalettePanel activeIndex={activeIndex} onSelectIndex={onSelectIndex} />
      </PopoverContent>
    </Popover>
  );
}