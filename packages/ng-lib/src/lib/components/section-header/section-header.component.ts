import { Component, input } from "@angular/core";
import { SectionHeaderConfig } from "../../models/section-header/section-header.model";

@Component({
  selector: "m2s2-section-header",
  templateUrl: "./section-header.component.html",
  styleUrls: ["./section-header.component.scss"],
  standalone: true,
})
export class SectionHeaderComponent {
  config = input.required<SectionHeaderConfig>();
}
