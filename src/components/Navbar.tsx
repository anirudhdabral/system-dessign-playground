"use client";

import { useThemeMode } from "@/providers/AppThemeProvider";
import { AppBar, Box, Button, ButtonBase, Toolbar, Typography } from "@mui/material";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { MdDarkMode, MdLightMode } from "react-icons/md";

export default function Navbar() {
  const { data: session } = useSession();
  const { mode, toggleTheme } = useThemeMode();
  const isDark = mode === "dark";

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          System Design Playground
        </Typography>

        <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
          <Button color="inherit" component={Link} href="/">
            Home
          </Button>

          {session && (
            <Button color="inherit" component={Link} href="/dashboard">
              Dashboard
            </Button>
          )}

          <ButtonBase
            onClick={toggleTheme}
            aria-label="Toggle theme"
            sx={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              width: 96,
              height: 40,
              px: 0.75,
              borderRadius: 999,
              border: 1,
              borderColor: "divider",
              bgcolor: "background.paper",
              transition: "all 220ms ease",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                top: 3,
                left: 4,
                width: 32,
                height: 32,
                borderRadius: 999,
                bgcolor: "background.default",
                boxShadow: "0 4px 10px rgba(2, 6, 23, 0.14)",
                transition: "transform 260ms ease",
                transform: isDark ? "translateX(55px)" : "translateX(0px)",
              }}
            />
            <Box
              sx={{
                position: "relative",
                zIndex: 1,
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                px: 0.75,
              }}
            >
              {!isDark ? (
                <>
                  <MdLightMode size={16} style={{ color: "yellow" }} />
                  <Typography variant="caption" sx={{ fontWeight: 500, textTransform: "uppercase" }}>
                    Light
                  </Typography>
                </>
              ) : (
                <>
                  <Typography variant="caption" sx={{ fontWeight: 500, textTransform: "uppercase" }}>
                    Dark
                  </Typography>
                  <MdDarkMode size={16} />
                </>
              )}
            </Box>
          </ButtonBase>

          {!session ? (
            <Button color="inherit" onClick={() => signIn()}>
              Login
            </Button>
          ) : (
            <Button color="inherit" onClick={() => signOut()}>
              Logout
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
