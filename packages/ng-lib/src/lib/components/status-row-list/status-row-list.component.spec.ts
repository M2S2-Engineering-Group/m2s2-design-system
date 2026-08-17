import { render, screen } from "@testing-library/angular";
import { axe } from "jest-axe";
import { StatusRowListComponent } from "./status-row-list.component";

describe("StatusRowListComponent", () => {
  const rows = [
    { id: "m2s2site", label: "m2s2site", status: "succeeded" },
    {
      id: "devto",
      label: "devto",
      status: "failed",
      detail: "no prior DEV.to article to update",
    },
  ];

  it("renders a label per row", async () => {
    await render(StatusRowListComponent, { inputs: { rows } });
    expect(screen.getByText("m2s2site")).toBeInTheDocument();
    expect(screen.getByText("devto")).toBeInTheDocument();
  });

  it("renders detail text only when present", async () => {
    await render(StatusRowListComponent, { inputs: { rows } });
    expect(
      screen.getByText("no prior DEV.to article to update"),
    ).toBeInTheDocument();
  });

  it("renders a link only when present", async () => {
    const withLink = [
      {
        id: "m2s2site",
        label: "m2s2site",
        status: "succeeded",
        link: { label: "View →", href: "https://m2s2.io/blog/example" },
      },
    ];
    await render(StatusRowListComponent, { inputs: { rows: withLink } });
    const link = screen.getByRole("link", { name: "View →" });
    expect(link).toHaveAttribute("href", "https://m2s2.io/blog/example");
  });

  it("renders no link when absent", async () => {
    await render(StatusRowListComponent, { inputs: { rows } });
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  describe("accessibility", () => {
    it("has no violations", async () => {
      const { container } = await render(StatusRowListComponent, {
        inputs: { rows },
      });
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
