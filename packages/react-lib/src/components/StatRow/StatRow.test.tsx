import { render, screen } from '@testing-library/react';
import { makeStatItems } from '@m2s2/utils/testing';
import { axe } from 'jest-axe';
import { StatRow } from './StatRow';

describe('StatRow', () => {
  it('renders each stat value', () => {
    render(<StatRow stats={makeStatItems(3)} />);
    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByText('200')).toBeInTheDocument();
    expect(screen.getByText('300')).toBeInTheDocument();
  });

  it('renders each stat label', () => {
    render(<StatRow stats={makeStatItems(3)} />);
    expect(screen.getByText('Metric 1')).toBeInTheDocument();
    expect(screen.getByText('Metric 2')).toBeInTheDocument();
    expect(screen.getByText('Metric 3')).toBeInTheDocument();
  });

  it('renders the correct number of stat items', () => {
    const { container } = render(<StatRow stats={makeStatItems(2)} />);
    expect(container.querySelectorAll('.sr-item')).toHaveLength(2);
  });

  describe('accessibility', () => {
    it('has no violations', async () => {
      const { container } = render(<StatRow stats={makeStatItems(3)} />);
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
