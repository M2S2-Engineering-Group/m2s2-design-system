import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from "@angular/core";
import {
  STATUS_LABELS,
  StatusBadgeVariant,
} from "../../models/status-badge/status-badge.model";

@Component({
  selector: "m2s2-status-badge",
  template: `{{ displayLabel() }}`,
  styleUrls: ["./status-badge.component.scss"],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: "status",
    "[attr.data-status]": "status()",
    "[attr.data-variant]": "variant()",
  },
})
export class StatusBadgeComponent {
  status = input.required<string>();
  label = input<string | undefined>(undefined);
  variant = input<StatusBadgeVariant>("badge");

  displayLabel = computed(
    () => this.label() ?? STATUS_LABELS[this.status()] ?? this.status(),
  );
}
