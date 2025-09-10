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
    <div className="flex justify-center items-center h-screen">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="default" size="lg" className="rounded-full shadow-lg">
            <SlidersHorizontal className="w-5 h-5 mr-2" />
            Open Settings
          </Button>
        </SheetTrigger>

        <SheetContent side="right" className="w-full max-w-full min-[540px]:w-[540px] min-[540px]:max-w-[540px] sm:w-[540px] sm:max-w-[540px]">
          <SheetHeader>
            <SheetTitle>Pipeline Parameter Chooser</SheetTitle>
          </SheetHeader>
          <div className="mt-4">
            <App />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default AppWithSheet;
