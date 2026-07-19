import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";
import { axe } from "jest-axe";
import LoadingButton from "./LoadingButton.vue";

describe("LoadingButton", () => {
  it("renders slot content when not loading", () => {
    const wrapper = mount(LoadingButton, { slots: { default: "Save" } });
    expect(wrapper.text()).toBe("Save");
  });

  it("renders slot content when loading but no loadingText", () => {
    const wrapper = mount(LoadingButton, {
      props: { loading: true },
      slots: { default: "Save" },
    });
    expect(wrapper.text()).toBe("Save");
  });

  it("shows loadingText instead of slot when loading=true and loadingText is set", () => {
    const wrapper = mount(LoadingButton, {
      props: { loading: true, loadingText: "Saving…" },
      slots: { default: "Save" },
    });
    expect(wrapper.text()).toBe("Saving…");
  });

  it("adds spinner element when loading", () => {
    const wrapper = mount(LoadingButton, { props: { loading: true } });
    expect(wrapper.find(".m2s2-btn-spinner").exists()).toBe(true);
  });

  it("does not render spinner when not loading", () => {
    const wrapper = mount(LoadingButton, { props: { loading: false } });
    expect(wrapper.find(".m2s2-btn-spinner").exists()).toBe(false);
  });

  it("sets disabled attribute when loading", () => {
    const wrapper = mount(LoadingButton, { props: { loading: true } });
    expect((wrapper.find("button").element as HTMLButtonElement).disabled).toBe(
      true,
    );
  });

  it("is not disabled when loading is false", () => {
    const wrapper = mount(LoadingButton, { props: { loading: false } });
    expect((wrapper.find("button").element as HTMLButtonElement).disabled).toBe(
      false,
    );
  });

  describe("accessibility", () => {
    it("has no violations in default state", async () => {
      const wrapper = mount(LoadingButton, { slots: { default: "Save" } });
      expect(await axe(wrapper.element)).toHaveNoViolations();
    });

    it("has no violations in loading state", async () => {
      const wrapper = mount(LoadingButton, {
        props: { loading: true, loadingText: "Saving…" },
        slots: { default: "Save" },
      });
      expect(await axe(wrapper.element)).toHaveNoViolations();
    });
  });
});
