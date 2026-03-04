"use client";

import FullPageLoader from "@/components/common/FullPageLoader";
import CreatePlaygroundCard from "@/components/dashboard/CreatePlaygroundCard";
import PlaygroundsListSection from "@/components/dashboard/PlaygroundsListSection";
import { CreatePlaygroundFormValues, GetPlaygroundsResponse } from "@/components/dashboard/types";
import { CREATE_PLAYGROUND, GET_PLAYGROUNDS } from "@/lib/graphql/operations/dashboard";
import { useToast } from "@/providers/ToastProvider";
import { useMutation, useQuery } from "@apollo/client/react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { alpha } from "@mui/material/styles";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { MdDashboard } from "react-icons/md";

export default function Dashboard() {
  const maxPlaygrounds = 4;
  const { data: session, status } = useSession();
  const { showToast } = useToast();
  const { data, loading } = useQuery<GetPlaygroundsResponse>(GET_PLAYGROUNDS);
  const [createPlayground, { loading: creatingPlayground }] = useMutation(CREATE_PLAYGROUND, {
    refetchQueries: [{ query: GET_PLAYGROUNDS }],
    awaitRefetchQueries: true,
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty: isCreateDirty, isValid: isCreateValid },
  } = useForm<CreatePlaygroundFormValues>({
    defaultValues: {
      title: "",
      description: "",
    },
    mode: "onChange",
  });

  const onCreatePlayground = async (values: CreatePlaygroundFormValues) => {
    try {
      await createPlayground({
        variables: {
          title: values.title.trim(),
          description: values.description.trim(),
        },
      });
      reset();
      showToast("Playground created successfully", "success");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to create playground";
      if (message.includes("Playground limit reached")) {
        showToast(`You can create up to ${maxPlaygrounds} playgrounds.`, "warning");
        return;
      }
      showToast("Failed to create playground", "error");
    }
  };

  const playgroundCount = data?.playgrounds?.length ?? 0;
  const hasReachedPlaygroundLimit = playgroundCount >= maxPlaygrounds;

  if (status === "loading") {
    return <FullPageLoader />;
  }
  if (!session) {
    return (
      <Container sx={{ mt: 8, textAlign: "center" }}>
        <Typography variant="h6" sx={{ color: "text.secondary" }}>
          Please sign in to access your dashboard.
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Stack
        component={motion.div}
        spacing={5}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        {/* Header */}
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.35 }}
        >
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: "14px",
                background: "linear-gradient(135deg, #4c6fff 0%, #7c3aed 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                boxShadow: (t) => `0 4px 14px ${alpha(t.palette.primary.main, 0.4)}`,
              }}
            >
              <MdDashboard size={22} />
            </Box>
            <Box>
              <Typography variant="h4" sx={{ lineHeight: 1.2 }}>
                My Playgrounds
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.25 }}>
                Hello{session.user?.name ? `, ${session.user.name.split(" ")[0]}` : ""}! Build and share architecture
                diagrams.
              </Typography>
            </Box>
          </Stack>
        </Box>

        {/* Main grid */}
        <Grid container spacing={3} alignItems="flex-start">
          <Grid size={{ xs: 12, md: 4 }}>
            <Box
              component={motion.div}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12, duration: 0.35 }}
            >
              <CreatePlaygroundCard
                control={control}
                handleSubmit={handleSubmit}
                onCreate={onCreatePlayground}
                disabled={!isCreateDirty || !isCreateValid || creatingPlayground || hasReachedPlaygroundLimit}
                loading={creatingPlayground}
                helperText={
                  hasReachedPlaygroundLimit
                    ? `You have reached the limit of ${maxPlaygrounds} playgrounds. Delete one to create a new playground.`
                    : undefined
                }
              />
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 8 }}>
            <Box
              component={motion.div}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18, duration: 0.35 }}
            >
              <PlaygroundsListSection loading={loading} playgrounds={data?.playgrounds ?? []} />
            </Box>
          </Grid>
        </Grid>
      </Stack>
    </Container>
  );
}
