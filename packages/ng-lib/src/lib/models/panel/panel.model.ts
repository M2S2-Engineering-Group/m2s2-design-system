import { Type } from '@angular/core';
import { M2S2PanelData, PanelSide, DialogAction } from '@m2s2/models';

export type { PanelSide, DialogAction };
export { M2S2PanelData };

/** Angular-specific panel data — extends base with ngComponentOutlet support. */
export interface NgM2S2PanelData extends M2S2PanelData {
  /** Angular component to render as the panel body. */
  bodyComponent?: Type<unknown>;
  /** Inputs forwarded to bodyComponent via ngComponentOutlet. */
  bodyInputs?: Record<string, unknown>;
}
