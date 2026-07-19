import type { ChartConfiguration } from "chart.js";
import type { RankedBarItem, TimeSeriesPoint } from "@m2s2/models";

const SERIES_COLORS = [
  "--color-primary",
  "--color-secondary",
  "--color-warning",
  "--color-error",
];

function cssVar(name: string, fallback: string): string {
  if (typeof document === "undefined") return fallback;
  return (
    getComputedStyle(document.documentElement).getPropertyValue(name).trim() ||
    fallback
  );
}

function formatAxisDate(isoDate: string): string {
  return new Date(isoDate + "T00:00:00").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function sharedScaleStyle() {
  return {
    grid: { color: cssVar("--color-border-subtle", "#3a3a3a") },
    ticks: {
      color: cssVar("--color-on-surface-muted", "#9a9a9a"),
      font: { family: cssVar("--font-family-mono", "monospace") },
    },
  };
}

/**
 * Builds a Chart.js line/bar config for one or more named series plotted
 * against a shared set of dates (e.g. daily Visits + Page Views).
 */
export function buildTimeSeriesChartConfig(
  points: TimeSeriesPoint[],
  type: "line" | "bar" = "line",
): ChartConfiguration {
  const seriesNames = Array.from(
    new Set(points.flatMap((p) => Object.keys(p.values))),
  );

  const datasets = seriesNames.map((name, i) => {
    const color = cssVar(SERIES_COLORS[i % SERIES_COLORS.length], "#8884d8");
    return {
      label: name,
      data: points.map((p) => p.values[name] ?? 0),
      borderColor: color,
      backgroundColor: color,
      tension: 0.3,
      borderWidth: 2,
    };
  });

  return {
    type,
    data: { labels: points.map((p) => formatAxisDate(p.date)), datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: "index", intersect: false },
      scales: {
        x: sharedScaleStyle(),
        y: { ...sharedScaleStyle(), beginAtZero: true },
      },
      plugins: {
        legend: {
          display: seriesNames.length > 1,
          labels: { color: cssVar("--color-on-surface", "#e0e0e0") },
        },
      },
    },
  };
}

/**
 * Builds a horizontal Chart.js bar config for a ranked list (e.g. top pages,
 * top referrers). Bar length is always scaled against the max value present.
 */
export function buildRankedBarChartConfig(
  items: RankedBarItem[],
): ChartConfiguration {
  const color = cssVar("--color-secondary", "#61dafb");

  return {
    type: "bar",
    data: {
      labels: items.map((i) => i.label),
      datasets: [
        {
          data: items.map((i) => i.value),
          backgroundColor: color,
          borderRadius: 4,
        },
      ],
    },
    options: {
      indexAxis: "y",
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: { ...sharedScaleStyle(), beginAtZero: true },
        y: sharedScaleStyle(),
      },
      plugins: { legend: { display: false } },
    },
  };
}
