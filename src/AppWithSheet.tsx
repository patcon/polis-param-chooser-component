// src/AppWithSheet.tsx
import React, { useState } from "react";
import App from "./App";
import MainSection from "./MainSection";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const AppWithSheet: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [currentPlot, setCurrentPlot] = useState<number | null>(null);

  const handleEdit = (plotIndex: number) => {
    setCurrentPlot(plotIndex);
    setOpen(true);
  };

  return (
    <div className="relative min-h-screen">
      <MainSection onEdit={handleEdit} />

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="right"
          className="w-full max-w-full min-[540px]:w-[540px] min-[540px]:max-w-[540px] sm:w-[540px] sm:max-w-[540px] gap-0"
        >
          <SheetHeader>
            <SheetTitle>
              {currentPlot !== null
                ? `Edit Plot ${currentPlot + 1}`
                : "Pipeline Parameter Chooser"}
            </SheetTitle>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto">
            <App />
          </div>

          <div className="sticky bottom-0 bg-background border-t p-4 flex gap-2 justify-end shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
            <Button variant="default" className="flex-1">
              Update
            </Button>
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => setOpen(false)}
            >
              Close
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default AppWithSheet;
