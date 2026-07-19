import { inject, type InjectionKey } from "vue";

export type Theme = "dark" | "light" | "auto";

export interface ThemeContext {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export const THEME_KEY: InjectionKey<ThemeContext> = Symbol("theme");

export function useTheme(): ThemeContext {
  const ctx = inject(THEME_KEY);
  if (!ctx) throw new Error("useTheme must be used within a <ThemeProvider>");
  return ctx;
}
