"use client";

import { createContext, useCallback, useContext, useEffect, useSyncExternalStore } from "react";
import { useHydrated, useStoredValue } from "@/hooks/use-stored-value";

export type Theme = "light" | "dark" | "sepia";

const THEMES: Theme[] = ["light", "dark", "sepia"];

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  mounted: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function applyThemeClass(theme: Theme) {
  const root = document.documentElement;
  root.classList.remove("dark", "sepia");
  if (theme !== "light") root.classList.add(theme);
}

function isTheme(value: string | null): value is Theme {
  return value !== null && (THEMES as string[]).includes(value);
}

const DARK_QUERY = "(prefers-color-scheme: dark)";

function subscribeSystemTheme(onChange: () => void) {
  const mq = window.matchMedia(DARK_QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const mounted = useHydrated();
  const [saved, setSaved] = useStoredValue("theme");
  const systemPrefersDark = useSyncExternalStore(
    subscribeSystemTheme,
    () => window.matchMedia(DARK_QUERY).matches,
    () => false
  );

  const theme: Theme = isTheme(saved) ? saved : systemPrefersDark ? "dark" : "light";

  // The inline script in layout.tsx sets the class before first paint;
  // skip the hydration pass so it isn't briefly reset to "light".
  useEffect(() => {
    if (mounted) applyThemeClass(theme);
  }, [theme, mounted]);

  const setTheme = useCallback((newTheme: Theme) => setSaved(newTheme), [setSaved]);

  // Cycles light → dark → sepia → light
  const toggleTheme = useCallback(() => {
    setTheme(THEMES[(THEMES.indexOf(theme) + 1) % THEMES.length]);
  }, [theme, setTheme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme, mounted }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
