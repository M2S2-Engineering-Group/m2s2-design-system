import type { Meta, StoryObj } from "@storybook/angular";
import { LoadingButtonComponent } from "./loading-button.component";

const BTN_STYLES = `
  .btn { display: inline-flex; align-items: center; padding: 8px 18px; border-radius: 8px; font-size: 14px; font-weight: 500; cursor: pointer; transition: opacity 0.15s; &:disabled { opacity: 0.6; cursor: not-allowed; } }
  .btn-primary   { background: #7c3aed; color: #fff; border: none; }
  .btn-secondary { background: transparent; color: #7c3aed; border: 1.5px solid #7c3aed; }
  .btn-danger    { background: transparent; color: #ef4444; border: 1.5px solid #ef4444; }
  .demo { display: flex; flex-wrap: wrap; gap: 24px; padding: 32px; background: var(--color-bg, #0a0a0f); align-items: flex-end; }
  .demo-col { display: flex; flex-direction: column; gap: 8px; }
  .demo-label { font-size: 11px; color: #94a3b8; font-family: sans-serif; }
`;

const meta: Meta<LoadingButtonComponent> = {
  title: "Components/LoadingButton",
  component: LoadingButtonComponent,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
A drop-in button wrapper that shows a spinner and disables the button while an async operation is in progress.
Pass your existing button classes — \`LoadingButton\` renders a standard \`<button>\` element via \`:host { display: contents }\`.

\`\`\`html
<m2s2-loading-button class="btn btn-primary" [loading]="saving" loadingText="Saving…">
  Save Changes
</m2s2-loading-button>
\`\`\`
        `,
      },
    },
  },
};
export default meta;
type Story = StoryObj<LoadingButtonComponent>;

export const States: Story = {
  name: "All States",
  render: () => ({
    styles: [BTN_STYLES],
    template: `
      <div class="demo">
        <div class="demo-col">
          <span class="demo-label">Idle</span>
          <m2s2-loading-button class="btn btn-primary" [loading]="false">Save Changes</m2s2-loading-button>
        </div>
        <div class="demo-col">
          <span class="demo-label">Loading</span>
          <m2s2-loading-button class="btn btn-primary" [loading]="true" loadingText="Saving…">Save Changes</m2s2-loading-button>
        </div>
        <div class="demo-col">
          <span class="demo-label">Secondary loading</span>
          <m2s2-loading-button class="btn btn-secondary" [loading]="true" loadingText="Submitting…">Submit Form</m2s2-loading-button>
        </div>
        <div class="demo-col">
          <span class="demo-label">Danger loading</span>
          <m2s2-loading-button class="btn btn-danger" [loading]="true" loadingText="Deleting…">Delete Record</m2s2-loading-button>
        </div>
      </div>
    `,
  }),
};

export const SpinnerOnly: Story = {
  name: "Spinner Without Label Change",
  render: () => ({
    styles: [BTN_STYLES],
    template: `
      <div class="demo">
        <div class="demo-col">
          <span class="demo-label">No loadingText — label stays, spinner added</span>
          <m2s2-loading-button class="btn btn-primary" [loading]="true">Save Changes</m2s2-loading-button>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          "Omit `loadingText` and the original label stays visible alongside the spinner.",
      },
    },
  },
};
