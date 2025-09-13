"use client";

import * as React from "react";
import { D3Map } from "./D3Map";
import { MapOverlay } from "./MapOverlay";
import dataset from "../../../.storybook/assets/localmap.json";

export const App: React.FC = () => {
  const [selectedIds, setSelectedIds] = React.useState<number[]>([]);
  const [action, setAction] = React.useState<"move-map" | "paint-groups">("move-map");

  // map ActionToolBar value to D3Map mode
  const mode: "move" | "paint" = action === "paint-groups" ? "paint" : "move";

  return (
    <div className="relative h-screen w-screen">
      {/* D3Map: absolutely positioned to fill parent */}
      <div className="absolute inset-0 z-0">
        <D3Map
          data={dataset}
          mode={mode}
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
        />
      </div>

      {/* Overlay UI: absolutely positioned on top with higher z-index */}
      <div className="absolute inset-0 z-50 pointer-events-none">
        {/* Pass down action state to MapOverlay */}
        <MapOverlay action={action} onActionChange={setAction} />
      </div>
    </div>
  );
};
