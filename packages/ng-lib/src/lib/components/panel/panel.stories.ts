import type { Meta, StoryObj } from '@storybook/angular';
import { Component, inject } from '@angular/core';
import { applicationConfig } from '@storybook/angular';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { M2S2PanelService } from '../../services/panel/panel.service';
import { NgM2S2PanelData } from '../../models/panel/panel.model';

// ── Sample body component ────────────────────────────────────────────────────

@Component({
  selector: 'sb-panel-body-demo',
  standalone: true,
  template: `
    <div class="demo-fields">
      <label class="demo-field">
        <span class="demo-label">Full name</span>
        <input class="demo-input" type="text" placeholder="Jane Smith" />
      </label>
      <label class="demo-field">
        <span class="demo-label">Email</span>
        <input class="demo-input" type="email" placeholder="jane@example.com" />
      </label>
      <label class="demo-field">
        <span class="demo-label">Role</span>
        <select class="demo-input">
          <option>Viewer</option>
          <option>Editor</option>
          <option>Admin</option>
        </select>
      </label>
      <label class="demo-field">
        <span class="demo-label">Notes</span>
        <textarea class="demo-input" rows="4" placeholder="Optional notes..."></textarea>
      </label>
    </div>
  `,
  styles: [`
    .demo-fields   { display: flex; flex-direction: column; gap: 20px; }
    .demo-field    { display: flex; flex-direction: column; gap: 6px; }
    .demo-label    { font-size: 0.8rem; font-weight: 600; color: var(--color-on-surface-muted); text-transform: uppercase; letter-spacing: 0.05em; }
    .demo-input    {
      padding: 10px 12px; border-radius: 8px; font-size: 0.875rem;
      border: 1px solid var(--color-border); background: var(--color-surface-raised);
      color: var(--color-on-surface); outline: none;
      &:focus { border-color: var(--color-primary); }
    }
    textarea.demo-input { resize: vertical; font-family: inherit; }
  `],
})
class PanelBodyDemoComponent {}

// ── Host component ───────────────────────────────────────────────────────────

@Component({
  selector: 'sb-panel-demo',
  standalone: true,
  template: `
    <div class="demo-wrap">
      <p class="demo-hint">Click a button to open a panel.</p>
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
    .demo-wrap    { display: flex; flex-direction: column; align-items: center; gap: 24px; padding: 48px 32px; }
    .demo-hint    { margin: 0; font-size: 0.875rem; color: var(--color-on-surface-muted); }
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
class PanelDemoComponent {
  private readonly panelSvc = inject(M2S2PanelService);
  lastResult: unknown;

  readonly buttons: { label: string; data: NgM2S2PanelData }[] = [
    {
      label: 'Info panel (message)',
      data: {
        title:   'Release notes',
        subtitle: 'v2.4.0 — May 2026',
        message: 'This release includes performance improvements to the data table, brand configurator enhancements, and the new side panel component.',
        actions: [
          { label: 'Close', value: null, variant: 'secondary' },
        ],
      },
    },
    {
      label: 'Form panel (component body)',
      data: {
        title:         'Edit member',
        subtitle:      'Update the member profile below.',
        bodyComponent: PanelBodyDemoComponent,
        actions: [
          { label: 'Cancel', value: false, variant: 'ghost'    },
          { label: 'Save',   value: true,  variant: 'primary'  },
        ],
      },
    },
    {
      label: 'Left panel',
      data: {
        title:   'Navigation',
        subtitle: 'Slide in from the left.',
        message: 'This panel animates from the left side.',
        side:    'left',
        width:   '320px',
        actions: [
          { label: 'Done', value: true, variant: 'primary' },
        ],
      },
    },
    {
      label: 'Modal panel (cannot dismiss)',
      data: {
        title:   'Terms of service',
        subtitle: 'Please read and accept before continuing.',
        message: 'You must accept the terms to proceed. Clicking outside or pressing Escape will not close this panel.',
        modal:   true,
        actions: [
          { label: 'Decline', value: false, variant: 'ghost'   },
          { label: 'Accept',  value: true,  variant: 'primary' },
        ],
      },
    },
    {
      label: 'Wide panel (720px)',
      data: {
        title:         'Record detail',
        subtitle:      'Wider panel for detailed content.',
        bodyComponent: PanelBodyDemoComponent,
        width:         '720px',
        actions: [
          { label: 'Cancel',      value: false,    variant: 'ghost'       },
          { label: 'Delete',      value: 'delete', variant: 'destructive' },
          { label: 'Save',        value: true,     variant: 'primary'     },
        ],
      },
    },
  ];

  open(data: NgM2S2PanelData): void {
    this.panelSvc.panel(data).afterClosed().subscribe(result => {
      this.lastResult = result ?? null;
    });
  }
}

// ── Meta ─────────────────────────────────────────────────────────────────────

const PANEL_CODE = `
// Inject the service
private readonly panelSvc = inject(M2S2PanelService);

// Simple message panel (right side, default)
this.panelSvc.panel({
  title:    'Release notes',
  subtitle: 'v2.4.0',
  message:  'Details about this release...',
  actions:  [{ label: 'Close', value: null, variant: 'secondary' }],
}).afterClosed().subscribe(result => { /* result is the action value */ });

// Panel with a custom component as the body
this.panelSvc.open(MyFormComponent, {
  title:   'Edit member',
  actions: [
    { label: 'Cancel', value: false, variant: 'ghost'   },
    { label: 'Save',   value: true,  variant: 'primary' },
  ],
});

// Left-side panel
this.panelSvc.panel({
  title: 'Navigation',
  side:  'left',
  width: '320px',
  actions: [{ label: 'Done', value: true, variant: 'primary' }],
});

// Modal panel (cannot dismiss via backdrop or Escape)
this.panelSvc.panel({
  title:  'Terms of service',
  modal:  true,
  actions: [
    { label: 'Decline', value: false, variant: 'ghost'   },
    { label: 'Accept',  value: true,  variant: 'primary' },
  ],
});
`.trim();

const meta: Meta<PanelDemoComponent> = {
  title:     'Components/Panel',
  component: PanelDemoComponent,
  tags:      ['autodocs'],
  decorators: [
    applicationConfig({
      providers: [provideAnimationsAsync()],
    }),
  ],
  parameters: {
    layout: 'fullscreen',
    docs: {
      source: { code: PANEL_CODE, language: 'typescript' },
    },
  },
};

export default meta;
type Story = StoryObj<PanelDemoComponent>;

export const Default: Story = {
  name: 'Interactive — all variants',
};
