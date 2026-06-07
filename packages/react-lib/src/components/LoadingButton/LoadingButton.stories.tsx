import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { LoadingButton } from './LoadingButton';

const DEMO_STYLES: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 24,
  padding: 32,
  background: 'var(--color-bg, #0a0a0f)',
  alignItems: 'flex-end',
};

const BTN_BASE: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  padding: '8px 18px',
  borderRadius: 8,
  fontSize: 14,
  fontFamily: 'sans-serif',
  fontWeight: 500,
  cursor: 'pointer',
  transition: 'opacity 0.15s',
};

const primary:   React.CSSProperties = { ...BTN_BASE, background: '#7c3aed', color: '#fff',    border: 'none' };
const secondary: React.CSSProperties = { ...BTN_BASE, background: 'transparent', color: '#7c3aed', border: '1.5px solid #7c3aed' };
const danger:    React.CSSProperties = { ...BTN_BASE, background: 'transparent', color: '#ef4444', border: '1.5px solid #ef4444' };

const label = (text: string) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
    <span style={{ fontSize: 11, color: '#94a3b8', fontFamily: 'sans-serif' }}>{text}</span>
  </div>
);

function InteractiveDemo() {
  const [saving,     setSaving]     = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleting,   setDeleting]   = useState(false);

  const simulate = (set: (v: boolean) => void, ms: number) => {
    set(true);
    setTimeout(() => set(false), ms);
  };

  return (
    <div style={DEMO_STYLES}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {label('Primary action')}
        <LoadingButton
          style={primary}
          loading={saving}
          loadingText="Saving…"
          onClick={() => simulate(setSaving, 2000)}>
          Save Changes
        </LoadingButton>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {label('Secondary action')}
        <LoadingButton
          style={secondary}
          loading={submitting}
          loadingText="Submitting…"
          onClick={() => simulate(setSubmitting, 1800)}>
          Submit Form
        </LoadingButton>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {label('Destructive action')}
        <LoadingButton
          style={danger}
          loading={deleting}
          loadingText="Deleting…"
          onClick={() => simulate(setDeleting, 1500)}>
          Delete Record
        </LoadingButton>
      </div>
    </div>
  );
}

const meta: Meta<typeof LoadingButton> = {
  title: 'Components/LoadingButton',
  component: LoadingButton,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
A drop-in button wrapper that shows a spinner and disables the button while an async operation is in progress.
Pass your existing button styles via \`className\` or \`style\` — \`LoadingButton\` renders a standard \`<button>\` element and forwards all native button props.

\`\`\`tsx
<LoadingButton
  className="btn-primary"
  loading={saving}
  loadingText="Saving…"
  onClick={handleSave}>
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
  name: 'All States',
  render: () => (
    <div style={DEMO_STYLES}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {label('Idle')}
        <LoadingButton style={primary} loading={false}>Save Changes</LoadingButton>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {label('Loading')}
        <LoadingButton style={primary} loading={true} loadingText="Saving…">Save Changes</LoadingButton>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {label('Secondary loading')}
        <LoadingButton style={secondary} loading={true} loadingText="Submitting…">Submit Form</LoadingButton>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {label('Danger loading')}
        <LoadingButton style={danger} loading={true} loadingText="Deleting…">Delete Record</LoadingButton>
      </div>
    </div>
  ),
};

export const Interactive: Story = {
  name: 'Interactive Demo',
  render: () => <InteractiveDemo />,
  parameters: {
    docs: {
      description: {
        story: 'Click each button to simulate a 1.5–2s API call.',
      },
    },
  },
};

export const SpinnerOnly: Story = {
  name: 'Spinner Without Label Change',
  render: () => (
    <div style={DEMO_STYLES}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {label('No loadingText — label stays, spinner added')}
        <LoadingButton style={primary} loading={true}>Save Changes</LoadingButton>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Omit `loadingText` and the original label stays visible alongside the spinner.',
      },
    },
  },
};
