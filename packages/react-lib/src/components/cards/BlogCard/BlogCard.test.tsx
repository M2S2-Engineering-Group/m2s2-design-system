import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { axe } from "jest-axe";
import { BlogCard } from "./BlogCard";

const config = {
  slug: "my-post",
  title: "My First Post",
  date: "2024-06-15",
  summary: "A brief summary.",
  tags: ["Angular", "Testing"],
};

const renderCard = (overrides = {}) =>
  render(
    <MemoryRouter>
      <BlogCard config={{ ...config, ...overrides }} />
    </MemoryRouter>,
  );

describe("BlogCard", () => {
  it("renders the title", () => {
    renderCard();
    expect(screen.getByText("My First Post")).toBeInTheDocument();
  });

  it("renders the formatted date", () => {
    renderCard();
    expect(screen.getByText("June 15, 2024")).toBeInTheDocument();
  });

  it("renders the summary", () => {
    renderCard();
    expect(screen.getByText("A brief summary.")).toBeInTheDocument();
  });

  it("renders the reading time when provided", () => {
    renderCard({ readingTime: 5 });
    expect(screen.getByText("5 min read")).toBeInTheDocument();
  });

  it("does not render a reading time element when omitted", () => {
    renderCard();
    expect(screen.queryByText(/min read/)).not.toBeInTheDocument();
  });

  it("renders the series block when provided", () => {
    renderCard({
      series: { id: "s1", title: "Building the thing", part: 2, total: 4 },
    });
    expect(screen.getByText("Part 2 of 4")).toBeInTheDocument();
    expect(screen.getByText("Building the thing")).toBeInTheDocument();
  });

  it("does not render a series block when omitted", () => {
    const { container } = renderCard();
    expect(container.querySelector(".bc-series")).not.toBeInTheDocument();
  });

  it("renders a cover image when provided", () => {
    renderCard({ coverImage: "https://example.com/cover.jpg" });
    expect(screen.getByRole("img", { name: "My First Post" })).toHaveAttribute(
      "src",
      "https://example.com/cover.jpg",
    );
  });

  it("renders the placeholder cover when no coverImage is provided", () => {
    const { container } = renderCard();
    expect(
      container.querySelector(".bc-cover-placeholder"),
    ).toBeInTheDocument();
  });

  describe("accessibility", () => {
    it("has no violations (default)", async () => {
      const { container } = renderCard();
      expect(await axe(container)).toHaveNoViolations();
    });

    it("has no violations (with cover image)", async () => {
      const { container } = renderCard({
        coverImage: "https://example.com/cover.jpg",
      });
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
