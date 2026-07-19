import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";
import { axe } from "jest-axe";
import SocialIcon from "./SocialIcon.vue";

describe("SocialIcon", () => {
  it("renders an svg for github", () => {
    const wrapper = mount(SocialIcon, { props: { type: "github" } });
    expect(wrapper.find("svg").exists()).toBe(true);
  });

  it("renders an svg for linkedin", () => {
    const wrapper = mount(SocialIcon, { props: { type: "linkedin" } });
    expect(wrapper.find("svg").exists()).toBe(true);
  });

  it("renders an svg for twitter", () => {
    const wrapper = mount(SocialIcon, { props: { type: "twitter" } });
    expect(wrapper.find("svg").exists()).toBe(true);
  });

  it("renders an svg for email", () => {
    const wrapper = mount(SocialIcon, { props: { type: "email" } });
    expect(wrapper.find("svg").exists()).toBe(true);
  });

  it("renders only one svg at a time", () => {
    const wrapper = mount(SocialIcon, { props: { type: "github" } });
    expect(wrapper.findAll("svg")).toHaveLength(1);
  });

  describe("accessibility", () => {
    it("has no violations for github icon", async () => {
      const wrapper = mount(SocialIcon, { props: { type: "github" } });
      expect(await axe(wrapper.element)).toHaveNoViolations();
    });

    it("has no violations for linkedin icon", async () => {
      const wrapper = mount(SocialIcon, { props: { type: "linkedin" } });
      expect(await axe(wrapper.element)).toHaveNoViolations();
    });
  });
});
