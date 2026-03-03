import { DragEvent, MouseEvent, RefObject } from "react";
import { Control, UseFormHandleSubmit } from "react-hook-form";
import { Connection, Edge, EdgeChange, Node, NodeChange, NodeTypes } from "reactflow";

export type EdgeProtocol = "HTTP" | "gRPC" | "Async";
export type GroupKind = "vpc" | "availability-zone" | "kubernetes-cluster";
export type EdgeMetadata = {
  protocol?: EdgeProtocol;
  latency?: string;
  rps?: string;
};
export type DiagramEdge = Edge<EdgeMetadata>;

export interface Version {
  title: string;
  description: string;
  diagram: {
    nodes: Node[];
    edges: Edge[];
  };
  createdAt: string;
}

export interface PlaygroundData {
  id: string;
  title: string;
  description: string;
  isPublic: boolean;
  diagram: {
    nodes: Node[];
    edges: Edge[];
  };
  versions: Version[];
}

export interface GetPlaygroundResponse {
  playground: PlaygroundData;
}

export interface PlaygroundFormValues {
  title: string;
  description: string;
  diagram: {
    nodes: Node[];
    edges: Edge[];
  };
}

export interface EdgeFormValues {
  label: string;
  protocol: "" | EdgeProtocol;
  latency: string;
  rps: string;
}

export interface EdgeDialogFormProps {
  control: Control<EdgeFormValues>;
  handleSubmit: UseFormHandleSubmit<EdgeFormValues>;
}

export interface PlaygroundCanvasProps {
  containerRef?: RefObject<HTMLDivElement | null>;
  nodes: Node[];
  edges: Edge[];
  nodeTypes: NodeTypes;
  previewMode: boolean;
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onEdgeDoubleClick: (event: MouseEvent, edge: Edge) => void;
  onConnect: (params: Connection) => void;
  onDrop: (event: DragEvent) => void;
  onDragOver: (event: DragEvent) => void;
}
