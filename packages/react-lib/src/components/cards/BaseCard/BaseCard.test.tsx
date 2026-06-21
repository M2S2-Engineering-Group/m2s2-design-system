import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { BaseCard } from './BaseCard';

describe('BaseCard', () => {
  it('renders children', () => {
    render(<BaseCard><p>Card content</p></BaseCard>);
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('does not apply featured class by default', () => {
    const { container } = render(<BaseCard><span /></BaseCard>);
    expect(container.firstChild).not.toHaveClass('featured');
  });

  it('applies featured class when featured=true', () => {
    const { container } = render(<BaseCard featured><span /></BaseCard>);
    expect(container.firstChild).toHaveClass('featured');
  });

  it('sets data-variant to default when no variant is provided', () => {
    const { container } = render(<BaseCard><span /></BaseCard>);
    expect(container.firstChild).toHaveAttribute('data-variant', 'default');
  });

  it('sets data-variant to the provided variant', () => {
    const { container } = render(<BaseCard variant="raised"><span /></BaseCard>);
    expect(container.firstChild).toHaveAttribute('data-variant', 'raised');
  });

  it('always has the m2s2-card class', () => {
    const { container } = render(<BaseCard><span /></BaseCard>);
    expect(container.firstChild).toHaveClass('m2s2-card');
  });

  describe('accessibility', () => {
    it('has no violations (default)', async () => {
      const { container } = render(<BaseCard><p>Card content</p></BaseCard>);
      expect(await axe(container)).toHaveNoViolations();
    });

    it('has no violations (featured)', async () => {
      const { container } = render(<BaseCard featured><p>Card content</p></BaseCard>);
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
