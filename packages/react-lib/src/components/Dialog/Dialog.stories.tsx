import type { Meta, StoryObj } from '@storybook/react';
import { DialogProvider } from './DialogProvider';
import { useDialog } from '../../hooks/useDialog';

function DialogDemo({ label, action }: { label: string; action: (ctx: ReturnType<typeof useDialog>) => void }) {
  const ctx = useDialog();
  return (
    <button className="dialog-btn dialog-btn--primary" style={{ padding: '8px 16px' }} onClick={() => action(ctx)}>
      {label}
    </button>
  );
}

function withProvider(Story: React.ComponentType) {
  return (
    <DialogProvider>
      <Story />
    </DialogProvider>
  );
}

const meta: Meta = {
  title: 'Components/Dialog',
  tags: ['autodocs'],
  decorators: [withProvider],
};
export default meta;

export const Confirm: StoryObj = {
  name: 'Confirm dialog',
  render: () => (
    <DialogDemo
      label="Open confirm"
      action={ctx => ctx.confirm('Delete item?', 'This action cannot be undone.').then(ok => alert(ok ? 'Confirmed' : 'Cancelled'))}
    />
  ),
};

export const CustomActions: StoryObj = {
  name: 'Custom actions',
  render: () => (
    <DialogDemo
      label="Open dialog"
      action={ctx =>
        ctx.dialog({
          title: 'Save changes?',
          message: 'You have unsaved changes. What would you like to do?',
          actions: [
            { label: 'Discard', value: 'discard', variant: 'destructive' },
            { label: 'Cancel',  value: null,      variant: 'ghost'       },
            { label: 'Save',    value: 'save',     variant: 'primary'     },
          ],
        }).then(v => alert(`Resolved: ${v}`))
      }
    />
  ),
};

export const Modal: StoryObj = {
  name: 'Modal (no dismiss)',
  render: () => (
    <DialogDemo
      label="Open modal"
      action={ctx =>
        ctx.dialog({
          title: 'Action required',
          message: 'You must make a choice to continue. Clicking outside or pressing Escape will not close this dialog.',
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
