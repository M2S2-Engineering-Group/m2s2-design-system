import { render, screen } from "@testing-library/angular";
import { axe } from "jest-axe";
import { BaseCardComponent } from "./base-card.component";

describe("BaseCardComponent", () => {
  it("projects slotted content", async () => {
    await render(`<m2s2-card>Card content</m2s2-card>`, {
      imports: [BaseCardComponent],
    });
    expect(screen.getByText("Card content")).toBeInTheDocument();
  });

  it("adds the featured class to the host when featured is true", async () => {
    await render(`<m2s2-card [featured]="true">Content</m2s2-card>`, {
      imports: [BaseCardComponent],
    });
    expect(document.querySelector("m2s2-card")).toHaveClass("featured");
  });

  it("does not add the featured class when featured is false", async () => {
    await render(`<m2s2-card [featured]="false">Content</m2s2-card>`, {
      imports: [BaseCardComponent],
    });
    expect(document.querySelector("m2s2-card")).not.toHaveClass("featured");
  });

  it("sets the data-variant attribute on the host", async () => {
    await render(`<m2s2-card variant="raised">Content</m2s2-card>`, {
      imports: [BaseCardComponent],
    });
    expect(document.querySelector("m2s2-card")).toHaveAttribute(
      "data-variant",
      "raised",
    );
  });

  it("defaults data-variant to default", async () => {
    await render(`<m2s2-card>Content</m2s2-card>`, {
      imports: [BaseCardComponent],
    });
    expect(document.querySelector("m2s2-card")).toHaveAttribute(
      "data-variant",
      "default",
    );
  });

  describe("accessibility", () => {
    it("has no violations with default card", async () => {
      const { container } = await render(
        `<m2s2-card>Card content</m2s2-card>`,
        {
          imports: [BaseCardComponent],
        },
      );
      expect(await axe(container)).toHaveNoViolations();
    });

    it("has no violations with featured variant", async () => {
      const { container } = await render(
        `<m2s2-card [featured]="true">Featured content</m2s2-card>`,
        {
          imports: [BaseCardComponent],
        },
      );
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
