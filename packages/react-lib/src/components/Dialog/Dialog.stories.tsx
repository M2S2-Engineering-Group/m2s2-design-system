import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { DialogProvider } from './DialogProvider';
import { useDialog } from '../../hooks/useDialog';
import type { M2S2DialogData } from '@m2s2/models';

const BUTTONS: { label: string; data: M2S2DialogData }[] = [
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
        { label: 'Keep it', value: false, variant: 'ghost'       },
        { label: 'Delete',  value: true,  variant: 'destructive' },
      ],
    },
  },
  {
    label: 'Multi-action dialog',
    data: {
      title: 'Save changes',
      message: 'You have unsaved changes. What would you like to do?',
      actions: [
        { label: 'Discard',     value: 'discard', variant: 'ghost'     },
        { label: 'Save draft',  value: 'draft',   variant: 'secondary' },
        { label: 'Publish now', value: 'publish', variant: 'primary'   },
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

function DemoInner() {
  const { dialog } = useDialog();
  const [lastResult, setLastResult] = useState<{ value: unknown; set: boolean }>({ value: undefined, set: false });

  async function open(data: M2S2DialogData) {
    const result = await dialog(data);
    setLastResult({ value: result ?? null, set: true });
  }

  function resultLabel(v: unknown): string {
    return v === null ? 'null (× button)' : JSON.stringify(v);
  }

  return (
    <div className="demo-wrap">
      <p className="demo-hint">Click a button to open the dialog.</p>
      <div className="demo-buttons">
        {BUTTONS.map(btn => (
          <button key={btn.label} className="demo-btn" onClick={() => open(btn.data)}>
            {btn.label}
          </button>
        ))}
      </div>
      {lastResult.set && (
        <p className="demo-result">
          Last closed with: <code>{resultLabel(lastResult.value)}</code>
        </p>
      )}
      <style>{`
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
      `}</style>
    </div>
  );
}

function withProvider(Story: React.ComponentType) {
  return <DialogProvider><Story /></DialogProvider>;
}

const meta: Meta = {
  title: 'Components/Dialog',
  tags: ['autodocs'],
  decorators: [withProvider],
  parameters: { layout: 'fullscreen' },
};
export default meta;

export const Default: StoryObj = {
  name: 'Interactive — all variants',
  render: () => <DemoInner />,
};
