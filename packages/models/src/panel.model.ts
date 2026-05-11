import { DialogAction } from './dialog.model';

export type PanelSide = 'left' | 'right';

export interface M2S2PanelData {
  title: string;
  subtitle?: string;
  /** Simple text body — use a framework-specific extension for rich/component content. */
  message?: string;
  /** Footer action buttons. */
  actions?: DialogAction[];
  /** When true, backdrop clicks and Escape do not close the panel. */
  modal?: boolean;
  side?: PanelSide;
  width?: string;
}
