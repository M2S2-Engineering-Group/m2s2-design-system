import { Component, input } from "@angular/core";
import { FooterConfig } from "../../models/footer/footer.model";

@Component({
  selector: "m2s2-footer",
  templateUrl: "./footer.component.html",
  styleUrls: ["./footer.component.scss"],
  standalone: true,
})
export class FooterComponent {
  readonly config = input.required<FooterConfig>();
  readonly currentYear = new Date().getFullYear();
}
