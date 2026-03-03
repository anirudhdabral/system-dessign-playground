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
        ]