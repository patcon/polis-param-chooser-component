"use client";

import * as React from "react";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from "@/components/ui/drawer";
import { LayerTypeButton } from "./LayerTypeButton";
import { Vote, Group, Ruler } from "lucide-react";

export function LayerConfigDrawer() {
  const [selected, setSelected] = React.useState<string | null>(null);

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <button className="px-4 py-2 bg-sky-600 text-white rounded-md">
          Open Layer Config
        </button>
      </DrawerTrigger>

      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="text-lg font-semibold">
            Layer Type
          </DrawerTitle>
          <DrawerDescription>
            Choose which layer to display on map.
          </DrawerDescription>
        </DrawerHeader>

        {/* The grid of layer type buttons */}
        <div className="grid grid-cols-3 gap-4 px-6 py-4">
          <div className="flex justify-center">
            <LayerTypeButton
              icon={Group}
              label="Groups"
              selected={selected === "groups"}
              onClick={() =>
                setSelected((s) => (s === "groups" ? null : "groups"))
              }
            />
          </div>
          <div className="flex justify-center">
            <LayerTypeButton
              icon={Vote}
              label="Votes"
              selected={selected === "votes"}
              onClick={() =>
                setSelected((s) => (s === "votes" ? null : "votes"))
              }
            />
          </div>
          <div className="flex justify-center">
            <LayerTypeButton
              icon={Ruler}
              label="Metrics"
              selected={selected === "metrics"}
              onClick={() =>
                setSelected((s) => (s === "metrics" ? null : "metrics"))
              }
            />
          </div>
        </div>

        {/* Divider line */}
        <div className="border-t border-gray-200 my-4" />

        {/* Space for more content later */}
        <div className="px-6 py-4 text-sm text-gray-500">
          (More settings go here…)
        </div>

        <DrawerFooter>
          <button className="px-4 py-2 bg-sky-600 text-white rounded-md">
            Save
          </button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
