"use client";

import * as React from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Hand, Paintbrush } from "lucide-react";

type ActionToolBarProps = {
  value: string; // always selected
  onValueChange: (value: string) => void;
};

export function ActionToolBar({ value, onValueChange }: ActionToolBarProps) {
  return (
    <ToggleGroup
      type="single"
      variant="outline"
      value={value}
      onValueChange={onValueChange}
      className="flex bg-white"
      aria-label="Action toolbar: move map, paint groups"
    >
      <ToggleGroupItem
        value="paint-groups"
        aria-label="Paint groups"
        className="data-[state=on]:bg-sky-600 data-[state=on]:text-white"
      >
        <Paintbrush className="h-5 w-5" />
      </ToggleGroupItem>

      <ToggleGroupItem
        value="move-map"
        aria-label="Move map"
        className="data-[state=on]:bg-sky-600 data-[state=on]:text-white"
      >
        <Hand className="h-5 w-5" />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
