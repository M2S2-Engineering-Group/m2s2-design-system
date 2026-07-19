import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";
import { axe } from "jest-axe";
import SectionHeader from "./SectionHeader.vue";

describe("SectionHeader", () => {
  it("renders the label in an h2", () => {
    const wrapper = mount(SectionHeader, {
      props: { config: { label: "Our Services" } },
    });
    expect(wrapper.find("h2").text()).toBe("Our Services");
  });

  it("applies the m2s2-section-header class to the container", () => {
    const wrapper = mount(SectionHeader, {
      props: { config: { label: "Test" } },
    });
    expect(wrapper.element).toHaveClass("m2s2-section-header");
  });

  it("applies the sh-label class to the heading", () => {
    const wrapper = mount(SectionHeader, {
      props: { config: { label: "Test" } },
    });
    expect(wrapper.find("h2").element).toHaveClass("sh-label");
  });

  it("renders the subtitle when provided", () => {
    const wrapper = mount(SectionHeader, {
      props: { config: { label: "Test", subtitle: "A subtitle" } },
    });
    expect(wrapper.find(".sh-subtitle").text()).toBe("A subtitle");
  });

  it("applies the sh-subtitle class to the subtitle", () => {
    const wrapper = mount(SectionHeader, {
      props: { config: { label: "Test", subtitle: "Sub" } },
    });
    expect(wrapper.find("p").element).toHaveClass("sh-subtitle");
  });

  it("does not render a subtitle element when omitted", () => {
    const wrapper = mount(SectionHeader, {
      props: { config: { label: "Test" } },
    });
    expect(wrapper.find(".sh-subtitle").exists()).toBe(false);
  });

  describe("accessibility", () => {
    it("has no violations without subtitle", async () => {
      const wrapper = mount(SectionHeader, {
        props: { config: { label: "Our Services" } },
      });
      expect(await axe(wrapper.element)).toHaveNoViolations();
    });

    it("has no violations with subtitle", async () => {
      const wrapper = mount(SectionHeader, {
        props: { config: { label: "Our Services", subtitle: "What we offer" } },
      });
      expect(await axe(wrapper.element)).toHaveNoViolations();
    });
  });
});
