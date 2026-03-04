"use client";

import "@fontsource/inter";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { ConfirmProvider } from "material-ui-confirm";
import { createContext, useContext, useEffect, useLayoutEffect, useMemo, useState, type ReactNode } from "react";
import { createAppTheme, fallbackThemeColorTokens, type ThemeColorTokens } from "@/theme/theme";

interface AppThemeProviderProps {
  children: ReactNode;
}

interface ThemeModeContextValue {
  mode: "light" | "dark";
  toggleTheme: () => void;
}

const ThemeModeContext = createContext<ThemeModeContextValue | null>(null);

export const useThemeMode = (): ThemeModeContextValue => {
  const context = useContext(ThemeModeContext);
  if (!context) {
    throw new Error("useThemeMode must be used within AppThemeProvider");
  }
  return context;
};

export default function AppThemeProvider({ children }: AppThemeProviderProps) {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)", {
    noSsr: true,
  });

  // Lazy initialiser: read localStorage synchronously on first client render.
  // This means the very first React render already uses the correct palette,
  // eliminating the single-frame MUI "light flash" before the useEffect fired.
  const [mode, setMode] = useState<"light" | "dark">(() => {
    if (typeof window === "undefined") return "light";
    const stored = window.localStorage.getItem("app-theme-mode");
    if (stored === "light" || stored === "dark") return stored;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });
  const [tokens, setTokens] = useState<ThemeColorTokens>(fallbackThemeColorTokens);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const rootStyles = getComputedStyle(document.documentElement);
    const read = (name: string, fallback: string) => rootStyles.getPropertyValue(name).trim() || fallback;

    setTokens({
      primary: read("--color-primary", fallbackThemeColorTokens.primary),
      primaryLight: read("--color-primary-light", fallbackThemeColorTokens.primaryLight),
      primaryDark: read("--color-primary-dark", fallbackThemeColorTokens.primaryDark),
      secondary: read("--color-secondary", fallbackThemeColorTokens.secondary),
      secondaryLight: read("--color-secondary-light", fallbackThemeColorTokens.secondaryLight),
      secondaryDark: read("--color-secondary-dark", fallbackThemeColorTokens.secondaryDark),
      success: read("--color-success", fallbackThemeColorTokens.success),
      successLight: read("--color-success-light", fallbackThemeColorTokens.successLight),
      successDark: read("--color-success-dark", fallbackThemeColorTokens.successDark),
      warning: read("--color-warning", fallbackThemeColorTokens.warning),
      warningLight: read("--color-warning-light", fallbackThemeColorTokens.warningLight),
      warningDark: read("--color-warning-dark", fallbackThemeColorTokens.warningDark),
      error: read("--color-danger", fallbackThemeColorTokens.error),
      errorLight: read("--color-danger-light", fallbackThemeColorTokens.errorLight),
      errorDark: read("--color-danger-dark", fallbackThemeColorTokens.errorDark),
      info: read("--color-info", fallbackThemeColorTokens.info),
      infoLight: read("--color-info-light", fallbackThemeColorTokens.infoLight),
      infoDark: read("--color-info-dark", fallbackThemeColorTokens.infoDark),
      background: read("--background", fallbackThemeColorTokens.background),
      foreground: read("--foreground", fallbackThemeColorTokens.foreground),
      gray75: read("--gray-75", fallbackThemeColorTokens.gray75),
      gray200: read("--gray-200", fallbackThemeColorTokens.gray200),
      gray300: read("--gray-300", fallbackThemeColorTokens.gray300),
      gray700: read("--gray-700", fallbackThemeColorTokens.gray700),
    });
  }, []);

  useLayoutEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined") return;

    const html = document.documentElement;

    // Suppress all CSS transitions for the duration of this paint so the
    // entire palette swaps in a single frame with no colour flash.
    html.classList.add("theme-switching");
    html.setAttribute("data-theme", mode);
    window.localStorage.setItem("app-theme-mode", mode);

    let raf1 = 0;
    let raf2 = 0;
    raf1 = window.requestAnimationFrame(() => {
      raf2 = window.requestAnimationFrame(() => {
        const rootStyles = getComputedStyle(html);
        const read = (name: string, fallback: string) => rootStyles.getPropertyValue(name).trim() || fallback;

        setTokens({
          primary: read("--color-primary", fallbackThemeColorTokens.primary),
          primaryLight: read("--color-primary-light", fallbackThemeColorTokens.primaryLight),
          primaryDark: read("--color-primary-dark", fallbackThemeColorTokens.primaryDark),
          secondary: read("--color-secondary", fallbackThemeColorTokens.secondary),
          secondaryLight: read("--color-secondary-light", fallbackThemeColorTokens.secondaryLight),
          secondaryDark: read("--color-secondary-dark", fallbackThemeColorTokens.secondaryDark),
          success: read("--color-success", fallbackThemeColorTokens.success),
          successLight: read("--color-success-light", fallbackThemeColorTokens.successLight),
          successDark: read("--color-success-dark", fallbackThemeColorTokens.successDark),
          warning: read("--color-warning", fallbackThemeColorTokens.warning),
          warningLight: read("--color-warning-light", fallbackThemeColorTokens.warningLight),
          warningDark: read("--color-warning-dark", fallbackThemeColorTokens.warningDark),
          error: read("--color-danger", fallbackThemeColorTokens.error),
          errorLight: read("--color-danger-light", fallbackThemeColorTokens.errorLight),
          errorDark: read("--color-danger-dark", fallbackThemeColorTokens.errorDark),
          info: read("--color-info", fallbackThemeColorTokens.info),
          infoLight: read("--color-info-light", fallbackThemeColorTokens.infoLight),
          infoDark: read("--color-info-dark", fallbackThemeColorTokens.infoDark),
          background: read("--background", fallbackThemeColorTokens.background),
          foreground: read("--foreground", fallbackThemeColorTokens.foreground),
          gray75: read("--gray-75", fallbackThemeColorTokens.gray75),
          gray200: read("--gray-200", fallbackThemeColorTokens.gray200),
          gray300: read("--gray-300", fallbackThemeColorTokens.gray300),
          gray700: read("--gray-700", fallbackThemeColorTokens.gray700),
        });

        // Re-enable transitions after the palette has settled.
        // We need one more frame so React has committed the new MUI theme too.
        window.requestAnimationFrame(() => {
          html.classList.remove("theme-switching");
        });
      });
    });

    return () => {
      window.cancelAnimationFrame(raf1);
      window.cancelAnimationFrame(raf2);
    };
  }, [mode]);

  const theme = useMemo(() => createAppTheme(mode, tokens), [mode, tokens]);

  const value = useMemo<ThemeModeContextValue>(
    () => ({
      mode,
      toggleTheme: () => setMode((current) => (current === "dark" ? "light" : "dark")),
    }),
    [mode],
  );

  // Prevent server/client theme className divergence.
  // The app renders once the client has resolved persisted theme mode.
  if (!mounted) {
    return null;
  }

  return (
    <ThemeModeContext.Provider value={value}>
      <ThemeProvider theme={theme}>
        <ConfirmProvider>
          <CssBaseline />
          {children}
        </ConfirmProvider>
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
}
