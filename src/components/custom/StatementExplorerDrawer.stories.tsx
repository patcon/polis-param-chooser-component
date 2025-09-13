import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import statements from "../../../.storybook/assets/statements.json";
import { StatementExplorerDrawer } from "./StatementExplorerDrawer";

const meta: Meta<typeof StatementExplorerDrawer> = {
  title: "Components/StatementExplorerDrawer",
  component: StatementExplorerDrawer,
};

export default meta;
type Story = StoryObj<typeof StatementExplorerDrawer>;

export const Default: Story = {
  render: () => <StatementExplorerDrawer statements={statements} />,
};
