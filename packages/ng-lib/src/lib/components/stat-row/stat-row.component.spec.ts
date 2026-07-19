import { render, screen } from "@testing-library/angular";
import { axe } from "jest-axe";
import { StatRowComponent } from "./stat-row.component";

describe("StatRowComponent", () => {
  const stats = [
    { value: "120", label: "Projects" },
    { value: "40+", label: "Clients" },
    { value: "5", label: "Years" },
  ];

  it("renders all stat values", async () => {
    await render(StatRowComponent, { inputs: { stats } });
    expect(screen.getByText("120")).toBeInTheDocument();
    expect(screen.getByText("40+")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("renders all stat labels", async () => {
    await render(StatRowComponent, { inputs: { stats } });
    expect(screen.getByText("Projects")).toBeInTheDocument();
    expect(screen.getByText("Clients")).toBeInTheDocument();
    expect(screen.getByText("Years")).toBeInTheDocument();
  });

  it("applies sr-value and sr-label classes", async () => {
    await render(StatRowComponent, { inputs: { stats } });
    expect(screen.getByText("120")).toHaveClass("sr-value");
    expect(screen.getByText("Projects")).toHaveClass("sr-label");
  });

  it("renders dividers between stats but not after the last one", async () => {
    const { container } = await render(StatRowComponent, { inputs: { stats } });
    const dividers = container.querySelectorAll(".sr-divider");
    expect(dividers.length).toBe(stats.length - 1);
  });

  describe("accessibility", () => {
    it("has no violations", async () => {
      const { container } = await render(StatRowComponent, {
        inputs: { stats },
      });
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
