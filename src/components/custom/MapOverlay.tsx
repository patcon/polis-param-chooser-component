"use client";

import * as React from "react";
import { ActionToolBar } from "./ActionToolBar";
import { LayerConfigDrawer } from "./LayerConfigDrawer";
import { StatementExplorerDrawer } from "./StatementExplorerDrawer";
import { PalettePopover } from "./PalettePopover";
import { ToggleToolBar } from "./ToggleToolBar";
import { INITIAL_ACTION } from "@/constants";
import type { Statement } from "./StatementExplorerDrawer";

type MapOverlayProps = {
  action?: "move-map" | "paint-groups";
  onActionChange?: (value: "move-map" | "paint-groups") => void;
  colorIndex?: number; // 👈 new
  onColorIndexChange?: (index: number) => void; // 👈 new
  statements?: Statement[];
  toggles?: string[];
  onTogglesChange?: (values: string[]) => void;
  pointGroups?: (number | null)[]; // 👈 NEW: palette index per point
};

export function MapOverlay({
  action: controlledAction,
  onActionChange,
  colorIndex: controlledColorIndex,
  onColorIndexChange,
  statements = [],
  toggles: controlledToggles,
  onTogglesChange,
  pointGroups = [],
}: MapOverlayProps) {
  // if no props passed, create local state
  const [internalAction, setInternalAction] = React.useState<"move-map" | "paint-groups">(INITIAL_ACTION);
  const action = controlledAction ?? internalAction;
  const handleActionChange = onActionChange ?? setInternalAction;

  // local colorIndex fallback
  const [internalColorIndex, setInternalColorIndex] = React.useState(0);
  const colorIndex = controlledColorIndex ?? internalColorIndex;
  const handleColorIndexChange = onColorIndexChange ?? setInternalColorIndex;

  // Toggles
  const [internalToggles, setInternalToggles] = React.useState<string[]>([]);
  const toggles = controlledToggles ?? internalToggles;
  const handleTogglesChange = onTogglesChange ?? setInternalToggles;

  // --- NEW: compute activeColors from pointGroups ---
  const activeColors = React.useMemo(
    () => [...new Set(pointGroups.filter((x): x is number => x !== null))],
    [pointGroups]
  );

  return (
    // Using the not-yet-fully supported 100dvh and 100dvw allows storybook's fullscreen iframe to work.
    // Might cause issues on older browsers. Would ideally be best to put this fix in on the storybook,
    // since it's only to get the iframe working...
    <div className="relative h-screen-safe w-screen-safe">
      <div className="absolute top-4 right-4 z-50 pointer-events-auto flex flex-col gap-2">
        <LayerConfigDrawer />
        <StatementExplorerDrawer statements={statements} activeColors={activeColors} />
      </div>

      <div className="absolute bottom-4 left-4 right-4 z-50 flex justify-between items-center px-0 pointer-events-auto">
        <ToggleToolBar value={toggles} onValueChange={handleTogglesChange} />

        <div className="flex items-center gap-2">
          <ActionToolBar value={action} onValueChange={handleActionChange} />
          <PalettePopover
            activeIndex={colorIndex}
            onSelectIndex={handleColorIndexChange}
            disabled={action !== "paint-groups"} // 👈 disable palette when not painting
          />
        </div>
      </div>
    </div>
  );
}
