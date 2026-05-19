import { inject, type InjectionKey } from 'vue';
import type { M2S2PanelData } from '@m2s2/models';

export interface PanelContext {
  panel: (data: M2S2PanelData) => Promise<unknown>;
}

export const PANEL_KEY: InjectionKey<PanelContext> = Symbol('panel');

export function usePanel(): PanelContext {
  const ctx = inject(PANEL_KEY);
  if (!ctx) throw new Error('usePanel must be used within a <PanelProvider>');
  return ctx;
}
