"use client";

import { useThemeMode } from "@/providers/AppThemeProvider";
import { AppBar, Avatar, Box, Button, Chip, Divider, IconButton, Popover, Toolbar, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { MdDarkMode, MdDashboard, MdLightMode, MdLogin, MdLogout } from "react-icons/md";

export default function Navbar() {
  const { data: session } = useSession();
  const { mode, toggleTheme } = useThemeMode();
  const isDark = mode === "dark";

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const popoverOpen = Boolean(anchorEl);

  const handleAvatarClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(e.currentTarget);
  };
  const handlePopoverClose = () => setAnchorEl(null);

  return (
    <AppBar position="sticky" sx={{ top: 0, zIndex: 1100 }}>
      <Toolbar>
        {/* Logo / Brand */}
        <Box
          component={Link}
          href="/"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            textDecoration: "none",
            flexGrow: 1,
          }}
        >
          <Image
            src="/favicon.svg"
            alt="SysDesign logo"
            width={32}
            height={32}
            style={{ borderRadius: 10, display: "block" }}
          />
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 700,
              letterSpacing: "-0.3px",
              background: isDark
                ? "linear-gradient(135deg, #7895ff, #c084fc)"
                : "linear-gradient(135deg, #3754db, #7c3aed)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            SysDesign
          </Typography>
          <Chip
            label="Playground"
            size="small"
            sx={{
              height: 20,
              fontSize: "0.65rem",
              fontWeight: 600,
              backgroundColor: (t) => alpha(t.palette.primary.main, 0.1),
              color: "primary.main",
              border: "none",
              letterSpacing: "0.04em",
            }}
          />
        </Box>

        {/* Nav links */}
        <Box sx={{ display: "flex", gap: 0.5, alignItems: "center" }}>
          {session && (
            <Button
              color="inherit"
              component={Link}
              href="/dashboard"
              startIcon={<MdDashboard size={16} />}
              size="small"
              sx={{
                fontWeight: 500,
                color: "text.secondary",
                "&:hover": { color: "text.primary", bgcolor: (t) => alpha(t.palette.text.primary, 0.06) },
              }}
            >
              Dashboard
            </Button>
          )}

          {/* Auth */}
          {!session ? (
            <>
              <IconButton
                size="small"
                onClick={toggleTheme}
                aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
                sx={{
                  ml: 0.5,
                  width: 32,
                  height: 32,
                  border: "1px solid",
                  borderColor: "divider",
                  color: isDark ? "primary.light" : "warning.dark",
                  bgcolor: (t) => alpha(t.palette.text.primary, 0.04),
                  "&:hover": {
                    bgcolor: (t) => alpha(t.palette.text.primary, 0.1),
                    borderColor: "text.secondary",
                  },
                }}
              >
                {isDark ? <MdDarkMode size={16} /> : <MdLightMode size={16} />}
              </IconButton>
              <Button
                variant="contained"
                size="small"
                onClick={() => signIn()}
                startIcon={<MdLogin size={15} />}
                sx={{ ml: 0.5, borderRadius: "10px" }}
              >
                Sign In
              </Button>
            </>
          ) : (
            <>
              {/* Clickable avatar */}
              <IconButton
                onClick={handleAvatarClick}
                size="small"
                aria-label="Open profile menu"
                sx={{
                  ml: 0.5,
                  p: 0.25,
                  borderRadius: "50%",
                  border: "2px solid",
                  borderColor: popoverOpen ? "primary.main" : "transparent",
                  transition: "border-color 200ms ease",
                  "&:hover": { borderColor: "primary.light" },
                }}
              >
                <Avatar
                  src={session.user?.image ?? undefined}
                  alt={session.user?.name ?? "User"}
                  sx={{ width: 30, height: 30, fontSize: "0.75rem", fontWeight: 700 }}
                >
                  {session.user?.name?.charAt(0).toUpperCase()}
                </Avatar>
              </IconButton>

              {/* Profile popover */}
              <Popover
                open={popoverOpen}
                anchorEl={anchorEl}
                onClose={handlePopoverClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                slotProps={{
                  paper: {
                    sx: {
                      mt: 1,
                      minWidth: 220,
                      borderRadius: "14px",
                      border: "1px solid",
                      borderColor: "divider",
                      boxShadow: (t) =>
                        isDark
                          ? `0 8px 32px ${alpha("#000", 0.45)}`
                          : `0 8px 32px ${alpha(t.palette.primary.main, 0.12)}`,
                      overflow: "hidden",
                    },
                  },
                }}
              >
                {/* User info header */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    px: 2,
                    py: 1.75,
                    background: (t) =>
                      isDark
                        ? `linear-gradient(135deg, ${alpha(t.palette.primary.dark, 0.25)}, ${alpha(t.palette.secondary.dark, 0.18)})`
                        : `linear-gradient(135deg, ${alpha(t.palette.primary.light, 0.18)}, ${alpha(t.palette.secondary.light, 0.12)})`,
                  }}
                >
                  <Avatar
                    src={session.user?.image ?? undefined}
                    alt={session.user?.name ?? "User"}
                    sx={{ width: 40, height: 40, fontSize: "1rem", fontWeight: 700 }}
                  >
                    {session.user?.name?.charAt(0).toUpperCase()}
                  </Avatar>
                  <Box>
                    <Typography variant="body2" fontWeight={700} noWrap sx={{ maxWidth: 140 }}>
                      {session.user?.name ?? "User"}
                    </Typography>
                    {session.user?.email && (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        noWrap
                        sx={{ display: "block", maxWidth: 140 }}
                      >
                        {session.user.email}
                      </Typography>
                    )}
                  </Box>
                </Box>

                <Divider />

                {/* Dark mode toggle row */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    px: 2,
                    py: 1.25,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {isDark ? (
                      <MdDarkMode size={16} style={{ color: "#7895ff" }} />
                    ) : (
                      <MdLightMode size={16} style={{ color: "#f59e0b" }} />
                    )}
                    <Typography variant="body2" fontWeight={500}>
                      {isDark ? "Dark mode" : "Light mode"}
                    </Typography>
                  </Box>

                  {/* Toggle pill */}
                  <Box
                    component="button"
                    onClick={toggleTheme}
                    aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
                    sx={{
                      position: "relative",
                      display: "flex",
                      alignItems: "center",
                      width: 44,
                      height: 24,
                      borderRadius: 999,
                      border: "1.5px solid",
                      borderColor: isDark ? "primary.main" : "divider",
                      bgcolor: isDark ? alpha("#4c6fff", 0.18) : "background.default",
                      cursor: "pointer",
                      p: 0,
                      overflow: "hidden",
                      outline: "none",
                      flexShrink: 0,
                      "&:focus-visible": {
                        boxShadow: (t) => `0 0 0 3px ${alpha(t.palette.primary.main, 0.35)}`,
                      },
                    }}
                  >
                    <Box
                      sx={{
                        position: "absolute",
                        top: 2,
                        left: isDark ? "calc(100% - 22px)" : 2,
                        width: 18,
                        height: 18,
                        borderRadius: 999,
                        bgcolor: isDark ? "primary.main" : "background.paper",
                        boxShadow: isDark ? "0 2px 8px rgba(76,111,255,0.5)" : "0 2px 8px rgba(15,23,42,0.18)",
                        transition: "left 280ms cubic-bezier(0.34,1.56,0.64,1), background-color 280ms ease",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: isDark ? "white" : "#718096",
                      }}
                    >
                      {isDark ? <MdDarkMode size={10} /> : <MdLightMode size={10} />}
                    </Box>
                  </Box>
                </Box>

                <Divider />

                {/* Sign out */}
                <Box sx={{ px: 1.5, py: 1 }}>
                  <Button
                    fullWidth
                    size="small"
                    startIcon={<MdLogout size={15} />}
                    onClick={() => {
                      handlePopoverClose();
                      signOut();
                    }}
                    sx={{
                      justifyContent: "flex-start",
                      color: "text.secondary",
                      borderRadius: "8px",
                      py: 0.75,
                      "&:hover": {
                        color: "error.main",
                        bgcolor: (t) => alpha(t.palette.error.main, 0.07),
                      },
                    }}
                  >
                    Sign Out
                  </Button>
                </Box>
              </Popover>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
