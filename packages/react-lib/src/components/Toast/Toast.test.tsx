import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { Toast } from "./Toast";

describe("Toast", () => {
  it("renders children content", () => {
    render(<Toast onDismiss={() => {}}>Publishing…</Toast>);
    expect(screen.getByText("Publishing…")).toBeInTheDocument();
  });

  it("calls onDismiss when the close button is clicked", async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn();
    render(<Toast onDismiss={onDismiss}>Saved</Toast>);
    await user.click(screen.getByLabelText("Dismiss"));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it("defaults to role=status for info/success", () => {
    render(<Toast onDismiss={() => {}}>Saved</Toast>);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("uses role=alert for the error kind", () => {
    render(
      <Toast kind="error" onDismiss={() => {}}>
        Failed
      </Toast>,
    );
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  describe("accessibility", () => {
    it("has no violations", async () => {
      const { container } = render(
        <Toast onDismiss={() => {}}>Publishing…</Toast>,
      );
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
