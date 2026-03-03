import dagre from "dagre";
import { Edge, Node, Position } from "reactflow";

const nodeWidth = 180;
const nodeHeight = 60;
const groupMinWidth = 280;
const groupMinHeight = 180;
const groupPaddingX = 24;
const groupPaddingTop = 44;
const groupPaddingBottom = 20;
const GROUP_NODE_TYPE = "groupNode";

const getNodeDimensions = (node: Node) => {
  const width =
    typeof node.style?.width === "number"
      ? node.style.width
      : node.type === GROUP_NODE_TYPE
        ? groupMinWidth
        : nodeWidth;
  const height =
    typeof node.style?.height === "number"
      ? node.style.height
      : node.type === GROUP_NODE_TYPE
        ? groupMinHeight
        : nodeHeight;

  return { width, height };
};

const layoutWithDagre = (nodes: Node[], edges: Edge[], direction: "TB" | "LR"): Node[] => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({ rankdir: direction });

  const isHorizontal = direction === "LR";

  nodes.forEach((node) => {
    const { width, height } = getNodeDimensions(node);
    dagreGraph.setNode(node.id, { width, height });
  });

  edges.forEach((edge) => {
    if (dagreGraph.hasNode(edge.source) && dagreGraph.hasNode(edge.target)) {
      dagreGraph.setEdge(edge.source, edge.target);
    }
  });

  dagre.layout(dagreGraph);

  return nodes.map((node) => {
    const positionedNode = dagreGraph.node(node.id);
    if (!positionedNode) return node;

    const { width, height } = getNodeDimensions(node);

    return {
      ...node,
      position: {
        x: positionedNode.x - width / 2,
        y: positionedNode.y - height / 2,
      },
      targetPosition: isHorizontal ? Position.Left : Position.Top,
      sourcePosition: isHorizontal ? Position.Right : Position.Bottom,
    };
  });
};

export function getLayoutedElements(
  nodes: Node[],
  edges: Edge[],
  direction: "TB" | "LR" = "TB",
): { nodes: Node[]; edges: Edge[] } {
  const nodesById = new Map(nodes.map((node) => [node.id, node]));

  // First, layout each group's children inside the parent boundary.
  const groupNodes = nodes.filter((node) => node.type === GROUP_NODE_TYPE);
  groupNodes.forEach((groupNode) => {
    const children = nodes.filter((node) => node.parentNode === groupNode.id);
    if (children.length === 0) return;

    const childIds = new Set(children.map((child) => child.id));
    const internalEdges = edges.filter((edge) => childIds.has(edge.source) && childIds.has(edge.target));

    const layoutedChildren = layoutWithDagre(children, internalEdges, direction);

    const minX = Math.min(...layoutedChildren.map((node) => node.position.x));
    const minY = Math.min(...layoutedChildren.map((node) => node.position.y));

    const normalizedChildren = layoutedChildren.map((node) => {
      const { width, height } = getNodeDimensions(node);
      return {
        ...node,
        parentNode: groupNode.id,
        extent: "parent" as const,
        position: {
          x: node.position.x - minX + groupPaddingX,
          y: node.position.y - minY + groupPaddingTop,
        },
        style: {
          ...node.style,
          width,
          height,
        },
      };
    });

    const groupWidth = Math.max(
      groupMinWidth,
      Math.max(
        ...normalizedChildren.map((node) => {
          const { width } = getNodeDimensions(node);
          return node.position.x + width;
        }),
      ) + groupPaddingX,
    );
    const groupHeight = Math.max(
      groupMinHeight,
      Math.max(
        ...normalizedChildren.map((node) => {
          const { height } = getNodeDimensions(node);
          return node.position.y + height;
        }),
      ) + groupPaddingBottom,
    );

    nodesById.set(groupNode.id, {
      ...groupNode,
      style: {
        ...groupNode.style,
        width: groupWidth,
        height: groupHeight,
      },
    });

    normalizedChildren.forEach((node) => {
      nodesById.set(node.id, node);
    });
  });

  // Then layout top-level nodes only (groups + non-group nodes not inside a group).
  const allNodes = Array.from(nodesById.values());
  const topLevelNodes = allNodes.filter((node) => !node.parentNode);
  const topLevelNodeIds = new Set(topLevelNodes.map((node) => node.id));
  const topLevelEdges = edges.filter((edge) => topLevelNodeIds.has(edge.source) && topLevelNodeIds.has(edge.target));
  const layoutedTopLevel = layoutWithDagre(topLevelNodes, topLevelEdges, direction);

  layoutedTopLevel.forEach((node) => {
    nodesById.set(node.id, node);
  });

  const layoutedNodes = nodes.map((node) => nodesById.get(node.id) ?? node);

  return { nodes: layoutedNodes, edges };
}
