"use client";

import FullPageLoader from "@/components/common/FullPageLoader";
import EdgeEditDialog from "@/components/playground/EdgeEditDialog";
import PlaygroundCanvas from "@/components/playground/PlaygroundCanvas";
import PlaygroundMetadataForm from "@/components/playground/PlaygroundMetadataForm";
import PlaygroundSidebar from "@/components/playground/PlaygroundSidebar";
import { playgroundNodeTypes } from "@/components/playground/nodeTypes";
import { usePlaygroundEditor } from "@/components/playground/usePlaygroundEditor";
import { Box, Button, Container, FormControlLabel, Switch, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import { MdDelete } from "react-icons/md";
import "reactflow/dist/style.css";

export default function PlaygroundPage() {
  const params = useParams();
  const id = params.id as string;

  const editor = usePlaygroundEditor(id);

  if (editor.loading) return <FullPageLoader />;
  if (!editor.playground) return <p>Not found</p>;

  return (
    <Container
      component={motion.div}
      sx={{ mt: 4 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"} mb={4}>
        <Typography variant="h4">Edit Playground</Typography>
        <Box display="flex" gap={1} alignItems={"center"}>
          <FormControlLabel
            control={
              <Switch
                checked={!editor.autosavePaused}
                onChange={editor.onToggleAutosave}
                color="success"
                size="small"
              />
            }
            label={"Autosave"}
          />
          <Button
            color="error"
            disabled={editor.deletingPlayground || editor.updatingPlayground}
            onClick={editor.onDeletePlayground}
            variant="outlined"
          >
            <MdDelete />
            &nbsp;Delete Playground
          </Button>
        </Box>
      </Box>

      <Box sx={{ mb: 4 }}>
        <PlaygroundMetadataForm control={editor.playgroundFormControl} />

        <Box
          component={motion.div}
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "280px minmax(0, 1fr)" },
            gap: 3,
          }}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.06, duration: 0.3 }}
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
          />
        </Box>
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
