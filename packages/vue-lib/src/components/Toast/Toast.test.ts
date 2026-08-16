import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";
import { axe } from "jest-axe";
import Toast from "./Toast.vue";

describe("Toast", () => {
  it("renders slotted content", () => {
    const wrapper = mount(Toast, { slots: { default: "Publishing…" } });
    expect(wrapper.text()).toContain("Publishing…");
  });

  it("emits dismiss when the close button is clicked", async () => {
    const wrapper = mount(Toast, { slots: { default: "Saved" } });
    await wrapper.get(".toast-close").trigger("click");
    expect(wrapper.emitted("dismiss")).toHaveLength(1);
  });

  it("defaults to role=status for info/success", () => {
    const wrapper = mount(Toast, { slots: { default: "Saved" } });
    expect(wrapper.get('[role="status"]')).toBeTruthy();
  });

  it("uses role=alert for the error kind", () => {
    const wrapper = mount(Toast, {
      props: { kind: "error" },
      slots: { default: "Failed" },
    });
    expect(wrapper.get('[role="alert"]')).toBeTruthy();
  });

  describe("accessibility", () => {
    it("has no violations", async () => {
      const wrapper = mount(Toast, { slots: { default: "Publishing…" } });
      expect(await axe(wrapper.element)).toHaveNoViolations();
    });
  });
});
