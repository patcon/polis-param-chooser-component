import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { PaintbrushSparklesIcon } from "./PaintbrushSparklesIcon";

type Story = StoryObj<typeof PaintbrushSparklesIcon>;

const meta: Meta<typeof PaintbrushSparklesIcon> = {
  title: "Icons/PaintbrushSparklesIcon",
  component: PaintbrushSparklesIcon,
  argTypes: {
    size: { control: "number" },
    className: { control: "text" },
  },
};

export default meta;

export const Default: Story = {
  render: (args) => <PaintbrushSparklesIcon {...args} />,
};
