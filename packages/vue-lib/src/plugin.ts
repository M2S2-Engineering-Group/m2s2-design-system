import { ref, watch, type App } from 'vue';
import { THEME_KEY, type Theme } from './components/ThemeProvider/useTheme';
import DialogProvider from './components/Dialog/DialogProvider.vue';
import PanelProvider from './components/Panel/PanelProvider.vue';
import ThemeProvider from './components/ThemeProvider/ThemeProvider.vue';

export interface M2S2PluginOptions {
  defaultTheme?: Theme;
}

const STORAGE_KEY = 'm2s2-theme';

function applyTheme(t: Theme) {
  if (typeof document === 'undefined') return;
  if (t === 'auto') {
    document.documentElement.removeAttribute('data-theme');
  } else {
    document.documentElement.setAttribute('data-theme', t);
  }
}

export function createM2S2(options: M2S2PluginOptions = {}) {
  return {
    install(app: App) {
      // ── Theme ──────────────────────────────────────────────────────────────────
      const stored = (typeof localStorage !== 'undefined'
        ? (localStorage.getItem(STORAGE_KEY) as Theme | null)
        : null) ?? options.defaultTheme ?? 'auto';

      const theme = ref<Theme>(stored);
      applyTheme(theme.value);

      watch(theme, t => {
        if (typeof localStorage !== 'undefined') localStorage.setItem(STORAGE_KEY, t);
        applyTheme(t);
      });

      app.provide(THEME_KEY, {
        get theme() { return theme.value; },
        setTheme(t: Theme) { theme.value = t; },
      });

      // ── Register provider components globally ──────────────────────────────────
      // Wrap your app root with <DialogProvider><PanelProvider> to enable
      // useDialog() and usePanel() throughout the component tree.
      app.component('M2S2ThemeProvider',  ThemeProvider);
      app.component('M2S2DialogProvider', DialogProvider);
      app.component('M2S2PanelProvider',  PanelProvider);
    },
  };
}
