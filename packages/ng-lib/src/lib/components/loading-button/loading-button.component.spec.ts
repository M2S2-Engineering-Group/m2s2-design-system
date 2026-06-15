import { render, screen } from '@testing-library/angular';
import { LoadingButtonComponent } from './loading-button.component';

const renderButton = (inputs: Record<string, unknown> = {}, template?: string) => {
  if (template) {
    return render(template, {
      imports: [LoadingButtonComponent],
    });
  }
  return render(LoadingButtonComponent, { inputs });
};

describe('LoadingButtonComponent', () => {
  describe('default state', () => {
    it('projects slotted content into the button', async () => {
      await render('<m2s2-loading-button>Save</m2s2-loading-button>', {
        imports: [LoadingButtonComponent],
      });
      expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
    });

    it('is enabled by default', async () => {
      await render('<m2s2-loading-button>Go</m2s2-loading-button>', {
        imports: [LoadingButtonComponent],
      });
      expect(screen.getByRole('button')).not.toBeDisabled();
    });

    it('does not show a spinner when not loading', async () => {
      await render('<m2s2-loading-button>Go</m2s2-loading-button>', {
        imports: [LoadingButtonComponent],
      });
      expect(document.querySelector('.m2s2-btn-spinner')).not.toBeInTheDocument();
    });
  });

  describe('loading state', () => {
    it('shows the spinner when loading is true', async () => {
      await render('<m2s2-loading-button [loading]="true">Save</m2s2-loading-button>', {
        imports: [LoadingButtonComponent],
      });
      expect(document.querySelector('.m2s2-btn-spinner')).toBeInTheDocument();
    });

    it('disables the button when loading is true', async () => {
      await render('<m2s2-loading-button [loading]="true">Save</m2s2-loading-button>', {
        imports: [LoadingButtonComponent],
      });
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('sets aria-busy on the button when loading', async () => {
      await render('<m2s2-loading-button [loading]="true">Save</m2s2-loading-button>', {
        imports: [LoadingButtonComponent],
      });
      expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true');
    });

    it('shows loadingText instead of content when both loading and loadingText are set', async () => {
      await render(
        '<m2s2-loading-button [loading]="true" loadingText="Saving…">Save</m2s2-loading-button>',
        { imports: [LoadingButtonComponent] },
      );
      expect(screen.getByRole('button')).toHaveTextContent('Saving…');
    });

    it('still shows content when loading is true but loadingText is not provided', async () => {
      await render('<m2s2-loading-button [loading]="true">Save</m2s2-loading-button>', {
        imports: [LoadingButtonComponent],
      });
      expect(screen.getByRole('button')).toHaveTextContent('Save');
    });
  });

  describe('disabled input', () => {
    it('disables the button when disabled is true', async () => {
      await render('<m2s2-loading-button [disabled]="true">Submit</m2s2-loading-button>', {
        imports: [LoadingButtonComponent],
      });
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('remains disabled even when loading is false but disabled is true', async () => {
      await render(
        '<m2s2-loading-button [loading]="false" [disabled]="true">Submit</m2s2-loading-button>',
        { imports: [LoadingButtonComponent] },
      );
      expect(screen.getByRole('button')).toBeDisabled();
    });
  });
});
