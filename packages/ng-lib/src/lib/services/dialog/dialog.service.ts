import { Injectable, inject } from "@angular/core";
import { ComponentType } from "@angular/cdk/overlay";
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
} from "@angular/material/dialog";
import { M2S2DialogComponent } from "../../components/dialog/dialog.component";
import { M2S2DialogData } from "../../models/dialog/dialog.model";

const PANEL_CLASS = "m2s2-dialog-panel";

const DEFAULTS: Partial<MatDialogConfig> = {
  width: "480px",
  maxWidth: "95vw",
  maxHeight: "90vh",
  panelClass: PANEL_CLASS,
  restoreFocus: true,
};

@Injectable({ providedIn: "root" })
export class M2S2DialogService {
  private readonly mat = inject(MatDialog);

  /** Open any component as a branded dialog. Returns the raw MatDialogRef. */
  open<T, R = unknown>(
    component: ComponentType<T>,
    config?: MatDialogConfig<unknown>,
  ): MatDialogRef<T, R> {
    return this.mat.open(component, {
      ...DEFAULTS,
      ...config,
      panelClass: PANEL_CLASS,
    });
  }

  /** Open the built-in dialog shell with fully configurable actions. */
  dialog(
    data: M2S2DialogData,
    config?: MatDialogConfig<M2S2DialogData>,
  ): MatDialogRef<M2S2DialogComponent, unknown> {
    return this.mat.open(M2S2DialogComponent, {
      ...DEFAULTS,
      ...config,
      panelClass: PANEL_CLASS,
      disableClose: data.modal ?? false,
      data,
    });
  }

  /** Convenience: yes/no confirm with sensible defaults that can be overridden. */
  confirm(
    title: string,
    message?: string,
    options?: Partial<Pick<M2S2DialogData, "actions">>,
  ): MatDialogRef<M2S2DialogComponent, boolean> {
    return this.dialog({
      title,
      message,
      actions: options?.actions ?? [
        { label: "Cancel", value: false, variant: "secondary" },
        { label: "Confirm", value: true, variant: "primary" },
      ],
    }) as MatDialogRef<M2S2DialogComponent, boolean>;
  }
}
