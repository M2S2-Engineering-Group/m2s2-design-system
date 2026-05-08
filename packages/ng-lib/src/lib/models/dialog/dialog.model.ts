export type DialogActionVariant = 'primary' | 'secondary' | 'destructive' | 'ghost';

export interface DialogAction {
  label:    string;
  value:    unknown;
  variant?: DialogActionVariant;
}

export interface M2S2DialogData {
  title:    string;
  message?: string;
  actions:  DialogAction[];
  /** When true, backdrop clicks and Escape do not close the dialog. */
  modal?:   boolean;
}
