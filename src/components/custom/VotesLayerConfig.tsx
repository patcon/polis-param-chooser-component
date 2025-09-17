"use client";

import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

type VotesLayerConfigProps = {
  highlightPassVotes: boolean;
  onHighlightPassVotesChange: (value: boolean) => void;
  statementId?: string;
  onStatementIdChange?: (value: string) => void;
};

export function VotesLayerConfig({
  highlightPassVotes,
  onHighlightPassVotesChange,
  statementId = "0",
  onStatementIdChange,
}: VotesLayerConfigProps) {
  return (
    <div className="space-y-4">
      {/* Single row with Statement ID and Highlight Pass toggle */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <Label htmlFor="statement-id" className="text-sm">
            Statement ID:
          </Label>
          <input
            id="statement-id"
            type="number"
            value={statementId}
            onChange={(e) => onStatementIdChange?.(e.target.value)}
            className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            min="0"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Switch
            checked={highlightPassVotes}
            onCheckedChange={onHighlightPassVotesChange}
            id="highlight-pass-votes"
          />
          <Label htmlFor="highlight-pass-votes" className="select-none text-sm">
            Highlight pass votes
          </Label>
        </div>
      </div>
    </div>
  );
}
