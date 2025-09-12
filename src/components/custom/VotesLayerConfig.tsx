"use client";

import * as React from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

type VotesLayerConfigProps = {
  highlightPassVotes: boolean;
  onHighlightPassVotesChange: (value: boolean) => void;
};

export function VotesLayerConfig({
  highlightPassVotes,
  onHighlightPassVotesChange,
}: VotesLayerConfigProps) {
  return (
    <div className="flex items-center gap-2 p-4">
      <Switch
        checked={highlightPassVotes}
        onCheckedChange={onHighlightPassVotesChange}
        id="highlight-pass-votes"
      />
      <Label htmlFor="highlight-pass-votes" className="select-none">
        Highlight pass votes
      </Label>
    </div>
  );
}
