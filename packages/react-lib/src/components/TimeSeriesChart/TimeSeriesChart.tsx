import { useEffect, useRef } from "react";
import { Chart } from "chart.js/auto";
import { TimeSeriesPoint } from "@m2s2/models";
import { buildTimeSeriesChartConfig } from "@m2s2/utils";
import "./TimeSeriesChart.scss";

interface TimeSeriesChartProps {
  data: TimeSeriesPoint[];
  type?: "line" | "bar";
}

export function TimeSeriesChart({ data, type = "line" }: TimeSeriesChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const chart = new Chart(
      canvasRef.current,
      buildTimeSeriesChartConfig(data, type),
    );
    return () => chart.destroy();
  }, [data, type]);

  return (
    <div className="m2s2-chart">
      <canvas ref={canvasRef} />
    </div>
  );
}
