import { useState } from "react";
import { IconButton, Tooltip } from "@mui/material";
import { TbCopy, TbCopyCheckFilled } from "react-icons/tb";

export default function CopyIconButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!text || copied) return;

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  return (
    <Tooltip title={copied ? "Link copied!" : "Copy link"}>
      <IconButton color="primary" onClick={handleCopy}>
        {copied ? <TbCopyCheckFilled size={20} /> : <TbCopy size={20} />}
      </IconButton>
    </Tooltip>
  );
}
