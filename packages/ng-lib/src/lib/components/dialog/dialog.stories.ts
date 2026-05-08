import type { Meta, StoryObj } from '@storybook/angular';
import { Component, inject } from '@angular/core';
import { applicationConfig } from '@storybook/angular';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { M2S2DialogService } from '../../services/dialog/dialog.service';
import { M2S2DialogData } from '../../models/dialog/dialog.model';

// ── Demo host ────────────────────────────────────────────────────────────────

@Component({
  selector: 'sb-dialog-demo',
  standalone: true,
  template: `
    <div class="demo-wrap">
      <p class="demo-hint">Click a button to open the dialog.</p>
      <div class="demo-buttons">
        @for (btn of buttons; track btn.label) {
          <button class="demo-btn" (click)="open(btn.data)">{{ btn.label }}</button>
        }
      </div>
      @if (lastResult !== undefined) {
        <p class="demo-result">
          Last closed with: <code>{{ lastResult === null ? 'null (× button)' : (lastResult | json) }}</code>
        </p>
      }
    </div>
  `,
  styles: [`
    .demo-wrap   { display: flex; flex-direction: column; align-items: center; gap: 24px; padding: 48px 32px; }
    .demo-hint   { margin: 0; font-size: 0.875rem; color: var(--color-on-surface-muted); }
    .demo-buttons { display: flex; flex-wrap: wrap; gap: 12px; justify-content: center; }
    .demo-btn {
      padding: 10px 24px; border-radius: 8px; border: 1px solid var(--color-border);
      background: var(--color-surface-raised); color: var(--color-on-surface);
      font-size: 0.875rem; font-weight: 500; cursor: pointer;
      transition: border-color 0.15s, background 0.15s;
      &:hover { border-color: var(--color-primary); background: var(--color-surface); }
    }
    .demo-result {
      margin: 0; font-size: 0.8rem; color: var(--color-on-surface-muted);
      code { color: var(--color-secondary); }
    }
  `],
  imports: [],
})
class DialogDemoComponent {
  private readonly dialogSvc = inject(M2S2DialogService);

  lastResult: unknown;

  readonly buttons: { label: string; data: M2S2DialogData }[] = [
    {
      label: 'Confirm dialog',
      data: {
        title: 'Confirm action',
        message: 'Are you sure you want to proceed? This action cannot be undone.',
        actions: [
          { label: 'Cancel',  value: false, variant: 'secondary' },
          { label: 'Confirm', value: true,  variant: 'primary'   },
        ],
      },
    },
    {
      label: 'Destructive dialog',
      data: {
        title: 'Delete record',
        message: 'This will permanently delete the record and all associated data. This cannot be reversed.',
        actions: [
          { label: 'Keep it',  value: false, variant: 'ghost'       },
          { label: 'Delete',   value: true,  variant: 'destructive' },
        ],
      },
    },
    {
      label: 'Multi-action dialog',
      data: {
        title: 'Save changes',
        message: 'You have unsaved changes. What would you like to do?',
        actions: [
          { label: 'Discard',      value: 'discard', variant: 'ghost'     },
          { label: 'Save draft',   value: 'draft',   variant: 'secondary' },
          { label: 'Publish now',  value: 'publish', variant: 'primary'   },
        ],
      },
    },
    {
      label: 'Info dialog (no message)',
      data: {
        title: 'Feature coming soon',
        actions: [
          { label: 'Got it', value: true, variant: 'primary' },
        ],
      },
    },
    {
      label: 'Modal dialog (cannot dismiss)',
      data: {
        title: 'Action required',
        message: 'You must choose an option to continue. Clicking outside or pressing Escape will not close this dialog.',
        modal: true,
        actions: [
          { label: 'Cancel',  value: false, variant: 'secondary' },
          { label: 'Proceed', value: true,  variant: 'primary'   },
        ],
      },
    },
  ];

  open(data: M2S2DialogData): void {
    this.dialogSvc.dialog(data).afterClosed().subscribe(result => {
      this.lastResult = result ?? null;
    });
  }
}

// ── Meta ─────────────────────────────────────────────────────────────────────

const DIALOG_CODE = `
// Inject the service
private readonly dialogSvc = inject(M2S2DialogService);

// Simple confirm dialog
this.dialogSvc.dialog({
  title:   'Confirm action',
  message: 'Are you sure you want to proceed?',
  actions: [
    { label: 'Cancel',  value: false, variant: 'secondary' },
    { label: 'Confirm', value: true,  variant: 'primary'   },
  ],
}).afterClosed().subscribe(result => { /* result is the action value */ });

// Modal dialog (cannot dismiss via backdrop or Escape)
this.dialogSvc.dialog({
  title:  'Action required',
  modal:  true,
  actions: [
    { label: 'Cancel',  value: false, variant: 'ghost'   },
    { label: 'Proceed', value: true,  variant: 'primary' },
  ],
});

// Destructive variant
this.dialogSvc.dialog({
  title:   'Delete record',
  message: 'This cannot be reversed.',
  actions: [
    { label: 'Keep it', value: false, variant: 'ghost'       },
    { label: 'Delete',  value: true,  variant: 'destructive' },
  ],
});

// Convenience confirm shorthand
this.dialogSvc.confirm('Delete item?', 'This cannot be undone.')
  .afterClosed().subscribe((confirmed: boolean) => { ... });
`.trim();

const meta: Meta<DialogDemoComponent> = {
  title:     'Components/Dialog',
  component: DialogDemoComponent,
  tags:      ['autodocs'],
  decorators: [
    applicationConfig({
      providers: [provideAnimationsAsync()],
    }),
  ],
  parameters: {
    layout: 'fullscreen',
    docs: {
      source: { code: DIALOG_CODE, language: 'typescript' },
    },
  },
};

export default meta;
type Story = StoryObj<DialogDemoComponent>;

export const Default: Story = {
  name: 'Interactive — all variants',
};
