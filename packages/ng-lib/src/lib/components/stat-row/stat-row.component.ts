import { Component, input } from '@angular/core';
import { StatItem } from '../../models/stat-row/stat-row.model';

@Component({
  selector: 'm2s2-stat-row',
  templateUrl: './stat-row.component.html',
  styleUrls: ['./stat-row.component.scss'],
  standalone: true,
})
export class StatRowComponent {
  stats = input.required<StatItem[]>();
}
