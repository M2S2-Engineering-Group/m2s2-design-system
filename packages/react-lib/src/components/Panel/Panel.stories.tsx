import type { Meta, StoryObj } from '@storybook/react';
import { PanelProvider } from './PanelProvider';
import { usePanel } from '../../hooks/usePanel';

function PanelDemo({ label, action }: { label: string; action: (ctx: ReturnType<typeof usePanel>) => void }) {
  const ctx = usePanel();
  return (
    <button className="panel-btn panel-btn--primary" style={{ padding: '8px 16px' }} onClick={() => action(ctx)}>
      {label}
    </button>
  );
}

function withProvider(Story: React.ComponentType) {
  return (
    <PanelProvider>
      <Story />
    </PanelProvider>
  );
}

const meta: Meta = {
  title: 'Components/Panel',
  tags: ['autodocs'],
  decorators: [withProvider],
};
export default meta;

export const RightPanel: StoryObj = {
  name: 'Right side (default)',
  render: () => (
    <PanelDemo
      label="Open right panel"
      action={ctx =>
        ctx.panel({
          title: 'Panel Title',
          subtitle: 'Optional subtitle line',
          message: 'This panel slides in from the right. Click the ✕ button or the backdrop to close.',
          actions: [
            { label: 'Cancel', value: null,  variant: 'secondary' },
            { label: 'Save',   value: 'save', variant: 'primary'  },
          ],
        }).then(v => alert(`Resolved: ${v}`))
      }
    />
  ),
};

export const LeftPanel: StoryObj = {
  name: 'Left side',
  render: () => (
    <PanelDemo
      label="Open left panel"
      action={ctx =>
        ctx.panel({
          title: 'Left Panel',
          side: 'left',
          message: 'This panel slides in from the left.',
          actions: [{ label: 'Close', value: null, variant: 'secondary' }],
        })
      }
    />
  ),
};

export const WithRichBody: StoryObj = {
  name: 'Rich body content',
  render: () => (
    <PanelDemo
      label="Open panel with rich content"
      action={ctx =>
        ctx.panel({
          title: 'Rich Content Panel',
          body: (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <p>Panels accept arbitrary React nodes as the <code>body</code> prop.</p>
              <input placeholder="Example input" style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
            </div>
          ),
          actions: [
            { label: 'Cancel', value: null,    variant: 'ghost'   },
            { label: 'Submit', value: 'submit', variant: 'primary' },
          ],
        })
      }
    />
  ),
};

export const ModalPanel: StoryObj = {
  name: 'Modal (no dismiss)',
  render: () => (
    <PanelDemo
      label="Open modal panel"
      action={ctx =>
        ctx.panel({
          title: 'Action Required',
          message: 'This panel cannot be dismissed by clicking outside or pressing Escape.',
          modal: true,
          actions: [
            { label: 'Cancel', value: false, variant: 'secondary' },
            { label: 'Accept', value: true,  variant: 'primary'   },
          ],
        })
      }
    />
  ),
};
