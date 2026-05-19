import { inject, type InjectionKey } from 'vue';
import type { M2S2DialogData } from '@m2s2/models';

export interface DialogContext {
  dialog:  (data: M2S2DialogData) => Promise<unknown>;
  confirm: (title: string, message?: string) => Promise<boolean>;
}

export const DIALOG_KEY: InjectionKey<DialogContext> = Symbol('dialog');

export function useDialog(): DialogContext {
  const ctx = inject(DIALOG_KEY);
  if (!ctx) throw new Error('useDialog must be used within a <DialogProvider>');
  return ctx;
}
