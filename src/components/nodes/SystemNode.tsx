"use client";

import { Box, TextField, Typography } from "@mui/material";
import { NodeResizer } from "@reactflow/node-resizer";
import "@reactflow/node-resizer/dist/style.css";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Handle, Position, useStore } from "reactflow";

interface SystemNodeProps {
  id: string;
  selected?: boolean;
  data: {
    label: string;
    type: "api" | "db" | "cache" | "queue";
    readOnly?: boolean;
    onLabelChange?: (id: string, value: string) => void;
  };
}

const colors = {
  api: "#1976d2",
  db: "#2e7d32",
  cache: "#ed6c02",
  queue: "#9c27b0",
};

export const DEFAULT_NODE_WIDTH = 80;
export const DEFAULT_NODE_HEIGHT = 30;

export default function SystemNode({ id, data, selected = false }: SystemNodeProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState(data.label);
  const isReadOnly = Boolean(data.readOnly);

  // Subscribe to edges that touch this node and build a set of connected handle ids
  const connectedHandles = useStore(
    useCallback(
      (store) => {
        const connected = new Set<string>();
        for (const edge of store.edges) {
          if (edge.source === id && edge.sourceHandle) connected.add(edge.sourceHandle);
          if (edge.target === id && edge.targetHandle) connected.add(edge.targetHandle);
        }
        return connected;
      },
      [id],
    ),
  );

  const baseStyle = { width: 5.5, height: 5.5, backgroundColor: "gray" };

  const getHandleStyle = (handleId: string) => ({
    ...baseStyle,
    opacity: selected || connectedHandles.has(handleId) ? 1 : 0,
    transition: "opacity 0.15s ease",
  });

  useEffect(() => {
    setLabel(data.label);
  }, [data.label]);

  const handleSave = () => {
    data.onLabelChange?.(id, label);
    setIsEditing(false);
  };

  return (
    <Box
      onDoubleClick={!isReadOnly ? () => setIsEditing(true) : undefined}
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 1,
        borderRadius: 2,
        backgroundColor: colors[data.type],
        color: "white",
        boxSizing: "border-box",
        minWidth: DEFAULT_NODE_WIDTH,
        minHeight: DEFAULT_NODE_HEIGHT,
      }}
    >
      {!isReadOnly && (
        <NodeResizer
          minWidth={DEFAULT_NODE_WIDTH}
          minHeight={DEFAULT_NODE_HEIGHT}
          isVisible={selected}
          lineStyle={{ borderColor: "#1976d2" }}
          handleStyle={{ background: "#1976d2" }}
        />
      )}
      <Handle id="top" type="source" position={Position.Top} style={getHandleStyle("top")} />
      <Handle id="bottom" type="source" position={Position.Bottom} style={getHandleStyle("bottom")} />
      <Handle id="left" type="source" position={Position.Left} style={getHandleStyle("left")} />
      <Handle id="right" type="source" position={Position.Right} style={getHandleStyle("right")} />
      {isEditing && !isReadOnly ? (
        <TextField
          autoFocus
          variant="standard"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          onBlur={handleSave}
          onKeyDown={(e) => e.key === "Enter" && handleSave()}
          size="small"
          sx={{ input: { textAlign: "center", color: "white" } }}
          slotProps={{ input: { disableUnderline: true } }}
          fullWidth
        />
      ) : (
        <Typography variant="body2">{label}</Typography>
      )}
    </Box>
  );
}
