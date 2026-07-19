import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";
import { axe } from "jest-axe";
import BlogCard from "./BlogCard.vue";

const config = {
  slug: "my-post",
  title: "My First Post",
  date: "2024-06-15",
  summary: "A brief summary.",
  tags: ["Angular", "Testing"],
};

const mountCard = (overrides = {}) =>
  mount(BlogCard, { props: { config: { ...config, ...overrides } } });

describe("BlogCard", () => {
  it("renders the title", () => {
    const wrapper = mountCard();
    expect(wrapper.find(".bc-title").text()).toBe("My First Post");
  });

  it("renders the formatted date", () => {
    const wrapper = mountCard();
    expect(wrapper.find("time").text()).toBe("June 15, 2024");
  });

  it("renders the summary", () => {
    const wrapper = mountCard();
    expect(wrapper.find(".bc-summary").text()).toBe("A brief summary.");
  });

  it("renders the reading time when provided", () => {
    const wrapper = mountCard({ readingTime: 5 });
    expect(wrapper.find(".bc-reading-time").text()).toBe("5 min read");
  });

  it("does not render a reading time element when omitted", () => {
    const wrapper = mountCard();
    expect(wrapper.find(".bc-reading-time").exists()).toBe(false);
  });

  it("renders a cover image when provided", () => {
    const wrapper = mountCard({ coverImage: "https://example.com/cover.jpg" });
    const img = wrapper.find("img");
    expect(img.exists()).toBe(true);
    expect(img.attributes("src")).toBe("https://example.com/cover.jpg");
    expect(img.attributes("alt")).toBe("My First Post");
  });

  it("renders the placeholder cover when no coverImage is provided", () => {
    const wrapper = mountCard();
    expect(wrapper.find(".bc-cover-placeholder").exists()).toBe(true);
    expect(wrapper.find("img").exists()).toBe(false);
  });

  it("renders all tags", () => {
    const wrapper = mountCard();
    const tags = wrapper.findAll(".bc-tag");
    expect(tags).toHaveLength(2);
    expect(tags[0].text()).toBe("Angular");
    expect(tags[1].text()).toBe("Testing");
  });

  it("links to the correct blog post URL", () => {
    const wrapper = mountCard();
    expect(wrapper.find(".bc-title a").attributes("href")).toBe(
      "/blog/my-post",
    );
  });

  describe("accessibility", () => {
    it("has no violations with default config", async () => {
      const wrapper = mountCard();
      expect(await axe(wrapper.element)).toHaveNoViolations();
    });

    it("has no violations with a cover image", async () => {
      const wrapper = mountCard({
        coverImage: "https://example.com/cover.jpg",
      });
      expect(await axe(wrapper.element)).toHaveNoViolations();
    });
  });
});
