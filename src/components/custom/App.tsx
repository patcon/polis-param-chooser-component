"use client";

import * as React from "react";
import { D3Map } from "./D3Map";
import { MapOverlay } from "./MapOverlay";
import dataset from "../../../.storybook/assets/localmap.json";

export const App: React.FC = () => {
  const [selectedIds, setSelectedIds] = React.useState<number[]>([]);

  return (
    <div className="relative h-screen w-screen">
      {/* D3Map: absolutely positioned to fill parent */}
      <div className="absolute inset-0 z-0">
        <D3Map
          data={dataset}
          mode="paint"
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
        />
      </div>

      {/* Overlay UI: absolutely positioned on top with higher z-index */}
      <div className="absolute inset-0 z-50 pointer-events-none">
        <MapOverlay />
      </div>

      {/* Optional debug panel */}
      {/* <div
        className="absolute bottom-2 left-2 z-60 pointer-events-auto bg-white p-1 text-xs"
      >
        Selected IDs: {selectedIds.length ? selectedIds.join(", ") : "None"}
      </div> */}
    </div>
  );
};
