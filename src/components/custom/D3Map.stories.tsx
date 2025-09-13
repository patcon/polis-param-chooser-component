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
  argTypes: {
    mode: {
      control: { type: "radio" },
      options: ["move", "paint"],
      description: "Map interaction mode",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/** Pan/zoom only with live mode control */
export const MoveMode: Story = {
  render: (args) => <D3Map data={dataset} {...args} />,
};

/** Freeform lasso select with live mode control */
export const PaintMode: Story = {
  render: (args) => <D3Map data={dataset} {...args} />,
};

/** Lasso select with selection state and live mode control */
export const PaintModeWithSelection: Story = {
  render: (args) => {
    const [selectedIds, setSelectedIds] = React.useState<number[]>([]);
    return (
      <>
        <D3Map
          data={dataset}
          {...args}
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
        />
        <div
          style={{
            position: "absolute",
            bottom: 10,
            left: 10,
            background: "rgba(255,255,255,0.8)",
            padding: 4,
            fontSize: 12,
          }}
        >
          Selected IDs: {selectedIds.join(", ")}
        </div>
      </>
    );
  },
};
