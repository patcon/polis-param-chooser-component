import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { D3Map } from "./D3Map";
import dataset from "../../../.storybook/assets/localmap.json";

const meta: Meta<typeof D3Map> = {
  title: "Components/D3Map",
  component: D3Map,
  parameters: {
    layout: "fullscreen", // full viewport, no padding
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/** Pan/zoom only */
export const MoveMode: Story = {
  render: () => <D3Map data={dataset} mode="move" />,
};

/** Freeform lasso select */
export const PaintMode: Story = {
  render: () => <D3Map data={dataset} mode="paint" />,
};
