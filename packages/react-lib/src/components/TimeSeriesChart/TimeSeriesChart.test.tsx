import { render } from "@testing-library/react";
import { vi } from "vitest";
import { TimeSeriesChart } from "./TimeSeriesChart";

const { mockDestroy, mockChartCtor } = vi.hoisted(() => ({
  mockDestroy: vi.fn(),
  mockChartCtor: vi.fn(),
}));

vi.mock("chart.js/auto", () => ({
  Chart: vi.fn().mockImplementation(function (
    this: { destroy: typeof mockDestroy },
    ...args: unknown[]
  ) {
    mockChartCtor(...args);
    this.destroy = mockDestroy;
    return this;
  }),
}));

describe("TimeSeriesChart", () => {
  const data = [
    { date: "2026-07-01", values: { Visits: 10 } },
    { date: "2026-07-02", values: { Visits: 20 } },
  ];

  beforeEach(() => {
    mockChartCtor.mockClear();
    mockDestroy.mockClear();
  });

  it("renders a canvas element", () => {
    const { container } = render(<TimeSeriesChart data={data} />);
    expect(container.querySelector("canvas")).toBeInTheDocument();
  });

  it("instantiates Chart.js with the canvas element and a config built from the data", () => {
    render(<TimeSeriesChart data={data} />);
    expect(mockChartCtor).toHaveBeenCalledTimes(1);
    const [canvasArg, config] = mockChartCtor.mock.calls[0];
    expect(canvasArg).toBeInstanceOf(HTMLCanvasElement);
    expect(config.data.datasets[0].data).toEqual([10, 20]);
  });

  it("destroys the previous chart instance when data changes", () => {
    const { rerender } = render(<TimeSeriesChart data={data} />);
    expect(mockDestroy).not.toHaveBeenCalled();

    rerender(
      <TimeSeriesChart
        data={[{ date: "2026-07-03", values: { Visits: 30 } }]}
      />,
    );

    expect(mockDestroy).toHaveBeenCalledTimes(1);
    expect(mockChartCtor).toHaveBeenCalledTimes(2);
  });

  it("destroys the chart instance on unmount", () => {
    const { unmount } = render(<TimeSeriesChart data={data} />);
    unmount();
    expect(mockDestroy).toHaveBeenCalledTimes(1);
  });
});
