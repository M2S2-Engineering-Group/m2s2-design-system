import { THEMES } from "./themes";

const STORAGE_KEY = "m2s2-sb-theme";

export function broadcastTheme(brandTheme: string, colorMode: string): void {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ brandTheme, colorMode }),
    );
  } catch {}
}

export function listenForThemeChanges(
  onTheme: (brandTheme: string, colorMode: string) => void,
): void {
  const apply = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const { brandTheme, colorMode } = JSON.parse(raw);
      onTheme(brandTheme ?? "m2s2", colorMode ?? "dark");
    } catch {}
  };
  window.addEventListener("storage", apply);
  apply();
}

function readStored(): { brandTheme: string; colorMode: string } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { brandTheme: "m2s2", colorMode: "dark" };
}

const stored = readStored();

export const sharedGlobalTypes = {
  brandTheme: {
    name: "Brand Theme",
    description: "Apply a custom brand palette to preview your own colors",
    defaultValue: stored.brandTheme,
    toolbar: {
      icon: "paintbrush" as const,
      items: THEMES.map((t) => ({ value: t.key, title: t.label })),
      dynamicTitle: true,
    },
  },
  colorMode: {
    name: "Color Mode",
    description: "Switch between dark and light mode",
    defaultValue: stored.colorMode,
    toolbar: {
      icon: "circlehollow" as const,
      items: [
        { value: "dark", title: "Dark", icon: "moon" as const },
        { value: "light", title: "Light", icon: "sun" as const },
      ],
      dynamicTitle: true,
    },
  },
};
