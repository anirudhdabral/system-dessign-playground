"use client";

import SystemNode from "@/components/nodes/SystemNode";
import GroupNode from "@/components/nodes/GroupNode";
import { GET_SHARED_PLAYGROUND } from "@/lib/graphql/operations/playground";
import { useQuery } from "@apollo/client/react";
import { Box, CircularProgress, Container, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import ReactFlow, { Background, Edge, MiniMap, Node, useEdgesState, useNodesState } from "reactflow";
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
    setEdges(data.sharedPlayground.diagram.edges || []);
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
        sx={{ height: 650, border: "1px solid #ccc" }}
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
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          panOnDrag
          zoomOnScroll
          zoomOnPinch
          zoomOnDoubleClick={false}
          fitView
        >
          <Background />
          <MiniMap
            nodeColor={(node) => {
              const colors: Record<string, string> = {
                api: "#1976d2",
                db: "#2e7d32",
                cache: "#ed6c02",
                queue: "#9c27b0",
              };
              return colors[node.data?.type as string] || "#999";
            }}
          />
        </ReactFlow>
      </Box>
    </Container>
  );
}
