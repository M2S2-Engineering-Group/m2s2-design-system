import { useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';
import { RankedBarItem } from '@m2s2/models';
import { buildRankedBarChartConfig } from '@m2s2/utils';
import './RankedBarChart.scss';

interface RankedBarChartProps {
  data: RankedBarItem[];
}

export function RankedBarChart({ data }: RankedBarChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const chart = new Chart(canvasRef.current, buildRankedBarChartConfig(data));
    return () => chart.destroy();
  }, [data]);

  return (
    <div className="m2s2-chart">
      <canvas ref={canvasRef} />
    </div>
  );
}
