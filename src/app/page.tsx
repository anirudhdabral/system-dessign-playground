"use client";

import { Container, Typography } from "@mui/material";

export default function Home() {
  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4">Welcome to System Design Playground</Typography>
      <Typography sx={{ mt: 2 }}>Practice, design, and iterate on scalable systems.</Typography>
    </Container>
  );
}
