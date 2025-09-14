"use client";

import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { StatementExplorerButton } from "./StatementExplorerButton";

const meta = {
  title: "Components/StatementExplorerButton",
  component: StatementExplorerButton,
} satisfies Meta<typeof StatementExplorerButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => <StatementExplorerButton {...args} />,
};

export const WithClickHandler: Story = {
  render: (args) => (
    <StatementExplorerButton
      {...args}
      onClick={() => alert("Explore Statements clicked!")}
    />
  ),
};

export const CustomClass: Story = {
  render: (args) => (
    <StatementExplorerButton
      {...args}
      className="text-emerald-500"
    />
  ),
};
