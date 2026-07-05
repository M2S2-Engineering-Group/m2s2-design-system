export interface TimeSeriesPoint {
  date: string; // ISO date, e.g. "2026-07-01"
  values: Record<string, number>; // series name -> value, e.g. { Visits: 120, "Page Views": 340 }
}

export interface RankedBarItem {
  label: string;
  value: number;
}
