import { render, screen, fireEvent } from '@testing-library/angular';
import { axe } from 'jest-axe';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { M2S2PanelComponent } from './panel.component';
import { NgM2S2PanelData } from '../../models/panel/panel.model';

const makePanelRef = () => ({ close: jest.fn() });

const renderPanel = (data: NgM2S2PanelData) => {
  const panelRef = makePanelRef();
  return render(M2S2PanelComponent, {
    providers: [
      { provide: MAT_DIALOG_DATA, useValue: data },
      { provide: MatDialogRef, useValue: panelRef },
    ],
  }).then(result => ({ ...result, panelRef }));
};

describe('M2S2PanelComponent', () => {
  describe('title and subtitle', () => {
    it('renders the panel title', async () => {
      await renderPanel({ title: 'Edit Profile' });
      expect(screen.getByText('Edit Profile')).toBeInTheDocument();
    });

    it('renders the subtitle when provided', async () => {
      await renderPanel({ title: 'Settings', subtitle: 'Manage your preferences' });
      expect(screen.getByText('Manage your preferences')).toBeInTheDocument();
    });

    it('does not render a subtitle element when subtitle is omitted', async () => {
      await renderPanel({ title: 'Settings' });
      expect(document.querySelector('.panel-subtitle')).not.toBeInTheDocument();
    });
  });

  describe('message body', () => {
    it('renders a text message when provided', async () => {
      await renderPanel({ title: 'Info', message: 'Please fill in your details.' });
      expect(screen.getByText('Please fill in your details.')).toBeInTheDocument();
    });

    it('does not render the message element when message is omitted', async () => {
      await renderPanel({ title: 'Info' });
      expect(document.querySelector('.panel-message')).not.toBeInTheDocument();
    });
  });

  describe('close button', () => {
    it('renders the close button when modal is false', async () => {
      await renderPanel({ title: 'Closeable', modal: false });
      expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
    });

    it('does not render the close button when modal is true', async () => {
      await renderPanel({ title: 'Forced', modal: true });
      expect(screen.queryByRole('button', { name: 'Close' })).not.toBeInTheDocument();
    });

    it('calls ref.close with null when the close button is clicked', async () => {
      const { panelRef } = await renderPanel({ title: 'Closeable', modal: false });
      fireEvent.click(screen.getByRole('button', { name: 'Close' }));
      expect(panelRef.close).toHaveBeenCalledWith(null);
    });
  });

  describe('action buttons', () => {
    it('renders a button for each action', async () => {
      await renderPanel({
        title: 'Review',
        actions: [
          { label: 'Cancel', value: null },
          { label: 'Save', value: 'save', variant: 'primary' },
        ],
      });
      expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
    });

    it('calls ref.close with the action value when an action button is clicked', async () => {
      const { panelRef } = await renderPanel({
        title: 'Review',
        actions: [{ label: 'Approve', value: 'approved', variant: 'primary' }],
      });
      fireEvent.click(screen.getByRole('button', { name: 'Approve' }));
      expect(panelRef.close).toHaveBeenCalledWith('approved');
    });

    it('does not render a footer when no actions are provided', async () => {
      await renderPanel({ title: 'Empty Footer' });
      expect(document.querySelector('.panel-footer')).not.toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('has no violations with title and actions', async () => {
      const { container } = await renderPanel({
        title: 'Edit Profile',
        subtitle: 'Update your details',
        actions: [
          { label: 'Cancel', value: null },
          { label: 'Save', value: 'save', variant: 'primary' },
        ],
      });
      expect(await axe(container)).toHaveNoViolations();
    });

    it('has no violations with close button visible', async () => {
      const { container } = await renderPanel({ title: 'Closeable', modal: false });
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
