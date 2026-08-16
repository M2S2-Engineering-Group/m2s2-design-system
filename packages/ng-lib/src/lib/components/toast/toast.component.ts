import { Component, computed, input, output } from "@angular/core";
import { ToastKind } from "../../models/toast/toast.model";

@Component({
  selector: "m2s2-toast",
  templateUrl: "./toast.component.html",
  styleUrls: ["./toast.component.scss"],
  standalone: true,
  host: {
    "[attr.role]": "role()",
    "[attr.data-kind]": "kind()",
  },
})
export class ToastComponent {
  kind = input<ToastKind>("info");
  dismiss = output<void>();

  // Errors are assertive (announced immediately, interrupting); info/success
  // are polite (announced when the screen reader is next idle) — matches
  // each kind's actual urgency instead of one role for every toast.
  role = computed(() => (this.kind() === "error" ? "alert" : "status"));
}
