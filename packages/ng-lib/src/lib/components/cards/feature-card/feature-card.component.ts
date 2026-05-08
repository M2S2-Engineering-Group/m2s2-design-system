import { Component, input } from '@angular/core';
import { BaseCardComponent } from '../base-card/base-card.component';
import { FeatureCardConfig } from '../../../models/card/card.model';

@Component({
  selector: 'm2s2-feature-card',
  templateUrl: './feature-card.component.html',
  styleUrls: ['./feature-card.component.scss'],
  standalone: true,
  imports: [BaseCardComponent],
  host: { style: 'display: contents' },
})
export class FeatureCardComponent {
  config = input.required<FeatureCardConfig>();
}
