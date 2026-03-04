"use client";

import { Box, InputBase } from "@mui/material";
import { NodeResizer } from "@reactflow/node-resizer";
import "@reactflow/node-resizer/dist/style.css";
import { useCallback, useEffect, useState } from "react";
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

const typeAccent: Record<string, string> = {
  api: "#3b82f6", // blue
  db: "#22c55e", // green
  cache: "#f97316", // orange
  queue: "#a855f7", // purple
};

const typeLabel: Record<string, string> = {
  api: "API",
  db: "DB",
  cache: "Cache",
  queue: "Queue",
};

export const DEFAULT_NODE_WIDTH = 100;
export const DEFAULT_NODE_HEIGHT = 40;

export default function SystemNode({ id, data, selected = false }: SystemNodeProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState(data.label);
  const isReadOnly = Boolean(data.readOnly);
  const accent = typeAccent[data.type] ?? "#3b82f6";

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

  const showHandle = (handleId: string) => selected || connectedHandles.has(handleId);

  const handleStyle = (handleId: string) => ({
    width: 7,
    height: 7,
    background: accent,
    border: "1.5px solid white",
    opacity: showHandle(handleId) ? 1 : 0,
    transition: "opacity 0.12s ease",
  });

  useEffect(() => {
    setLabel(data.label);
  }, [data.label]);

  const handleSave = () => {
    data.onLabelChange?.(id, label.trim() || data.label);
    setIsEditing(false);
  };

  return (
    <Box
      onDoubleClick={!isReadOnly ? () => setIsEditing(true) : undefined}
      sx={{
        width: "100%",
        height: "100%",
        minWidth: DEFAULT_NODE_WIDTH,
        minHeight: DEFAULT_NODE_HEIGHT,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxSizing: "border-box",
        position: "relative",
        // Card-style: white/dark bg, border, accent left stripe
        bgcolor: "background.paper",
        border: "1.5px solid",
        borderColor: selected ? accent : "divider",
        borderRadius: "8px",
        borderLeft: `3px solid ${accent}`,
        boxShadow: selected ? `0 0 0 2px ${accent}33, 0 4px 16px ${accent}22` : "0 1px 4px rgba(0,0,0,0.07)",
        cursor: isReadOnly ? "default" : "grab",
        overflow: "visible",
      }}
    >
      {!isReadOnly && (
        <NodeResizer
          minWidth={DEFAULT_NODE_WIDTH}
          minHeight={DEFAULT_NODE_HEIGHT}
          isVisible={selected}
          lineStyle={{ borderColor: accent, borderWidth: 1, opacity: 0.6 }}
          handleStyle={{
            background: accent,
            border: "none",
            borderRadius: 2,
            width: 6,
            height: 6,
            opacity: 0.8,
          }}
        />
      )}

      <Handle id="top" type="source" position={Position.Top} style={handleStyle("top")} />
      <Handle id="bottom" type="source" position={Position.Bottom} style={handleStyle("bottom")} />
      <Handle id="left" type="source" position={Position.Left} style={handleStyle("left")} />
      <Handle id="right" type="source" position={Position.Right} style={handleStyle("right")} />

      <Box
        sx={{
          width: "100%",
          px: "10px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1px",
          overflow: "hidden",
        }}
      >
        {/* Type badge */}
        <Box
          component="span"
          sx={{
            fontSize: "0.55rem",
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: accent,
            lineHeight: 1,
          }}
        >
          {typeLabel[data.type] ?? data.type}
        </Box>

        {/* Label / edit field */}
        {isEditing && !isReadOnly ? (
          <InputBase
            autoFocus
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            onBlur={handleSave}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSave();
              if (e.key === "Escape") {
                setLabel(data.label);
                setIsEditing(false);
              }
            }}
            inputProps={{ style: { textAlign: "center", padding: 0 } }}
            sx={{
              width: "100%",
              fontSize: "0.75rem",
              fontWeight: 600,
              color: "text.primary",
              lineHeight: 1.3,
            }}
          />
        ) : (
          <Box
            component="span"
            sx={{
              fontSize: "0.75rem",
              fontWeight: 600,
              color: "text.primary",
              lineHeight: 1.3,
              textAlign: "center",
              width: "100%",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {label}
          </Box>
        )}
      </Box>
    </Box>
  );
}
