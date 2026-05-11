import { Injectable, inject, Type } from '@angular/core';
import { ComponentType } from '@angular/cdk/overlay';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { M2S2PanelComponent } from '../../components/panel/panel.component';
import { NgM2S2PanelData } from '../../models/panel/panel.model';

const PANEL_CLASS = 'm2s2-panel-overlay';

const DEFAULTS: Partial<MatDialogConfig> = {
  maxWidth:     '100vw',
  height:       '100dvh',
  maxHeight:    '100dvh',
  restoreFocus: true,
};

@Injectable({ providedIn: 'root' })
export class M2S2PanelService {
  private readonly mat = inject(MatDialog);

  /**
   * Open the built-in panel shell.
   * For rich body content, set `data.bodyComponent` to your component type.
   */
  panel(data: NgM2S2PanelData, config?: Partial<MatDialogConfig>): MatDialogRef<M2S2PanelComponent, unknown> {
    const side     = data.side ?? 'right';
    const position = side === 'left' ? { top: '0', left: '0' } : { top: '0', right: '0' };

    return this.mat.open(M2S2PanelComponent, {
      ...DEFAULTS,
      ...config,
      position,
      width:        data.width ?? '480px',
      panelClass:   [PANEL_CLASS, `m2s2-panel--${side}`],
      disableClose: data.modal ?? false,
      data,
    });
  }

  /** Open any component inside the branded panel shell. */
  open<T>(
    bodyComponent: Type<T>,
    panelData: Omit<NgM2S2PanelData, 'bodyComponent'>,
    config?: Partial<MatDialogConfig>,
  ): MatDialogRef<M2S2PanelComponent, unknown> {
    return this.panel({ ...panelData, bodyComponent: bodyComponent as Type<unknown> }, config);
  }
}
