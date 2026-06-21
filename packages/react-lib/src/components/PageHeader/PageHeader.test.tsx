import { render, screen } from '@testing-library/react';
import { makePageHeaderConfig } from '@m2s2/utils/testing';
import { axe } from 'jest-axe';
import { PageHeader } from './PageHeader';

describe('PageHeader', () => {
  it('renders the title as an h1', () => {
    render(<PageHeader config={makePageHeaderConfig({ title: 'Welcome' })} />);
    expect(screen.getByRole('heading', { level: 1, name: 'Welcome' })).toBeInTheDocument();
  });

  it('renders the subtitle', () => {
    render(<PageHeader config={makePageHeaderConfig({ subtitle: 'Your journey starts here.' })} />);
    expect(screen.getByText('Your journey starts here.')).toBeInTheDocument();
  });

  describe('accessibility', () => {
    it('has no violations', async () => {
      const { container } = render(
        <PageHeader config={makePageHeaderConfig({ title: 'Welcome', subtitle: 'Your journey starts here.' })} />
      );
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
