import { render, screen } from "@testing-library/react";
import { makeFeatureCardConfig } from "@m2s2/utils/testing";
import { axe } from "jest-axe";
import { FeatureCard } from "./FeatureCard";

describe("FeatureCard", () => {
  it("renders the title", () => {
    render(
      <FeatureCard
        config={makeFeatureCardConfig({ title: "Fast Delivery" })}
      />,
    );
    expect(
      screen.getByRole("heading", { name: "Fast Delivery" }),
    ).toBeInTheDocument();
  });

  it("renders the body", () => {
    render(
      <FeatureCard
        config={makeFeatureCardConfig({ body: "Ships in 24 hours." })}
      />,
    );
    expect(screen.getByText("Ships in 24 hours.")).toBeInTheDocument();
  });

  it("renders items list when items are provided", () => {
    render(
      <FeatureCard
        config={makeFeatureCardConfig({
          items: ["Item A", "Item B", "Item C"],
        })}
      />,
    );
    expect(screen.getByRole("list")).toBeInTheDocument();
    expect(screen.getByText("Item A")).toBeInTheDocument();
    expect(screen.getByText("Item B")).toBeInTheDocument();
    expect(screen.getByText("Item C")).toBeInTheDocument();
  });

  it("does not render a list when items is absent", () => {
    render(
      <FeatureCard config={makeFeatureCardConfig({ items: undefined })} />,
    );
    expect(screen.queryByRole("list")).not.toBeInTheDocument();
  });

  it("does not render a list when items is empty", () => {
    render(<FeatureCard config={makeFeatureCardConfig({ items: [] })} />);
    expect(screen.queryByRole("list")).not.toBeInTheDocument();
  });

  it("renders the note when provided", () => {
    render(
      <FeatureCard
        config={makeFeatureCardConfig({ note: "Limited time offer." })}
      />,
    );
    expect(screen.getByText("Limited time offer.")).toBeInTheDocument();
  });

  it("does not render a note when absent", () => {
    render(<FeatureCard config={makeFeatureCardConfig({ note: undefined })} />);
    expect(screen.queryByText(/Limited/)).not.toBeInTheDocument();
  });

  describe("accessibility", () => {
    it("has no violations (default)", async () => {
      const { container } = render(
        <FeatureCard
          config={makeFeatureCardConfig({ title: "Fast Delivery" })}
        />,
      );
      expect(await axe(container)).toHaveNoViolations();
    });

    it("has no violations (with items and note)", async () => {
      const { container } = render(
        <FeatureCard
          config={makeFeatureCardConfig({
            items: ["Item A", "Item B"],
            note: "Limited time.",
          })}
        />,
      );
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
