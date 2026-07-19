import { Component, input } from "@angular/core";
import { RouterLink } from "@angular/router";
import { CtaConfig } from "../../models/cta/cta.model";

@Component({
  selector: "m2s2-cta-section",
  templateUrl: "./cta-section.component.html",
  styleUrls: ["./cta-section.component.scss"],
  standalone: true,
  imports: [RouterLink],
})
export class CtaSectionComponent {
  readonly config = input.required<CtaConfig>();
}
