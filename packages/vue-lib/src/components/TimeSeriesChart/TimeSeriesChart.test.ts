import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import TimeSeriesChart from './TimeSeriesChart.vue';

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

describe('TimeSeriesChart', () => {
  const data = [
    { date: '2026-07-01', values: { Visits: 10 } },
    { date: '2026-07-02', values: { Visits: 20 } },
  ];

  beforeEach(() => {
    mockChartCtor.mockClear();
    mockDestroy.mockClear();
  });

  it('renders a canvas element', () => {
    const wrapper = mount(TimeSeriesChart, { props: { data } });
    expect(wrapper.find('canvas').exists()).toBe(true);
  });

  it('instantiates Chart.js with the canvas element and a config built from the data', () => {
    mount(TimeSeriesChart, { props: { data } });
    expect(mockChartCtor).toHaveBeenCalledTimes(1);
    const [canvasArg, config] = mockChartCtor.mock.calls[0];
    expect(canvasArg).toBeInstanceOf(HTMLCanvasElement);
    expect(config.data.datasets[0].data).toEqual([10, 20]);
  });

  it('destroys the previous chart instance when data changes', async () => {
    const wrapper = mount(TimeSeriesChart, { props: { data } });
    expect(mockDestroy).not.toHaveBeenCalled();

    await wrapper.setProps({ data: [{ date: '2026-07-03', values: { Visits: 30 } }] });

    expect(mockDestroy).toHaveBeenCalledTimes(1);
    expect(mockChartCtor).toHaveBeenCalledTimes(2);
  });

  it('destroys the chart instance on unmount', () => {
    const wrapper = mount(TimeSeriesChart, { props: { data } });
    wrapper.unmount();
    expect(mockDestroy).toHaveBeenCalledTimes(1);
  });
});
