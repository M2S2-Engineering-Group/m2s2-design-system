import { render, screen } from '@testing-library/react';
import { makeProcessSteps } from '@m2s2/utils/testing';
import { ProcessSteps } from './ProcessSteps';

describe('ProcessSteps', () => {
  it('renders each step number', () => {
    render(<ProcessSteps steps={makeProcessSteps(3)} />);
    expect(screen.getByText('01')).toBeInTheDocument();
    expect(screen.getByText('02')).toBeInTheDocument();
    expect(screen.getByText('03')).toBeInTheDocument();
  });

  it('renders each step name', () => {
    render(<ProcessSteps steps={makeProcessSteps(3)} />);
    expect(screen.getByText('Step 1')).toBeInTheDocument();
    expect(screen.getByText('Step 2')).toBeInTheDocument();
    expect(screen.getByText('Step 3')).toBeInTheDocument();
  });

  it('renders each step description', () => {
    render(<ProcessSteps steps={makeProcessSteps(3)} />);
    expect(screen.getByText('Description 1.')).toBeInTheDocument();
    expect(screen.getByText('Description 2.')).toBeInTheDocument();
    expect(screen.getByText('Description 3.')).toBeInTheDocument();
  });
});
