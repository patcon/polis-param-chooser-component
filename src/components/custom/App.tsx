"use client";

import * as React from "react";
import { D3Map } from "./D3Map";
import { MapOverlay } from "./MapOverlay";
import dataset from "../../../.storybook/assets/localmap.json";
import { INITIAL_ACTION } from "@/constants";

export const App: React.FC = () => {
  const [selectedIds, setSelectedIds] = React.useState<number[]>([]);
  const [action, setAction] = React.useState<"move-map" | "paint-groups">(INITIAL_ACTION);

  // current palette index chosen in the overlay
  const [colorIndex, setColorIndex] = React.useState(0);

  // array parallel to dataset: null = ungrouped, number = palette index
  const [pointGroups, setPointGroups] = React.useState<(number | null)[]>(() =>
    Array(dataset.length).fill(null)
  );

  const mode: "move" | "paint" = action === "paint-groups" ? "paint" : "move";

  // update both selectedIds and pointGroups when selection changes
  function handleSelectionChange(ids: number[]) {
    setSelectedIds(ids);
    setPointGroups((prev) => {
      const next = [...prev];
      ids.forEach((id) => {
        // find index of this id in dataset (adapt this if your dataset shape differs)
        const idx = dataset.findIndex((d) => d.id === id || d[0] === id);
        if (idx !== -1) next[idx] = colorIndex;
      });
      return next;
    });
  }

  return (
    <div className="relative h-screen w-screen">
      {/* D3Map: absolutely positioned to fill parent */}
      <div className="absolute inset-0 z-0">
        <D3Map
          data={dataset}
          mode={mode}
          selectedIds={selectedIds}
          pointGroups={pointGroups}             // <-- new
          onSelectionChange={handleSelectionChange}
        />
      </div>

      {/* Overlay UI */}
      <div className="absolute inset-0 z-50 pointer-events-none">
        <MapOverlay
          action={action}
          onActionChange={setAction}
          colorIndex={colorIndex}               // <-- new
          onColorIndexChange={setColorIndex}    // <-- new
        />
      </div>
    </div>
  );
};
