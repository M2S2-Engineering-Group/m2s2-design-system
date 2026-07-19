import { describe, it, expect } from "vitest";
import { BLOG_EDITOR_TOOLBAR } from "./editor";

describe("BLOG_EDITOR_TOOLBAR", () => {
  it("contains 12 items", () => {
    expect(BLOG_EDITOR_TOOLBAR).toHaveLength(12);
  });

  it("every item has a label and icon", () => {
    for (const item of BLOG_EDITOR_TOOLBAR) {
      expect(item.label).toBeTruthy();
      expect(item.icon).toBeTruthy();
    }
  });

  it("every item has at least one of: wrap, prefix, or block", () => {
    for (const item of BLOG_EDITOR_TOOLBAR) {
      const hasAction =
        item.wrap !== undefined ||
        item.prefix !== undefined ||
        item.block !== undefined;
      expect(hasAction, `"${item.label}" has no action`).toBe(true);
    }
  });

  it("wrap items have exactly two strings", () => {
    const wrapItems = BLOG_EDITOR_TOOLBAR.filter((i) => i.wrap);
    for (const item of wrapItems) {
      expect(item.wrap).toHaveLength(2);
      expect(typeof item.wrap![0]).toBe("string");
      expect(typeof item.wrap![1]).toBe("string");
    }
  });

  it("includes expected formatting actions", () => {
    const labels = BLOG_EDITOR_TOOLBAR.map((i) => i.label);
    expect(labels).toContain("Bold");
    expect(labels).toContain("Italic");
    expect(labels).toContain("Link");
    expect(labels).toContain("Code block");
    expect(labels).toContain("Heading 2");
  });
});
