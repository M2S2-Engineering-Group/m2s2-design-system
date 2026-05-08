import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
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

  formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric',
    });
  }
}
