import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { BringToFrontSolid } from "./BringToFrontSolid";

type Story = StoryObj<typeof BringToFrontSolid>;

const meta: Meta<typeof BringToFrontSolid> = {
  title: "Icons/BringToFrontSolid",
  component: BringToFrontSolid,
  argTypes: {
    size: { control: "number" },
    className: { control: "text" },
  },
};

export default meta;

export const Default: Story = {
  render: (args) => <BringToFrontSolid {...args} />,
};
