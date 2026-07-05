import { render } from '@testing-library/react';
import { vi } from 'vitest';
import { RankedBarChart } from './RankedBarChart';

const { mockDestroy, mockChartCtor } = vi.hoisted(() => ({
  mockDestroy: vi.fn(),
  mockChartCtor: vi.fn(),
}));

vi.mock('chart.js/auto', () => ({
  Chart: vi.fn().mockImplementation(function (this: { destroy: typeof mockDestroy }, ...args: unknown[]) {
    mockChartCtor(...args);
    this.destroy = mockDestroy;
    return this;
  }),
}));

describe('RankedBarChart', () => {
  const data = [
    { label: '/blog', value: 42 },
    { label: '/about', value: 10 },
  ];

  beforeEach(() => {
    mockChartCtor.mockClear();
    mockDestroy.mockClear();
  });

  it('renders a canvas element', () => {
    const { container } = render(<RankedBarChart data={data} />);
    expect(container.querySelector('canvas')).toBeInTheDocument();
  });

  it('instantiates Chart.js as a horizontal bar chart with the given data', () => {
    render(<RankedBarChart data={data} />);
    expect(mockChartCtor).toHaveBeenCalledTimes(1);
    const [canvasArg, config] = mockChartCtor.mock.calls[0];
    expect(canvasArg).toBeInstanceOf(HTMLCanvasElement);
    expect(config.options.indexAxis).toBe('y');
    expect(config.data.labels).toEqual(['/blog', '/about']);
    expect(config.data.datasets[0].data).toEqual([42, 10]);
  });

  it('destroys the previous chart instance when data changes', () => {
    const { rerender } = render(<RankedBarChart data={data} />);
    expect(mockDestroy).not.toHaveBeenCalled();

    rerender(<RankedBarChart data={[{ label: '/contact', value: 5 }]} />);

    expect(mockDestroy).toHaveBeenCalledTimes(1);
    expect(mockChartCtor).toHaveBeenCalledTimes(2);
  });
});
