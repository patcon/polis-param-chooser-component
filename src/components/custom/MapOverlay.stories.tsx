"use client";

import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { MapOverlay } from "./MapOverlay";

const meta = {
  title: "Components/MapOverlay",
  component: MapOverlay,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof MapOverlay>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="h-screen w-screen bg-gray-100 relative">
      <MapOverlay />
      <div className="absolute inset-0 flex items-center justify-center text-gray-400">
        Map / content placeholder
      </div>
    </div>
  ),
};
