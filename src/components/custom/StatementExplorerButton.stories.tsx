"use client";

import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { StatementExplorerButton } from "./StatementExplorerButton";
import type { StatementExplorerButtonProps } from "./StatementExplorerButton";

const meta = {
  title: "Components/StatementExplorerButton",
  component: StatementExplorerButton,
  argTypes: {
    variant: {
      control: { type: "radio" },
      options: ["telescope", "message"],
    },
  },
} satisfies Meta<typeof StatementExplorerButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    iconVariant: "telescope",
  },
  render: (args: StatementExplorerButtonProps) => <StatementExplorerButton {...args} />,
};

export const MessageVariant: Story = {
  args: {
    iconVariant: "message",
  },
  render: (args: StatementExplorerButtonProps) => <StatementExplorerButton {...args} />,
};


export const WithClickHandler: Story = {
  args: {
    iconVariant: "telescope",
    onClick: () => alert("Explore Statements clicked!"),
  },
  render: (args: StatementExplorerButtonProps) => <StatementExplorerButton {...args} />,
};
