// IconToggleGroup.stories.tsx

import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { IconToggleGroup } from "./IconToggleGroup";

const meta = {
  title: "Components/IconToggleGroup",
  component: IconToggleGroup,
  // optionally add tags, decorators, etc.
} satisfies Meta<typeof IconToggleGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    const [values, setValues] = useState<string[]>([]);
    return (
      <IconToggleGroup
        {...args}
        value={values}
        onValueChange={(newVals) => {
          setValues(newVals);
        }}
      />
    );
  },
  args: {
    // initial args: you could set initial toggles on
    value: [],  // none toggled
  },
};

export const AllOn: Story = {
  render: (args) => {
    const [values, setValues] = useState<string[]>(["flip-horizontal", "flip-vertical", "show-named-labels", "colors-to-front"]);
    return (
      <IconToggleGroup
        {...args}
        value={values}
        onValueChange={(newVals) => {
          setValues(newVals);
        }}
      />
    );
  },
  args: {
    value: ["flip-horizontal", "flip-vertical", "show-named-labels", "colors-to-front"],
  },
};

export const FlipOnly: Story = {
  render: (args) => {
    const [values, setValues] = useState<string[]>(["flip-horizontal"]);
    return (
      <IconToggleGroup
        {...args}
        value={values}
        onValueChange={(newVals) => {
          setValues(newVals);
        }}
      />
    );
  },
  args: {
    value: ["flip-horizontal"],
  },
};
