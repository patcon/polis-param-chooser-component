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
    const [activeIndex, setActiveIndex] = useState(0);
    return (
      <div className="fixed bottom-4 right-4 z-50"> {/* pinned here */}
        <PalettePopover
          {...args}
          activeIndex={activeIndex}
          onSelectIndex={setActiveIndex}
        />
      </div>
    );
  },
};

export const DifferentColor: Story = {
  render: (args) => {
    const [activeIndex, setActiveIndex] = useState(3);
    return (
      <div className="fixed bottom-4 right-4 z-50"> {/* pinned here */}
        <PalettePopover
          {...args}
          activeIndex={activeIndex}
          onSelectIndex={setActiveIndex}
        />
      </div>
    );
  },
};
