import { Type } from '@angular/core';
import { DialogAction } from '../dialog/dialog.model';

export type PanelSide = 'left' | 'right';

export interface M2S2PanelData {
  title:          string;
  subtitle?:      string;
  /** Simple text body — use bodyComponent for rich content. */
  message?:       string;
  /** Component to render as the panel body. */
  bodyComponent?: Type<unknown>;
  /** Inputs forwarded to bodyComponent via ngComponentOutlet. */
  bodyInputs?:    Record<string, unknown>;
  /** Footer action buttons. */
  actions?:       DialogAction[];
  /** When true, backdrop clicks and Escape do not close the panel. */
  modal?:         boolean;
  side?:          PanelSide;
  width?:         string;
}
