import type { Meta, StoryObj } from "@storybook/react";
import React, { useState, useEffect } from "react";
import {
  THEMES,
  primaryTokens,
  secondaryTokens,
  gradientTokens,
  defaultGradientStops,
  ALL_BRAND_CSS_VARS,
  readCurrentTokenValues,
  buildGradient,
  extractGradientStops,
  exportCssBlock,
} from "../../storybook-shared/src";

function BrandConfigurator(): React.JSX.Element {
  const [values, setValues] = useState<Record<string, string>>({});
  const [activePreset, setActivePreset] = useState("m2s2");
  const [stops, setStops] = useState({ ...defaultGradientStops });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const initial = readCurrentTokenValues(primaryTokens, gradientTokens);
    const secondaryVals = readCurrentTokenValues(secondaryTokens, []);
    setValues({ ...initial, ...secondaryVals });
  }, []);

  function getValue(cssVar: string): string {
    return values[cssVar] ?? "#000000";
  }

  function setVar(cssVar: string, value: string): void {
    setValues((prev) => ({ ...prev, [cssVar]: value }));
    document.documentElement.style.setProperty(cssVar, value);
    setActivePreset("custom");
  }

  function onGradientChange(
    token: (typeof gradientTokens)[0],
    stop: "start" | "end",
    color: string,
  ): void {
    const newStops = {
      ...stops,
      [stop === "start" ? token.startKey : token.endKey]: color,
    };
    setStops(newStops);
    const grad = buildGradient(token, newStops);
    setValues((prev) => ({ ...prev, [token.cssVar]: grad }));
    document.documentElement.style.setProperty(token.cssVar, grad);
    setActivePreset("custom");
  }

  function applyPreset(key: string): void {
    setActivePreset(key);
    const theme = THEMES.find((t) => t.key === key);
    if (!theme) return;
    const map: Record<string, string> = {
      "--color-primary": theme.primary,
      "--color-primary-vivid": theme.primaryVivid,
      "--color-primary-dim": theme.primaryDim,
      "--color-on-primary": theme.onPrimary,
      "--color-secondary": theme.secondary,
      "--color-secondary-dim": theme.secondaryDim,
      "--color-on-secondary": theme.onSecondary,
      "--gradient-brand": theme.gradientBrand,
      "--gradient-brand-135": theme.gradientBrand135,
      "--gradient-nav-bar": theme.gradientNavBar,
    };
    for (const [prop, val] of Object.entries(map)) {
      document.documentElement.style.setProperty(prop, val);
    }
    setValues((prev) => ({ ...prev, ...map }));
    setStops(
      extractGradientStops(gradientTokens, map as Record<keyof object, string>),
    );
  }

  function reset(): void {
    for (const prop of ALL_BRAND_CSS_VARS) {
      document.documentElement.style.removeProperty(prop);
    }
    setActivePreset("m2s2");
    const initial = readCurrentTokenValues(primaryTokens, gradientTokens);
    const secondaryVals = readCurrentTokenValues(secondaryTokens, []);
    setValues({ ...initial, ...secondaryVals });
    setStops({ ...defaultGradientStops });
  }

  async function copy(): Promise<void> {
    const css = exportCssBlock(primaryTokens, gradientTokens, values);
    await navigator.clipboard.writeText(css);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const css = exportCssBlock(primaryTokens, gradientTokens, values);

  return (
    <div className="bc-configurator">
      <header className="bc-header">
        <div>
          <h1 className="bc-title">Brand Configurator</h1>
          <p className="bc-subtitle">
            Customize the design tokens that power every component in the
            library. Changes apply live to the entire Storybook instance.
          </p>
        </div>
        <div className="bc-presets">
          <span className="bc-presets-label">Presets:</span>
          {THEMES.map((theme) => (
            <button
              key={theme.key}
              className={`bc-preset-btn${activePreset === theme.key ? " bc-preset-btn--active" : ""}`}
              onClick={() => applyPreset(theme.key)}
            >
              <span
                className="bc-preset-swatch"
                style={{ background: theme.gradientBrand135 }}
              />
              {theme.label}
            </button>
          ))}
          <button
            className="bc-preset-btn bc-preset-btn--reset"
            onClick={reset}
          >
            Reset
          </button>
        </div>
      </header>

      <div className="bc-body">
        {[
          { title: "Primary Color", tokens: primaryTokens },
          { title: "Secondary Color", tokens: secondaryTokens },
        ].map(({ title, tokens }) => (
          <section key={title} className="bc-section">
            <h2 className="bc-section-title">{title}</h2>
            <div className="bc-token-grid">
              {tokens.map((t) => (
                <div key={t.cssVar} className="bc-token-row">
                  <div className="bc-swatch-wrap">
                    <input
                      type="color"
                      className="bc-picker"
                      value={getValue(t.cssVar)}
                      onChange={(e) => setVar(t.cssVar, e.target.value)}
                    />
                    <div
                      className="bc-swatch"
                      style={{ background: getValue(t.cssVar) }}
                    />
                  </div>
                  <div className="bc-token-info">
                    <span className="bc-token-label">{t.label}</span>
                    <code className="bc-token-var">{t.cssVar}</code>
                  </div>
                  <code className="bc-token-value">{getValue(t.cssVar)}</code>
                </div>
              ))}
            </div>
          </section>
        ))}

        <section className="bc-section">
          <h2 className="bc-section-title">Gradients</h2>
          <div className="bc-gradient-grid">
            {gradientTokens.map((g) => (
              <div key={g.cssVar} className="bc-gradient-row">
                <div className="bc-gradient-stops">
                  <div className="bc-stop-wrap">
                    <span className="bc-stop-label">Start</span>
                    <input
                      type="color"
                      className="bc-picker bc-picker--sm"
                      value={stops[g.startKey]}
                      onChange={(e) =>
                        onGradientChange(g, "start", e.target.value)
                      }
                    />
                  </div>
                  <div
                    className="bc-gradient-preview"
                    style={{ background: getValue(g.cssVar) }}
                  />
                  <div className="bc-stop-wrap">
                    <span className="bc-stop-label">End</span>
                    <input
                      type="color"
                      className="bc-picker bc-picker--sm"
                      value={stops[g.endKey]}
                      onChange={(e) =>
                        onGradientChange(g, "end", e.target.value)
                      }
                    />
                  </div>
                </div>
                <div className="bc-token-info">
                  <span className="bc-token-label">{g.label}</span>
                  <code className="bc-token-var">{g.cssVar}</code>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bc-section">
          <h2 className="bc-section-title">Export CSS Variables</h2>
          <pre className="bc-export">{css}</pre>
          <button className="bc-copy-btn" onClick={copy}>
            {copied ? "✓ Copied!" : "Copy to clipboard"}
          </button>
        </section>
      </div>

      <style>{`
        .bc-configurator { max-width: 900px; margin: 0 auto; padding: 48px 32px; color: var(--color-on-bg); font-family: var(--font-family-base); }
        .bc-header { margin-bottom: 40px; padding-bottom: 32px; border-bottom: 1px solid var(--color-border); }
        .bc-title { font-size: 2rem; font-weight: 700; background: var(--gradient-brand); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; margin: 0 0 12px; }
        .bc-subtitle { color: var(--color-on-surface-muted); line-height: 1.7; margin: 0 0 24px; max-width: 680px; }
        .bc-presets { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; }
        .bc-presets-label { font-size: 0.8rem; font-weight: 600; color: var(--color-on-surface-muted); text-transform: uppercase; letter-spacing: 0.05em; margin-right: 4px; }
        .bc-preset-btn { display: flex; align-items: center; gap: 6px; padding: 6px 14px; border: 1px solid var(--color-border); border-radius: 20px; background: none; font-size: 0.8rem; font-weight: 500; color: var(--color-on-surface-muted); cursor: pointer; transition: border-color 0.15s, color 0.15s; }
        .bc-preset-btn:hover { border-color: var(--color-primary); color: var(--color-on-surface); }
        .bc-preset-btn--active { border-color: var(--color-primary); background: var(--color-primary-dim); color: #fff; }
        .bc-preset-btn--reset { margin-left: 8px; border-style: dashed; }
        .bc-preset-swatch { width: 14px; height: 14px; border-radius: 50%; flex-shrink: 0; }
        .bc-body { display: flex; flex-direction: column; gap: 40px; }
        .bc-section { background: var(--color-surface); border: 1px solid var(--color-border); border-radius: 12px; padding: 24px; }
        .bc-section-title { font-size: 1rem; font-weight: 600; color: var(--color-on-bg); margin: 0 0 16px; }
        .bc-token-grid { display: flex; flex-direction: column; gap: 8px; }
        .bc-token-row { display: flex; align-items: center; gap: 12px; padding: 10px 12px; background: var(--color-surface-raised); border-radius: 8px; }
        .bc-swatch-wrap { position: relative; width: 36px; height: 36px; border-radius: 8px; overflow: hidden; flex-shrink: 0; border: 1px solid var(--color-border); cursor: pointer; }
        .bc-picker { position: absolute; inset: 0; width: 100%; height: 100%; opacity: 0; cursor: pointer; border: none; padding: 0; }
        .bc-swatch { width: 100%; height: 100%; pointer-events: none; }
        .bc-token-info { flex: 1; display: flex; flex-direction: column; gap: 2px; }
        .bc-token-label { font-size: 0.875rem; font-weight: 500; color: var(--color-on-surface); }
        .bc-token-var { font-size: 0.75rem; color: var(--color-on-surface-muted); }
        .bc-token-value { font-size: 0.75rem; color: var(--color-secondary); white-space: nowrap; }
        .bc-gradient-grid { display: flex; flex-direction: column; gap: 12px; }
        .bc-gradient-row { padding: 12px; background: var(--color-surface-raised); border-radius: 8px; display: flex; align-items: center; gap: 16px; }
        .bc-gradient-stops { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
        .bc-stop-wrap { display: flex; flex-direction: column; align-items: center; gap: 4px; }
        .bc-stop-label { font-size: 0.65rem; color: var(--color-on-surface-muted); text-transform: uppercase; letter-spacing: 0.05em; }
        .bc-picker--sm { position: relative; opacity: 1; width: 32px; height: 32px; padding: 2px; border-radius: 6px; border: 1px solid var(--color-border); cursor: pointer; background: var(--color-surface); }
        .bc-gradient-preview { width: 120px; height: 32px; border-radius: 6px; flex-shrink: 0; }
        .bc-export { background: var(--color-surface-raised); border: 1px solid var(--color-border); border-radius: 8px; padding: 16px 20px; font-size: 0.8rem; color: var(--color-secondary); overflow-x: auto; margin: 0 0 16px; white-space: pre; line-height: 1.6; }
        .bc-copy-btn { padding: 8px 20px; border-radius: 8px; border: none; background: var(--gradient-brand-135); color: #fff; font-size: 0.875rem; font-weight: 600; cursor: pointer; transition: opacity 0.15s; }
        .bc-copy-btn:hover { opacity: 0.85; }
      `}</style>
    </div>
  );
}

const meta: Meta = {
  title: "Brand Configurator",
  component: BrandConfigurator,
  parameters: {
    layout: "fullscreen",
    controls: { disable: true },
    actions: { disable: true },
  },
};

export default meta;

export const Configure: StoryObj = {
  name: "Configure Your Brand",
};
