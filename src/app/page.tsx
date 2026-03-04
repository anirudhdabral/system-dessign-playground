"use client";

import { Box, Button, Chip, Container, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { motion } from "framer-motion";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { signIn } from "next-auth/react";
import { MdArrowForward, MdAutoGraph, MdDashboard, MdLayers, MdShare, MdTimeline } from "react-icons/md";

const features = [
  {
    icon: <MdLayers size={22} />,
    title: "Visual Node Editor",
    desc: "Drag-and-drop API, DB, cache and queue components onto an infinite canvas.",
  },
  {
    icon: <MdTimeline size={22} />,
    title: "Version History",
    desc: "Every save creates a snapshot. Browse, preview, and restore any past state.",
  },
  {
    icon: <MdShare size={22} />,
    title: "Share Publicly",
    desc: "One click to publish a read-only link anyone can view without an account.",
  },
  {
    icon: <MdAutoGraph size={22} />,
    title: "Auto Layout",
    desc: "Instantly arrange messy diagrams into clean, readable graphs with one button.",
  },
];

export default function Home() {
  const { data: session } = useSession();

  return (
    <Box sx={{ minHeight: "calc(100vh - 60px)", position: "relative", overflow: "hidden" }}>
      {/* Ambient gradient blobs */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: "-10%",
            left: "-5%",
            width: "55%",
            paddingTop: "55%",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(76,111,255,0.12) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: "-5%",
            right: "-5%",
            width: "50%",
            paddingTop: "50%",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />
      </Box>

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1, py:6 }}>
        <Stack alignItems="center" spacing={5}>
          {/* Badge */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <Chip
              label="* Visual System Design Tool"
              sx={{
                fontWeight: 600,
                fontSize: "0.78rem",
                letterSpacing: "0.04em",
                height: 30,
                bgcolor: (t) => alpha(t.palette.primary.main, 0.1),
                color: "primary.main",
                border: "1px solid",
                borderColor: (t) => alpha(t.palette.primary.main, 0.25),
              }}
            />
          </motion.div>

          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.08 }}
            style={{ textAlign: "center" }}
          >
            <Typography
              component="h1"
              sx={{
                fontWeight: 800,
                fontSize: { xs: "2.4rem", sm: "3.2rem", md: "4rem" },
                lineHeight: 1.1,
                letterSpacing: "-1.5px",
                background:
                  "linear-gradient(130deg, var(--home-hero-title-gradient-start) 20%, var(--home-hero-title-gradient-end) 80%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Design Systems.
              <br />
              <Box
                component="span"
                sx={{
                  background: "linear-gradient(130deg, #4c6fff 10%, #7c3aed 90%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Visually.
              </Box>
            </Typography>
          </motion.div>

          {/* Sub-headline */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.16 }}
            style={{ textAlign: "center", maxWidth: 520 }}
          >
            <Typography
              variant="body1"
              sx={{
                color: (t) => (t.palette.mode === "dark" ? alpha(t.palette.text.primary, 0.88) : "text.secondary"),
                fontSize: "1.05rem",
                lineHeight: 1.8,
              }}
            >
              A collaborative canvas for sketching scalable architectures - with versioning, sharing, and a rich node
              palette built in.
            </Typography>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.24 }}
          >
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} alignItems="center">
              {session ? (
                <Button
                  component={Link}
                  href="/dashboard"
                  variant="contained"
                  size="large"
                  endIcon={<MdDashboard />}
                  sx={{
                    px: 3.5,
                    py: 1.25,
                    borderRadius: 3,
                    fontSize: "0.95rem",
                    fontWeight: 700,
                    background: "linear-gradient(135deg, #4c6fff 0%, #7c3aed 100%)",
                    "&:hover": {
                      background: "linear-gradient(135deg, #3a5de0 0%, #6d28d9 100%)",
                    },
                  }}
                >
                  Open Dashboard
                </Button>
              ) : (
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => signIn()}
                  endIcon={<MdArrowForward />}
                  sx={{
                    px: 3.5,
                    py: 1.25,
                    borderRadius: 3,
                    fontSize: "0.95rem",
                    fontWeight: 700,
                    background: "linear-gradient(135deg, #4c6fff 0%, #7c3aed 100%)",
                    "&:hover": {
                      background: "linear-gradient(135deg, #3a5de0 0%, #6d28d9 100%)",
                    },
                  }}
                >
                  Get Started Free
                </Button>
              )}
            </Stack>
          </motion.div>

          {/* Feature grid */}
          <Box
            component={motion.div}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "repeat(4, 1fr)" },
              gap: 2,
              width: "100%",
              mt: 4,
            }}
          >
            {features.map((f, i) => (
              <Box
                key={f.title}
                component={motion.div}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.07, duration: 0.35 }}
                sx={{
                  p: 2.5,
                  borderRadius: 3,
                  border: "1px solid",
                  borderColor: (t) => (t.palette.mode === "dark" ? alpha(t.palette.common.white, 0.18) : "divider"),
                  bgcolor: (t) =>
                    t.palette.mode === "dark" ? alpha(t.palette.background.paper, 0.78) : t.palette.background.paper,
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                  cursor: "default",
                  "&:hover": {
                    borderColor: "primary.main",
                    boxShadow: (t) => `0 4px 24px ${alpha(t.palette.primary.main, 0.12)}`,
                    transform: "translateY(-2px)",
                  },
                }}
              >
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    bgcolor: (t) => alpha(t.palette.primary.main, 0.1),
                    color: "primary.main",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {f.icon}
                </Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                  {f.title}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: (t) => (t.palette.mode === "dark" ? alpha(t.palette.text.primary, 0.82) : "text.secondary"),
                    lineHeight: 1.7,
                  }}
                >
                  {f.desc}
                </Typography>
              </Box>
            ))}
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}

