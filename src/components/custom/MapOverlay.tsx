"use client";

import * as React from "react";
import { ActionToolBar } from "./ActionToolBar";
import { LayerConfigDrawer } from "./LayerConfigDrawer";
import { PalettePopover } from "./PalettePopover";
import { ToggleToolBar } from "./ToggleToolBar";
import { PALETTE_COLORS } from "@/constants";

export function MapOverlay() {
  const [action, setAction] = React.useState("move-map");
  const [colorIndex, setColorIndex] = React.useState(0);
  const [toggles, setToggles] = React.useState<string[]>(["flip-horizontal"]);

  return (
    <div className="relative h-screen w-screen">
      {/* Action toolbar (top-left) */}
      <div className="absolute top-4 left-4 z-50 pointer-events-auto">
        <ActionToolBar value={action} onValueChange={setAction} />
      </div>

      {/* Layer select drawer (top-right) */}
      <div className="absolute top-4 right-4 z-50 pointer-events-auto">
        <LayerConfigDrawer />
      </div>

      {/* Bottom controls (row) */}
      <div className="absolute bottom-4 left-4 right-4 z-50 flex justify-between items-center px-0 pointer-events-auto">
        {/* Toggle toolbar on the left */}
        <ToggleToolBar value={toggles} onValueChange={setToggles} />

        {/* Palette popover on the right */}
        <div className="flex-shrink-0">
          <PalettePopover
            activeIndex={colorIndex}
            onSelectIndex={setColorIndex}
          />
        </div>
      </div>
    </div>
  );
}
