import { render } from '@testing-library/angular';
import { RankedBarChartComponent } from './ranked-bar-chart.component';

const mockDestroy = jest.fn();
const mockChartCtor = jest.fn();

jest.mock('chart.js/auto', () => ({
  Chart: jest.fn().mockImplementation(function (this: { destroy: jest.Mock }, ...args: unknown[]) {
    mockChartCtor(...args);
    this.destroy = mockDestroy;
    return this;
  }),
}));

describe('RankedBarChartComponent', () => {
  const data = [
    { label: '/blog', value: 42 },
    { label: '/about', value: 10 },
  ];

  beforeEach(() => {
    mockChartCtor.mockClear();
    mockDestroy.mockClear();
  });

  it('renders a canvas element', async () => {
    const { container, fixture } = await render(RankedBarChartComponent, { inputs: { data } });
    await fixture.whenStable();
    expect(container.querySelector('canvas')).toBeInTheDocument();
  });

  it('instantiates Chart.js as a horizontal bar chart with the given data', async () => {
    const { fixture } = await render(RankedBarChartComponent, { inputs: { data } });
    await fixture.whenStable();
    expect(mockChartCtor).toHaveBeenCalledTimes(1);
    const [canvasArg, config] = mockChartCtor.mock.calls[0];
    expect(canvasArg).toBeInstanceOf(HTMLCanvasElement);
    expect(config.options.indexAxis).toBe('y');
    expect(config.data.labels).toEqual(['/blog', '/about']);
    expect(config.data.datasets[0].data).toEqual([42, 10]);
  });

  it('destroys the previous chart instance when data changes', async () => {
    const { fixture } = await render(RankedBarChartComponent, { inputs: { data } });
    await fixture.whenStable();
    expect(mockDestroy).not.toHaveBeenCalled();

    fixture.componentRef.setInput('data', [{ label: '/contact', value: 5 }]);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(mockDestroy).toHaveBeenCalledTimes(1);
    expect(mockChartCtor).toHaveBeenCalledTimes(2);
  });
});
