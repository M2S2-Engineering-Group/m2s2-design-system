import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { M2S2DialogData, DialogAction } from '../../models/dialog/dialog.model';

@Component({
  selector: 'm2s2-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
  standalone: true,
})
export class M2S2DialogComponent {
  readonly data = inject<M2S2DialogData>(MAT_DIALOG_DATA);
  readonly ref  = inject(MatDialogRef<M2S2DialogComponent>);

  close(action: DialogAction): void {
    this.ref.close(action.value);
  }
}
