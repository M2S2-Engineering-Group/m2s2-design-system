import type { Meta, StoryObj } from "@storybook/angular";
import { Component, signal } from "@angular/core";
import { LoadingDirective } from "./loading.directive";

// ── Shared demo styles ────────────────────────────────────────────────────────
const DEMO_STYLES = `
  .demo      { display: flex; flex-wrap: wrap; gap: 12px; padding: 32px; background: var(--color-bg, #0a0a0f); }
  .demo-col  { display: flex; flex-direction: column; gap: 12px; }
  .demo-label { font-size: 12px; color: var(--color-on-surface-muted, #94a3b8); font-family: sans-serif; margin-bottom: 4px; }

  .btn {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 8px 18px; border-radius: 8px; font-size: 14px;
    font-family: sans-serif; font-weight: 500; cursor: pointer;
    border: none; transition: opacity 0.15s;
    &:disabled { opacity: 0.6; cursor: not-allowed; }
  }
  .btn-primary  { background: #7c3aed; color: #fff; }
  .btn-secondary { background: transparent; color: #7c3aed; border: 1.5px solid #7c3aed; }
  .btn-danger   { background: transparent; color: #ef4444; border: 1.5px solid #ef4444; }
`;

// ── Interactive demo ──────────────────────────────────────────────────────────
@Component({
  selector: "sb-loading-interactive",
  standalone: true,
  imports: [LoadingDirective],
  styles: [DEMO_STYLES],
  template: `
    <div class="demo">
      <div class="demo-col">
        <span class="demo-label">Primary action</span>
        <button
          class="btn btn-primary"
          [m2s2Loading]="saving()"
          (click)="simulate(saving, 2000)"
        >
          {{ saving() ? "Saving…" : "Save Changes" }}
        </button>
      </div>
      <div class="demo-col">
        <span class="demo-label">Secondary action</span>
        <button
          class="btn btn-secondary"
          [m2s2Loading]="submitting()"
          (click)="simulate(submitting, 1800)"
        >
          {{ submitting() ? "Submitting…" : "Submit Form" }}
        </button>
      </div>
      <div class="demo-col">
        <span class="demo-label">Destructive action</span>
        <button
          class="btn btn-danger"
          [m2s2Loading]="deleting()"
          (click)="simulate(deleting, 1500)"
        >
          {{ deleting() ? "Deleting…" : "Delete Record" }}
        </button>
      </div>
    </div>
  `,
})
class InteractiveDemoComponent {
  saving = signal(false);
  submitting = signal(false);
  deleting = signal(false);

  simulate(s: ReturnType<typeof signal<boolean>>, ms: number): void {
    s.set(true);
    setTimeout(() => s.set(false), ms);
  }
}

// ── Static loading state ──────────────────────────────────────────────────────
@Component({
  selector: "sb-loading-static",
  standalone: true,
  imports: [LoadingDirective],
  styles: [DEMO_STYLES],
  template: `
    <div class="demo">
      <div class="demo-col">
        <span class="demo-label">Idle</span>
        <button class="btn btn-primary" [m2s2Loading]="false">
          Save Changes
        </button>
      </div>
      <div class="demo-col">
        <span class="demo-label">Loading</span>
        <button class="btn btn-primary" [m2s2Loading]="true">Saving…</button>
      </div>
      <div class="demo-col">
        <span class="demo-label">Secondary loading</span>
        <button class="btn btn-secondary" [m2s2Loading]="true">
          Submitting…
        </button>
      </div>
      <div class="demo-col">
        <span class="demo-label">Danger loading</span>
        <button class="btn btn-danger" [m2s2Loading]="true">Deleting…</button>
      </div>
    </div>
  `,
})
class StaticDemoComponent {}

// ── Meta ──────────────────────────────────────────────────────────────────────
const meta: Meta<StaticDemoComponent> = {
  title: "Directives/Loading",
  component: StaticDemoComponent,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
The \`[m2s2Loading]\` directive adds a spinner and disables any \`<button>\` while an async operation is in progress.
Apply it to any button — it works alongside any existing CSS classes and styles.

\`\`\`html
<button [m2s2Loading]="saving()" (click)="save()">
  {{ saving() ? 'Saving…' : 'Save Changes' }}
</button>
\`\`\`

The directive:
- Inserts an inline spinner before the button label
- Sets \`disabled\` so the button cannot be clicked again
- Sets \`aria-busy\` for screen readers
- Self-contained — no external CSS import required
        `,
      },
    },
  },
};
export default meta;
type Story = StoryObj<StaticDemoComponent>;

export const States: Story = {
  name: "All States",
};

export const Interactive: Story = {
  name: "Interactive Demo",
  render: () => ({
    template: "<sb-loading-interactive />",
    moduleMetadata: { imports: [InteractiveDemoComponent] },
  }),
  parameters: {
    docs: {
      description: {
        story:
          "Click each button to simulate a 1.5–2s API call. The directive handles disabling and the spinner automatically.",
      },
    },
  },
};
