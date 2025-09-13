// PalettePopover.stories.tsx
"use client";

import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { PalettePopover } from "./PalettePopover";

const meta = {
  title: "Components/PalettePopover",
  component: PalettePopover,
} satisfies Meta<typeof PalettePopover>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    const [selectedColor, setSelectedColor] = useState("#ef4444"); // Red
    return (
      <div className="p-8">
        <PalettePopover
          {...args}
          activeColor={selectedColor}
          onSelectColor={(color) => setSelectedColor(color.hex)}
        />
      </div>
    );
  },
};

export const DifferentSelected: Story = {
  render: (args) => {
    const [selectedColor, setSelectedColor] = useState("#22c55e"); // Green
    return (
      <div className="p-8">
        <PalettePopover
          {...args}
          activeColor={selectedColor}
          onSelectColor={(color) => setSelectedColor(color.hex)}
        />
      </div>
    );
  },
};
