"use client";

import * as React from "react";
import { D3Map } from "./D3Map";
import { MapOverlay } from "./MapOverlay";
import dataset from "../../../.storybook/assets/localmap.json";
import statements from "../../../.storybook/assets/statements.json";
import { INITIAL_ACTION } from "@/constants";

export const App: React.FC = () => {
  const [selectedIds, setSelectedIds] = React.useState<number[]>([]);
  const [action, setAction] = React.useState<"move-map" | "paint-groups">(INITIAL_ACTION);

  // current palette index chosen in the overlay
  const [colorIndex, setColorIndex] = React.useState(0);

  const [toggles, setToggles] = React.useState<string[]>([]);

  // array parallel to dataset: null = ungrouped, number = palette index
  const [pointGroups, setPointGroups] = React.useState<(number | null)[]>(() =>
    Array(dataset.length).fill(null)
  );

  // StatementExplorerDrawer state
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [drawerTab, setDrawerTab] = React.useState("all");

  const mode: "move" | "paint" = action === "paint-groups" ? "paint" : "move";

  // update both selectedIds and pointGroups when selection changes
  function handleSelectionChange(ids: number[]) {
    setSelectedIds(ids);
    setPointGroups((prev) => {
      const next = [...prev];
      ids.forEach((id) => {
        // find index of this id in dataset
        const idx = dataset.findIndex((d) => d[0] === id);
        if (idx !== -1) next[idx] = colorIndex;
      });
      return next;
    });
  }

  // handle quick select (single point click) - opens drawer to specific tab
  function handleQuickSelect(id: number) {
    // find the index of this point in the dataset
    const idx = dataset.findIndex((d) => d[0] === id);
    if (idx !== -1) {
      // get the color index for this point
      const pointColorIndex = pointGroups[idx];
      if (pointColorIndex !== null) {
        // open drawer to the specific group tab
        setDrawerTab(`group-${pointColorIndex}`);
        setDrawerOpen(true);
      }
    }
  }

  return (
    <div className="relative h-screen w-screen">
      {/* D3Map: absolutely positioned to fill parent */}
      <div className="absolute inset-0 z-0">
        <D3Map
          data={dataset as [number, [number, number]][]}
          mode={mode}
          pointGroups={pointGroups}
          onSelectionChange={handleSelectionChange}
          onQuickSelect={handleQuickSelect}
          flipX={toggles.includes("flip-horizontal")}
          flipY={toggles.includes("flip-vertical")}
        />
      </div>

      {/* Overlay UI */}
      <div className="absolute inset-0 z-50 pointer-events-none">
        <MapOverlay
          action={action}
          onActionChange={setAction}
          colorIndex={colorIndex}
          onColorIndexChange={setColorIndex}
          statements={statements as any[]}
          toggles={toggles}
          onTogglesChange={setToggles}
          pointGroups={pointGroups}
          drawerOpen={drawerOpen}
          onDrawerOpenChange={setDrawerOpen}
          drawerTab={drawerTab}
          onDrawerTabChange={setDrawerTab}
        />
      </div>
    </div>
  );
};
