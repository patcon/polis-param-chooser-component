import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { D3Map } from "./D3Map";
import dataset from "../../../.storybook/assets/localmap.json";

const meta: Meta<typeof D3Map> = {
  title: "Components/D3Map",
  component: D3Map,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const FromJSON: Story = {
  render: () => <D3Map data={dataset} />,
};
