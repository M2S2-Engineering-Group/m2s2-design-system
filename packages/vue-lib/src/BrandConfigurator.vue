<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import {
  THEMES,
  primaryTokens, secondaryTokens, gradientTokens,
  defaultGradientStops, ALL_BRAND_CSS_VARS,
  readCurrentTokenValues, buildGradient, extractGradientStops, exportCssBlock,
} from '../../storybook-shared/src';

const activePreset = ref('m2s2');
const copied = ref(false);
const values = ref<Record<string, string>>({});
const gradientStops = ref<Record<string, string>>({ ...defaultGradientStops });

onMounted(() => {
  values.value = readCurrentTokenValues(primaryTokens, gradientTokens);
  const secondaryVals = readCurrentTokenValues(secondaryTokens, []);
  Object.assign(values.value, secondaryVals);
});

function getValue(cssVar: string): string {
  return values.value[cssVar] ?? '#000000';
}

function setVar(cssVar: string, value: string): void {
  values.value = { ...values.value, [cssVar]: value };
  document.documentElement.style.setProperty(cssVar, value);
  activePreset.value = 'custom';
}

function onGradientChange(token: typeof gradientTokens[0], stop: 'start' | 'end', color: string): void {
  const stops = { ...gradientStops.value };
  stops[stop === 'start' ? token.startKey : token.endKey] = color;
  gradientStops.value = stops;
  const grad = buildGradient(token, stops);
  values.value = { ...values.value, [token.cssVar]: grad };
  document.documentElement.style.setProperty(token.cssVar, grad);
  activePreset.value = 'custom';
}

function applyPreset(key: string): void {
  activePreset.value = key;
  const theme = THEMES.find(t => t.key === key);
  if (!theme) return;

  const map: Record<string, string> = {
    '--color-primary':        theme.primary,
    '--color-primary-vivid':  theme.primaryVivid,
    '--color-primary-dim':    theme.primaryDim,
    '--color-on-primary':     theme.onPrimary,
    '--color-secondary':      theme.secondary,
    '--color-secondary-dim':  theme.secondaryDim,
    '--color-on-secondary':   theme.onSecondary,
    '--gradient-brand':       theme.gradientBrand,
    '--gradient-brand-135':   theme.gradientBrand135,
    '--gradient-nav-bar':     theme.gradientNavBar,
  };

  for (const [prop, val] of Object.entries(map)) {
    document.documentElement.style.setProperty(prop, val);
  }
  values.value = { ...values.value, ...map };
  gradientStops.value = extractGradientStops(gradientTokens, map as Record<keyof object, string>);
}

function reset(): void {
  for (const prop of ALL_BRAND_CSS_VARS) {
    document.documentElement.style.removeProperty(prop);
  }
  activePreset.value = 'm2s2';
  values.value = readCurrentTokenValues(primaryTokens, gradientTokens);
  const secondaryVals = readCurrentTokenValues(secondaryTokens, []);
  Object.assign(values.value, secondaryVals);
  gradientStops.value = { ...defaultGradientStops };
}

const exportCss = computed(() =>
  exportCssBlock(primaryTokens, gradientTokens, values.value)
);

async function copy(): Promise<void> {
  await navigator.clipboard.writeText(exportCss.value);
  copied.value = true;
  setTimeout(() => (copied.value = false), 2000);
}

const themes = THEMES;
const primary = primaryTokens;
const secondary = secondaryTokens;
const gradients = gradientTokens;
</script>

