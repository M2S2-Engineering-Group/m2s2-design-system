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
import { buildRankedBarChartConfig } from '@m2s2/utils';
import { RankedBarItem } from '../../models/chart';

@Component({
  selector: 'm2s2-ranked-bar-chart',
  templateUrl: './ranked-bar-chart.component.html',
  styleUrls: ['./ranked-bar-chart.component.scss'],
  standalone: true,
})
export class RankedBarChartComponent {
  data = input.required<RankedBarItem[]>();

  private readonly canvasRef = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');
  private readonly injector = inject(Injector);
  private readonly destroyRef = inject(DestroyRef);
  private chart?: Chart;

  constructor() {
    afterNextRender(() => {
      effect(
        () => {
          const config = buildRankedBarChartConfig(this.data());
          this.chart?.destroy();
          this.chart = new Chart(this.canvasRef().nativeElement, config);
        },
        { injector: this.injector },
      );
    });
    this.destroyRef.onDestroy(() => this.chart?.destroy());
  }
}
