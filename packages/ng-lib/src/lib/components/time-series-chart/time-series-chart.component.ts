import {
  Component,
  DestroyRef,
  ElementRef,
  Injector,
  afterNextRender,
  effect,
  inject,
  input,
  viewChild,
} from '@angular/core';
import { Chart } from 'chart.js/auto';
import { buildTimeSeriesChartConfig } from '@m2s2/utils';
import { TimeSeriesPoint } from '../../models/chart';

@Component({
  selector: 'm2s2-time-series-chart',
  templateUrl: './time-series-chart.component.html',
  styleUrls: ['./time-series-chart.component.scss'],
  standalone: true,
})
export class TimeSeriesChartComponent {
  data = input.required<TimeSeriesPoint[]>();
  type = input<'line' | 'bar'>('line');

  private readonly canvasRef = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');
  private readonly injector = inject(Injector);
  private readonly destroyRef = inject(DestroyRef);
  private chart?: Chart;

  constructor() {
    afterNextRender(() => {
      effect(
        () => {
          const config = buildTimeSeriesChartConfig(this.data(), this.type());
          this.chart?.destroy();
          this.chart = new Chart(this.canvasRef().nativeElement, config);
        },
        { injector: this.injector },
      );
    });
    this.destroyRef.onDestroy(() => this.chart?.destroy());
  }
}
