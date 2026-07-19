import { render, screen } from "@testing-library/angular";
import { axe } from "jest-axe";
import { ProcessStepsComponent } from "./process-steps.component";

describe("ProcessStepsComponent", () => {
  const steps = [
    { num: "01", name: "Discovery", desc: "We learn about your goals." },
    { num: "02", name: "Design", desc: "We craft the solution." },
    { num: "03", name: "Deliver", desc: "We ship and support." },
  ];

  it("renders every step number, name, and description", async () => {
    await render(ProcessStepsComponent, { inputs: { steps } });
    for (const step of steps) {
      expect(screen.getByText(step.num)).toBeInTheDocument();
      expect(screen.getByText(step.name)).toBeInTheDocument();
      expect(screen.getByText(step.desc)).toBeInTheDocument();
    }
  });

  it("applies ps-num, ps-name, and ps-desc classes", async () => {
    await render(ProcessStepsComponent, { inputs: { steps } });
    expect(screen.getByText("01")).toHaveClass("ps-num");
    expect(screen.getByText("Discovery")).toHaveClass("ps-name");
    expect(screen.getByText("We learn about your goals.")).toHaveClass(
      "ps-desc",
    );
  });

  it("renders dividers between steps but not after the last one", async () => {
    const { container } = await render(ProcessStepsComponent, {
      inputs: { steps },
    });
    const dividers = container.querySelectorAll(".ps-divider");
    expect(dividers.length).toBe(steps.length - 1);
  });

  it("renders a single step with no dividers", async () => {
    const { container } = await render(ProcessStepsComponent, {
      inputs: { steps: [{ num: "01", name: "Only", desc: "Just one." }] },
    });
    expect(container.querySelectorAll(".ps-divider").length).toBe(0);
  });

  describe("accessibility", () => {
    it("has no violations with multiple steps", async () => {
      const { container } = await render(ProcessStepsComponent, {
        inputs: { steps },
      });
      expect(await axe(container)).toHaveNoViolations();
    });

    it("has no violations with a single step", async () => {
      const { container } = await render(ProcessStepsComponent, {
        inputs: { steps: [{ num: "01", name: "Only", desc: "Just one." }] },
      });
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
