import type { Meta, StoryObj } from "@storybook/angular";
import { Component, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { THEMES } from "../.storybook/themes";

interface ColorToken {
  label: string;
  cssVar: string;
  defaultValue: string;
}

interface GradientToken {
  label: string;
  cssVar: string;
  defaultValue: string;
  startKey: string;
  endKey: string;
}

@Component({
  selector: "sb-brand-configurator",
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="configurator">
      <header class="config-header">
        <div class="config-header-inner">
          <h1 class="config-title">Brand Configurator</h1>
          <p class="config-subtitle">
            Customize the design tokens that power every component in the
            library. Changes apply live to the entire Storybook instance —
            navigate to any component story to see your brand in action.
          </p>
        </div>
        <div class="config-presets">
          <span class="presets-label">Presets:</span>
          @for (theme of themes; track theme.key) {
            <button
              class="preset-btn"
              [class.preset-btn--active]="activePreset === theme.key"
              (click)="applyPreset(theme.key)"
            >
              <span
                class="preset-swatch"
                [style.background]="theme.gradientBrand135"
              ></span>
              {{ theme.label }}
            </button>
          }
          <button class="preset-btn preset-btn--reset" (click)="reset()">
            Reset
          </button>
        </div>
      </header>

      <div class="config-body">
        <!-- Color tokens -->
        <section class="token-section">
          <h2 class="section-title">Primary Color</h2>
          <div class="token-grid">
            @for (t of primaryTokens; track t.cssVar) {
              <div class="token-row">
                <div class="token-swatch-wrap">
                  <input
                    type="color"
                    class="color-picker"
                    [ngModel]="getValue(t.cssVar)"
                    (ngModelChange)="setVar(t.cssVar, $event)"
                  />
                  <div
                    class="token-swatch"
                    [style.background]="getValue(t.cssVar)"
                  ></div>
                </div>
                <div class="token-info">
                  <span class="token-label">{{ t.label }}</span>
                  <code class="token-var">{{ t.cssVar }}</code>
                </div>
                <code class="token-value">{{ getValue(t.cssVar) }}</code>
              </div>
            }
          </div>
        </section>

        <section class="token-section">
          <h2 class="section-title">Secondary Color</h2>
          <div class="token-grid">
            @for (t of secondaryTokens; track t.cssVar) {
              <div class="token-row">
                <div class="token-swatch-wrap">
                  <input
                    type="color"
                    class="color-picker"
                    [ngModel]="getValue(t.cssVar)"
                    (ngModelChange)="setVar(t.cssVar, $event)"
                  />
                  <div
                    class="token-swatch"
                    [style.background]="getValue(t.cssVar)"
                  ></div>
                </div>
                <div class="token-info">
                  <span class="token-label">{{ t.label }}</span>
                  <code class="token-var">{{ t.cssVar }}</code>
                </div>
                <code class="token-value">{{ getValue(t.cssVar) }}</code>
              </div>
            }
          </div>
        </section>

        <section class="token-section">
          <h2 class="section-title">Gradients</h2>
          <p class="section-note">
            Gradients are built from the start and end colors below. The hex
            values here define the gradient stops — the full
            <code>linear-gradient()</code> is constructed automatically.
          </p>
          <div class="gradient-grid">
            @for (g of gradientTokens; track g.cssVar) {
              <div class="gradient-row">
                <div class="gradient-stops">
                  <div class="stop-wrap">
                    <span class="stop-label">Start</span>
                    <input
                      type="color"
                      class="color-picker color-picker--sm"
                      [ngModel]="gradientStops[g.startKey]"
                      (ngModelChange)="onGradientChange(g, 'start', $event)"
                    />
                  </div>
                  <div
                    class="gradient-preview"
                    [style.background]="getValue(g.cssVar)"
                  ></div>
                  <div class="stop-wrap">
                    <span class="stop-label">End</span>
                    <input
                      type="color"
                      class="color-picker color-picker--sm"
                      [ngModel]="gradientStops[g.endKey]"
                      (ngModelChange)="onGradientChange(g, 'end', $event)"
                    />
                  </div>
                </div>
                <div class="token-info">
                  <span class="token-label">{{ g.label }}</span>
                  <code class="token-var">{{ g.cssVar }}</code>
                </div>
              </div>
            }
          </div>
        </section>

        <!-- Export -->
        <section class="token-section">
          <h2 class="section-title">Export CSS Variables</h2>
          <p class="section-note">
            Copy these variables into your app's <code>styles.scss</code> or a
            <code>brand-override.scss</code> file to apply your brand globally.
          </p>
          <pre class="export-block">{{ exportCss }}</pre>
          <button class="copy-btn" (click)="copy()">
            {{ copied ? "✓ Copied!" : "Copy to clipboard" }}
          </button>
        </section>
      </div>
    </div>
  `,
  styles: [
    `
      .configurator {
        max-width: 900px;
        margin: 0 auto;
        padding: 48px 32px;
        color: var(--color-on-bg);
        font-family: var(--font-family-base);
      }
      .config-header {
        margin-bottom: 40px;
        padding-bottom: 32px;
        border-bottom: 1px solid var(--color-border);
      }
      .config-header-inner {
        margin-bottom: 24px;
      }
      .config-title {
        font-size: 2rem;
        font-weight: 700;
        background: var(--gradient-brand);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        margin: 0 0 12px;
      }
      .config-subtitle {
        color: var(--color-on-surface-muted);
        line-height: 1.7;
        margin: 0;
        max-width: 680px;
      }
      .config-presets {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 8px;
      }
      .presets-label {
        font-size: 0.8rem;
        font-weight: 600;
        color: var(--color-on-surface-muted);
        text-transform: uppercase;
        letter-spacing: 0.05em;
        margin-right: 4px;
      }
      .preset-btn {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 6px 14px;
        border: 1px solid var(--color-border);
        border-radius: 20px;
        background: none;
        font-size: 0.8rem;
        font-weight: 500;
        color: var(--color-on-surface-muted);
        cursor: pointer;
        transition:
          border-color 0.15s,
          color 0.15s,
          background 0.15s;
        &:hover {
          border-color: var(--color-primary);
          color: var(--color-on-surface);
        }
        &--active {
          border-color: var(--color-primary);
          background: var(--color-primary-dim);
          color: #fff;
        }
        &--reset {
          margin-left: 8px;
          border-style: dashed;
        }
      }
      .preset-swatch {
        width: 14px;
        height: 14px;
        border-radius: 50%;
        flex-shrink: 0;
      }
      .config-body {
        display: flex;
        flex-direction: column;
        gap: 40px;
      }
      .token-section {
        background: var(--color-surface);
        border: 1px solid var(--color-border);
        border-radius: 12px;
        padding: 24px;
      }
      .section-title {
        font-size: 1rem;
        font-weight: 600;
        color: var(--color-on-bg);
        margin: 0 0 16px;
      }
      .section-note {
        font-size: 0.85rem;
        color: var(--color-on-surface-muted);
        line-height: 1.6;
        margin: -8px 0 16px;
        code {
          color: var(--color-secondary);
        }
      }
      .token-grid {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .token-row {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 10px 12px;
        background: var(--color-surface-raised);
        border-radius: 8px;
      }
      .token-swatch-wrap {
        position: relative;
        width: 36px;
        height: 36px;
        border-radius: 8px;
        overflow: hidden;
        flex-shrink: 0;
        border: 1px solid var(--color-border);
        cursor: pointer;
      }
      .color-picker {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
        cursor: pointer;
        border: none;
        padding: 0;
      }
      .token-swatch {
        width: 100%;
        height: 100%;
        pointer-events: none;
      }
      .token-info {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 2px;
      }
      .token-label {
        font-size: 0.875rem;
        font-weight: 500;
        color: var(--color-on-surface);
      }
      .token-var {
        font-size: 0.75rem;
        color: var(--color-on-surface-muted);
      }
      .token-value {
        font-size: 0.75rem;
        color: var(--color-secondary);
        white-space: nowrap;
      }
      .gradient-grid {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      .gradient-row {
        padding: 12px;
        background: var(--color-surface-raised);
        border-radius: 8px;
        display: flex;
        align-items: center;
        gap: 16px;
      }
      .gradient-stops {
        display: flex;
        align-items: center;
        gap: 8px;
        flex-shrink: 0;
      }
      .stop-wrap {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
      }
      .stop-label {
        font-size: 0.65rem;
        color: var(--color-on-surface-muted);
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }
      .color-picker--sm {
        position: relative;
        opacity: 1;
        width: 32px;
        height: 32px;
        padding: 2px;
        border-radius: 6px;
        border: 1px solid var(--color-border);
        cursor: pointer;
        background: var(--color-surface);
      }
      .gradient-preview {
        width: 120px;
        height: 32px;
        border-radius: 6px;
        flex-shrink: 0;
      }
      .export-block {
        background: var(--color-surface-raised);
        border: 1px solid var(--color-border);
        border-radius: 8px;
        padding: 16px 20px;
        font-size: 0.8rem;
        color: var(--color-secondary);
        overflow-x: auto;
        margin: 0 0 16px;
        white-space: pre;
        line-height: 1.6;
      }
      .copy-btn {
        padding: 8px 20px;
        border-radius: 8px;
        border: none;
        background: var(--gradient-brand-135);
        color: #fff;
        font-size: 0.875rem;
        font-weight: 600;
        cursor: pointer;
        transition: opacity 0.15s;
        &:hover {
          opacity: 0.85;
        }
      }
    `,
  ],
})
class BrandConfiguratorComponent implements OnInit {
  readonly themes = THEMES;
  activePreset = "m2s2";
  copied = false;

  readonly primaryTokens: ColorToken[] = [
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

  readonly secondaryTokens: ColorToken[] = [
    {
      label: "Secondary",
      cssVar: "--color-secondary",
      defaultValue: "#22d3ee",
    },
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

  readonly gradientTokens: GradientToken[] = [
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

  gradientStops: Record<string, string> = {
    brand90Start: "#3b0764",
    brand90End: "#22d3ee",
    brand135Start: "#3b0764",
    brand135End: "#22d3ee",
    navStart: "#400690",
    navEnd: "#00d4ff",
  };

  private values: Record<string, string> = {};

  ngOnInit(): void {
    for (const t of [...this.primaryTokens, ...this.secondaryTokens]) {
      const current = getComputedStyle(document.documentElement)
        .getPropertyValue(t.cssVar)
        .trim();
      this.values[t.cssVar] = current || t.defaultValue;
    }
    for (const g of this.gradientTokens) {
      const current = getComputedStyle(document.documentElement)
        .getPropertyValue(g.cssVar)
        .trim();
      this.values[g.cssVar] = current || g.defaultValue;
    }
  }

  getValue(cssVar: string): string {
    return this.values[cssVar] ?? "#000000";
  }

  setVar(cssVar: string, value: string): void {
    this.values[cssVar] = value;
    document.documentElement.style.setProperty(cssVar, value);
    this.activePreset = "custom";
  }

  onGradientChange(
    g: GradientToken,
    stop: "start" | "end",
    color: string,
  ): void {
    if (stop === "start") this.gradientStops[g.startKey] = color;
    else this.gradientStops[g.endKey] = color;

    const angle = g.cssVar === "--gradient-brand" ? "90deg" : "135deg";
    const grad =
      g.cssVar === "--gradient-nav-bar"
        ? `linear-gradient(90deg, ${this.gradientStops[g.startKey]} 0%, ${this.gradientStops[g.endKey]} 100%)`
        : `linear-gradient(${angle}, ${this.gradientStops[g.startKey]} 0%, ${this.gradientStops[g.endKey]} 100%)`;

    this.values[g.cssVar] = grad;
    document.documentElement.style.setProperty(g.cssVar, grad);
    this.activePreset = "custom";
  }

  applyPreset(key: string): void {
    this.activePreset = key;
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
      this.values[prop] = val;
    }

    // Update gradient stop controls (approximation from first/last stop)
    const extractFirst = (grad: string) =>
      grad.match(/#[0-9a-f]{6}/i)?.[0] ?? "#000000";
    const extractLast = (grad: string) =>
      grad.match(/#[0-9a-f]{6}/gi)?.slice(-1)[0] ?? "#ffffff";

    this.gradientStops["brand90Start"] = extractFirst(theme.gradientBrand);
    this.gradientStops["brand90End"] = extractLast(theme.gradientBrand);
    this.gradientStops["brand135Start"] = extractFirst(theme.gradientBrand135);
    this.gradientStops["brand135End"] = extractLast(theme.gradientBrand135);
    this.gradientStops["navStart"] = extractFirst(theme.gradientNavBar);
    this.gradientStops["navEnd"] = extractLast(theme.gradientNavBar);
  }

  reset(): void {
    const props = [
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
    for (const p of props) document.documentElement.style.removeProperty(p);
    this.activePreset = "m2s2";
    this.ngOnInit();
  }

  get exportCss(): string {
    const lines = [":root {"];
    for (const t of [...this.primaryTokens, ...this.secondaryTokens]) {
      lines.push(`  ${t.cssVar}: ${this.values[t.cssVar] ?? t.defaultValue};`);
    }
    for (const g of this.gradientTokens) {
      lines.push(`  ${g.cssVar}: ${this.values[g.cssVar] ?? g.defaultValue};`);
    }
    lines.push("}");
    return lines.join("\n");
  }

  copy(): void {
    navigator.clipboard.writeText(this.exportCss).then(() => {
      this.copied = true;
      setTimeout(() => (this.copied = false), 2000);
    });
  }
}

const meta: Meta<BrandConfiguratorComponent> = {
  title: "Brand Configurator",
  component: BrandConfiguratorComponent,
  parameters: {
    layout: "fullscreen",
    controls: { disable: true },
    actions: { disable: true },
  },
};

export default meta;

export const Configure: StoryObj<BrandConfiguratorComponent> = {
  name: "Configure Your Brand",
};
