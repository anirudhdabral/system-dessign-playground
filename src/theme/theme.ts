import { createTheme, alpha, type PaletteMode, type Theme } from "@mui/material/styles";

const cssVar = (name: string) => `var(${name})`;

export interface ThemeColorTokens {
  primary: string;
  primaryLight: string;
  primaryDark: string;
  secondary: string;
  secondaryLight: string;
  secondaryDark: string;
  success: string;
  successLight: string;
  successDark: string;
  warning: string;
  warningLight: string;
  warningDark: string;
  error: string;
  errorLight: string;
  errorDark: string;
  info: string;
  infoLight: string;
  infoDark: string;
  background: string;
  foreground: string;
  gray75: string;
  gray200: string;
  gray300: string;
  gray700: string;
}

export const fallbackThemeColorTokens: ThemeColorTokens = {
  primary: "#4c6fff",
  primaryLight: "#7895ff",
  primaryDark: "#3754db",
  secondary: "#e4ecf7",
  secondaryLight: "#ebf2fa",
  secondaryDark: "#a6b7d4",
  success: "#66cb9f",
  successLight: "#8cdfb3",
  successDark: "#4aae8c",
  warning: "#f7936f",
  warningLight: "#fab592",
  warningDark: "#d46a51",
  error: "#f16063",
  errorLight: "#f68e87",
  errorDark: "#cf4655",
  info: "#68dbf2",
  infoLight: "#8dedf7",
  infoDark: "#4cafd0",
  background: "#ffffff",
  foreground: "#171717",
  gray75: "#fafafa",
  gray200: "#edf2f7",
  gray300: "#e2e8f0",
  gray700: "#4a5568",
};

