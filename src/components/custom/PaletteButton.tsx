"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Palette } from "lucide-react";

type ButtonProps = React.ComponentProps<typeof Button>

export type PaletteButtonProps = ButtonProps & {
  color?: string; // icon color when active
};

export const PaletteButton = React.forwardRef<HTMLButtonElement, PaletteButtonProps>(
  ({ color = "#0ea5e9", className, disabled, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        {...props}
        disabled={disabled}
        variant="outline"
        className={`p-2 ${className ?? ""}`}
        aria-label="Open palette"
      >
        <Palette
          className="h-5 w-5"
          style={{ color: disabled ? undefined : color }}
        />
      </Button>
    );
  }
);

PaletteButton.displayName = "PaletteButton";
