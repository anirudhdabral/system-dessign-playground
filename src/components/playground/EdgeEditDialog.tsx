"use client";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { Controller } from "react-hook-form";
import { EdgeDialogFormProps, EdgeFormValues } from "./types";

interface EdgeEditDialogProps extends EdgeDialogFormProps {
  open: boolean;
  canSave: boolean;
  onClose: () => void;
  onSave: (values: EdgeFormValues) => void;
}

export default function EdgeEditDialog({ open, canSave, onClose, onSave, control, handleSubmit }: EdgeEditDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit Edge</DialogTitle>
      <DialogContent>
        <Controller
          name="label"
          control={control}
          render={({ field }) => <TextField {...field} fullWidth label="Label" sx={{ mt: 1, mb: 2 }} />}
        />
        <Controller
          name="protocol"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Protocol</InputLabel>
              <Select {...field} label="Protocol">
                <MenuItem value="">None</MenuItem>
                <MenuItem value="HTTP">HTTP</MenuItem>
                <MenuItem value="gRPC">gRPC</MenuItem>
                <MenuItem value="Async">Async</MenuItem>
              </Select>
            </FormControl>
          )}
        />
        <Controller
          name="latency"
          control={control}
          render={({ field }) => (
            <TextField {...field} fullWidth label="Latency (optional)" placeholder="e.g. 120ms" sx={{ mb: 2 }} />
          )}
        />
        <Controller
          name="rps"
          control={control}
          render={({ field }) => <TextField {...field} fullWidth label="RPS (optional)" placeholder="e.g. 500" />}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" disabled={!canSave} onClick={handleSubmit(onSave)}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
