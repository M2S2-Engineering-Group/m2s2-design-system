import { Component, input } from '@angular/core';
import { CardVariant } from '../../../models/card/card.model';

@Component({
  selector: 'm2s2-card',
  templateUrl: './base-card.component.html',
  styleUrls: ['./base-card.component.scss'],
  standalone: true,
  host: {
    '[class.featured]': 'featured()',
    '[attr.data-variant]': 'variant()',
  },
})
export class BaseCardComponent {
  featured = input(false);
  variant  = input<CardVariant>('default');
}
