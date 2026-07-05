import { render } from '@testing-library/angular';
import { TimeSeriesChartComponent } from './time-series-chart.component';

const mockDestroy = jest.fn();
const mockChartCtor = jest.fn();

jest.mock('chart.js/auto', () => ({
  Chart: jest.fn().mockImplementation(function (this: { destroy: jest.Mock }, ...args: unknown[]) {
    mockChartCtor(...args);
    this.destroy = mockDestroy;
    return this;
  }),
}));

describe('TimeSeriesChartComponent', () => {
  const data = [
    { date: '2026-07-01', values: { Visits: 10 } },
    { date: '2026-07-02', values: { Visits: 20 } },
  ];

  beforeEach(() => {
    mockChartCtor.mockClear();
    mockDestroy.mockClear();
  });

  it('renders a canvas element', async () => {
    const { container, fixture } = await render(TimeSeriesChartComponent, { inputs: { data } });
    await fixture.whenStable();
    expect(container.querySelector('canvas')).toBeInTheDocument();
  });

  it('instantiates Chart.js once the view has rendered', async () => {
    const { fixture } = await render(TimeSeriesChartComponent, { inputs: { data } });
    await fixture.whenStable();
    expect(mockChartCtor).toHaveBeenCalledTimes(1);
    const [canvasArg, config] = mockChartCtor.mock.calls[0];
    expect(canvasArg).toBeInstanceOf(HTMLCanvasElement);
    expect(config.data.datasets[0].data).toEqual([10, 20]);
  });

  it('destroys the previous chart instance when data changes', async () => {
    const { fixture } = await render(TimeSeriesChartComponent, { inputs: { data } });
    await fixture.whenStable();
    expect(mockDestroy).not.toHaveBeenCalled();

    fixture.componentRef.setInput('data', [{ date: '2026-07-03', values: { Visits: 30 } }]);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(mockDestroy).toHaveBeenCalledTimes(1);
    expect(mockChartCtor).toHaveBeenCalledTimes(2);
  });
});
