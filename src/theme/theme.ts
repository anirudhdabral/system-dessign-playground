import { createTheme, type PaletteMode, type Theme } from "@mui/material/styles";

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

export const createAppTheme = (mode: PaletteMode, tokens: ThemeColorTokens = fallbackThemeColorTokens): Theme =>
  createTheme({
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
        paper: tokens.gray75,
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
      fontFamily: "Inter",
      h4: { fontWeight: 700 },
      h5: { fontWeight: 700 },
      h6: { fontWeight: 600 },
      button: {
        fontWeight: 500,
        textTransform: "none",
      },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: cssVar("--background"),
            color: cssVar("--foreground"),
            transition: "background-color 200ms ease, color 200ms ease, border-color 200ms ease",
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            fontWeight: 500,
            textTransform: "none",
            transition:
              "background-color 180ms ease, box-shadow 180ms ease, border-color 180ms ease, transform 180ms ease",
            boxShadow: "none",
          },
          contained: {
            boxShadow: "0 6px 16px rgba(0, 0, 0, 0.12)",
          },
        },
      },
      MuiPaper: {
        defaultProps: {
          elevation: 0,
        },
        styleOverrides: {
          root: {
            borderRadius: 12,
            border: `1px solid ${tokens.gray200}`,
            boxShadow: "0 8px 24px rgba(15, 23, 42, 0.06)",
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
            boxShadow: "0 10px 28px rgba(15, 23, 42, 0.08)",
            backgroundImage: "none",
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: 12,
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
            backdropFilter: "blur(8px)",
            borderBottom: `1px solid ${tokens.gray200}`,
            boxShadow: "none",
            backgroundImage: "none",
          },
        },
      },
    },
  });
