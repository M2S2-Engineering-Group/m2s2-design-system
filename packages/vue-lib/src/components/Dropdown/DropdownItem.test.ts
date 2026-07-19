import { mount } from "@vue/test-utils";
import { describe, it, expect, vi } from "vitest";
import { axe } from "jest-axe";
import DropdownItem from "./DropdownItem.vue";

describe("DropdownItem", () => {
  it("renders an anchor for an anchor item", () => {
    const item = { id: "1", text: "GitHub", href: "https://github.com" };
    const wrapper = mount(DropdownItem, { props: { item } });
    expect(wrapper.find("a.m2s2-dropdown__link").exists()).toBe(true);
    expect(wrapper.find("a").attributes("href")).toBe("https://github.com");
  });

  it("renders the anchor text", () => {
    const item = { id: "1", text: "GitHub", href: "https://github.com" };
    const wrapper = mount(DropdownItem, { props: { item } });
    expect(wrapper.find("a").text()).toBe("GitHub");
  });

  it("renders a button for a clickable item", () => {
    const item = { id: "2", text: "Log Out", onClick: vi.fn() };
    const wrapper = mount(DropdownItem, { props: { item } });
    expect(wrapper.find("button.m2s2-dropdown__link").exists()).toBe(true);
  });

  it("calls onClick handler when button is clicked", async () => {
    const onClick = vi.fn();
    const item = { id: "2", text: "Log Out", onClick };
    const wrapper = mount(DropdownItem, { props: { item } });
    await wrapper.find("button").trigger("click");
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("emits select when button is clicked", async () => {
    const item = { id: "2", text: "Log Out", onClick: vi.fn() };
    const wrapper = mount(DropdownItem, { props: { item } });
    await wrapper.find("button").trigger("click");
    expect(wrapper.emitted("select")).toHaveLength(1);
  });

  it("emits select when anchor is clicked", async () => {
    const item = { id: "1", text: "GitHub", href: "https://github.com" };
    const wrapper = mount(DropdownItem, { props: { item } });
    await wrapper.find("a").trigger("click");
    expect(wrapper.emitted("select")).toHaveLength(1);
  });

  describe("accessibility", () => {
    function mountInMenu(item: object) {
      const menu = document.createElement("ul");
      menu.setAttribute("role", "menu");
      document.body.appendChild(menu);
      const wrapper = mount(DropdownItem, { props: { item }, attachTo: menu });
      return { wrapper, menu };
    }

    it("has no violations for an anchor item", async () => {
      const item = { id: "1", text: "GitHub", href: "https://github.com" };
      const { wrapper, menu } = mountInMenu(item);
      expect(await axe(menu)).toHaveNoViolations();
      wrapper.unmount();
      menu.remove();
    });

    it("has no violations for a button item", async () => {
      const item = { id: "2", text: "Log Out", onClick: vi.fn() };
      const { wrapper, menu } = mountInMenu(item);
      expect(await axe(menu)).toHaveNoViolations();
      wrapper.unmount();
      menu.remove();
    });
  });
});
