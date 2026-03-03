"use client";

import { Box, TextField, Typography } from "@mui/material";
import { NodeResizer } from "@reactflow/node-resizer";
import "@reactflow/node-resizer/dist/style.css";
import { useEffect, useState } from "react";

interface GroupNodeProps {
  id: string;
  data: {
    label: string;
    groupType?: string;
    readOnly?: boolean;
    onLabelChange?: (id: string, value: string) => void;
  };
}

export const DEFAULT_GROUP_WIDTH = 420;
export const DEFAULT_GROUP_HEIGHT = 260;

export default function GroupNode({ id, data }: GroupNodeProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState(data.label);
  const isReadOnly = Boolean(data.readOnly);

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
        border: "2px dashed #7c8aa5",
        borderRadius: 2,
        background: "rgba(148, 163, 184, 0.08)",
        boxSizing: "border-box",
        position: "relative",
        overflow: "visible",
      }}
    >
      {!isReadOnly && (
        <NodeResizer
          minWidth={280}
          minHeight={180}
          lineStyle={{ borderColor: "#64748b" }}
          handleStyle={{ background: "#64748b" }}
        />
      )}
      <Box
        sx={{
          position: "absolute",
          top: 8,
          left: 8,
          background: "rgba(255,255,255,0.9)",
          border: "1px solid #cbd5e1",
          borderRadius: 1,
          px: 1,
          py: 0.25,
          maxWidth: "calc(100% - 16px)",
        }}
      >
        {isEditing && !isReadOnly ? (
          <TextField
            autoFocus
            variant="standard"
            value={label}
            onChange={(event) => setLabel(event.target.value)}
            onBlur={handleSave}
            onKeyDown={(event) => event.key === "Enter" && handleSave()}
            size="small"
            slotProps={{ input: { disableUnderline: true } }}
          />
        ) : (
          <Typography variant="caption" sx={{ fontWeight: 700, color: "#1e293b" }}>
            {label}
          </Typography>
        )}
      </Box>
    </Box>
  );
}
