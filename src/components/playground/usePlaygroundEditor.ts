"use client";

import { DEFAULT_GROUP_HEIGHT, DEFAULT_GROUP_WIDTH } from "@/components/nodes/GroupNode";
import { DEFAULT_NODE_HEIGHT, DEFAULT_NODE_WIDTH } from "@/components/nodes/SystemNode";
import {
  DELETE_PLAYGROUND,
  GET_PLAYGROUND,
  TOGGLE_PUBLIC,
  UPDATE_PLAYGROUND,
} from "@/lib/graphql/operations/playground";
import { getLayoutedElements } from "@/lib/layout";
import { useToast } from "@/providers/ToastProvider";
import { useMutation, useQuery } from "@apollo/client/react";
import { toPng } from "html-to-image";
import { useConfirm } from "material-ui-confirm";
import { useRouter } from "next/navigation";
import { DragEvent, MouseEvent, useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from "reactflow";
import { DiagramEdge, EdgeFormValues, GetPlaygroundResponse, GroupKind, PlaygroundFormValues, Version } from "./types";
import { getVersionTimestamp, sanitizeForPersistence } from "./utils";

const GROUP_LABELS: Record<GroupKind, string> = {
  vpc: "VPC",
  "availability-zone": "Availability Zone",
  "kubernetes-cluster": "Kubernetes Cluster",
};

const DEFAULT_EDGE_STYLE = { stroke: "#b1b1b7", strokeWidth: 1 };

export function usePlaygroundEditor(id: string) {
  const { showToast } = useToast();
  const confirm = useConfirm();
  const router = useRouter();
  const { project, fitView } = useReactFlow();
  const isHydratingRef = useRef(false);
  const canvasContainerRef = useRef<HTMLDivElement | null>(null);
  const nodesRef = useRef<Node[]>([]);
  const edgesRef = useRef<Edge[]>([]);

  const { data, loading } = useQuery<GetPlaygroundResponse>(GET_PLAYGROUND, {
    variables: { id },
  });
  const [nodes, setNodes] = useNodesState([]);
  const [edges, setEdges] = useEdgesState([]);

  const [updatePlayground, { loading: updatingPlayground }] = useMutation(UPDATE_PLAYGROUND);
  const [togglePublic, { loading: togglingPublic }] = useMutation(TOGGLE_PUBLIC, {
    refetchQueries: [{ query: GET_PLAYGROUND, variables: { id } }],
    awaitRefetchQueries: true,
  });
  const [deletePlayground, { loading: deletingPlayground }] = useMutation(DELETE_PLAYGROUND);

  const {
    control: playgroundFormControl,
    reset: resetPlaygroundForm,
    watch: watchPlaygroundForm,
    setValue: setPlaygroundFormValue,
    formState: { isDirty: isFormDirty },
  } = useForm<PlaygroundFormValues>({
    defaultValues: {
      title: "",
      description: "",
      diagram: { nodes: [], edges: [] },
    },
  });
  const title = watchPlaygroundForm("title");
  const description = watchPlaygroundForm("description");

  const {
    control: edgeFormControl,
    reset: resetEdgeForm,
    handleSubmit: handleEdgeFormSubmit,
  } = useForm<EdgeFormValues>({
    defaultValues: {
      label: "",
      protocol: "",
      latency: "",
      rps: "",
    },
  });

  const [previewVersion, setPreviewVersion] = useState<Version | null>(null);
  const [edgeEditorOpen, setEdgeEditorOpen] = useState(false);
  const [editingEdgeId, setEditingEdgeId] = useState<string | null>(null);
  const [selectedVersionIndex, setSelectedVersionIndex] = useState("current");
  const [shareUrl, setShareUrl] = useState("");
  const [autosavePaused, setAutosavePaused] = useState(false);

  const sortedVersions = useMemo(
    () =>
      [...(data?.playground.versions ?? [])].sort(
        (a, b) => getVersionTimestamp(b.createdAt) - getVersionTimestamp(a.createdAt),
      ),
    [data?.playground.versions],
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    setShareUrl(`${window.location.origin}/share/${id}`);
  }, [id]);

  const buildPersistedDiagram = (sourceNodes: Node[] = nodesRef.current, sourceEdges: Edge[] = edgesRef.current) =>
    sanitizeForPersistence({
      nodes: sourceNodes.map((node) => ({
        ...node,
        selected: undefined,
        dragging: undefined,
        resizing: undefined,
        positionAbsolute: undefined,
        data: {
          ...node.data,
          onLabelChange: undefined,
          readOnly: undefined,
        },
      })),
      edges: sourceEdges.map((edge) => ({
        ...edge,
        selected: undefined,
      })),
    });

  const markDiagramDirty = (nextNodes: Node[] = nodesRef.current, nextEdges: Edge[] = edgesRef.current) => {
    setPlaygroundFormValue("diagram", buildPersistedDiagram(nextNodes, nextEdges), {
      shouldDirty: true,
      shouldTouch: false,
      shouldValidate: false,
    });
  };

  const handleLabelChange = (nodeId: string, newLabel: string) => {
    const nextNodes = nodesRef.current.map((node) =>
      node.id === nodeId
        ? {
            ...node,
            data: {
              ...node.data,
              label: newLabel,
              onLabelChange: handleLabelChange,
            },
          }
        : node,
    );
    nodesRef.current = nextNodes;
    setNodes(nextNodes);
    markDiagramDirty(nextNodes, edgesRef.current);
  };

  useEffect(() => {
    if (!data?.playground) return;

    isHydratingRef.current = true;
    const source = previewVersion || data.playground;

    resetPlaygroundForm({
      title: source.title,
      description: source.description,
      diagram: sanitizeForPersistence(source.diagram ?? { nodes: [], edges: [] }),
    });

    if (source.diagram) {
      const loadedNodes = (source.diagram.nodes || []).map((node: Node) => ({
        ...node,
        data: {
          ...node.data,
          ...(previewVersion ? { readOnly: true } : {}),
          onLabelChange: handleLabelChange,
        },
      }));

      nodesRef.current = loadedNodes;
      edgesRef.current = (source.diagram.edges || []).map((edge: Edge) => ({
        ...edge,
        style: { ...DEFAULT_EDGE_STYLE, ...edge.style },
      }));
      setNodes(loadedNodes);
      setEdges(edgesRef.current);
    }

    const frame = requestAnimationFrame(() => {
      isHydratingRef.current = false;
    });

    return () => cancelAnimationFrame(frame);
  }, [data, previewVersion, resetPlaygroundForm, setEdges, setNodes]);

  const onDragStart = (event: DragEvent, item: string) => {
    event.dataTransfer.setData("application/reactflow", item);
    event.dataTransfer.effectAllowed = "move";
  };

  const onDrop = (event: DragEvent) => {
    if (previewVersion) return;
    event.preventDefault();

    const item = event.dataTransfer.getData("application/reactflow");
    if (!item) return;

    const position = project({
      x: event.clientX,
      y: event.clientY,
    });

    if (item.startsWith("group:")) {
      const groupKind = item.replace("group:", "") as GroupKind;
      const groupNode: Node = {
        id: crypto.randomUUID(),
        type: "groupNode",
        position,
        style: {
          width: DEFAULT_GROUP_WIDTH,
          height: DEFAULT_GROUP_HEIGHT,
        },
        data: {
          label: GROUP_LABELS[groupKind],
          type: groupKind,
          groupType: groupKind,
          onLabelChange: handleLabelChange,
        },
      };

      const nextNodes = [...nodesRef.current, groupNode];
      nodesRef.current = nextNodes;
      setNodes(nextNodes);
      markDiagramDirty(nextNodes, edgesRef.current);
      return;
    }

    const newNode: Node = {
      id: crypto.randomUUID(),
      type: "systemNode",
      position,
      style: {
        width: DEFAULT_NODE_WIDTH,
        height: DEFAULT_NODE_HEIGHT,
      },
      data: {
        label: item.toUpperCase(),
        type: item,
        onLabelChange: handleLabelChange,
      },
    };

    const nextNodes = [...nodesRef.current, newNode];
    nodesRef.current = nextNodes;
    setNodes(nextNodes);
    markDiagramDirty(nextNodes, edgesRef.current);
  };

  const onDragOver = (event: DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };

  const onConnect = (params: Connection) => {
    const nextEdges = addEdge(
      {
        ...params,
        id: crypto.randomUUID(),
        type: "smoothstep",
        label: "",
        data: {},
        style: DEFAULT_EDGE_STYLE,
        labelStyle: { fontSize: 12, fontWeight: 600, fill: "#111827" },
        labelBgStyle: { fill: "#ffffff", fillOpacity: 0.9 },
        labelBgPadding: [6, 2] as [number, number],
        labelBgBorderRadius: 4,
      },
      edgesRef.current,
    );
    edgesRef.current = nextEdges;
    setEdges(nextEdges);
  };

  const onConnectWithDirty = (params: Connection) => {
    onConnect(params);
    if (isHydratingRef.current) return;
    markDiagramDirty(nodesRef.current, edgesRef.current);
  };

  const handleNodesChangeWithDirty = (changes: NodeChange[]) => {
    const nextNodes = applyNodeChanges(changes, nodesRef.current);
    nodesRef.current = nextNodes;
    setNodes(nextNodes);
    if (isHydratingRef.current) return;
    if (changes.some((change) => change.type !== "select")) {
      markDiagramDirty(nextNodes, edgesRef.current);
    }
  };

  const handleEdgesChangeWithDirty = (changes: EdgeChange[]) => {
    const nextEdges = applyEdgeChanges(changes, edgesRef.current);
    edgesRef.current = nextEdges;
    setEdges(nextEdges);
    if (isHydratingRef.current) return;
    if (changes.some((change) => change.type !== "select")) {
      markDiagramDirty(nodesRef.current, nextEdges);
    }
  };

  const onEdgeDoubleClick = (_event: MouseEvent, edge: Edge) => {
    if (previewVersion) return;

    const typedEdge = edge as DiagramEdge;
    setEditingEdgeId(edge.id);
    resetEdgeForm({
      label: String(typedEdge.label ?? ""),
      protocol: typedEdge.data?.protocol ?? "",
      latency: typedEdge.data?.latency ?? "",
      rps: typedEdge.data?.rps ?? "",
    });
    setEdgeEditorOpen(true);
  };

  const saveEdgeChanges = (values: EdgeFormValues) => {
    if (!editingEdgeId) return;

    const nextEdges = edgesRef.current.map((edge) =>
      edge.id === editingEdgeId
        ? {
            ...edge,
            label: values.label.trim(),
            data: {
              protocol: values.protocol || undefined,
              latency: values.latency.trim() || undefined,
              rps: values.rps.trim() || undefined,
            },
            style: DEFAULT_EDGE_STYLE,
            labelStyle: { fontSize: 12, fontWeight: 600, fill: "#111827" },
            labelBgStyle: { fill: "#ffffff", fillOpacity: 0.9 },
            labelBgPadding: [6, 2] as [number, number],
            labelBgBorderRadius: 4,
          }
        : edge,
    );
    edgesRef.current = nextEdges;
    setEdges(nextEdges);
    markDiagramDirty(nodesRef.current, nextEdges);
    setEdgeEditorOpen(false);
    setEditingEdgeId(null);
    resetEdgeForm();
  };

  const persistPlayground = async (createVersion: boolean, successMessage: string, refetchAfterSave: boolean) => {
    await updatePlayground({
      variables: {
        id,
        title,
        description,
        diagram: buildPersistedDiagram(),
        createVersion,
      },
      refetchQueries: refetchAfterSave ? [{ query: GET_PLAYGROUND, variables: { id } }] : [],
      awaitRefetchQueries: refetchAfterSave,
    });
    resetPlaygroundForm({
      title,
      description,
      diagram: buildPersistedDiagram(),
    });
    showToast(successMessage, "success");
  };

  const onAutoLayout = () => {
    const { nodes: layoutedNodes } = getLayoutedElements(nodesRef.current, edgesRef.current, "TB");
    const nextNodes = layoutedNodes.map((node) => ({
      ...node,
      data: {
        ...node.data,
        onLabelChange: handleLabelChange,
      },
    }));
    nodesRef.current = nextNodes;
    setNodes(nextNodes);
    markDiagramDirty(nextNodes, edgesRef.current);
    void fitView({ padding: 0.2, duration: 300 });
    showToast("Auto layout applied", "success");
  };

  const onExportPng = async () => {
    const canvasElement = canvasContainerRef.current;
    if (!canvasElement) {
      showToast("Canvas not ready for export", "error");
      return;
    }

    try {
      const dataUrl = await toPng(canvasElement, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: "#ffffff",
      });
      const link = document.createElement("a");
      const baseName = (title || "playground").trim().replace(/\s+/g, "-");
      link.download = `${baseName.toLowerCase()}.png`;
      link.href = dataUrl;
      link.click();
      showToast("PNG exported", "success");
    } catch {
      showToast("Failed to export PNG", "error");
    }
  };

  const getNodeSize = (node: Node) => {
    const width =
      typeof node.style?.width === "number"
        ? node.style.width
        : node.type === "groupNode"
          ? DEFAULT_GROUP_WIDTH
          : DEFAULT_NODE_WIDTH;
    const height =
      typeof node.style?.height === "number"
        ? node.style.height
        : node.type === "groupNode"
          ? DEFAULT_GROUP_HEIGHT
          : DEFAULT_NODE_HEIGHT;
    return { width, height };
  };

  const getAbsolutePosition = (node: Node, nodeMap: Map<string, Node>) => {
    let x = node.position.x;
    let y = node.position.y;
    let currentParentId = node.parentNode;
    const visited = new Set<string>();

    while (currentParentId && !visited.has(currentParentId)) {
      visited.add(currentParentId);
      const parentNode = nodeMap.get(currentParentId);
      if (!parentNode) break;
      x += parentNode.position.x;
      y += parentNode.position.y;
      currentParentId = parentNode.parentNode;
    }

    return { x, y };
  };

  const onGroupSelected = () => {
    if (previewVersion) return;

    const selectedNodes = nodesRef.current.filter((node) => node.selected && node.type !== "groupNode");
    if (selectedNodes.length === 0) return;

    const nodeMap = new Map(nodesRef.current.map((node) => [node.id, node]));
    const selectedWithAbs = selectedNodes.map((node) => {
      const absolute = getAbsolutePosition(node, nodeMap);
      const { width, height } = getNodeSize(node);
      return { node, absolute, width, height };
    });

    const minX = Math.min(...selectedWithAbs.map((entry) => entry.absolute.x));
    const minY = Math.min(...selectedWithAbs.map((entry) => entry.absolute.y));
    const maxX = Math.max(...selectedWithAbs.map((entry) => entry.absolute.x + entry.width));
    const maxY = Math.max(...selectedWithAbs.map((entry) => entry.absolute.y + entry.height));

    const paddingX = 24;
    const paddingTop = 44;
    const paddingBottom = 20;
    const groupPosition = { x: minX - paddingX, y: minY - paddingTop };
    const groupId = crypto.randomUUID();

    const groupNode: Node = {
      id: groupId,
      type: "groupNode",
      position: groupPosition,
      style: {
        width: Math.max(DEFAULT_GROUP_WIDTH, maxX - minX + paddingX * 2),
        height: Math.max(DEFAULT_GROUP_HEIGHT, maxY - minY + paddingTop + paddingBottom),
      },
      data: {
        label: "Container",
        type: "custom",
        groupType: "custom",
        onLabelChange: handleLabelChange,
      },
    };

    const nextNodes = nodesRef.current.map((node) => {
      const selectedNode = selectedWithAbs.find((entry) => entry.node.id === node.id);
      if (!selectedNode) return node;
      return {
        ...node,
        selected: false,
        parentNode: groupId,
        extent: "parent" as const,
        position: {
          x: selectedNode.absolute.x - groupPosition.x,
          y: selectedNode.absolute.y - groupPosition.y,
        },
      };
    });

    const groupedNodes = [...nextNodes, groupNode];
    nodesRef.current = groupedNodes;
    setNodes(groupedNodes);
    markDiagramDirty(groupedNodes, edgesRef.current);
  };

  const onSave = async () => {
    if (!isFormDirty || previewVersion) return;
    try {
      await persistPlayground(true, "Changes saved", true);
    } catch {
      showToast("Failed to save changes", "error");
    }
  };

  const onTogglePublic = async () => {
    if (!data?.playground) return;
    try {
      const nextPublic = !data.playground.isPublic;
      await togglePublic({ variables: { id, isPublic: nextPublic } });
      showToast(nextPublic ? "Playground is now public" : "Playground is now private", "success");
    } catch {
      showToast("Failed to update visibility", "error");
    }
  };

  const onToggleAutosave = () => {
    setAutosavePaused((paused) => {
      const nextPaused = !paused;
      showToast(nextPaused ? "Autosave paused" : "Autosave resumed", "info");
      return nextPaused;
    });
  };

  const onDeletePlayground = async () => {
    const { confirmed } = await confirm({
      title: "Delete playground?",
      description: "This will permanently delete the playground and all versions. This action cannot be undone.",
      confirmationText: "Delete",
      cancellationText: "Cancel",
      dialogProps: { maxWidth: "xs", fullWidth: true },
      confirmationButtonProps: { color: "error", variant: "contained" },
      cancellationButtonProps: { variant: "outlined" },
    });
    if (!confirmed) return;
    try {
      await deletePlayground({ variables: { id } });
      showToast("Playground deleted", "success");
      router.push("/dashboard");
    } catch {
      showToast("Failed to delete playground", "error");
    }
  };

  const onVersionChange = (nextIndex: string) => {
    setSelectedVersionIndex(nextIndex);
    if (nextIndex === "current") {
      setPreviewVersion(null);
      return;
    }
    const selected = sortedVersions[Number(nextIndex)];
    setPreviewVersion(selected ?? null);
  };

  const onExitPreview = () => {
    setPreviewVersion(null);
    setSelectedVersionIndex("current");
  };

  const onRestoreVersion = async () => {
    if (!previewVersion) return;
    try {
      await updatePlayground({
        variables: {
          id,
          title: previewVersion.title,
          description: previewVersion.description,
          diagram: sanitizeForPersistence(previewVersion.diagram),
        },
        refetchQueries: [{ query: GET_PLAYGROUND, variables: { id } }],
        awaitRefetchQueries: true,
      });
      setPreviewVersion(null);
      setSelectedVersionIndex("current");
      showToast("Version restored", "success");
    } catch {
      showToast("Failed to restore version", "error");
    }
  };

  const onCloseEdgeDialog = () => {
    setEdgeEditorOpen(false);
    resetEdgeForm();
  };

  const onSaveEdgeDialog = (values: EdgeFormValues) => {
    saveEdgeChanges(values);
    showToast("Edge updated", "success");
  };

  useEffect(() => {
    if (previewVersion || autosavePaused) return;

    const interval = window.setInterval(async () => {
      if (isHydratingRef.current) return;
      if (!isFormDirty) return;
      if (updatingPlayground) return;

      try {
        await persistPlayground(false, "Autosaved", false);
      } catch {
        showToast("Autosave failed", "error");
      }
    }, 5000);

    return () => window.clearInterval(interval);
  }, [previewVersion, autosavePaused, isFormDirty, updatingPlayground, title, description]);

  return {
    loading,
    playground: data?.playground ?? null,
    nodes,
    edges,
    shareUrl,
    sortedVersions,
    previewVersion,
    selectedVersionIndex,
    edgeEditorOpen,
    canSaveEdge: Boolean(editingEdgeId),
    isDirty: isFormDirty,
    isPreview: Boolean(previewVersion),
    autosavePaused,
    updatingPlayground,
    deletingPlayground,
    togglingPublic,
    playgroundFormControl,
    edgeFormControl,
    handleEdgeFormSubmit,
    canvasContainerRef,
    onSave,
    onExportPng,
    onAutoLayout,
    onToggleAutosave,
    onDeletePlayground,
    onTogglePublic,
    onVersionChange,
    onExitPreview,
    onRestoreVersion,
    onGroupSelected,
    onDragStart,
    onDrop,
    onDragOver,
    onConnectWithDirty,
    onEdgeDoubleClick,
    handleNodesChangeWithDirty,
    handleEdgesChangeWithDirty,
    onCloseEdgeDialog,
    onSaveEdgeDialog,
  };
}
