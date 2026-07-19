import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";
import { axe } from "jest-axe";
import DataTable from "./DataTable.vue";
import { makeColumnDefs } from "@m2s2/utils/testing";

describe("DataTable", () => {
  it("shows empty message when totalCount is 0", () => {
    const wrapper = mount(DataTable, {
      props: { totalCount: 0, emptyMessage: "Nothing here." },
    });
    expect(wrapper.find(".dt-empty").text()).toBe("Nothing here.");
  });

  it("does not render toolbar when totalCount is 0", () => {
    const wrapper = mount(DataTable, { props: { totalCount: 0 } });
    expect(wrapper.find(".dt-toolbar").exists()).toBe(false);
  });

  it("renders search and pills when statuses are given", () => {
    const wrapper = mount(DataTable, {
      props: { totalCount: 5, statuses: ["all", "active"] },
    });
    expect(wrapper.find(".dt-search").exists()).toBe(true);
    expect(wrapper.findAll(".dt-pill")).toHaveLength(2);
  });

  it("emits searchChange when search input changes", async () => {
    const wrapper = mount(DataTable, {
      props: { totalCount: 5, statuses: ["all"] },
    });
    await wrapper.find(".dt-search").setValue("foo");
    expect(wrapper.emitted("searchChange")?.[0]).toEqual(["foo"]);
  });

  it("emits statusChange when a pill is clicked", async () => {
    const wrapper = mount(DataTable, {
      props: { totalCount: 5, statuses: ["all", "active"] },
    });
    await wrapper.findAll(".dt-pill")[1].trigger("click");
    expect(wrapper.emitted("statusChange")?.[0]).toEqual(["active"]);
  });

  it("emits colToggle when a column checkbox is changed", async () => {
    const cols = makeColumnDefs(2);
    const wrapper = mount(DataTable, {
      props: { totalCount: 5, columnDefs: cols, statuses: ["all"] },
    });
    await wrapper.find(".dt-col-btn").trigger("click");
    const checkbox = wrapper.find('input[type="checkbox"]');
    await checkbox.trigger("change");
    expect(wrapper.emitted("colToggle")?.[0]).toEqual([cols[0].key]);
  });

  describe("accessibility", () => {
    it("has no violations in empty state", async () => {
      const wrapper = mount(DataTable, {
        props: { totalCount: 0, emptyMessage: "Nothing here." },
      });
      expect(await axe(wrapper.element)).toHaveNoViolations();
    });

    it("has no violations with toolbar and statuses", async () => {
      const wrapper = mount(DataTable, {
        props: { totalCount: 5, statuses: ["all", "active"] },
      });
      expect(await axe(wrapper.element)).toHaveNoViolations();
    });
  });
});
