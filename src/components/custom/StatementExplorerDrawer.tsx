// StatementExplorerDrawer.tsx
"use client";

import * as React from "react";
import {
  Drawer,
  DrawerTrigger,
  DrawerPortal,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from "@/components/ui/drawer";
import { StatementTable } from "./StatementTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatementExplorerButton } from "./StatementExplorerButton";
import { Badge } from "@/components/ui/badge";
import { PALETTE_COLORS } from "@/constants";

export type Statement = {
  statement_id: number;
  txt: string;
  moderated?: -1 | 0 | 1;
};

type StatementExplorerDrawerProps = {
  statements: Statement[];
  activeColors?: number[];

  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultOpen?: boolean;

  tabValue?: string;
  onTabValueChange?: (v: string) => void;
  defaultTab?: string;
};

export const StatementExplorerDrawer: React.FC<StatementExplorerDrawerProps> = ({
  statements,
  activeColors = [],

  open,
  onOpenChange,
  defaultOpen = false,

  tabValue,
  onTabValueChange,
  defaultTab = "all",
}) => {
  const [internalOpen, setInternalOpen] = React.useState<boolean>(defaultOpen);
  const [internalTab, setInternalTab] = React.useState<string>(defaultTab);

  const isOpen = open ?? internalOpen;
  const handleOpenChange = onOpenChange ?? setInternalOpen;

  const activeTab = tabValue ?? internalTab;
  const handleTabChange = onTabValueChange ?? setInternalTab;

  const letterForIndex = (index: number) => String.fromCharCode(65 + index);
  const sortedColors = React.useMemo(() => [...activeColors].sort((a, b) => a - b), [activeColors]);

  return (
    <Drawer open={isOpen} onOpenChange={handleOpenChange} defaultOpen={defaultOpen}>
      <DrawerTrigger asChild>
        <StatementExplorerButton iconVariant="telescope" />
      </DrawerTrigger>

      <DrawerPortal>
        <DrawerOverlay />

        <DrawerContent className="w-full max-w-full flex flex-col h-full">
          <DrawerHeader>
            <div className="flex items-center justify-between w-full">
              <DrawerTitle>Explore Statements</DrawerTitle>
              <DrawerClose aria-label="Close">✕</DrawerClose>
            </div>
          </DrawerHeader>

          <div className="flex-1 overflow-y-auto flex flex-col">
            <Tabs value={activeTab} onValueChange={handleTabChange}>
              {/* Sticky tabs container */}
              <div className="sticky top-0 z-10 bg-white px-4 pb-2 shadow-md">
                <TabsList className="flex space-x-2">
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
              </div>

              {/* All tab */}
              <TabsContent value="all" className="select-text">
                <StatementTable statements={statements} />
              </TabsContent>

              {/* Dummy tables for each group */}
              {sortedColors.map((colorIndex) => (
                <TabsContent
                  key={colorIndex}
                  value={`group-${colorIndex}`}
                  className="select-text mt-2"
                >
                  <StatementTable statements={[{
                    statement_id: -1,
                    txt: "Group-representative statments not yet implemented in prototype.",
                    moderated: -1,
                  }]} />
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </DrawerContent>
      </DrawerPortal>
    </Drawer>
  );
};
