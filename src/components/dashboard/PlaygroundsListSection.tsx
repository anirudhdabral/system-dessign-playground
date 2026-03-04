"use client";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import LinearProgress from "@mui/material/LinearProgress";
import Paper from "@mui/material/Paper";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { alpha } from "@mui/material/styles";
import { AnimatePresence, motion } from "framer-motion";
import { MdGridView, MdInbox } from "react-icons/md";
import { PlaygroundCard } from "./PlaygroundCard";
import { Playground } from "./types";

interface PlaygroundsListSectionProps {
  loading: boolean;
  playgrounds: Playground[];
}

export default function PlaygroundsListSection({ loading, playgrounds }: PlaygroundsListSectionProps) {
  return (
    <Card
      component={motion.div}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Stack spacing={3}>
          {/* Header */}
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: "10px",
                bgcolor: (t) => alpha(t.palette.primary.main, 0.1),
                color: "primary.main",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <MdGridView size={18} />
            </Box>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                Your Playgrounds
              </Typography>
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                {loading ? "Loading…" : `${playgrounds.length} diagram${playgrounds.length !== 1 ? "s" : ""}`}
              </Typography>
            </Box>
            <AnimatePresence>
              {!loading && playgrounds.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.7 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <Chip
                    label={`${playgrounds.length}`}
                    size="small"
                    sx={{
                      fontWeight: 700,
                      bgcolor: (t) => alpha(t.palette.primary.main, 0.1),
                      color: "primary.main",
                      border: "none",
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </Stack>

          {/* Loading bar */}
          <AnimatePresence>
            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <LinearProgress sx={{ borderRadius: 999 }} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Loading skeletons */}
          <AnimatePresence>
            {loading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Box sx={{ display: "flex", gap: 2, overflowX: "auto", pb: 1 }}>
                  {[0, 1, 2].map((i) => (
                    <Paper key={i} sx={{ p: 2.5, minWidth: 280, flex: "0 0 auto", borderRadius: 3 }}>
                      <Stack spacing={1.5}>
                        <Skeleton variant="text" width="70%" height={28} />
                        <Skeleton variant="text" width="100%" />
                        <Skeleton variant="text" width="80%" />
                        <Skeleton variant="rectangular" width={120} height={28} sx={{ borderRadius: 2, mt: 1 }} />
                      </Stack>
                    </Paper>
                  ))}
                </Box>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Empty state */}
          <AnimatePresence>
            {!loading && playgrounds.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <Box
                  sx={{
                    py: 6,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 1.5,
                    bgcolor: (t) => alpha(t.palette.text.primary, 0.02),
                    borderRadius: 3,
                    border: "1.5px dashed",
                    borderColor: "divider",
                  }}
                >
                  <Box
                    sx={{
                      width: 52,
                      height: 52,
                      borderRadius: "16px",
                      bgcolor: (t) => alpha(t.palette.text.secondary, 0.07),
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "text.disabled",
                    }}
                  >
                    <MdInbox size={26} />
                  </Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                    No playgrounds yet
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary", textAlign: "center", maxWidth: 260 }}>
                    Create your first playground using the form on the left to start designing.
                  </Typography>
                </Box>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Playground cards */}
          {!loading && playgrounds.length > 0 && <PlaygroundCard playgrounds={playgrounds} />}
        </Stack>
      </CardContent>
    </Card>
  );
}
