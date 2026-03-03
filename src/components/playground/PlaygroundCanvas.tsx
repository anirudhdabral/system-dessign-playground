"use client";

import { Box } from "@mui/material";
import ReactFlow, { Background, ConnectionMode, Controls, MiniMap } from "reactflow";
import { PlaygroundCanvasProps } from "./types";

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
}: PlaygroundCanvasProps) {
  return (
    <Box
      ref={containerRef}
      sx={{
        flex: 1,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
      }}
    >
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
        fitView
      >
        <Controls />
        <Background />
        <MiniMap
          nodeColor={(node) => {
            const colors: Record<string, string> = {
              api: "#1976d2",
              db: "#2e7d32",
              cache: "#ed6c02",
              queue: "#9c27b0",
              vpc: "#334155",
              "availability-zone": "#475569",
              "kubernetes-cluster": "#0f766e",
              custom: "#64748b",
            };
            return colors[node.data.type as string] || "#999";
          }}
        />
      </ReactFlow>
    </Box>
  );
}
