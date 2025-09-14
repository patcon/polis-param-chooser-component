"use client";

import * as React from "react";
import { Layers } from "lucide-react";
import { StandaloneButton } from "./StandaloneButton";

// Grab props type from Button directly
type ButtonProps = React.ComponentProps<typeof StandaloneButton>;

export const SelectLayerButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => (
    <StandaloneButton ref={ref} {...props} label="Select layers" icon={Layers} />
  )
);

SelectLayerButton.displayName = "SelectLayerButton";
