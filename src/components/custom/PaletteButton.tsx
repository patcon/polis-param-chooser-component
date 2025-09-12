"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Palette } from "lucide-react";

type PaletteButtonProps = {
  disabled?: boolean;
  color?: string; // icon color when active
  onClick?: () => void;
};

export function PaletteButton({
  disabled = false,
  color = "#0ea5e9", // default sky-500
  onClick,
}: PaletteButtonProps) {
  return (
    <Button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      variant="outline"
      className="p-2"
      aria-label="Open palette"
    >
      <Palette
        className={`h-5 w-5 ${disabled ? "text-gray-700" : ""}`}
        style={disabled ? undefined : { color }}
      />
    </Button>
  );
}
