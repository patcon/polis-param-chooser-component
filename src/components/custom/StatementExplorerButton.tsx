"use client";

import * as React from "react";
import { Telescope } from "lucide-react";
import { StandaloneButton } from "./StandaloneButton";

// Grab props type from Button directly
type ButtonProps = React.ComponentProps<typeof StandaloneButton>;

export const StatementExplorerButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => (
    <StandaloneButton ref={ref} {...props} label="Explore statements" icon={Telescope} />
  )
);

StatementExplorerButton.displayName = "StatementExplorerButton";
