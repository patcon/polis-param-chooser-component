// AppWithSheet.tsx
import React from "react";
import App from "./App";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";

const AppWithSheet: React.FC = () => {
  return (
    <div className="relative min-h-screen">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="default" size="lg" className="rounded-full shadow-lg fixed top-4 right-4 z-50">
            <SlidersHorizontal className="w-5 h-5 mr-2" />
            Settings
          </Button>
        </SheetTrigger>

        <SheetContent side="right" className="w-full max-w-full min-[540px]:w-[540px] min-[540px]:max-w-[540px] sm:w-[540px] sm:max-w-[540px]">
          <SheetHeader>
            <SheetTitle>Pipeline Parameter Chooser</SheetTitle>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto">
            <App />
          </div>

          <div className="sticky bottom-0 bg-background border-t p-4 flex gap-2 justify-end">
            <Button variant="default" className="flex-1">
              Update
            </Button>
            <SheetTrigger asChild>
              <Button variant="secondary" className="flex-1">
                Close
              </Button>
            </SheetTrigger>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default AppWithSheet;
