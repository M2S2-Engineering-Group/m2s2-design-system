import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { SectionHeader } from "./SectionHeader";

describe("SectionHeader", () => {
  it("renders the label in an h2", () => {
    render(<SectionHeader config={{ label: "Our Services" }} />);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      "Our Services",
    );
  });

  it("applies the m2s2-section-header class to the container", () => {
    const { container } = render(<SectionHeader config={{ label: "Test" }} />);
    expect(container.firstChild).toHaveClass("m2s2-section-header");
  });

  it("applies the sh-label class to the heading", () => {
    render(<SectionHeader config={{ label: "Test" }} />);
    expect(screen.getByRole("heading")).toHaveClass("sh-label");
  });

  it("renders the subtitle when provided", () => {
    render(
      <SectionHeader config={{ label: "Test", subtitle: "A subtitle" }} />,
    );
    expect(screen.getByText("A subtitle")).toBeInTheDocument();
  });

  it("applies the sh-subtitle class to the subtitle", () => {
    render(<SectionHeader config={{ label: "Test", subtitle: "Sub" }} />);
    expect(screen.getByText("Sub")).toHaveClass("sh-subtitle");
  });

  it("does not render a subtitle element when omitted", () => {
    render(<SectionHeader config={{ label: "Test" }} />);
    expect(screen.queryByText(/subtitle/i)).not.toBeInTheDocument();
  });

  describe("accessibility", () => {
    it("has no violations (label only)", async () => {
      const { container } = render(
        <SectionHeader config={{ label: "Our Services" }} />,
      );
      expect(await axe(container)).toHaveNoViolations();
    });

    it("has no violations (with subtitle)", async () => {
      const { container } = render(
        <SectionHeader
          config={{ label: "Our Services", subtitle: "What we offer" }}
        />,
      );
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
