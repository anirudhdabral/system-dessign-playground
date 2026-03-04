"use client";

import CopyIconButton from "@/components/CopyIconButton";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { DragEvent } from "react";
import {
  MdAutoFixHigh,
  MdCloudUpload,
  MdFolderSpecial,
  MdHistory,
  MdImage,
  MdLock,
  MdPublic,
  MdRestoreFromTrash,
  MdSave,
  MdWarning,
} from "react-icons/md";
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
        borderRadius: 3,
        overflow: "hidden",
        bgcolor: "background.paper",
        height: "fit-content",
      }}
    >
      {/* Preview mode banner */}
      {isPreview && (
        <Box
          sx={{
            px: 2,
            py: 1,
            bgcolor: (t) => alpha(t.palette.warning.main, 0.12),
            borderBottom: "1px solid",
            borderColor: (t) => alpha(t.palette.warning.main, 0.3),
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <MdWarning size={15} color="#f7936f" />
          <Typography variant="caption" sx={{ color: "warning.dark", fontWeight: 600 }}>
            Viewing old version
          </Typography>
        </Box>
      )}

      <Stack spacing={0} divider={<Divider />}>
        {/* Actions section */}
        <Box sx={{ p: 2 }}>
          <Typography
            variant="caption"
            sx={{
              color: "text.disabled",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              display: "block",
              mb: 1.5,
            }}
          >
            Actions
          </Typography>
          <Stack spacing={1}>
            <Tooltip title={!isDirty ? "No unsaved changes" : ""} placement="right">
              <span>
                <Button
                  fullWidth
                  variant="contained"
                  disabled={updatingPlayground || !isDirty || isPreview}
                  onClick={onSave}
                  startIcon={updatingPlayground ? <CircularProgress size={14} color="inherit" /> : <MdSave size={16} />}
                  sx={{
                    justifyContent: "flex-start",
                    background: isDirty && !isPreview ? "linear-gradient(135deg, #4c6fff 0%, #7c3aed 100%)" : undefined,
                    "&:hover": {
                      background:
                        isDirty && !isPreview ? "linear-gradient(135deg, #3a5de0 0%, #6d28d9 100%)" : undefined,
                    },
                  }}
                >
                  {updatingPlayground ? "Saving…" : "Save Changes"}
                  {isDirty && !isPreview && (
                    <Box
                      component="span"
                      sx={{
                        ml: "auto",
                        width: 7,
                        height: 7,
                        borderRadius: "50%",
                        bgcolor: "white",
                        opacity: 0.8,
                      }}
                    />
                  )}
                </Button>
              </span>
            </Tooltip>

            <Button
              fullWidth
              variant="outlined"
              onClick={onExportPng}
              startIcon={<MdImage size={16} />}
              sx={{ justifyContent: "flex-start" }}
            >
              Export PNG
            </Button>

            <Button
              fullWidth
              variant="outlined"
              disabled={isPreview}
              onClick={onAutoLayout}
              startIcon={<MdAutoFixHigh size={16} />}
              sx={{ justifyContent: "flex-start" }}
            >
              Auto Layout
            </Button>
          </Stack>
        </Box>

       

        {/* Node palette section */}
        <Box sx={{ p: 2 }}>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
            <MdFolderSpecial size={15} />
            <Typography
              variant="caption"
              sx={{ color: "text.disabled", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}
            >
              Node Palette
            </Typography>
          </Stack>

          <Button
            fullWidth
            variant="outlined"
            onClick={onGroupSelected}
            disabled={isPreview}
            size="small"
            sx={{ mb: 1.5, justifyContent: "flex-start" }}
          >
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
                size="small"
                sx={{
                  justifyContent: "flex-start",
                  color: "text.secondary",
                  borderStyle: "dashed",
                  fontSize: "0.75rem",
                  "&:hover": {
                    borderStyle: "solid",
                    color: "primary.main",
                    bgcolor: (t) => alpha(t.palette.primary.main, 0.05),
                  },
                  cursor: "grab",
                  "&:active": { cursor: "grabbing" },
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>

          {!isPreview && (
            <Typography variant="caption" sx={{ color: "text.disabled", display: "block", mt: 1, textAlign: "center" }}>
              Drag nodes onto the canvas
            </Typography>
          )}
        </Box>

         {/* Visibility section */}
        <Box sx={{ p: 2 }}>
          <Typography
            variant="caption"
            sx={{
              color: "text.disabled",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              display: "block",
              mb: 1.5,
            }}
          >
            Visibility
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            <Button
              fullWidth
              variant={isPublic ? "outlined" : "contained"}
              color={isPublic ? "warning" : "success"}
              disabled={togglingPublic}
              onClick={onTogglePublic}
              startIcon={
                togglingPublic ? (
                  <CircularProgress size={14} color="inherit" />
                ) : isPublic ? (
                  <MdLock size={16} />
                ) : (
                  <MdPublic size={16} />
                )
              }
              sx={{ justifyContent: "flex-start" }}
            >
              {isPublic ? "Make Private" : "Make Public"}
            </Button>
            {isPublic && shareUrl && (
              <Tooltip title="Copy share link">
                <span>
                  <CopyIconButton text={shareUrl} />
                </span>
              </Tooltip>
            )}
          </Stack>
          {isPublic && (
            <Box
              sx={{
                mt: 1,
                px: 1.5,
                py: 0.75,
                borderRadius: 2,
                bgcolor: (t) => alpha(t.palette.success.main, 0.08),
                display: "flex",
                alignItems: "center",
                gap: 0.75,
              }}
            >
              <MdCloudUpload size={13} color="#66cb9f" />
              <Typography variant="caption" sx={{ color: "success.dark", fontWeight: 500 }}>
                Publicly accessible
              </Typography>
            </Box>
          )}
        </Box>

        {/* Version history section */}
        {sortedVersions.length > 0 && (
          <Box sx={{ p: 2 }}>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
              <MdHistory size={15} />
              <Typography
                variant="caption"
                sx={{ color: "text.disabled", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}
              >
                Version History
              </Typography>
              <Chip
                label={sortedVersions.length}
                size="small"
                sx={{ height: 18, fontSize: "0.65rem", fontWeight: 700, ml: "auto !important" }}
              />
            </Stack>

            <FormControl fullWidth size="small">
              <InputLabel id="version-select-label">Select Version</InputLabel>
              <Select
                labelId="version-select-label"
                label="Select Version"
                value={selectedVersionIndex}
                onChange={(event) => onVersionChange(event.target.value)}
              >
                <MenuItem value="current">
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Box sx={{ width: 7, height: 7, borderRadius: "50%", bgcolor: "success.main" }} />
                    <span>Latest (Current)</span>
                  </Stack>
                </MenuItem>
                {sortedVersions.map((version, index) => (
                  <MenuItem key={`${version.createdAt}-${index}`} value={String(index)}>
                    {formatVersionDate(version.createdAt)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {previewVersion && (
              <Stack spacing={1} sx={{ mt: 1.5 }}>
                <Button fullWidth variant="outlined" color="warning" onClick={onExitPreview} size="small">
                  Exit Preview
                </Button>
                <Button
                  fullWidth
                  variant="contained"
                  color="error"
                  disabled={updatingPlayground}
                  onClick={onRestoreVersion}
                  size="small"
                  startIcon={<MdRestoreFromTrash size={15} />}
                >
                  Restore This Version
                </Button>
              </Stack>
            )}
          </Box>
        )}
      </Stack>
    </Box>
  );
}
