"use client";

import GroupNode from "@/components/nodes/GroupNode";
import SystemNode from "@/components/nodes/SystemNode";
import { nodeColors } from "@/components/playground/constants";
import { GET_SHARED_PLAYGROUND } from "@/lib/graphql/operations/playground";
import { useQuery } from "@apollo/client/react";
import { Box, CircularProgress, Container, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import ReactFlow, {
  Background,
  BackgroundVariant,
  ConnectionMode,
  Controls,
  Edge,
  MiniMap,
  Node,
  useEdgesState,
  useNodesState,
} from "reactflow";
import "reactflow/dist/style.css";

interface SharedPlayground {
  id: string;
  title: string;
  description: string;
  isPublic: boolean;
  diagram: {
    nodes: Node[];
    edges: Edge[];
  };
}

interface GetSharedPlaygroundResponse {
  sharedPlayground: SharedPlayground;
}

const DEFAULT_EDGE_STYLE = { stroke: "#b1b1b7", strokeWidth: 1 };

const nodeTypes = {
  systemNode: SystemNode,
  groupNode: GroupNode,
};

export default function SharedPlaygroundPage() {
  const params = useParams();
  const id = params.id as string;

  const { data, loading, error } = useQuery<GetSharedPlaygroundResponse>(GET_SHARED_PLAYGROUND, {
    variables: { id },
  });

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    if (!data?.sharedPlayground?.diagram) return;

    const loadedNodes = (data.sharedPlayground.diagram.nodes || []).map((node: Node) => ({
      ...node,
      data: {
        ...node.data,
        readOnly: true,
      },
    }));

    setNodes(loadedNodes);
    setEdges(
      (data.sharedPlayground.diagram.edges || []).map((edge: Edge) => ({
        ...edge,
        style: { ...DEFAULT_EDGE_STYLE, ...edge.style },
      })),
    );
  }, [data, setEdges, setNodes]);

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "60vh",
          display: "grid",
          placeItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }
  if (error || !data?.sharedPlayground?.isPublic) {
    return <p>This playground is private or unavailable.</p>;
  }

  return (
    <Container
      component={motion.div}
      sx={{ mt: 4 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <Typography variant="h4" sx={{ mb: 1 }}>
        {data.sharedPlayground.title}
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        {data.sharedPlayground.description}
      </Typography>

      <Box
        component={motion.div}
        sx={{ height: 650, border: "1px solid #ccc", mb: 5, borderRadius: 3 }}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.06, duration: 0.3 }}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          connectionMode={ConnectionMode.Loose}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          panOnDrag
          zoomOnScroll
          zoomOnPinch
          zoomOnDoubleClick={false}
          fitView
        >
          <Controls
            showInteractive={false}
            style={{
              borderRadius: 12,
              overflow: "hidden",
              border: "1px solid var(--gray-200)",
            }}
          />
          <Background variant={BackgroundVariant.Dots} gap={24} size={1.5} color="var(--gray-400)" />
          <MiniMap
            nodeColor={(node) => nodeColors[node.data.type as string] || "#999"}
            style={{ borderRadius: 12, overflow: "hidden" }}
            maskColor="rgba(0,0,0,0.06)"
          />
        </ReactFlow>
      </Box>
    </Container>
  );
}
