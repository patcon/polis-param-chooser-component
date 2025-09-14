"use client";

import * as React from "react";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
  DrawerPortal,
  DrawerOverlay,
} from "@/components/ui/drawer";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatementExplorerButton } from "./StatementExplorerButton";

export type Statement = {
  statement_id: number;
  txt: string;
};

type StatementExplorerDrawerProps = {
  statements: Statement[];
};

function insertBreaks(val: string) {
  const ZWSP = "\u200B";
  return val
    // after / but skip ://
    .replace(/(?<!:)\/(?!\/)/g, "/"+ZWSP)
    // after , if not followed by space
    .replace(/,(?!\s)/g, ","+ZWSP)
    // after every 20 letters in a row
    .replace(/([A-Za-z]{20})(?=[A-Za-z])/g, "$1"+ZWSP);
}


export const StatementExplorerDrawer: React.FC<StatementExplorerDrawerProps> = ({ statements }) => {
  const [tabValue, setTabValue] = React.useState("all");

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <StatementExplorerButton iconVariant="telescope" />
      </DrawerTrigger>

      <DrawerPortal>
        <DrawerOverlay />
        <DrawerContent className="w-full max-w-full flex flex-col h-full">
          <DrawerHeader>
            <DrawerTitle>Explore Statements</DrawerTitle>
            <DrawerClose />
          </DrawerHeader>

          {/* scrollable content */}
          <div className="flex-1 overflow-y-auto p-4">
            <Tabs value={tabValue} onValueChange={setTabValue}>
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="select-text">
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
                        <TableCell className="whitespace-nowrap text-right text-[12px] text-gray-400">{s.statement_id}</TableCell>
                        <TableCell className="whitespace-normal">{insertBreaks(s.txt)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
            </Tabs>
          </div>
        </DrawerContent>
      </DrawerPortal>
    </Drawer>
  );
};
