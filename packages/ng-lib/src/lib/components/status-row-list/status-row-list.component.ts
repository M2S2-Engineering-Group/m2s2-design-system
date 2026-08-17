import { Component, input } from "@angular/core";
import { StatusBadgeComponent } from "../status-badge/status-badge.component";
import { StatusRowItem } from "../../models/status-row-list/status-row-list.model";

@Component({
  selector: "m2s2-status-row-list",
  templateUrl: "./status-row-list.component.html",
  styleUrls: ["./status-row-list.component.scss"],
  standalone: true,
  imports: [StatusBadgeComponent],
})
export class StatusRowListComponent {
  rows = input.required<StatusRowItem[]>();
}
