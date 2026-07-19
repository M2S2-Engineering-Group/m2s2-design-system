import { render, screen } from "@testing-library/angular";
import { axe } from "jest-axe";
import { StatusBadgeComponent } from "./status-badge.component";

describe("StatusBadgeComponent", () => {
  it("renders the mapped display label", async () => {
    await render(StatusBadgeComponent, { inputs: { status: "received" } });
    expect(screen.getByText("Received")).toBeInTheDocument();
  });

  it("sets data-status on the host element", async () => {
    await render(StatusBadgeComponent, { inputs: { status: "received" } });
    expect(screen.getByText("Received")).toHaveAttribute(
      "data-status",
      "received",
    );
  });

  it("defaults data-variant to badge", async () => {
    await render(StatusBadgeComponent, { inputs: { status: "received" } });
    expect(screen.getByText("Received")).toHaveAttribute(
      "data-variant",
      "badge",
    );
  });

  it("applies the pill variant", async () => {
    await render(StatusBadgeComponent, {
      inputs: { status: "received", variant: "pill" },
    });
    expect(screen.getByText("Received")).toHaveAttribute(
      "data-variant",
      "pill",
    );
  });

  it("falls back to the raw status string for unknown statuses", async () => {
    await render(StatusBadgeComponent, { inputs: { status: "custom-status" } });
    expect(screen.getByText("custom-status")).toBeInTheDocument();
  });

  it("uses an explicit label over STATUS_LABELS", async () => {
    await render(StatusBadgeComponent, {
      inputs: { status: "received", label: "Override" },
    });
    expect(screen.getByText("Override")).toBeInTheDocument();
    expect(screen.queryByText("Received")).not.toBeInTheDocument();
  });

  describe("accessibility", () => {
    it("has no violations with default badge variant", async () => {
      const { container } = await render(StatusBadgeComponent, {
        inputs: { status: "received" },
      });
      expect(await axe(container)).toHaveNoViolations();
    });

    it("has no violations with pill variant", async () => {
      const { container } = await render(StatusBadgeComponent, {
        inputs: { status: "received", variant: "pill" },
      });
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
