import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";
import { axe } from "jest-axe";
import BaseCard from "./BaseCard.vue";

describe("BaseCard", () => {
  it("renders slot content", () => {
    const wrapper = mount(BaseCard, {
      slots: { default: '<p class="inner">Hello</p>' },
    });
    expect(wrapper.find(".inner").exists()).toBe(true);
  });

  it("adds featured class when featured=true", () => {
    const wrapper = mount(BaseCard, { props: { featured: true } });
    expect(wrapper.find(".m2s2-card").classes()).toContain("featured");
  });

  it("does not add featured class when featured=false", () => {
    const wrapper = mount(BaseCard, { props: { featured: false } });
    expect(wrapper.find(".m2s2-card").classes()).not.toContain("featured");
  });

  it("sets data-variant attribute", () => {
    const wrapper = mount(BaseCard, { props: { variant: "raised" } });
    expect(wrapper.find(".m2s2-card").attributes("data-variant")).toBe(
      "raised",
    );
  });

  it("defaults data-variant to default", () => {
    const wrapper = mount(BaseCard);
    expect(wrapper.find(".m2s2-card").attributes("data-variant")).toBe(
      "default",
    );
  });

  describe("accessibility", () => {
    it("has no violations with default props", async () => {
      const wrapper = mount(BaseCard, {
        slots: { default: "<p>Card content</p>" },
      });
      expect(await axe(wrapper.element)).toHaveNoViolations();
    });

    it("has no violations when featured", async () => {
      const wrapper = mount(BaseCard, {
        props: { featured: true },
        slots: { default: "<p>Featured card</p>" },
      });
      expect(await axe(wrapper.element)).toHaveNoViolations();
    });
  });
});
