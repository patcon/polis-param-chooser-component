import type { Meta, StoryObj } from "@storybook/react";
import { StatementTable } from "./StatementTable";
import type { Statement } from "./StatementExplorerDrawer";

const meta: Meta<typeof StatementTable> = {
  title: "Components/StatementTable",
  component: StatementTable,
};

export default meta;

type Story = StoryObj<typeof StatementTable>;

// Default sample statements
const defaultStatements: Statement[] = [
  { statement_id: 1, txt: "This is a normal statement.", moderated: 1 },
  { statement_id: 2, txt: "This statement was moderated out.", moderated: -1 },
  {
    statement_id: 3,
    txt: "This statement is unmoderated, and without knowing strict moderation setting for conversation, we're not sure its status.",
    moderated: 0,
  },
];

// Statement that demonstrates break after slash but not protocol
const slashStatement: Statement[] = [
  {
    statement_id: 5,
    txt: "Visit mysite.com/path/to/resource or https://example.com/path/should/notbreak",
    moderated: 1,
  },
];

// Statement that demonstrates break after comma without space
const commaStatement: Statement[] = [
  {
    statement_id: 6,
    txt: "Apples,Oranges,Bananas,Mangoes.Apples,Oranges,Bananas,Mangoes",
    moderated: 1,
  },
];

// Statement that demonstrates breaking every 20 letters
const longLettersStatement: Statement[] = [
  {
    statement_id: 7,
    txt: "AverylongstatementwithoutspaceswhichshouldbreakproperlyintoZWSPsSoWeCanSeeIfItWrapsCorrectlyInTheTableCell",
    moderated: 1,
  },
];

export const Default: Story = {
  args: {
    statements: defaultStatements,
  },
};

export const LineBreaks: Story = {
  args: {
    statements: [
      ...defaultStatements,
      ...slashStatement,
      ...commaStatement,
      ...longLettersStatement,
    ],
  },
};
