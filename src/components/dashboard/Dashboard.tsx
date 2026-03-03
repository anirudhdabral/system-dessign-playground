"use client";

import { useMutation, useQuery } from "@apollo/client/react";
import { Avatar, Box, Container, Grid, Stack, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import FullPageLoader from "@/components/common/FullPageLoader";
import CreatePlaygroundCard from "@/components/dashboard/CreatePlaygroundCard";
import PlaygroundsListCard from "@/components/dashboard/PlaygroundsListCard";
import { CREATE_PLAYGROUND, GET_PLAYGROUNDS } from "@/lib/graphql/operations/dashboard";
import { CreatePlaygroundFormValues, GetPlaygroundsResponse } from "@/components/dashboard/types";
import { useToast } from "@/providers/ToastProvider";
import { MdDashboard } from "react-icons/md";

export default function Dashboard() {
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
    } catch {
      showToast("Failed to create playground", "error");
    }
  };

  if (status === "loading") {
    return <FullPageLoader />;
  }
  if (!session) return <Typography>Please login to access dashboard.</Typography>;

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Stack
        component={motion.div}
        spacing={4}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.3 }}
        >
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
            <Avatar sx={{ width: 34, height: 34 }}>
              <MdDashboard />
            </Avatar>
            <Typography variant="h4">System Design Dashboard</Typography>
          </Stack>
          <Typography variant="body1">Build and share architecture playgrounds with version history.</Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 5 }}>
            <Box
              component={motion.div}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.35 }}
            >
              <CreatePlaygroundCard
                control={control}
                handleSubmit={handleSubmit}
                onCreate={onCreatePlayground}
                disabled={!isCreateDirty || !isCreateValid || creatingPlayground}
              />
            </Box>
          </Grid>
        </Grid>

        <PlaygroundsListCard loading={loading} playgrounds={data?.playgrounds ?? []} />
      </Stack>
    </Container>
  );
}
