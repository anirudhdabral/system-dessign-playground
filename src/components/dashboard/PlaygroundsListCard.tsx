"use client";

import { Box, Button, Card, CardContent, LinearProgress, Paper, Stack, Typography } from "@mui/material";
import { motion } from "framer-motion";
import Link from "next/link";
import { MdOpenInNew } from "react-icons/md";
import { Playground } from "./types";

interface PlaygroundsListCardProps {
  loading: boolean;
  playgrounds: Playground[];
}

export default function PlaygroundsListCard({ loading, playgrounds }: PlaygroundsListCardProps) {
  return (
    <Card
      component={motion.div}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, duration: 0.35 }}
    >
      <CardContent>
        <Stack spacing={2}>
          <Typography variant="h6">Your Playgrounds</Typography>
          {loading && <LinearProgress />}
          {!loading && (
            <Box
              sx={{
                display: "flex",
                gap: 2,
                overflowX: "auto",
                pb: 1,
                scrollSnapType: "x mandatory",
              }}
            >
              {playgrounds.length === 0 && (
                <Paper sx={{ p: 3, minWidth: 300 }}>
                  <Typography variant="subtitle1">No playgrounds yet</Typography>
                  <Typography variant="body2">Create your first playground to start designing.</Typography>
                </Paper>
              )}
              {playgrounds.map((playground, index) => (
                <Card
                  component={motion.div}
                  key={playground.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.02 * index, duration: 0.24 }}
                  sx={{
                    width: 300,
                    height: 170,
                    flex: "0 0 auto",
                    scrollSnapAlign: "start",
                  }}
                >
                  <CardContent
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      gap: 1,
                    }}
                  >
                    <Typography component={Link} href={`/playground/${playground.id}`} variant="h5" noWrap>
                      {playground.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        overflow: "hidden",
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      {playground.description}
                    </Typography>
                    <Button
                      component={Link}
                      href={`/playground/${playground.id}`}
                      variant="text"
                      endIcon={<MdOpenInNew />}
                      sx={{
                        mt: "auto",
                        alignSelf: "flex-start",
                        textTransform: "uppercase",
                        letterSpacing: 0.8,
                        px: 0,
                        minWidth: "auto",
                      }}
                    >
                      Open Playground
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </Box>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
