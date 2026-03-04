"use client";

import FullPageLoader from "@/components/common/FullPageLoader";
import EdgeEditDialog from "@/components/playground/EdgeEditDialog";
import PlaygroundCanvas from "@/components/playground/PlaygroundCanvas";
import PlaygroundMetadataForm from "@/components/playground/PlaygroundMetadataForm";
import PlaygroundSidebar from "@/components/playground/PlaygroundSidebar";
import { playgroundNodeTypes } from "@/components/playground/nodeTypes";
import { usePlaygroundEditor } from "@/components/playground/usePlaygroundEditor";
import { Box, Button, Chip, Container, FormControlLabel, Stack, Switch, Tooltip, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import { MdDelete, MdEdit } from "react-icons/md";
import "reactflow/dist/style.css";

export default function PlaygroundPage() {
  const params = useParams();
  const id = params.id as string;

  const editor = usePlaygroundEditor(id);

  if (editor.loading) return <FullPageLoader message="Loading playground…" />;
  if (!editor.playground) {
    return (
      <Container sx={{ mt: 8, textAlign: "center" }}>
        <Typography variant="h6" sx={{ color: "text.secondary" }}>
          Playground not found.
        </Typography>
      </Container>
    );
  }

  return (
    <Container
      maxWidth="xl"
      component={motion.div}
      sx={{ mt: 3, mb: 6 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      {/* Page header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          pb: 2,
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: "11px",
              background: "linear-gradient(135deg, #4c6fff 0%, #7c3aed 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              boxShadow: (t) => `0 3px 12px ${alpha(t.palette.primary.main, 0.4)}`,
            }}
          >
            <MdEdit size={18} />
          </Box>
          <Box>
            <Typography variant="h5" sx={{ lineHeight: 1.2 }}>
              Edit Playground
            </Typography>
            {editor.playground.isPublic && (
              <Chip
                label="Public"
                size="small"
                sx={{
                  height: 18,
                  fontSize: "0.65rem",
                  fontWeight: 700,
                  bgcolor: (t) => alpha(t.palette.success.main, 0.12),
                  color: "success.dark",
                  mt: 0.25,
                }}
              />
            )}
          </Box>
        </Stack>

        <Stack direction="row" spacing={1} alignItems="center">
          <Tooltip title={editor.autosavePaused ? "Autosave is paused" : "Autosave is on"}>
            <FormControlLabel
              control={
                <Switch
                  checked={!editor.autosavePaused}
                  onChange={editor.onToggleAutosave}
                  color="success"
                  size="small"
                />
              }
              label={
                <Typography variant="caption" sx={{ fontWeight: 500, color: "text.secondary" }}>
                  Autosave
                </Typography>
              }
            />
          </Tooltip>

          <Button
            color="error"
            disabled={editor.deletingPlayground || editor.updatingPlayground}
            onClick={editor.onDeletePlayground}
            variant="outlined"
            size="small"
            startIcon={<MdDelete size={15} />}
            sx={{
              borderWidth: "1.5px",
              "&:hover": {
                bgcolor: (t) => alpha(t.palette.error.main, 0.06),
                borderWidth: "1.5px",
              },
            }}
          >
            Delete
          </Button>
        </Stack>
      </Box>

      {/* Metadata */}
      <Box sx={{ mb: 2.5 }}>
        <PlaygroundMetadataForm control={editor.playgroundFormControl} />
      </Box>

      {/* Main canvas area */}
      <Box
        component={motion.div}
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "260px minmax(0, 1fr)" },
          gap: 2.5,
          alignItems: "flex-start",
        }}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08, duration: 0.3 }}
      >
        <PlaygroundSidebar
          isDirty={editor.isDirty}
          isPreview={editor.isPreview}
          isPublic={editor.playground.isPublic}
          updatingPlayground={editor.updatingPlayground}
          togglingPublic={editor.togglingPublic}
          selectedVersionIndex={editor.selectedVersionIndex}
          sortedVersions={editor.sortedVersions}
          previewVersion={editor.previewVersion}
          shareUrl={editor.shareUrl}
          onSave={editor.onSave}
          onExportPng={editor.onExportPng}
          onAutoLayout={editor.onAutoLayout}
          onTogglePublic={editor.onTogglePublic}
          onVersionChange={editor.onVersionChange}
          onExitPreview={editor.onExitPreview}
          onRestoreVersion={editor.onRestoreVersion}
          onGroupSelected={editor.onGroupSelected}
          onDragStart={editor.onDragStart}
        />

        <PlaygroundCanvas
          containerRef={editor.canvasContainerRef}
          nodes={editor.nodes}
          edges={editor.edges}
          nodeTypes={playgroundNodeTypes}
          previewMode={editor.isPreview}
          onNodesChange={editor.handleNodesChangeWithDirty}
          onEdgesChange={editor.handleEdgesChangeWithDirty}
          onEdgeDoubleClick={editor.onEdgeDoubleClick}
          onConnect={editor.onConnectWithDirty}
          onDrop={editor.onDrop}
          onDragOver={editor.onDragOver}
          onNodeDragStart={editor.onNodeDragStart}
          onNodeDragStop={editor.onNodeDragStop}
        />
      </Box>

      <EdgeEditDialog
        open={editor.edgeEditorOpen}
        canSave={editor.canSaveEdge}
        onClose={editor.onCloseEdgeDialog}
        onSave={editor.onSaveEdgeDialog}
        control={editor.edgeFormControl}
        handleSubmit={editor.handleEdgeFormSubmit}
      />
    </Container>
  );
}
