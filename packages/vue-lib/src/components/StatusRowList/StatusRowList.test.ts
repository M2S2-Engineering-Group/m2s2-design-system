import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";
import { axe } from "jest-axe";
import StatusRowList from "./StatusRowList.vue";

describe("StatusRowList", () => {
  const rows = [
    { id: "m2s2site", label: "m2s2site", status: "succeeded" },
    {
      id: "devto",
      label: "devto",
      status: "failed",
      detail: "no prior DEV.to article to update",
    },
  ];

  it("renders a label per row", () => {
    const wrapper = mount(StatusRowList, { props: { rows } });
    const labels = wrapper.findAll(".srl-label");
    expect(labels).toHaveLength(2);
    expect(labels[0].text()).toBe("m2s2site");
    expect(labels[1].text()).toBe("devto");
  });

  it("renders detail text only when present", () => {
    const wrapper = mount(StatusRowList, { props: { rows } });
    expect(wrapper.findAll(".srl-detail")).toHaveLength(1);
    expect(wrapper.get(".srl-detail").text()).toBe(
      "no prior DEV.to article to update",
    );
  });

  it("renders a link only when present", () => {
    const withLink = [
      {
        id: "m2s2site",
        label: "m2s2site",
        status: "succeeded",
        link: { label: "View →", href: "https://m2s2.io/blog/example" },
      },
    ];
    const wrapper = mount(StatusRowList, { props: { rows: withLink } });
    const link = wrapper.get(".srl-link");
    expect(link.attributes("href")).toBe("https://m2s2.io/blog/example");
  });

  it("renders no link when absent", () => {
    const wrapper = mount(StatusRowList, { props: { rows } });
    expect(wrapper.findAll(".srl-link")).toHaveLength(0);
  });

  describe("accessibility", () => {
    it("has no violations", async () => {
      const wrapper = mount(StatusRowList, { props: { rows } });
      expect(await axe(wrapper.element)).toHaveNoViolations();
    });
  });
});
