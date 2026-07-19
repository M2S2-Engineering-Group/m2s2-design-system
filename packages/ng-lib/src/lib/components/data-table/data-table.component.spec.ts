import { render, screen, fireEvent } from "@testing-library/angular";
import { axe } from "jest-axe";
import { DataTableComponent } from "./data-table.component";

describe("DataTableComponent", () => {
  it("shows the empty message when totalCount is 0", async () => {
    await render(DataTableComponent, { inputs: { totalCount: 0 } });
    expect(screen.getByText("No data yet.")).toBeInTheDocument();
  });

  it("shows a custom empty message", async () => {
    await render(DataTableComponent, {
      inputs: { totalCount: 0, emptyMessage: "Nothing here yet." },
    });
    expect(screen.getByText("Nothing here yet.")).toBeInTheDocument();
  });

  it("renders the search input when statuses are provided", async () => {
    await render(DataTableComponent, {
      inputs: { totalCount: 10, statuses: ["all", "active"] },
    });
    expect(screen.getByRole("searchbox")).toBeInTheDocument();
  });

  it("renders a pill for each status", async () => {
    await render(DataTableComponent, {
      inputs: { totalCount: 10, statuses: ["all", "active", "closed"] },
    });
    expect(screen.getByRole("button", { name: "All" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "active" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "closed" })).toBeInTheDocument();
  });

  it("marks the active status pill with dt-pill--active", async () => {
    await render(DataTableComponent, {
      inputs: {
        totalCount: 10,
        statuses: ["all", "active"],
        statusFilter: "active",
      },
    });
    expect(screen.getByRole("button", { name: "active" })).toHaveClass(
      "dt-pill--active",
    );
    expect(screen.getByRole("button", { name: "All" })).not.toHaveClass(
      "dt-pill--active",
    );
  });

  it("emits searchChange when the user types in the search input", async () => {
    const { fixture } = await render(DataTableComponent, {
      inputs: { totalCount: 10, statuses: ["all"] },
    });
    const spy = jest.fn();
    fixture.componentInstance.searchChange.subscribe(spy);
    fireEvent.input(screen.getByRole("searchbox"), {
      target: { value: "hello" },
    });
    expect(spy).toHaveBeenCalledWith("hello");
  });

  it("emits statusChange when a status pill is clicked", async () => {
    const { fixture } = await render(DataTableComponent, {
      inputs: { totalCount: 10, statuses: ["all", "active"] },
    });
    const spy = jest.fn();
    fixture.componentInstance.statusChange.subscribe(spy);
    fireEvent.click(screen.getByRole("button", { name: "active" }));
    expect(spy).toHaveBeenCalledWith("active");
  });

  it("toggles the column panel when the Columns button is clicked", async () => {
    const { fixture } = await render(DataTableComponent, {
      inputs: {
        totalCount: 10,
        columnDefs: [
          { key: "name", label: "Name" },
          { key: "email", label: "Email" },
        ],
        colVisibility: { name: true, email: false },
      },
    });
    expect(screen.queryByText("Name")).not.toBeInTheDocument();
    fireEvent.click(screen.getByText(/Columns/));
    fixture.detectChanges();
    expect(screen.getByText("Name")).toBeInTheDocument();
  });

  it("emits colToggle when a column checkbox is changed", async () => {
    const { fixture } = await render(DataTableComponent, {
      inputs: {
        totalCount: 10,
        columnDefs: [{ key: "name", label: "Name" }],
        colVisibility: { name: true },
      },
    });
    const spy = jest.fn();
    fixture.componentInstance.colToggle.subscribe(spy);
    fireEvent.click(screen.getByText(/Columns/));
    fixture.detectChanges();
    fireEvent.change(screen.getByRole("checkbox"));
    expect(spy).toHaveBeenCalledWith("name");
  });

  describe("accessibility", () => {
    it("has no violations in empty state", async () => {
      const { container } = await render(DataTableComponent, {
        inputs: { totalCount: 0 },
      });
      expect(await axe(container)).toHaveNoViolations();
    });

    it("has no violations with status filters", async () => {
      const { container } = await render(DataTableComponent, {
        inputs: { totalCount: 10, statuses: ["all", "active", "closed"] },
      });
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
