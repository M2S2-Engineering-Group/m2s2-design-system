import { describe, it, expect } from "vitest";
import { buildRankedBarChartConfig, buildTimeSeriesChartConfig } from "./chart";

describe("buildTimeSeriesChartConfig", () => {
  it("builds one dataset per series key present across the points", () => {
    const config = buildTimeSeriesChartConfig([
      { date: "2026-07-01", values: { Visits: 10, "Page Views": 20 } },
      { date: "2026-07-02", values: { Visits: 15, "Page Views": 25 } },
    ]);
    expect(config.data.datasets).toHaveLength(2);
    expect(config.data.datasets.map((d) => d.label)).toEqual([
      "Visits",
      "Page Views",
    ]);
    expect(config.data.datasets[0].data).toEqual([10, 15]);
    expect(config.data.datasets[1].data).toEqual([20, 25]);
    expect(config.data.labels).toHaveLength(2);
  });

  it("defaults missing series values to 0 for a given point", () => {
    const config = buildTimeSeriesChartConfig([
      { date: "2026-07-01", values: { Visits: 10 } },
      { date: "2026-07-02", values: { Visits: 15, "Page Views": 25 } },
    ]);
    const pageViews = config.data.datasets.find(
      (d) => d.label === "Page Views",
    );
    expect(pageViews?.data).toEqual([0, 25]);
  });

  it("defaults to a line chart when no type is given", () => {
    const config = buildTimeSeriesChartConfig([
      { date: "2026-07-01", values: { Visits: 1 } },
    ]);
    expect(config.type).toBe("line");
  });

  it("respects an explicit bar type", () => {
    const config = buildTimeSeriesChartConfig(
      [{ date: "2026-07-01", values: { Visits: 1 } }],
      "bar",
    );
    expect(config.type).toBe("bar");
  });

  it("hides the legend for a single series", () => {
    const config = buildTimeSeriesChartConfig([
      { date: "2026-07-01", values: { Visits: 1 } },
    ]);
    expect(config.options?.plugins?.legend?.display).toBe(false);
  });
});

describe("buildRankedBarChartConfig", () => {
  it("builds a horizontal bar config with one dataset", () => {
    const config = buildRankedBarChartConfig([
      { label: "/blog", value: 42 },
      { label: "/about", value: 10 },
    ]);
    expect(config.type).toBe("bar");
    expect(config.options?.indexAxis).toBe("y");
    expect(config.data.labels).toEqual(["/blog", "/about"]);
    expect(config.data.datasets[0].data).toEqual([42, 10]);
  });

  it("does not sort or filter — callers pass pre-sorted data", () => {
    const config = buildRankedBarChartConfig([
      { label: "low", value: 1 },
      { label: "high", value: 100 },
    ]);
    expect(config.data.labels).toEqual(["low", "high"]);
  });
});
