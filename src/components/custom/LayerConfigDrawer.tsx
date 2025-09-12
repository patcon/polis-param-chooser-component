"use client";

import * as React from "react";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
} from "@/components/ui/drawer";
import { X } from "lucide-react";
import { LayerTypeButton } from "./LayerTypeButton";
import { Vote, Group, Ruler } from "lucide-react";
import { VotesLayerConfig } from "./VotesLayerConfig";
import { MetricsLayerConfig } from "./MetricsLayerConfig";
import "./LayerConfigDrawer.css";

export function LayerConfigDrawer() {
  const [selected, setSelected] = React.useState<string>("groups");

  // State for VotesLayerConfig toggle
  const [highlightPassVotes, setHighlightPassVotes] = React.useState(false);

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <button className="px-4 py-2 bg-sky-600 text-white rounded-md">
          Open Layer Config
        </button>
      </DrawerTrigger>

      <DrawerContent>
        <DrawerHeader className="relative">
          <DrawerTitle className="text-lg font-semibold">Layer Type</DrawerTitle>
          <DrawerDescription>
            Choose which layer to display on map.
          </DrawerDescription>

          <DrawerClose asChild>
            <button
              aria-label="Close"
              className="absolute top-3 right-3 rounded-md p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-800 focus:outline-none"
            >
              <X className="h-5 w-5" />
            </button>
          </DrawerClose>
        </DrawerHeader>

        {/* Grid of layer type buttons */}
        <div className="grid grid-cols-3 gap-4 px-6 py-4">
          <div className="flex justify-center">
            <LayerTypeButton
              icon={Group}
              label="Groups"
              selected={selected === "groups"}
              onClick={() => {
                if (selected !== "groups") setSelected("groups");
              }}
            />
          </div>
          <div className="flex justify-center">
            <LayerTypeButton
              icon={Vote}
              label="Votes"
              selected={selected === "votes"}
              onClick={() => {
                if (selected !== "votes") setSelected("votes");
              }}
            />
          </div>
          <div className="flex justify-center">
            <LayerTypeButton
              icon={Ruler}
              label="Metrics"
              selected={selected === "metrics"}
              onClick={() => {
                if (selected !== "metrics") setSelected("metrics");
              }}
            />
          </div>
        </div>

        {/* Divider line */}
        <div className="border-t border-gray-200 my-4" />

        {/* VotesLayerConfig only shows when "votes" is selected */}
        <div className="px-6 py-4 min-h-[140px]">
          {selected === "votes" && (
            <VotesLayerConfig
              highlightPassVotes={highlightPassVotes}
              onHighlightPassVotesChange={setHighlightPassVotes}
            />
          )}
          {selected === "metrics" && <MetricsLayerConfig />}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
