"use client";

import { Button, Box, Paper, Stack, TextField, Typography } from "@mui/material";
import { Controller, Control, UseFormHandleSubmit } from "react-hook-form";
import { MdAddCircleOutline } from "react-icons/md";
import { CreatePlaygroundFormValues } from "./types";

interface CreatePlaygroundCardProps {
  control: Control<CreatePlaygroundFormValues>;
  handleSubmit: UseFormHandleSubmit<CreatePlaygroundFormValues>;
  onCreate: (values: CreatePlaygroundFormValues) => Promise<void>;
  disabled: boolean;
}

export default function CreatePlaygroundCard({ control, handleSubmit, onCreate, disabled }: CreatePlaygroundCardProps) {
  return (
    <Paper sx={{ p: 3 }}>
      <Box component="form" onSubmit={handleSubmit(onCreate)} noValidate>
        <Stack spacing={2}>
          <Typography variant="h6">Create Playground</Typography>
          <Controller
            name="title"
            control={control}
            rules={{
              required: true,
              validate: (value) => value.trim().length > 0,
            }}
            render={({ field }) => <TextField {...field} label="Title" fullWidth />}
          />
          <Controller
            name="description"
            control={control}
            rules={{
              required: true,
              validate: (value) => value.trim().length > 0,
            }}
            render={({ field }) => <TextField {...field} label="Description" fullWidth multiline rows={4} />}
          />
          <Button type="submit" variant="contained" startIcon={<MdAddCircleOutline />} disabled={disabled}>
            Create Playground
          </Button>
        </Stack>
      </Box>
    </Paper>
  );
}
