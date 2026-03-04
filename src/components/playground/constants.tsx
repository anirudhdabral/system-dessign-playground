import { MdApi, MdCloudQueue, MdHub, MdMemory, MdStorage, MdViewQuilt } from "react-icons/md";

export const playgroundNodes = [
  {
    key: "api",
    label: "API",
    icon: <MdApi size={18} />,
  },
  {
    key: "db",
    label: "DB",
    icon: <MdStorage size={18} />,
  },
  {
    key: "cache",
    label: "CACHE",
    icon: <MdMemory size={18} />,
  },
  {
    key: "queue",
    label: "QUEUE",
    icon: <MdCloudQueue size={18} />,
  },
  {
    key: "group:vpc",
    label: "VPC",
    icon: <MdHub size={18} />,
  },
  {
    key: "group:availability-zone",
    label: "AZ",
    icon: <MdViewQuilt size={18} />,
  },
  {
    key: "group:kubernetes-cluster",
    label: "K8S",
    icon: <MdHub size={18} />,
  },
];

export const nodeColors: Record<string, string> = {
  api: "#3b82f6",
  db: "#22c55e",
  cache: "#f97316",
  queue: "#a855f7",
  vpc: "#334155",
  "availability-zone": "#475569",
  "kubernetes-cluster": "#0f766e",
  custom: "#64748b",
};
