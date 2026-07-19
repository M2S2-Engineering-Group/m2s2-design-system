import { Component, inject } from "@angular/core";
import { NgComponentOutlet } from "@angular/common";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { NgM2S2PanelData, DialogAction } from "../../models/panel/panel.model";

@Component({
  selector: "m2s2-panel",
  templateUrl: "./panel.component.html",
  styleUrls: ["./panel.component.scss"],
  standalone: true,
  imports: [NgComponentOutlet],
})
export class M2S2PanelComponent {
  readonly data = inject<NgM2S2PanelData>(MAT_DIALOG_DATA);
  readonly ref = inject(MatDialogRef<M2S2PanelComponent>);

  close(value?: unknown): void {
    this.ref.close(value);
  }

  action(a: DialogAction): void {
    this.ref.close(a.value);
  }
}
