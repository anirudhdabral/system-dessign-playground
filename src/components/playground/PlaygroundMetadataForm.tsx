"use client";

import { Box, TextField } from "@mui/material";
import { Control, Controller } from "react-hook-form";
import { PlaygroundFormValues } from "./types";

interface PlaygroundMetadataFormProps {
  control: Control<PlaygroundFormValues>;
}

export default function PlaygroundMetadataForm({ control }: PlaygroundMetadataFormProps) {
  return (
    <Box sx={{ mb: 2 }}>
      <Controller
        name="title"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Title"
            fullWidth
            sx={{ mb: 2 }}
            onChange={(event) => field.onChange(event.target.value)}
          />
        )}
      />

      <Controller
        name="description"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Description"
            fullWidth
            multiline
            rows={6}
            sx={{ mb: 2 }}
            onChange={(event) => field.onChange(event.target.value)}
          />
        )}
      />
    </Box>
  );
}
