"use client";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { alpha } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { motion } from "framer-motion";
import { Control, Controller, UseFormHandleSubmit } from "react-hook-form";
import { MdAdd, MdDriveFileRenameOutline } from "react-icons/md";
import { CreatePlaygroundFormValues } from "./types";

interface CreatePlaygroundCardProps {
  control: Control<CreatePlaygroundFormValues>;
  handleSubmit: UseFormHandleSubmit<CreatePlaygroundFormValues>;
  onCreate: (values: CreatePlaygroundFormValues) => Promise<void>;
  disabled: boolean;
  loading?: boolean;
}

export default function CreatePlaygroundCard({
  control,
  handleSubmit,
  onCreate,
  disabled,
  loading,
}: CreatePlaygroundCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      whileHover={{ y: -3 }}
      // whileHover uses spring by default — feels smooth and physical
      style={{ borderRadius: 16 }}
    >
      <Paper sx={{ overflow: "hidden" }}>
        {/* Gradient top accent */}
        <Box
          sx={{
            height: 4,
            background: "linear-gradient(90deg, #4c6fff 0%, #7c3aed 100%)",
          }}
        />

        <Box component="form" onSubmit={handleSubmit(onCreate)} noValidate sx={{ p: 3 }}>
          <Stack spacing={2.5}>
            <Stack direction="row" spacing={1.5} alignItems="center">
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
                <MdDriveFileRenameOutline size={18} />
              </Box>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                  New Playground
                </Typography>
                <Typography variant="caption" sx={{ color: "text.secondary" }}>
                  Start a fresh diagram
                </Typography>
              </Box>
            </Stack>

            <Divider />

            <Controller
              name="title"
              control={control}
              rules={{
                required: true,
                validate: (value) => value.trim().length > 0,
              }}
              render={({ field }) => (
                <TextField {...field} label="Title" fullWidth size="small" placeholder="e.g. Twitter Architecture" />
              )}
            />

            <Controller
              name="description"
              control={control}
              rules={{
                required: true,
                validate: (value) => value.trim().length > 0,
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Description"
                  fullWidth
                  size="small"
                  multiline
                  rows={3}
                  placeholder="Briefly describe what you're designing…"
                />
              )}
            />

            <Button
              type="submit"
              variant="contained"
              disabled={disabled}
              startIcon={loading ? <CircularProgress size={15} color="inherit" /> : <MdAdd size={18} />}
              sx={{
                py: 1.1,
                background: "linear-gradient(135deg, #4c6fff 0%, #7c3aed 100%)",
                "&:hover": {
                  background: "linear-gradient(135deg, #3a5de0 0%, #6d28d9 100%)",
                },
                "&.Mui-disabled": {
                  background: (t) => alpha(t.palette.primary.main, 0.15),
                },
              }}
            >
              {loading ? "Creating…" : "Create Playground"}
            </Button>
          </Stack>
        </Box>
      </Paper>
    </motion.div>
  );
}
