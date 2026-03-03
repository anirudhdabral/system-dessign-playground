"use client";

import CopyIconButton from "@/components/CopyIconButton";
import { Box, Button, FormControl, InputLabel, MenuItem, Select, Typography } from "@mui/material";
import { DragEvent } from "react";
import { playgroundNodes } from "./constants";
import { Version } from "./types";
import { formatVersionDate } from "./utils";

interface PlaygroundSidebarProps {
  isDirty: boolean;
  isPreview: boolean;
  isPublic: boolean;
  updatingPlayground: boolean;
  togglingPublic: boolean;
  selectedVersionIndex: string;
  sortedVersions: Version[];
  previewVersion: Version | null;
  shareUrl: string;
  onSave: () => Promise<void>;
  onExportPng: () => Promise<void>;
  onAutoLayout: () => void;
  onTogglePublic: () => Promise<void>;
  onVersionChange: (value: string) => void;
  onExitPreview: () => void;
  onRestoreVersion: () => Promise<void>;
  onGroupSelected: () => void;
  onDragStart: (event: DragEvent, item: string) => void;
}

export default function PlaygroundSidebar({
  isDirty,
  isPreview,
  isPublic,
  updatingPlayground,
  togglingPublic,
  selectedVersionIndex,
  sortedVersions,
  previewVersion,
  shareUrl,
  onSave,
  onExportPng,
  onAutoLayout,
  onTogglePublic,
  onVersionChange,
  onExitPreview,
  onRestoreVersion,
  onGroupSelected,
  onDragStart,
}: PlaygroundSidebarProps) {
  return (
    <Box
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        p: 2,
        height: "fit-content",
        display: "grid",
        gap: 2,
      }}
    >
      <Button variant="contained" disabled={updatingPlayground || !isDirty || isPreview} onClick={onSave}>
        Save Changes
      </Button>
      <Button variant="outlined" onClick={onExportPng}>
        Export PNG
      </Button>
      <Button variant="outlined" disabled={isPreview} onClick={onAutoLayout}>
        Auto Layout
      </Button>
      <Box display="flex" gap={1}>
        <Button
          fullWidth
          variant="contained"
          color={isPublic ? "warning" : "success"}
          disabled={togglingPublic}
          onClick={onTogglePublic}
        >
          {isPublic ? "Make Private" : "Make Public"}
        </Button>
        {isPublic && shareUrl && <CopyIconButton text={shareUrl} />}
      </Box>

      {sortedVersions.length > 0 && (
        <FormControl fullWidth size="small" sx={{ mt: 2 }}>
          <InputLabel id="version-select-label">Select Version</InputLabel>
          <Select
            labelId="version-select-label"
            label="Select Version"
            value={selectedVersionIndex}
            onChange={(event) => onVersionChange(event.target.value)}
          >
            <MenuItem value="current">Latest (Current)</MenuItem>
            {sortedVersions.map((version, index) => (
              <MenuItem key={`${version.createdAt}-${index}`} value={String(index)}>
                {formatVersionDate(version.createdAt)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      {previewVersion && (
        <Button variant="outlined" color="warning" onClick={onExitPreview}>
          Exit Preview
        </Button>
      )}
      {previewVersion && (
        <Button variant="contained" color="error" disabled={updatingPlayground} onClick={onRestoreVersion}>
          Restore This Version
        </Button>
      )}

      <Typography variant="h6" sx={{ mt: 1 }}>
        Node Palette
      </Typography>
      <Button variant="outlined" onClick={onGroupSelected} disabled={isPreview}>
        Group Selected
      </Button>
      <Box
        sx={{
          display: "grid",
          gap: 1,
          gridTemplateColumns: "repeat(2, 1fr)",
        }}
      >
        {playgroundNodes.map((item) => (
          <Button
            key={item.key}
            draggable
            onDragStart={(event) => onDragStart(event, item.key)}
            variant="outlined"
            disabled={isPreview}
            startIcon={item.icon}
            sx={{ justifyContent: "flex-start", color: "text.secondary" }}
          >
            {item.label}
          </Button>
        ))}
      </Box>
    </Box>
  );
}
