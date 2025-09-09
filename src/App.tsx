import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Label } from "@/components/ui/Label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { Sparkles, Shrink, Group, Download, HelpCircle } from "lucide-react";
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
      {params.map((param) => (
        <div key={param.name} className="flex items-center gap-2">
          <Label className="min-w-[120px] flex items-center gap-1">
            {param.label}
            <Tooltip content={param.description}>
              <HelpCircle className="w-4 h-4 text-muted-foreground" />
            </Tooltip>
          </Label>

          {param.values.length === 1 ? (
            <ToggleGroup type="single" value={String(param.values[0])} className="flex gap-2">
              <ToggleGroupItem value={String(param.values[0])} disabled>
                {param.format ? param.format.replace("{val}", String(param.values[0])) : String(param.values[0])}
              </ToggleGroupItem>
            </ToggleGroup>
          ) : (
            <ToggleGroup
              type="single"
              value={String(selections[section]?.[algo]?.[param.name] ?? param.values[0])}
              onValueChange={(val) =>
                setSelections((prev) => ({
                  ...prev,
                  [section]: {
                    ...prev[section],
                    [algo]: {
                      ...prev[section]?.[algo],
                      [param.name]: val,
                    },
                  },
                }))
              }
              className="flex gap-2"
            >
              {param.values.map((val) => (
                <ToggleGroupItem key={String(val)} value={String(val)}>
                  {param.format ? param.format.replace("{val}", String(val)) : String(val)}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
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
        <Tabs value={selected} onValueChange={setSelected} className="w-full">
          <TabsList className="grid grid-cols-3">
            {items.map((item) => (
              <TabsTrigger key={item.name} value={item.name}>
                {item.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {items.map((item) => (
            <TabsContent key={item.name} value={item.name}>
              <ParamSelector
                params={item.params}
                selections={selections}
                setSelections={setSelections}
                section={sectionKey}
                algo={item.name}
              />
            </TabsContent>
          ))}
        </Tabs>
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
        icon={Sparkles}
        sectionKey="imputer"
        selections={selections}
        setSelections={setSelections}
      />
      <Section
        label="Dimension Reduction"
        items={config.reducers}
        icon={Shrink}
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
