import { render, screen, fireEvent } from '@testing-library/angular';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { M2S2DialogComponent } from './dialog.component';
import { M2S2DialogData } from '../../models/dialog/dialog.model';

const makeDialogRef = () => ({ close: jest.fn() });

const renderDialog = (data: M2S2DialogData) => {
  const dialogRef = makeDialogRef();
  return render(M2S2DialogComponent, {
    providers: [
      { provide: MAT_DIALOG_DATA, useValue: data },
      { provide: MatDialogRef, useValue: dialogRef },
    ],
  }).then(result => ({ ...result, dialogRef }));
};

describe('M2S2DialogComponent', () => {
  describe('title and message', () => {
    it('renders the dialog title', async () => {
      await renderDialog({ title: 'Confirm Delete', actions: [] });
      expect(screen.getByText('Confirm Delete')).toBeInTheDocument();
    });

    it('renders the message when provided', async () => {
      await renderDialog({
        title: 'Are you sure?',
        message: 'This action cannot be undone.',
        actions: [],
      });
      expect(screen.getByText('This action cannot be undone.')).toBeInTheDocument();
    });

    it('does not render a message element when message is omitted', async () => {
      await renderDialog({ title: 'No Message', actions: [] });
      expect(document.querySelector('.dialog-message')).not.toBeInTheDocument();
    });
  });

  describe('action buttons', () => {
    it('renders a button for each action', async () => {
      await renderDialog({
        title: 'Choose',
        actions: [
          { label: 'Cancel', value: null },
          { label: 'Confirm', value: 'confirm', variant: 'primary' },
        ],
      });
      expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Confirm' })).toBeInTheDocument();
    });

    it('calls ref.close with the action value when an action button is clicked', async () => {
      const { dialogRef } = await renderDialog({
        title: 'Confirm?',
        actions: [{ label: 'OK', value: 'ok', variant: 'primary' }],
      });
      fireEvent.click(screen.getByRole('button', { name: 'OK' }));
      expect(dialogRef.close).toHaveBeenCalledWith('ok');
    });

    it('calls ref.close with null for a cancel action value', async () => {
      const { dialogRef } = await renderDialog({
        title: 'Confirm?',
        actions: [{ label: 'Cancel', value: null }],
      });
      fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
      expect(dialogRef.close).toHaveBeenCalledWith(null);
    });
  });

  describe('close button', () => {
    it('renders the close button when modal is false', async () => {
      await renderDialog({ title: 'Closeable', actions: [], modal: false });
      expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
    });

    it('does not render the close button when modal is true', async () => {
      await renderDialog({ title: 'Forced', actions: [], modal: true });
      expect(screen.queryByRole('button', { name: 'Close' })).not.toBeInTheDocument();
    });

    it('calls ref.close with null when the close button is clicked', async () => {
      const { dialogRef } = await renderDialog({
        title: 'Closeable',
        actions: [],
        modal: false,
      });
      fireEvent.click(screen.getByRole('button', { name: 'Close' }));
      expect(dialogRef.close).toHaveBeenCalledWith(null);
    });
  });
});
