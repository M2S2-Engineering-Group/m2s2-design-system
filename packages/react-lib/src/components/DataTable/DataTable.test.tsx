import { render, screen } from "@testing-library/react";
import { makeColumnDefs } from "@m2s2/utils/testing";
import { axe } from "jest-axe";
import { DataTable } from "./DataTable";

describe("DataTable", () => {
  it("shows the empty message when totalCount is 0", () => {
    render(
      <DataTable totalCount={0} emptyMessage="Nothing here yet.">
        <table />
      </DataTable>,
    );
    expect(screen.getByText("Nothing here yet.")).toBeInTheDocument();
  });

  it("uses default empty message when none provided and totalCount is 0", () => {
    render(
      <DataTable totalCount={0}>
        <table />
      </DataTable>,
    );
    expect(screen.getByText("No data yet.")).toBeInTheDocument();
  });

  it("renders the search input when statuses are provided", () => {
    render(
      <DataTable
        totalCount={5}
        statuses={["all", "active"]}
        searchPlaceholder="Search items…"
      >
        <table />
      </DataTable>,
    );
    expect(screen.getByPlaceholderText("Search items…")).toBeInTheDocument();
  });

  it("renders a pill for each status", () => {
    render(
      <DataTable
        totalCount={5}
        statuses={["all", "active", "inactive"]}
        statusLabels={{ all: "All", active: "Active", inactive: "Inactive" }}
      >
        <table />
      </DataTable>,
    );
    expect(screen.getByRole("button", { name: "All" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Active" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Inactive" }),
    ).toBeInTheDocument();
  });

  it("falls back to the raw status string when no label is provided", () => {
    render(
      <DataTable totalCount={5} statuses={["custom_status"]} statusLabels={{}}>
        <table />
      </DataTable>,
    );
    expect(
      screen.getByRole("button", { name: "custom_status" }),
    ).toBeInTheDocument();
  });

  it("renders the column toggle button when columnDefs are provided", () => {
    render(
      <DataTable totalCount={5} columnDefs={makeColumnDefs(2)}>
        <table />
      </DataTable>,
    );
    expect(
      screen.getByRole("button", { name: /columns/i }),
    ).toBeInTheDocument();
  });

  it("does not render the column toggle button when columnDefs are absent", () => {
    render(
      <DataTable totalCount={5}>
        <table />
      </DataTable>,
    );
    expect(
      screen.queryByRole("button", { name: /columns/i }),
    ).not.toBeInTheDocument();
  });

  describe("accessibility", () => {
    it("has no violations (with data)", async () => {
      const { container } = render(
        <DataTable totalCount={5}>
          <table />
        </DataTable>,
      );
      expect(await axe(container)).toHaveNoViolations();
    });

    it("has no violations (empty state)", async () => {
      const { container } = render(
        <DataTable totalCount={0} emptyMessage="Nothing here yet.">
          <table />
        </DataTable>,
      );
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