export const createAppTheme = (mode: PaletteMode, tokens: ThemeColorTokens = fallbackThemeColorTokens): Theme => {
  const isDark = mode === "dark";

  return createTheme({
    palette: {
      mode,
      primary: {
        main: tokens.primary,
        light: tokens.primaryLight,
        dark: tokens.primaryDark,
      },
      secondary: {
        main: tokens.secondary,
        light: tokens.secondaryLight,
        dark: tokens.secondaryDark,
      },
      success: {
        main: tokens.success,
        light: tokens.successLight,
        dark: tokens.successDark,
      },
      warning: {
        main: tokens.warning,
        light: tokens.warningLight,
        dark: tokens.warningDark,
      },
      error: {
        main: tokens.error,
        light: tokens.errorLight,
        dark: tokens.errorDark,
      },
      info: {
        main: tokens.info,
        light: tokens.infoLight,
        dark: tokens.infoDark,
      },
      background: {
        default: tokens.background,
        paper: isDark ? tokens.gray75 : "#ffffff",
      },
      text: {
        primary: tokens.foreground,
        secondary: tokens.gray700,
      },
      divider: tokens.gray300,
    },
    shape: {
      borderRadius: 12,
    },
    typography: {
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      h4: { fontWeight: 700, letterSpacing: "-0.5px" },
      h5: { fontWeight: 700, letterSpacing: "-0.3px" },
      h6: { fontWeight: 600, letterSpacing: "-0.2px" },
      subtitle1: { fontWeight: 500 },
      subtitle2: { fontWeight: 500 },
      body2: { lineHeight: 1.65 },
      button: {
        fontWeight: 500,
        textTransform: "none",
        letterSpacing: "0.01em",
      },
      caption: {
        letterSpacing: "0.03em",
      },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: cssVar("--background"),
            color: cssVar("--foreground"),
          },
        },
      },

      MuiButton: {
        defaultProps: {
          disableElevation: true,
        },
        styleOverrides: {
          root: {
            borderRadius: 10,
            fontWeight: 500,
            textTransform: "none",
            boxShadow: "none",
            "&:hover": {
              boxShadow: "none",
              transform: "translateY(-1px)",
            },
            "&:active": {
              transform: "translateY(0)",
            },
          },
          contained: {
            boxShadow: `0 1px 3px ${alpha(tokens.primary, 0.25)}, 0 4px 12px ${alpha(tokens.primary, 0.15)}`,
            "&:hover": {
              boxShadow: `0 2px 6px ${alpha(tokens.primary, 0.3)}, 0 6px 20px ${alpha(tokens.primary, 0.2)}`,
            },
          },
          outlined: {
            borderWidth: "1.5px",
            "&:hover": {
              borderWidth: "1.5px",
              backgroundColor: alpha(tokens.primary, 0.04),
            },
          },
          sizeSmall: {
            borderRadius: 8,
            fontSize: "0.8125rem",
          },
        },
      },

      MuiPaper: {
        defaultProps: {
          elevation: 0,
        },
        styleOverrides: {
          root: {
            borderRadius: 16,
            border: `1px solid ${tokens.gray200}`,
            boxShadow: isDark
              ? `0 4px 24px rgba(0,0,0,0.35), 0 1px 4px rgba(0,0,0,0.2)`
              : `0 1px 3px rgba(15,23,42,0.04), 0 8px 24px rgba(15,23,42,0.06)`,
            backgroundImage: "none",
          },
        },
      },

      MuiCard: {
        defaultProps: {
          elevation: 0,
        },
        styleOverrides: {
          root: {
            borderRadius: 16,
            border: `1px solid ${tokens.gray200}`,
            boxShadow: isDark
              ? `0 4px 24px rgba(0,0,0,0.35), 0 1px 4px rgba(0,0,0,0.2)`
              : `0 1px 3px rgba(15,23,42,0.04), 0 10px 28px rgba(15,23,42,0.08)`,
            backgroundImage: "none",
            overflow: "hidden",
          },
        },
      },

      MuiCardContent: {
        styleOverrides: {
          root: {
            "&:last-child": {
              paddingBottom: 20,
            },
          },
        },
      },

      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            "& fieldset": {
              borderColor: tokens.gray300,
              borderWidth: "1.5px",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: tokens.primary,
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderWidth: "2px",
            },
          },
        },
      },

      MuiInputLabel: {
        styleOverrides: {
          root: {
            fontWeight: 500,
            fontSize: "0.875rem",
          },
        },
      },

      MuiAppBar: {
        defaultProps: {
          elevation: 0,
          color: "transparent",
        },
        styleOverrides: {
          root: {
            backdropFilter: "blur(16px) saturate(1.8)",
            WebkitBackdropFilter: "blur(16px) saturate(1.8)",
            borderBottom: `1px solid ${tokens.gray200}`,
            boxShadow: "none",
            backgroundImage: "none",
            backgroundColor: isDark ? `rgba(${hexToRgb(tokens.gray75)}, 0.85)` : "rgba(255,255,255,0.85)",
          },
        },
      },

      MuiToolbar: {
        styleOverrides: {
          root: {
            minHeight: "60px !important",
            paddingLeft: "20px !important",
            paddingRight: "20px !important",
          },
        },
      },

      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: 20,
            border: `1px solid ${tokens.gray200}`,
            boxShadow: isDark
              ? `0 20px 80px rgba(0,0,0,0.6), 0 4px 16px rgba(0,0,0,0.3)`
              : `0 20px 80px rgba(15,23,42,0.2), 0 4px 16px rgba(15,23,42,0.1)`,
          },
        },
      },

      MuiDialogTitle: {
        styleOverrides: {
          root: {
            fontWeight: 700,
            fontSize: "1.1rem",
            paddingBottom: 8,
          },
        },
      },

      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            fontWeight: 500,
            fontSize: "0.75rem",
          },
        },
      },

      MuiSelect: {
        styleOverrides: {
          root: {
            borderRadius: 10,
          },
        },
      },

      MuiMenuItem: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            margin: "2px 6px",
            padding: "7px 10px",
            "&:hover": {
              backgroundColor: alpha(tokens.primary, 0.07),
            },
            "&.Mui-selected": {
              backgroundColor: alpha(tokens.primary, 0.1),
              "&:hover": {
                backgroundColor: alpha(tokens.primary, 0.15),
              },
            },
          },
        },
      },

      MuiLinearProgress: {
        styleOverrides: {
          root: {
            borderRadius: 999,
            height: 4,
          },
        },
      },

      MuiSwitch: {
        styleOverrides: {
          root: {
            padding: 6,
          },
          track: {
            borderRadius: 999,
          },
          thumb: {
            boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
          },
        },
      },

      MuiToggleButton: {
        styleOverrides: {
          root: {
            borderRadius: "8px !important",
            textTransform: "none",
            fontWeight: 500,
          },
        },
      },

      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            borderRadius: 8,
            fontSize: "0.75rem",
            fontWeight: 500,
            padding: "6px 10px",
          },
        },
      },

      MuiAvatar: {
        styleOverrides: {
          root: {
            background: `linear-gradient(135deg, ${tokens.primary}, ${tokens.primaryDark})`,
            boxShadow: `0 2px 10px ${alpha(tokens.primary, 0.35)}`,
          },
        },
      },

      MuiFormControlLabel: {
        styleOverrides: {
          label: {
            fontWeight: 500,
            fontSize: "0.875rem",
          },
        },
      },
    },
  });
};

/** Convert a 6-digit hex colour to an "r,g,b" string for rgba() usage */
function hexToRgb(hex: string): string {
  const clean = hex.replace(/^#/, "");
  if (clean.length !== 6) return "255,255,255";
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return `${r},${g},${b}`;
}
