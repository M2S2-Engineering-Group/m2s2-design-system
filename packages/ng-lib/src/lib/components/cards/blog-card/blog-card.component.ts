import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { formatBlogDate, formatTagLabel } from '@m2s2/utils';
import { BlogCardConfig } from '../../../models/card/card.model';

@Component({
  selector: 'm2s2-blog-card',
  templateUrl: './blog-card.component.html',
  styleUrls: ['./blog-card.component.scss'],
  standalone: true,
  imports: [RouterLink],
})
export class BlogCardComponent {
  config = input.required<BlogCardConfig>();

  readonly formatDate = formatBlogDate;
  readonly tagLabel = formatTagLabel;
}
