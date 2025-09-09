import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Label } from "@/components/ui/Label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import { Database, Network, Group, Download, HelpCircle } from "lucide-react";
import config from "./config.json";

interface Selections {
  [section: string]: {
    [algo: string]: { [param: string]: any };
  };
}

interface ParamSelectorProps {
  params: Record<string, any[]>;
  selections: Selections;
  setSelections: React.Dispatch<React.SetStateAction<Selections>>;
  section: string;
  algo: string;
}

const ParamSelector: React.FC<ParamSelectorProps> = ({ params, selections, setSelections, section, algo }) => {
  return (
    <div className="grid gap-2 mt-2">
      {Object.entries(params).map(([key, values]) => (
        <div key={key} className="flex items-center gap-2">
          <Label className="min-w-[120px] flex items-center gap-1">
            {key}
            <Tooltip content={`Parameter: ${key}`}>
              <HelpCircle className="w-4 h-4 text-muted-foreground" />
            </Tooltip>
          </Label>
          {values.length > 1 ? (
            <Select value={String(selections[section]?.[algo]?.[key] ?? values[0])}
                    onValueChange={(val) =>
                      setSelections((prev) => ({
                        ...prev,
                        [section]: {
                          ...prev[section],
                          [algo]: {
                            ...prev[section]?.[algo],
                            [key]: val,
                          },
                        },
                      }))
                    }>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                {values.map((val) => (
                  <SelectItem key={String(val)} value={String(val)}>
                    {Array.isArray(val) ? JSON.stringify(val) : String(val)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <span className="text-sm text-muted-foreground">
              {Array.isArray(values[0]) ? JSON.stringify(values[0]) : String(values[0])}
            </span>
          )}
        </div>
      ))}
    </div>
  );
};

interface SectionProps {
  label: string;
  items: typeof config.imputers;
  icon: React.FC<any>;
  sectionKey: string;
  selections: Selections;
  setSelections: React.Dispatch<React.SetStateAction<Selections>>;
}

const Section: React.FC<SectionProps> = ({ label, items, icon: Icon, sectionKey, selections, setSelections }) => {
  const [selected, setSelected] = useState(items[0]?.name);
  const selectedItem = items.find((i) => i.name === selected);

  return (
    <Card>
      <CardHeader className="flex justify-between items-center pb-2">
        <CardTitle className="flex items-center gap-2">
          <Icon className="w-5 h-5" /> {label}
        </CardTitle>
        <Tooltip content={`${label} step in pipeline`}>
          <HelpCircle className="w-4 h-4 text-muted-foreground" />
        </Tooltip>
      </CardHeader>
      <CardContent>
        <ToggleGroup type="single" value={selected ?? ""} onValueChange={(val) => val && setSelected(val)} className="flex gap-2 mb-2">
          {items.map((item) => (
            <ToggleGroupItem key={item.name} value={item.name}>
              {item.name}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        {selectedItem && (
          <ParamSelector
            params={selectedItem.params}
            selections={selections}
            setSelections={setSelections}
            section={sectionKey}
            algo={selectedItem.name}
          />
        )}
      </CardContent>
    </Card>
  );
};

const App: React.FC = () => {
  const [selections, setSelections] = useState<Selections>({});

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(selections, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "param-grid.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4 grid gap-4 w-1/3 min-w-[320px]">
      <Section
        label="Imputation"
        items={config.imputers}
        icon={Database}
        sectionKey="imputer"
        selections={selections}
        setSelections={setSelections}
      />
      <Section
        label="Dimension Reduction"
        items={config.reducers}
        icon={Network}
        sectionKey="reducer"
        selections={selections}
        setSelections={setSelections}
      />
      <Section
        label="Clustering"
        items={config.clusterers}
        icon={Group}
        sectionKey="clusterer"
        selections={selections}
        setSelections={setSelections}
      />

      <Button onClick={handleExport} className="flex items-center gap-2">
        <Download className="w-4 h-4" /> Export JSON
      </Button>
    </div>
  );
};

export default App;
