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
    const [activeIndex, setActiveIndex] = useState(0); // first color
    return (
      <div className="p-8">
        <PalettePopover
          {...args}
          activeIndex={activeIndex}
          onSelectIndex={(index) => setActiveIndex(index)}
        />
      </div>
    );
  },
};

export const DifferentColor: Story = {
  render: (args) => {
    const [activeIndex, setActiveIndex] = useState(3); // pick red
    return (
      <div className="p-8">
        <PalettePopover
          {...args}
          activeIndex={activeIndex}
          onSelectIndex={(index) => setActiveIndex(index)}
        />
      </div>
    );
  },
};
