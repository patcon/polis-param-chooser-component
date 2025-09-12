// IconToggleGroup.tsx
"use client";

import * as React from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { FlipHorizontal, FlipVertical, Tags } from "lucide-react";  
// Choosing ArrowsHorizontal for flip horizontally, ArrowsVertical for flip vertically, Tag for named labels

type IconToggleGroupProps = {
  value: string[];
  onValueChange: (values: string[]) => void;
  // maybe accept size / variant etc if needed
};

export function IconToggleGroup({
  value,
  onValueChange,
}: IconToggleGroupProps) {
  return (
    <ToggleGroup
      type="multiple"
      variant="outline"
      value={value}
      onValueChange={onValueChange}
      className="flex"
      aria-label="Icon toggle group: flip horizontal, flip vertical, show named labels"
    >
      <ToggleGroupItem value="flip-horizontal" aria-label="Flip horizontally">
        <FlipHorizontal className="h-5 w-5" />
      </ToggleGroupItem>
      <ToggleGroupItem value="flip-vertical" aria-label="Flip vertically">
        <FlipVertical className="h-5 w-5" />
      </ToggleGroupItem>
      <ToggleGroupItem value="show-named-labels" aria-label="Show named labels">
        <Tags className="h-5 w-5" />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
