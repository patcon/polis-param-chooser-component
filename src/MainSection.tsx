// src/MainSection.tsx
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Square, Columns2, Columns3, Edit } from "lucide-react";
import type { Selections } from "./App";

function selectionSummary(selections: Selections): string[] {
  const badges: string[] = [];

  const sections: { key: keyof Selections; showParam?: boolean }[] = [
    { key: "imputer", showParam: true },
    { key: "reducer" },
    { key: "clusterer" },
  ];

  sections.forEach(({ key, showParam }) => {
    const section = selections[key];
    if (!section) return;

    const entries = Object.entries(section);
    if (entries.length === 0) return;

    const [algo, params] = entries[0];

    if (showParam && params && Object.keys(params).length > 0) {
      const firstParam = Object.keys(params)[0];
      badges.push(`${algo}:${params[firstParam]}`);
    } else {
      badges.push(algo);
    }
  });

  return badges;
}


interface MainSectionProps {
  onEdit: (plotIndex: number) => void;
  plotSelections: { [plot: number]: Selections };
}

const MainSection: React.FC<MainSectionProps> = ({ onEdit, plotSelections }) => {
  const [layout, setLayout] = useState<1 | 2 | 3>(1);
  const plots = Array.from({ length: layout });

  return (
    <div className="p-4">
      {/* layout selector */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-sm font-medium">Layout</span>
        <div className="flex gap-2">
          <Button
            variant={layout === 1 ? "default" : "outline"}
            onClick={() => setLayout(1)}
            aria-label="Single column layout"
          >
            <Square className="w-4 h-4" />
          </Button>
          <Button
            variant={layout === 2 ? "default" : "outline"}
            onClick={() => setLayout(2)}
            aria-label="Two column layout"
          >
            <Columns2 className="w-4 h-4" />
          </Button>
          <Button
            variant={layout === 3 ? "default" : "outline"}
            onClick={() => setLayout(3)}
            aria-label="Three column layout"
          >
            <Columns3 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* grid */}
      <div
        className={`grid gap-4 ${
          layout === 1
            ? "grid-cols-1"
            : layout === 2
            ? "grid-cols-2"
            : "grid-cols-3"
        }`}
      >
        {plots.map((_, i) => {
          const summary = selectionSummary(plotSelections[i] ?? {});

          return (
            <div key={i} className="relative">
              {/* badges */}
              <div className="absolute top-2 left-2 flex gap-1 flex-wrap">
                {summary.map((s, idx) => (
                  <Badge key={idx} variant="secondary" className="text-xs">
                    {s}
                  </Badge>
                ))}
              </div>

              <Card className="h-124 flex items-center justify-center text-muted-foreground">
                Plot {i + 1}
              </Card>

              <Button
                size="icon"
                variant="secondary"
                className="absolute bottom-2 right-2 rounded-full shadow-md hover:bg-secondary/80 hover:scale-105 transition-transform"
                onClick={() => onEdit(i)}
                aria-label={`Edit Plot ${i + 1}`}
              >
                <Edit className="w-4 h-4" />
              </Button>
            </div>
          )
        })}
      </div>
    </div>
  );
};

export default MainSection;
