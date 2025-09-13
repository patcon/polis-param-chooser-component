"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Layers } from "lucide-react";

type ButtonProps = React.ComponentProps<typeof Button>;

export const SelectLayerButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        {...props}
        variant="outline"
        className={`p-2 ${className ?? ""}`}
        aria-label="Select layers"
      >
        <Layers className="h-5 w-5" /> 
        {/* or any fixed Tailwind size */}
      </Button>
    );
  }
);

SelectLayerButton.displayName = "SelectLayersButton";
