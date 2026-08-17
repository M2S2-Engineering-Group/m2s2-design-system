import { Component } from "@angular/core";
import { render, screen } from "@testing-library/angular";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { ToastComponent } from "./toast.component";

@Component({
  selector: "m2s2-toast-host",
  standalone: true,
  imports: [ToastComponent],
  template: `<m2s2-toast [kind]="kind" (dismiss)="onDismiss()"
    >Publishing…</m2s2-toast
  >`,
})
class ToastHostComponent {
  kind: "info" | "success" | "error" = "info";
  dismissed = false;
  onDismiss(): void {
    this.dismissed = true;
  }
}

describe("ToastComponent", () => {
  it("renders projected content", async () => {
    await render(ToastHostComponent);
    expect(screen.getByText("Publishing…")).toBeInTheDocument();
  });

  it("emits dismiss when the close button is clicked", async () => {
    const user = userEvent.setup();
    const { fixture } = await render(ToastHostComponent);
    await user.click(screen.getByLabelText("Dismiss"));
    expect(fixture.componentInstance.dismissed).toBe(true);
  });

  it("defaults to role=status for info/success", async () => {
    await render(`<m2s2-toast>Saved</m2s2-toast>`, {
      imports: [ToastComponent],
    });
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("uses role=alert for the error kind", async () => {
    await render(`<m2s2-toast kind="error">Failed</m2s2-toast>`, {
      imports: [ToastComponent],
    });
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  describe("accessibility", () => {
    it("has no violations", async () => {
      const { container } = await render(ToastHostComponent);
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
