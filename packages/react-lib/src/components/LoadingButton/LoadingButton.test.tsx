import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { LoadingButton } from './LoadingButton';

describe('LoadingButton', () => {
  it('renders children', () => {
    render(<LoadingButton>Save</LoadingButton>);
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
  });

  it('is not disabled by default', () => {
    render(<LoadingButton>Save</LoadingButton>);
    expect(screen.getByRole('button')).not.toBeDisabled();
  });

  it('shows loadingText instead of children when loading', () => {
    render(<LoadingButton loading loadingText="Saving…">Save</LoadingButton>);
    expect(screen.getByRole('button', { name: 'Saving…' })).toBeInTheDocument();
    expect(screen.queryByText('Save')).not.toBeInTheDocument();
  });

  it('still shows children when loading but no loadingText provided', () => {
    render(<LoadingButton loading>Save</LoadingButton>);
    expect(screen.getByText('Save')).toBeInTheDocument();
  });

  it('renders the spinner element when loading', () => {
    const { container } = render(<LoadingButton loading>Save</LoadingButton>);
    expect(container.querySelector('.m2s2-btn-spinner')).toBeInTheDocument();
  });

  it('does not render the spinner when not loading', () => {
    const { container } = render(<LoadingButton>Save</LoadingButton>);
    expect(container.querySelector('.m2s2-btn-spinner')).not.toBeInTheDocument();
  });

  it('is disabled when loading=true', () => {
    render(<LoadingButton loading>Save</LoadingButton>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('is disabled when disabled prop is passed', () => {
    render(<LoadingButton disabled>Save</LoadingButton>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('sets aria-busy when loading', () => {
    render(<LoadingButton loading>Save</LoadingButton>);
    expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true');
  });

  describe('accessibility', () => {
    it('has no violations (default)', async () => {
      const { container } = render(<LoadingButton>Save</LoadingButton>);
      expect(await axe(container)).toHaveNoViolations();
    });

    it('has no violations (loading state)', async () => {
      const { container } = render(<LoadingButton loading loadingText="Saving…">Save</LoadingButton>);
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
