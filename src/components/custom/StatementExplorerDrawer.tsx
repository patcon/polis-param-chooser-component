"use client";

import * as React from "react";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from "@/components/ui/drawer";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquareText } from "lucide-react";

export type Statement = {
  statement_id: number;
  txt: string;
};

type StatementExplorerDrawerProps = {
  statements: Statement[];
};

export const StatementExplorerDrawer: React.FC<StatementExplorerDrawerProps> = ({ statements }) => {
  const [tabValue, setTabValue] = React.useState("all");

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <button className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded hover:bg-gray-200">
          <MessageSquareText size={16} /> Statements
        </button>
      </DrawerTrigger>
      <DrawerContent className="w-full max-w-full overflow-y-auto">
        <DrawerHeader>
          <DrawerTitle>Explore Statements</DrawerTitle>
          <DrawerClose />
        </DrawerHeader>

        {/* Content */}
        <div className="p-4">
          <Tabs value={tabValue} onValueChange={setTabValue}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>Statement</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {statements.map((s) => (
                    <TableRow key={s.statement_id}>
                      <TableCell>{s.statement_id}</TableCell>
                      <TableCell>{s.txt}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </div>
      </DrawerContent>
    </Drawer>
  );
};