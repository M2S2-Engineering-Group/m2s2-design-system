export interface BrandTheme {
  key: string;
  label: string;
  primary: string;
  primaryVivid: string;
  primaryDim: string;
  onPrimary: string;
  secondary: string;
  secondaryDim: string;
  onSecondary: string;
  gradientBrand: string;
  gradientBrand135: string;
  gradientNavBar: string;
}

const BRAND_PROPS: (keyof Omit<BrandTheme, "key" | "label">)[] = [
  "primary",
  "primaryVivid",
  "primaryDim",
  "onPrimary",
  "secondary",
  "secondaryDim",
  "onSecondary",
  "gradientBrand",
  "gradientBrand135",
  "gradientNavBar",
];

const CSS_VAR_MAP: Record<keyof Omit<BrandTheme, "key" | "label">, string> = {
  primary: "--color-primary",
  primaryVivid: "--color-primary-vivid",
  primaryDim: "--color-primary-dim",
  onPrimary: "--color-on-primary",
  secondary: "--color-secondary",
  secondaryDim: "--color-secondary-dim",
  onSecondary: "--color-on-secondary",
  gradientBrand: "--gradient-brand",
  gradientBrand135: "--gradient-brand-135",
  gradientNavBar: "--gradient-nav-bar",
};

export const THEMES: BrandTheme[] = [
  {
    key: "m2s2",
    label: "M²S² Default",
    primary: "#a78bfa",
    primaryVivid: "#8b5cf6",
    primaryDim: "#5b21b6",
    onPrimary: "#1a0030",
    secondary: "#22d3ee",
    secondaryDim: "#0891b2",
    onSecondary: "#001a20",
    gradientBrand:
      "linear-gradient(90deg, #3b0764 0%, #8b5cf6 50%, #22d3ee 100%)",
    gradientBrand135: "linear-gradient(135deg, #3b0764 0%, #22d3ee 100%)",
    gradientNavBar:
      "linear-gradient(90deg, rgba(64,6,144,1) 0%, rgba(109,7,152,1) 62%, rgba(0,212,255,1) 100%)",
  },
  {
    key: "ocean",
    label: "Ocean Blue",
    primary: "#38bdf8",
    primaryVivid: "#0ea5e9",
    primaryDim: "#0369a1",
    onPrimary: "#ffffff",
    secondary: "#f472b6",
    secondaryDim: "#db2777",
    onSecondary: "#ffffff",
    gradientBrand:
      "linear-gradient(90deg, #0369a1 0%, #0ea5e9 50%, #f472b6 100%)",
    gradientBrand135: "linear-gradient(135deg, #0369a1 0%, #f472b6 100%)",
    gradientNavBar:
      "linear-gradient(90deg, #0369a1 0%, #0ea5e9 62%, #f472b6 100%)",
  },
  {
    key: "emerald",
    label: "Emerald",
    primary: "#34d399",
    primaryVivid: "#10b981",
    primaryDim: "#065f46",
    onPrimary: "#022c22",
    secondary: "#818cf8",
    secondaryDim: "#4f46e5",
    onSecondary: "#ffffff",
    gradientBrand:
      "linear-gradient(90deg, #065f46 0%, #10b981 50%, #818cf8 100%)",
    gradientBrand135: "linear-gradient(135deg, #065f46 0%, #818cf8 100%)",
    gradientNavBar:
      "linear-gradient(90deg, #065f46 0%, #10b981 62%, #818cf8 100%)",
  },
  {
    key: "sunset",
    label: "Sunset",
    primary: "#fb923c",
    primaryVivid: "#f97316",
    primaryDim: "#c2410c",
    onPrimary: "#fff7ed",
    secondary: "#f43f5e",
    secondaryDim: "#be123c",
    onSecondary: "#ffffff",
    gradientBrand:
      "linear-gradient(90deg, #c2410c 0%, #f97316 50%, #f43f5e 100%)",
    gradientBrand135: "linear-gradient(135deg, #c2410c 0%, #f43f5e 100%)",
    gradientNavBar:
      "linear-gradient(90deg, #c2410c 0%, #f97316 62%, #f43f5e 100%)",
  },
  {
    key: "midnight",
    label: "Midnight",
    primary: "#818cf8",
    primaryVivid: "#6366f1",
    primaryDim: "#3730a3",
    onPrimary: "#ffffff",
    secondary: "#fbbf24",
    secondaryDim: "#d97706",
    onSecondary: "#1c1917",
    gradientBrand:
      "linear-gradient(90deg, #3730a3 0%, #6366f1 50%, #fbbf24 100%)",
    gradientBrand135: "linear-gradient(135deg, #3730a3 0%, #fbbf24 100%)",
    gradientNavBar:
      "linear-gradient(90deg, #3730a3 0%, #6366f1 62%, #fbbf24 100%)",
  },
];

export function applyTheme(key: string): void {
  const root = document.documentElement;
  for (const prop of Object.values(CSS_VAR_MAP)) {
    root.style.removeProperty(prop);
  }
  const theme = THEMES.find((t) => t.key === key);
  if (!theme || theme.key === "m2s2") return;
  for (const field of BRAND_PROPS) {
    root.style.setProperty(CSS_VAR_MAP[field], theme[field] as string);
  }
}

export function applyColorMode(mode: string): void {
  document.documentElement.setAttribute(
    "data-theme",
    mode === "light" ? "light" : "dark",
  );
}