<template>
  <div class="configurator">
    <header class="config-header">
      <div class="config-header-inner">
        <h1 class="config-title">Brand Configurator</h1>
        <p class="config-subtitle">
          Customize the design tokens that power every component in the library.
          Changes apply live to the entire Storybook instance — navigate to any
          component story to see your brand in action.
        </p>
      </div>
      <div class="config-presets">
        <span class="presets-label">Presets:</span>
        <button
          v-for="theme in themes"
          :key="theme.key"
          class="preset-btn"
          :class="{ 'preset-btn--active': activePreset === theme.key }"
          @click="applyPreset(theme.key)"
        >
          <span class="preset-swatch" :style="{ background: theme.gradientBrand135 }"></span>
          {{ theme.label }}
        </button>
        <button class="preset-btn preset-btn--reset" @click="reset()">Reset</button>
      </div>
    </header>

    <div class="config-body">
      <section class="token-section">
        <h2 class="section-title">Primary Color</h2>
        <div class="token-grid">
          <div v-for="t in primary" :key="t.cssVar" class="token-row">
            <div class="token-swatch-wrap">
              <input type="color" class="color-picker" :value="getValue(t.cssVar)"
                     @input="setVar(t.cssVar, ($event.target as HTMLInputElement).value)" />
              <div class="token-swatch" :style="{ background: getValue(t.cssVar) }"></div>
            </div>
            <div class="token-info">
              <span class="token-label">{{ t.label }}</span>
              <code class="token-var">{{ t.cssVar }}</code>
            </div>
            <code class="token-value">{{ getValue(t.cssVar) }}</code>
          </div>
        </div>
      </section>

      <section class="token-section">
        <h2 class="section-title">Secondary Color</h2>
        <div class="token-grid">
          <div v-for="t in secondary" :key="t.cssVar" class="token-row">
            <div class="token-swatch-wrap">
              <input type="color" class="color-picker" :value="getValue(t.cssVar)"
                     @input="setVar(t.cssVar, ($event.target as HTMLInputElement).value)" />
              <div class="token-swatch" :style="{ background: getValue(t.cssVar) }"></div>
            </div>
            <div class="token-info">
              <span class="token-label">{{ t.label }}</span>
              <code class="token-var">{{ t.cssVar }}</code>
            </div>
            <code class="token-value">{{ getValue(t.cssVar) }}</code>
          </div>
        </div>
      </section>

      <section class="token-section">
        <h2 class="section-title">Gradients</h2>
        <div class="gradient-grid">
          <div v-for="g in gradients" :key="g.cssVar" class="gradient-row">
            <div class="gradient-stops">
              <div class="stop-wrap">
                <span class="stop-label">Start</span>
                <input type="color" class="color-picker color-picker--sm"
                       :value="gradientStops[g.startKey]"
                       @input="onGradientChange(g, 'start', ($event.target as HTMLInputElement).value)" />
              </div>
              <div class="gradient-preview" :style="{ background: getValue(g.cssVar) }"></div>
              <div class="stop-wrap">
                <span class="stop-label">End</span>
                <input type="color" class="color-picker color-picker--sm"
                       :value="gradientStops[g.endKey]"
                       @input="onGradientChange(g, 'end', ($event.target as HTMLInputElement).value)" />
              </div>
            </div>
            <div class="token-info">
              <span class="token-label">{{ g.label }}</span>
              <code class="token-var">{{ g.cssVar }}</code>
            </div>
          </div>
        </div>
      </section>

      <section class="token-section">
        <h2 class="section-title">Export CSS Variables</h2>
        <p class="section-note">
          Copy these variables into your app's <code>styles.scss</code> or a
          <code>brand-override.scss</code> file to apply your brand globally.
        </p>
        <pre class="export-block">{{ exportCss }}</pre>
        <button class="copy-btn" @click="copy()">{{ copied ? '✓ Copied!' : 'Copy to clipboard' }}</button>
      </section>
    </div>
  </div>
</template>

<style scoped>
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
.config-header-inner { margin-bottom: 24px; }
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
.config-presets { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; }
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
  transition: border-color 0.15s, color 0.15s, background 0.15s;
}
.preset-btn:hover { border-color: var(--color-primary); color: var(--color-on-surface); }
.preset-btn--active { border-color: var(--color-primary); background: var(--color-primary-dim); color: #fff; }
.preset-btn--reset { margin-left: 8px; border-style: dashed; }
.preset-swatch { width: 14px; height: 14px; border-radius: 50%; flex-shrink: 0; }
.config-body { display: flex; flex-direction: column; gap: 40px; }
.token-section {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 24px;
}
.section-title { font-size: 1rem; font-weight: 600; color: var(--color-on-bg); margin: 0 0 16px; }
.section-note { font-size: 0.85rem; color: var(--color-on-surface-muted); line-height: 1.6; margin: -8px 0 16px; }
.section-note code { color: var(--color-secondary); }
.token-grid { display: flex; flex-direction: column; gap: 8px; }
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
.token-swatch { width: 100%; height: 100%; pointer-events: none; }
.token-info { flex: 1; display: flex; flex-direction: column; gap: 2px; }
.token-label { font-size: 0.875rem; font-weight: 500; color: var(--color-on-surface); }
.token-var { font-size: 0.75rem; color: var(--color-on-surface-muted); }
.token-value { font-size: 0.75rem; color: var(--color-secondary); white-space: nowrap; }
.gradient-grid { display: flex; flex-direction: column; gap: 12px; }
.gradient-row {
  padding: 12px;
  background: var(--color-surface-raised);
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 16px;
}
.gradient-stops { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
.stop-wrap { display: flex; flex-direction: column; align-items: center; gap: 4px; }
.stop-label { font-size: 0.65rem; color: var(--color-on-surface-muted); text-transform: uppercase; letter-spacing: 0.05em; }
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
.gradient-preview { width: 120px; height: 32px; border-radius: 6px; flex-shrink: 0; }
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
}
.copy-btn:hover { opacity: 0.85; }
</style>
