import { render, screen } from '@testing-library/react';
import { StatusBadge } from './StatusBadge';

describe('StatusBadge', () => {
  it('renders a span element', () => {
    render(<StatusBadge status="unknown" />);
    expect(screen.getByText('unknown')).toBeInTheDocument();
  });

  it('applies the m2s2-status-badge class', () => {
    render(<StatusBadge status="received" />);
    expect(screen.getByText('Received')).toHaveClass('m2s2-status-badge');
  });

  it('sets data-status attribute', () => {
    render(<StatusBadge status="received" />);
    expect(screen.getByText('Received')).toHaveAttribute('data-status', 'received');
  });

  it('maps known status values via STATUS_LABELS', () => {
    render(<StatusBadge status="received" />);
    expect(screen.getByText('Received')).toBeInTheDocument();
  });

  it('falls back to the status string for unknown statuses', () => {
    render(<StatusBadge status="custom-status" />);
    expect(screen.getByText('custom-status')).toBeInTheDocument();
  });

  it('uses an explicit label over STATUS_LABELS', () => {
    render(<StatusBadge status="received" label="Override" />);
    expect(screen.getByText('Override')).toBeInTheDocument();
    expect(screen.queryByText('Received')).not.toBeInTheDocument();
  });

  it('defaults variant to badge', () => {
    render(<StatusBadge status="received" />);
    expect(screen.getByText('Received')).toHaveAttribute('data-variant', 'badge');
  });

  it('applies the pill variant', () => {
    render(<StatusBadge status="received" variant="pill" />);
    expect(screen.getByText('Received')).toHaveAttribute('data-variant', 'pill');
  });
});
