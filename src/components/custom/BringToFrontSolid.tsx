// BringToFrontSolid.tsx
import React from "react";
import { BringToFront } from "lucide-react";
import "./BringToFrontSolid.css";

export interface BringToFrontSolidProps {
  size?: number | string;
  className?: string;
}

export const BringToFrontSolid: React.FC<BringToFrontSolidProps> = ({ size = 24, className }) => {
  return <BringToFront className="bring-to-front-solid" />;
};
