import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";
import { axe } from "jest-axe";
import Dialog from "./Dialog.vue";
import { makeM2S2DialogData } from "@m2s2/utils/testing";

const mountDialog = (open: boolean, overrides = {}) =>
  mount(Dialog, {
    props: { data: makeM2S2DialogData(overrides), open },
    attachTo: document.body,
    global: { stubs: { teleport: true } },
  });

describe("Dialog", () => {
  it("is not visible when open=false", () => {
    const wrapper = mountDialog(false);
    expect(wrapper.find(".m2s2-dialog-overlay").exists()).toBe(false);
  });

  it("is visible when open=true", () => {
    const wrapper = mountDialog(true);
    expect(wrapper.find(".m2s2-dialog-overlay").exists()).toBe(true);
  });

  it("renders the title", () => {
    const wrapper = mountDialog(true, { title: "Delete Item" });
    expect(wrapper.find(".dialog-title").text()).toBe("Delete Item");
  });

  it("renders the message", () => {
    const wrapper = mountDialog(true, { message: "This cannot be undone." });
    expect(wrapper.find(".dialog-message").text()).toBe(
      "This cannot be undone.",
    );
  });

  it("emits action with the action value on button click", async () => {
    const wrapper = mountDialog(true, {
      actions: [{ label: "Confirm", value: "confirm", variant: "primary" }],
    });
    await wrapper.find(".dialog-btn").trigger("click");
    expect(wrapper.emitted("action")?.[0]).toEqual(["confirm"]);
  });

  it("emits close when backdrop is clicked and not modal", async () => {
    const wrapper = mountDialog(true, { modal: false });
    await wrapper.find(".m2s2-dialog-overlay").trigger("click");
    expect(wrapper.emitted("close")).toBeTruthy();
  });

  it("does not emit close when backdrop is clicked on a modal dialog", async () => {
    const wrapper = mountDialog(true, { modal: true });
    await wrapper.find(".m2s2-dialog-overlay").trigger("click");
    expect(wrapper.emitted("close")).toBeFalsy();
  });

  describe("accessibility", () => {
    it("has no violations when closed", async () => {
      const wrapper = mountDialog(false);
      expect(await axe(wrapper.element)).toHaveNoViolations();
    });

    it("has no violations when open", async () => {
      const wrapper = mountDialog(true, {
        title: "Confirm Action",
        message: "Are you sure?",
      });
      expect(await axe(wrapper.element)).toHaveNoViolations();
    });
  });
});
