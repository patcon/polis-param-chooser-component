import * as React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Statement } from "./StatementExplorerDrawer";

type StatementTableProps = {
  statements: Statement[];
};

export const StatementTable: React.FC<StatementTableProps> = ({ statements }) => {
  const insertBreaks = (val: string) => {
    const ZWSP = "\u200B";
    return val
      .replace(/(?<!:)\/(?!\/)/g, "/" + ZWSP)
      .replace(/,(?!\s)/g, "," + ZWSP)
      .replace(/([A-Za-z]{20})(?=[A-Za-z])/g, "$1" + ZWSP);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-right text-[12px] text-gray-400">#</TableHead>
          <TableHead>Statement</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {statements.map((s) => (
          <TableRow key={s.statement_id}>
            <TableCell className="whitespace-nowrap text-right text-[12px] text-gray-400">
              {s.statement_id}
            </TableCell>
            <TableCell className="whitespace-normal">
              <span
                className={`
                  ${s.moderated === -1 ? "text-red-700" : ""}
                  ${s.moderated === 0 ? "text-gray-500" : ""}
                  ${s.moderated === 1 ? "text-gray-900" : ""}
                `}
              >
                {insertBreaks(s.txt)}
                {s.moderated === -1 ? " (moderated)" : ""}
                {s.moderated === 0 ? " (unmoderated)" : ""}
              </span>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
