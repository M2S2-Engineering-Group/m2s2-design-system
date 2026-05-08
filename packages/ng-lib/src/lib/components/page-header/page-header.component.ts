import { Component, input } from '@angular/core';
import { PageHeaderConfig } from '../../models/page-header/page-header.model';

@Component({
  selector: 'm2s2-page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.scss'],
  standalone: true,
})
export class PageHeaderComponent {
  config = input.required<PageHeaderConfig>();
}
