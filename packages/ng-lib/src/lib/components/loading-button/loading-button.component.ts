import { ChangeDetectionStrategy, Component, input } from "@angular/core";

@Component({
  selector: "m2s2-loading-button",
  template: `
    <button [disabled]="loading() || disabled()" [attr.aria-busy]="loading()">
      @if (loading()) {
        <span class="m2s2-btn-spinner" aria-hidden="true"></span>
      }
      @if (!loading() || !loadingText()) {
        <ng-content />
      } @else {
        {{ loadingText() }}
      }
    </button>
  `,
  styleUrls: ["./loading-button.component.scss"],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingButtonComponent {
  loading = input<boolean>(false);
  loadingText = input<string | undefined>(undefined);
  disabled = input<boolean>(false);
}
