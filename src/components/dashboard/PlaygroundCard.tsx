import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { alpha } from "@mui/material/styles";
import { motion } from "framer-motion";
import Link from "next/link";
import { MdArrowForward } from "react-icons/md";
import { Playground } from "./types";

export const PlaygroundCard = ({ playgrounds }: { playgrounds: Playground[] }) => {
  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        overflowX: "auto",
        p: 1,
        scrollSnapType: "x mandatory",
      }}
    >
      {playgrounds.map((playground, index) => (
        <motion.div
          key={playground.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.05 * index,
            duration: 0.3,
            ease: "easeOut",
          }}
          style={{ flex: "0 0 auto", scrollSnapAlign: "start", width: 280, borderRadius: 3 }}
        >
          {/* This motion.div handles hover — spring physics = smooth lift */}
          <motion.div
            whileHover={{ y: -4, boxShadow: "0 8px 32px rgba(76,111,255,0.16)" }}
            whileTap={{ y: -1, scale: 0.99 }}
            transition={{
              type: "spring",
              stiffness: 380,
              damping: 28,
            }}
            style={{ borderRadius: 35, height: "100%" }}
          >
            <Link href={`/playground/${playground.id}`}>
              <Paper
                sx={{
                  p: 2.5,
                  height: 180,
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                  borderRadius: 3,
                  cursor: "pointer",
                  position: "relative",
                  overflow: "hidden",
                  // Top colour stripe per card — unique hue per index
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 3,
                    background: `linear-gradient(90deg,
                            hsl(${(index * 53) % 360}, 70%, 60%),
                            hsl(${(index * 53 + 60) % 360}, 70%, 55%))`,
                  },
                }}
              >
                <Typography
                  variant="subtitle1"
                  noWrap
                  sx={{
                    fontWeight: 700,
                    textDecoration: "none",
                    color: "text.primary",
                    "&:hover": { color: "primary.main" },
                    mt: 0.5, // offset the top stripe
                  }}
                >
                  {playground.title}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    color: "text.secondary",
                    overflow: "hidden",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    lineHeight: 1.65,
                    flexGrow: 1,
                  }}
                >
                  {playground.description}
                </Typography>

                <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"} mt="auto">
                  <Chip
                    size="small"
                    label={playground.isPublic ? "Public" : "Private"}
                    sx={{
                      height: 22,
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      bgcolor: (t) =>
                        playground.isPublic ? alpha(t.palette.success.main, 0.14) : alpha(t.palette.text.primary, 0.08),
                      color: playground.isPublic ? "success.main" : "text.secondary",
                      border: "1px solid",
                      borderColor: (t) =>
                        playground.isPublic ? alpha(t.palette.success.main, 0.28) : alpha(t.palette.text.primary, 0.12),
                    }}
                  />
                  <Button
                    variant="text"
                    size="small"
                    endIcon={<MdArrowForward />}
                    sx={{
                      fontWeight: 600,
                      fontSize: "0.78rem",
                      color: "primary.main",
                    }}
                  >
                    Open
                  </Button>
                </Box>
              </Paper>
            </Link>
          </motion.div>
        </motion.div>
      ))}
    </Box>
  );
};
