"use client";

import * as React from "react";
import { D3Map } from "./D3Map";
import { MapOverlay } from "./MapOverlay";
import dataset from "../../../.storybook/assets/projections.json";
import statements from "../../../.storybook/assets/statements.json";
import { INITIAL_ACTION, PALETTE_COLORS, VOTE_COLORS, VOTE_COLORS_HIGHLIGHT_PASS } from "@/constants";
import { PathasLogo } from "./PathasLogo";
import { getParticipantDataForStatement, initializeDuckDB } from "../../lib/duckdb";

export const App: React.FC = () => {
  const [selectedIds, setSelectedIds] = React.useState<number[]>([]);
  const [action, setAction] = React.useState<"move-map" | "paint-groups">(INITIAL_ACTION);

  // current palette index chosen in the overlay
  const [colorIndex, setColorIndex] = React.useState(0);

  const [toggles, setToggles] = React.useState<string[]>([]);

  // Layer mode: "groups" or "votes"
  const [layerMode, setLayerMode] = React.useState<"groups" | "votes">("groups");
  
  // Statement ID for votes mode (user configurable)
  const [statementId, setStatementId] = React.useState("0");
  
  // Highlight pass votes toggle state
  const [highlightPassVotes, setHighlightPassVotes] = React.useState(true);

  // array parallel to dataset: null = ungrouped, number = palette index (for groups mode)
  const [pointGroups, setPointGroups] = React.useState<(number | null)[]>(() =>
    Array(dataset.length).fill(null)
  );

  // array parallel to dataset: vote-based color indices (for votes mode)
  const [pointVotes, setPointVotes] = React.useState<(number | null)[]>(() =>
    Array(dataset.length).fill(null)
  );

  // StatementExplorerDrawer state
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [drawerTab, setDrawerTab] = React.useState("all");

  // Initialize DuckDB on component mount
  React.useEffect(() => {
    const init = async () => {
      try {
        await initializeDuckDB();
        console.log('DuckDB initialized in App component');
      } catch (err) {
        console.error('DuckDB initialization error:', err);
      }
    };
    
    init();
  }, []);

  // Load votes data when switching to votes mode or changing statement ID
  React.useEffect(() => {
    if (layerMode === "votes") {
      const loadVotes = async () => {
        try {
          console.log(`Loading votes for statement ${statementId}`);
          const participantData = await getParticipantDataForStatement(statementId);
          
          // Create a map for quick lookup
          const voteMap = new Map(
            participantData.map(p => [p.participantId, p.voteType])
          );
          
          // Create votes color indices array parallel to dataset
          const newPointVotes = dataset.map(([participantId]) => {
            const participantVoteData = participantData.find(p => p.participantId === participantId.toString());
            
            if (!participantVoteData || participantVoteData.vote === null) {
              // Participant has no vote - should be black (null index)
              return null;
            }
            
            // Map actual vote values to indices for color lookup
            switch (participantVoteData.vote) {
              case 1: return 0;    // agree - green
              case -1: return 1;   // disagree - red
              case 0: return 2;    // pass - yellow
              default: return null; // no vote - black
            }
          });
          
          setPointVotes(newPointVotes);
          console.log('Loaded votes data for visualization');
        } catch (err) {
          console.error('Error loading votes:', err);
        }
      };
      
      loadVotes();
    }
  }, [layerMode, statementId]);

  const mode: "move" | "paint" = action === "paint-groups" ? "paint" : "move";

  // update both selectedIds and pointGroups when selection changes (only in groups mode)
  function handleSelectionChange(ids: number[]) {
    setSelectedIds(ids);
    if (layerMode === "groups") {
      setPointGroups((prev) => {
        const next = [...prev];
        ids.forEach((id) => {
          // find index of this id in dataset
          const idx = dataset.findIndex((d) => Number(d[0]) === id);
          if (idx !== -1) next[idx] = colorIndex;
        });
        return next;
      });
    }
  }

  // handle quick select (single point click) - opens drawer to specific tab
  function handleQuickSelect(id: number) {
    // find the index of this point in the dataset
    const idx = dataset.findIndex((d) => Number(d[0]) === id);
    if (idx !== -1) {
      if (layerMode === "groups") {
        // get the color index for this point
        const pointColorIndex = pointGroups[idx];
        if (pointColorIndex !== null) {
          // open drawer to the specific group tab
          setDrawerTab(`group-${pointColorIndex}`);
          setDrawerOpen(true);
        }
      } else if (layerMode === "votes") {
        // In votes mode, could show vote information
        const voteColorIndex = pointVotes[idx];
        if (voteColorIndex !== null) {
          const voteType = voteColorIndex === 0 ? 'agree' :
                          voteColorIndex === 1 ? 'disagree' : 'pass';
          console.log(`Clicked participant ${id} with vote: ${voteType}`);
        }
      }
    }
  }

  return (
    <div className="relative h-screen w-screen">
      <PathasLogo />

      {/* D3Map: absolutely positioned to fill parent */}
      <div className="absolute inset-0 z-0">
        <D3Map
          data={dataset as [number, [number, number]][]}
          mode={mode}
          pointColors={layerMode === "votes" ? pointVotes : pointGroups}
          palette={layerMode === "votes" ?
            (highlightPassVotes ?
              [VOTE_COLORS_HIGHLIGHT_PASS.agree, VOTE_COLORS_HIGHLIGHT_PASS.disagree, VOTE_COLORS_HIGHLIGHT_PASS.pass] :
              [VOTE_COLORS.agree, VOTE_COLORS.disagree, VOTE_COLORS.pass]
            ) :
            PALETTE_COLORS}
          onSelectionChange={handleSelectionChange}
          onQuickSelect={handleQuickSelect}
          flipX={toggles.includes("flip-horizontal")}
          flipY={toggles.includes("flip-vertical")}
        />
      </div>

      {/* Overlay UI */}
      <div className="absolute inset-0 z-50 pointer-events-none">
        <MapOverlay
          action={action}
          onActionChange={setAction}
          colorIndex={colorIndex}
          onColorIndexChange={setColorIndex}
          statements={statements as any[]}
          toggles={toggles}
          onTogglesChange={setToggles}
          pointGroups={pointGroups}
          drawerOpen={drawerOpen}
          onDrawerOpenChange={setDrawerOpen}
          drawerTab={drawerTab}
          onDrawerTabChange={setDrawerTab}
          layerMode={layerMode}
          onLayerModeChange={setLayerMode}
          statementId={statementId}
          onStatementIdChange={setStatementId}
          highlightPassVotes={highlightPassVotes}
          onHighlightPassVotesChange={setHighlightPassVotes}
        />
      </div>
    </div>
  );
};
