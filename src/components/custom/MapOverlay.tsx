"use client";

import * as React from "react";
import { ActionToolBar } from "./ActionToolBar";
import { LayerConfigDrawer } from "./LayerConfigDrawer";
import { PalettePopover } from "./PalettePopover";
import { ToggleToolBar } from "./ToggleToolBar";

type MapOverlayProps = {
  action: "move-map" | "paint-groups";
  onActionChange: (value: "move-map" | "paint-groups") => void;
};

export function MapOverlay({ action, onActionChange }: MapOverlayProps) {
  const [colorIndex, setColorIndex] = React.useState(0);
  const [toggles, setToggles] = React.useState<string[]>(["flip-horizontal"]);

  return (
    <div className="relative h-screen w-screen">
      <div className="absolute top-4 right-4 z-50 pointer-events-auto">
        <LayerConfigDrawer />
      </div>

      <div className="absolute bottom-4 left-4 right-4 z-50 flex justify-between items-center px-0 pointer-events-auto">
        {/* left group */}
        <ToggleToolBar value={toggles} onValueChange={setToggles} />

        {/* right group: ActionToolBar immediately left of PalettePopover */}
        <div className="flex items-center gap-2">
          <ActionToolBar value={action} onValueChange={onActionChange} />
          <PalettePopover activeIndex={colorIndex} onSelectIndex={setColorIndex} />
        </div>
      </div>
    </div>
  );
}
