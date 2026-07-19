import type { Meta, StoryObj } from "@storybook/vue3";
import { ref, onUnmounted } from "vue";
import LoadingButton from "./LoadingButton.vue";

const DEMO_STYLES = `
  .demo { display: flex; flex-wrap: wrap; gap: 24px; padding: 32px; background: var(--color-bg, #0a0a0f); align-items: flex-end; }
  .demo-col { display: flex; flex-direction: column; gap: 8px; }
  .demo-label { font-size: 11px; color: #94a3b8; font-family: sans-serif; }
  .btn { display: inline-flex; align-items: center; padding: 8px 18px; border-radius: 8px; font-size: 14px; font-family: sans-serif; font-weight: 500; cursor: pointer; transition: opacity 0.15s; &:disabled { opacity: 0.6; cursor: not-allowed; } }
  .btn-primary   { background: #7c3aed; color: #fff; border: none; }
  .btn-secondary { background: transparent; color: #7c3aed; border: 1.5px solid #7c3aed; }
  .btn-danger    { background: transparent; color: #ef4444; border: 1.5px solid #ef4444; }
`;

const meta: Meta<typeof LoadingButton> = {
  title: "Components/LoadingButton",
  component: LoadingButton,
  tags: ["autodocs"],
  decorators: [
    () => ({
      setup() {
        const el = document.createElement("style");
        el.textContent = DEMO_STYLES;
        document.head.appendChild(el);
        onUnmounted(() => el.remove());
      },
      template: "<story />",
    }),
  ],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
A drop-in button wrapper that shows a spinner and disables the button while an async operation is in progress.
Pass your existing button classes via \`class\` — \`LoadingButton\` renders a standard \`<button>\` and forwards all native attributes.

\`\`\`vue
<LoadingButton class="btn btn-primary" :loading="saving" loading-text="Saving…" @click="handleSave">
  Save Changes
</LoadingButton>
\`\`\`

When \`loading\` is true the button is disabled, \`aria-busy\` is set, a spinner appears, and — if provided — the label switches to \`loadingText\`.
        `,
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof LoadingButton>;

export const States: Story = {
  name: "All States",
  render: () => ({
    components: { LoadingButton },

    template: `
      <div class="demo">
        <div class="demo-col">
          <span class="demo-label">Idle</span>
          <LoadingButton class="btn btn-primary" :loading="false">Save Changes</LoadingButton>
        </div>
        <div class="demo-col">
          <span class="demo-label">Loading</span>
          <LoadingButton class="btn btn-primary" :loading="true" loading-text="Saving…">Save Changes</LoadingButton>
        </div>
        <div class="demo-col">
          <span class="demo-label">Secondary loading</span>
          <LoadingButton class="btn btn-secondary" :loading="true" loading-text="Submitting…">Submit Form</LoadingButton>
        </div>
        <div class="demo-col">
          <span class="demo-label">Danger loading</span>
          <LoadingButton class="btn btn-danger" :loading="true" loading-text="Deleting…">Delete Record</LoadingButton>
        </div>
      </div>
    `,
  }),
};

export const Interactive: Story = {
  name: "Interactive Demo",
  render: () => ({
    components: { LoadingButton },

    setup() {
      const saving = ref(false);
      const submitting = ref(false);
      const deleting = ref(false);

      function simulate(state: { value: boolean }, ms: number) {
        state.value = true;
        setTimeout(() => {
          state.value = false;
        }, ms);
      }

      return { saving, submitting, deleting, simulate };
    },
    template: `
      <div class="demo">
        <div class="demo-col">
          <span class="demo-label">Primary action</span>
          <LoadingButton class="btn btn-primary" :loading="saving" loading-text="Saving…" @click="simulate(saving, 2000)">
            Save Changes
          </LoadingButton>
        </div>
        <div class="demo-col">
          <span class="demo-label">Secondary action</span>
          <LoadingButton class="btn btn-secondary" :loading="submitting" loading-text="Submitting…" @click="simulate(submitting, 1800)">
            Submit Form
          </LoadingButton>
        </div>
        <div class="demo-col">
          <span class="demo-label">Destructive action</span>
          <LoadingButton class="btn btn-danger" :loading="deleting" loading-text="Deleting…" @click="simulate(deleting, 1500)">
            Delete Record
          </LoadingButton>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: "Click each button to simulate a 1.5–2s API call.",
      },
    },
  },
};

export const SpinnerOnly: Story = {
  name: "Spinner Without Label Change",
  render: () => ({
    components: { LoadingButton },

    template: `
      <div class="demo">
        <div class="demo-col">
          <span class="demo-label">No loadingText — label stays, spinner added</span>
          <LoadingButton class="btn btn-primary" :loading="true">Save Changes</LoadingButton>
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
