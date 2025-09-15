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
import { StatementTable } from "./StatementsTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatementExplorerButton } from "./StatementExplorerButton";
import { Badge } from "@/components/ui/badge";
import { PALETTE_COLORS } from "@/constants";

export type Statement = {
  statement_id: number;
  txt: string;
  moderated?: -1 | 0 | 1;
  colorIndex?: number;
};

type StatementExplorerDrawerProps = {
  statements: Statement[];
  activeColors?: number[];
};

export const StatementExplorerDrawer: React.FC<StatementExplorerDrawerProps> = ({
  statements,
  activeColors = [],
}) => {
  const [tabValue, setTabValue] = React.useState("all");

  const letterForIndex = (index: number) => String.fromCharCode(65 + index); // 0 => 'A'

  // Sort activeColors numerically to ensure tabs appear in order
  // TODO: Maybe sort by appearance LtR in map?
  const sortedColors = [...activeColors].sort((a, b) => a - b);

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

          <div className="flex-1 overflow-y-auto p-4">
            <Tabs value={tabValue} onValueChange={setTabValue}>
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>

                {sortedColors.map((colorIndex) => (
                  <TabsTrigger key={colorIndex} value={`group-${colorIndex}`}>
                    <Badge
                      style={{ backgroundColor: PALETTE_COLORS[colorIndex], color: "white" }}
                    >
                      Group {letterForIndex(colorIndex)}
                    </Badge>
                  </TabsTrigger>
                ))}
              </TabsList>

              {/* "All" tab content */}
              <TabsContent value="all" className="select-text">
                <StatementTable statements={statements} />
              </TabsContent>

              {/* one tab per active color */}
              {sortedColors.map((colorIndex) => (
                <TabsContent
                  key={colorIndex}
                  value={`group-${colorIndex}`}
                  className="select-text"
                >
                  <StatementTable
                    statements={statements.filter((s) => s.colorIndex === colorIndex)}
                  />
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </DrawerContent>
      </DrawerPortal>
    </Drawer>
  );
};
