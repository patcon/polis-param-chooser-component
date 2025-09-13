// PalettePopover.stories.tsx
"use client";

import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { PalettePopover } from "./PalettePopover";

const meta = {
  title: "Components/PalettePopover",
  component: PalettePopover,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    disabled: {
      control: { type: "boolean" },
      description: "Disables the palette button and popover",
      defaultValue: false,
    },
  },
} satisfies Meta<typeof PalettePopover>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    disabled: false, // control defaults here
  },
  render: (args) => {
    const [activeIndex, setActiveIndex] = useState(0);
    return (
      <div className="fixed bottom-4 right-4 z-50">
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
  args: {
    disabled: false,
  },
  render: (args) => {
    const [activeIndex, setActiveIndex] = useState(3);
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <PalettePopover
          {...args}
          activeIndex={activeIndex}
          onSelectIndex={setActiveIndex}
        />
      </div>
    );
  },
};

// 👇 New story specifically showing the disabled state
export const Disabled: Story = {
  args: {
    disabled: true,
  },
  render: (args) => {
    const [activeIndex, setActiveIndex] = useState(0);
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <PalettePopover
          {...args}
          activeIndex={activeIndex}
          onSelectIndex={setActiveIndex}
        />
      </div>
    );
  },
};
