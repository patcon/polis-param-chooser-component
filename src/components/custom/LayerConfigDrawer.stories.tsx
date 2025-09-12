import type { Meta, StoryObj } from "@storybook/react";
import { LayerConfigDrawer } from "./LayerConfigDrawer";

const meta = {
  title: "Components/LayerConfigDrawer",
  component: LayerConfigDrawer,
} satisfies Meta<typeof LayerConfigDrawer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <LayerConfigDrawer />,
};
