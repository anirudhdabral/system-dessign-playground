"use client";

import { Box, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { motion } from "framer-motion";

interface FullPageLoaderProps {
  message?: string;
}

export default function FullPageLoader({ message }: FullPageLoaderProps) {
  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 60px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 3,
      }}
    >
      {/* Spinning gradient ring */}
      <Box
        sx={{
          position: "relative",
          width: 52,
          height: 52,
        }}
      >
        {/* Visible gradient ring via conic-gradient on a rounded div */}
        <Box
          component={motion.div}
          animate={{ rotate: 360 }}
          transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
          sx={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            background: (t) =>
              `conic-gradient(from 0deg, ${alpha(t.palette.primary.main, 0)} 0%, ${t.palette.primary.main} 60%, #7c3aed 100%)`,
            // Mask the centre to make it a ring not a disc
            maskImage: "radial-gradient(circle, transparent 54%, black 55%)",
            WebkitMaskImage: "radial-gradient(circle, transparent 54%, black 55%)",
          }}
        />
        {/* Static inner dot to anchor the eye */}
        <Box
          sx={{
            position: "absolute",
            inset: "18px",
            borderRadius: "50%",
            bgcolor: "primary.main",
            opacity: 0.25,
          }}
        />
      </Box>

      {/* Text */}
      <Box sx={{ textAlign: "center" }}>
        <Typography variant="body2" sx={{ fontWeight: 600, color: "text.secondary" }}>
          {message ?? "Loading…"}
        </Typography>
      </Box>
    </Box>
  );
}
