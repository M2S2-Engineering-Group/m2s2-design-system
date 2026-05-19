import { defineComponent } from 'vue';
import type { Meta, StoryObj } from '@storybook/vue3';
import type { M2S2PanelData } from '@m2s2/models';
import PanelProvider from './PanelProvider.vue';
import { usePanel } from './usePanel';
import { ref } from 'vue';

const BUTTONS: { label: string; data: M2S2PanelData }[] = [
  {
    label: 'Info panel (message)',
    data: {
      title:    'Release notes',
      subtitle: 'v2.4.0 — May 2026',
      message:  'This release includes performance improvements to the data table, brand configurator enhancements, and the new side panel component.',
      actions: [
        { label: 'Close', value: null, variant: 'secondary' },
      ],
    },
  },
  {
    label: 'Form panel (component body)',
    data: {
      title:    'Edit member',
      subtitle: 'Update the member profile below.',
      message:  'Fill in the fields below to update the member record.',
      actions: [
        { label: 'Cancel', value: false, variant: 'ghost'   },
        { label: 'Save',   value: true,  variant: 'primary' },
      ],
    },
  },
  {
    label: 'Left panel',
    data: {
      title:    'Navigation',
      subtitle: 'Slide in from the left.',
      message:  'This panel animates from the left side.',
      side:     'left',
      width:    '320px',
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
      title:    'Record detail',
      subtitle: 'Wider panel for detailed content.',
      message:  'This panel is wider than the default to accommodate detailed content.',
      width:    '720px',
      actions: [
        { label: 'Cancel', value: false,    variant: 'ghost'       },
        { label: 'Delete', value: 'delete', variant: 'destructive' },
        { label: 'Save',   value: true,     variant: 'primary'     },
      ],
    },
  },
];

const DEMO_STYLES = `
  .demo-wrap    { display: flex; flex-direction: column; align-items: center; gap: 24px; padding: 48px 32px; }
  .demo-hint    { margin: 0; font-size: 0.875rem; color: var(--color-on-surface-muted); }
  .demo-buttons { display: flex; flex-wrap: wrap; gap: 12px; justify-content: center; }
  .demo-btn {
    padding: 10px 24px; border-radius: 8px; border: 1px solid var(--color-border);
    background: var(--color-surface-raised); color: var(--color-on-surface);
    font-size: 0.875rem; font-weight: 500; cursor: pointer;
    transition: border-color 0.15s, background 0.15s;
  }
  .demo-btn:hover { border-color: var(--color-primary); background: var(--color-surface); }
  .demo-result  { margin: 0; font-size: 0.8rem; color: var(--color-on-surface-muted); }
  .demo-result code { color: var(--color-secondary); }
`;

const DemoInner = defineComponent({
  setup() {
    const panelSvc  = usePanel();
    const lastResult = ref<unknown>(undefined);
    const hasResult  = ref(false);

    function resultLabel(v: unknown): string {
      return v === null ? 'null (× button)' : JSON.stringify(v);
    }

    async function open(data: M2S2PanelData) {
      const result = await panelSvc.panel(data);
      lastResult.value = result ?? null;
      hasResult.value  = true;
    }

    return { buttons: BUTTONS, lastResult, hasResult, resultLabel, open };
  },
  template: `
    <div class="demo-wrap">
      <p class="demo-hint">Click a button to open a panel.</p>
      <div class="demo-buttons">
        <button
          v-for="btn in buttons"
          :key="btn.label"
          class="demo-btn"
          @click="open(btn.data)"
        >{{ btn.label }}</button>
      </div>
      <p v-if="hasResult" class="demo-result">
        Last closed with: <code>{{ resultLabel(lastResult) }}</code>
      </p>
    </div>
  `,
});

const meta: Meta = {
  title: 'Components/Panel',
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};
export default meta;

export const Default: StoryObj = {
  name: 'Interactive — all variants',
  render: () => ({
    components: { PanelProvider, DemoInner },
    setup() {
      if (typeof document !== 'undefined') {
        let el = document.getElementById('panel-demo-styles');
        if (!el) {
          el = document.createElement('style');
          el.id = 'panel-demo-styles';
          el.textContent = DEMO_STYLES;
          document.head.appendChild(el);
        }
      }
    },
    template: `
      <PanelProvider>
        <DemoInner />
      </PanelProvider>
    `,
  }),
};
