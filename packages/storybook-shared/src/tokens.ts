export interface ColorToken {
  label: string;
  cssVar: string;
  defaultValue: string;
}

export interface GradientToken {
  label: string;
  cssVar: string;
  defaultValue: string;
  startKey: string;
  endKey: string;
}

export const primaryTokens: ColorToken[] = [
  { label: "Primary", cssVar: "--color-primary", defaultValue: "#a78bfa" },
  {
    label: "Primary Vivid",
    cssVar: "--color-primary-vivid",
    defaultValue: "#8b5cf6",
  },
  {
    label: "Primary Dim",
    cssVar: "--color-primary-dim",
    defaultValue: "#5b21b6",
  },
  {
    label: "On Primary",
    cssVar: "--color-on-primary",
    defaultValue: "#1a0030",
  },
];

export const secondaryTokens: ColorToken[] = [
  { label: "Secondary", cssVar: "--color-secondary", defaultValue: "#22d3ee" },
  {
    label: "Secondary Dim",
    cssVar: "--color-secondary-dim",
    defaultValue: "#0891b2",
  },
  {
    label: "On Secondary",
    cssVar: "--color-on-secondary",
    defaultValue: "#001a20",
  },
];

export const gradientTokens: GradientToken[] = [
  {
    label: "Brand Gradient (90°)",
    cssVar: "--gradient-brand",
    defaultValue:
      "linear-gradient(90deg, #3b0764 0%, #8b5cf6 50%, #22d3ee 100%)",
    startKey: "brand90Start",
    endKey: "brand90End",
  },
  {
    label: "Brand Gradient (135°)",
    cssVar: "--gradient-brand-135",
    defaultValue: "linear-gradient(135deg, #3b0764 0%, #22d3ee 100%)",
    startKey: "brand135Start",
    endKey: "brand135End",
  },
  {
    label: "Navbar Gradient",
    cssVar: "--gradient-nav-bar",
    defaultValue:
      "linear-gradient(90deg, rgba(64,6,144,1) 0%, rgba(0,212,255,1) 100%)",
    startKey: "navStart",
    endKey: "navEnd",
  },
];

export const defaultGradientStops: Record<string, string> = {
  brand90Start: "#3b0764",
  brand90End: "#22d3ee",
  brand135Start: "#3b0764",
  brand135End: "#22d3ee",
  navStart: "#400690",
  navEnd: "#00d4ff",
};

export const ALL_BRAND_CSS_VARS = [
  "--color-primary",
  "--color-primary-vivid",
  "--color-primary-dim",
  "--color-on-primary",
  "--color-secondary",
  "--color-secondary-dim",
  "--color-on-secondary",
  "--gradient-brand",
  "--gradient-brand-135",
  "--gradient-nav-bar",
];

export function readCurrentTokenValues(
  tokens: ColorToken[],
  gradients: GradientToken[],
): Record<string, string> {
  const values: Record<string, string> = {};
  const styles = getComputedStyle(document.documentElement);
  for (const t of [...tokens, ...gradients]) {
    const current = styles.getPropertyValue(t.cssVar).trim();
    values[t.cssVar] = current || t.defaultValue;
  }
  return values;
}

export function buildGradient(
  token: GradientToken,
  stops: Record<string, string>,
): string {
  const start = stops[token.startKey];
  const end = stops[token.endKey];
  if (token.cssVar === "--gradient-nav-bar") {
    return `linear-gradient(90deg, ${start} 0%, ${end} 100%)`;
  }
  const angle = token.cssVar === "--gradient-brand" ? "90deg" : "135deg";
  return `linear-gradient(${angle}, ${start} 0%, ${end} 100%)`;
}

export function extractGradientStops(
  gradients: GradientToken[],
  themeValues: Record<keyof object, string>,
): Record<string, string> {
  const stops: Record<string, string> = { ...defaultGradientStops };
  const firstHex = (s: string) => s.match(/#[0-9a-f]{6}/i)?.[0] ?? "#000000";
  const lastHex = (s: string) =>
    s.match(/#[0-9a-f]{6}/gi)?.slice(-1)[0] ?? "#ffffff";
  for (const g of gradients) {
    const val = (themeValues as Record<string, string>)[g.cssVar];
    if (val) {
      stops[g.startKey] = firstHex(val);
      stops[g.endKey] = lastHex(val);
    }
  }
  return stops;
}

export function exportCssBlock(
  colorTokens: ColorToken[],
  gradientTokens: GradientToken[],
  values: Record<string, string>,
): string {
  const lines = [":root {"];
  for (const t of [...colorTokens, ...gradientTokens]) {
    lines.push(`  ${t.cssVar}: ${values[t.cssVar] ?? t.defaultValue};`);
  }
  lines.push("}");
  return lines.join("\n");
}
