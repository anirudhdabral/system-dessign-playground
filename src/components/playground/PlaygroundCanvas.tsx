"use client";

import { Box } from "@mui/material";
import { alpha } from "@mui/material/styles";
import ReactFlow, { Background, BackgroundVariant, ConnectionMode, Controls, MiniMap } from "reactflow";
import { PlaygroundCanvasProps } from "./types";

const nodeColors: Record<string, string> = {
  api: "#3b82f6",
  db: "#22c55e",
  cache: "#f97316",
  queue: "#a855f7",
  vpc: "#334155",
  "availability-zone": "#475569",
  "kubernetes-cluster": "#0f766e",
  custom: "#64748b",
};

export default function PlaygroundCanvas({
  containerRef,
  nodes,
  edges,
  nodeTypes,
  previewMode,
  onNodesChange,
  onEdgesChange,
  onEdgeDoubleClick,
  onConnect,
  onDrop,
  onDragOver,
  onNodeDragStart,
  onNodeDragStop,
}: PlaygroundCanvasProps) {
  return (
    <Box
      ref={containerRef}
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 3,
        // ReactFlow's ResizeObserver needs a concrete height on the container —
        // `minHeight` alone is insufficient in a CSS grid cell.
        height: "calc(100vh - 280px)",
        minHeight: 650,
        position: "relative",
        overflow: "hidden",
        bgcolor: (t) => (t.palette.mode === "dark" ? "hsl(222 35% 11%)" : "hsl(220 25% 97%)"),
        // Ensure ReactFlow's own node-position transforms are never CSS-transitioned
        // (our global theme transition doesn't include `transform`, but be explicit)
        "& .react-flow__node": {
          transition: "box-shadow 160ms ease, opacity 160ms ease !important",
        },
        "& .react-flow__node.selected": {
          zIndex: 1000,
        },
      }}
    >
      {/* Preview mode badge */}
      {previewMode && (
        <Box
          sx={{
            position: "absolute",
            top: 12,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 10,
            px: 2,
            py: 0.5,
            borderRadius: 999,
            bgcolor: (t) => alpha(t.palette.warning.main, 0.15),
            border: "1px solid",
            borderColor: (t) => alpha(t.palette.warning.main, 0.4),
            backdropFilter: "blur(8px)",
          }}
        >
          <Box
            component="span"
            sx={{
              fontSize: "0.72rem",
              fontWeight: 700,
              color: "warning.dark",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
            }}
          >
            Preview Mode
          </Box>
        </Box>
      )}

      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        connectionMode={ConnectionMode.Loose}
        nodesDraggable={!previewMode}
        nodesConnectable={!previewMode}
        elementsSelectable={!previewMode}
        deleteKeyCode={!previewMode ? ["Delete", "Backspace"] : null}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onEdgeDoubleClick={onEdgeDoubleClick}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onNodeDragStart={onNodeDragStart}
        onNodeDragStop={onNodeDragStop}
        fitView
        proOptions={{ hideAttribution: false }}
      >
        <Controls
          style={{
            borderRadius: 12,
            overflow: "hidden",
            border: "1px solid var(--gray-200)",
          }}
        />
        {/* Dots grid — use a slightly stronger color so it's visible in both modes */}
        <Background variant={BackgroundVariant.Dots} gap={24} size={1.5} color="var(--gray-400)" />
        <MiniMap
          nodeColor={(node) => nodeColors[node.data.type as string] || "#999"}
          style={{ borderRadius: 12, overflow: "hidden" }}
          maskColor="rgba(0,0,0,0.06)"
        />
      </ReactFlow>
    </Box>
  );
}
