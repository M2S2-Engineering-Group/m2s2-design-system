import { render, screen } from '@testing-library/react';
import { makeCtaConfig } from '@m2s2/utils/testing';
import { axe } from 'jest-axe';
import { CtaSection } from './CtaSection';

describe('CtaSection', () => {
  it('renders the title', () => {
    render(<CtaSection config={makeCtaConfig({ title: 'Get Started Today' })} />);
    expect(screen.getByRole('heading', { name: 'Get Started Today' })).toBeInTheDocument();
  });

  it('renders the body text', () => {
    render(<CtaSection config={makeCtaConfig({ body: 'Join thousands of users.' })} />);
    expect(screen.getByText('Join thousands of users.')).toBeInTheDocument();
  });

  it('renders the link with the correct label', () => {
    render(<CtaSection config={makeCtaConfig({ label: 'Sign Up Free' })} />);
    expect(screen.getByRole('link', { name: 'Sign Up Free' })).toBeInTheDocument();
  });

  it('renders the link with the correct href', () => {
    render(<CtaSection config={makeCtaConfig({ route: '/signup', label: 'Sign Up Free' })} />);
    expect(screen.getByRole('link', { name: 'Sign Up Free' })).toHaveAttribute('href', '/signup');
  });

  describe('accessibility', () => {
    it('has no violations', async () => {
      const { container } = render(
        <CtaSection config={makeCtaConfig({ title: 'Get Started', body: 'Join us today.', label: 'Sign Up', route: '/signup' })} />
      );
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
