import { render, screen, fireEvent } from "@testing-library/angular";
import { axe } from "jest-axe";
import { provideRouter } from "@angular/router";
import { DropdownItemComponent } from "./dropdown-item.component";
import {
  AnchorDropdownItemModel,
  ClickableDropdownItemModel,
  RouterLinkDropdownModel,
} from "../../../models/dropdown/item/dropdown-item.model";

// mat-menu-item sets role="menuitem" on both button and anchor elements.

describe("DropdownItemComponent — clickable", () => {
  it("renders a menu item with the item text", async () => {
    const item = new ClickableDropdownItemModel("1", "", "Delete", jest.fn());
    await render(DropdownItemComponent, { inputs: { dropdownItem: item } });
    expect(
      screen.getByRole("menuitem", { name: "Delete" }),
    ).toBeInTheDocument();
  });

  it("calls the click handler when the menu item is clicked", async () => {
    const onClick = jest.fn();
    const item = new ClickableDropdownItemModel("1", "", "Delete", onClick);
    await render(DropdownItemComponent, { inputs: { dropdownItem: item } });
    fireEvent.click(screen.getByRole("menuitem", { name: "Delete" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});

describe("DropdownItemComponent — router link", () => {
  it("renders a menu item with the item text", async () => {
    const item = new RouterLinkDropdownModel(
      "2",
      "",
      "Dashboard",
      "/dashboard",
    );
    await render(DropdownItemComponent, {
      inputs: { dropdownItem: item },
      providers: [provideRouter([])],
    });
    expect(
      screen.getByRole("menuitem", { name: "Dashboard" }),
    ).toBeInTheDocument();
  });
});

describe("DropdownItemComponent — anchor", () => {
  it("renders a menu item with the correct href", async () => {
    const item = new AnchorDropdownItemModel(
      "3",
      "",
      "GitHub",
      "https://github.com",
    );
    await render(DropdownItemComponent, { inputs: { dropdownItem: item } });
    expect(screen.getByRole("menuitem", { name: "GitHub" })).toHaveAttribute(
      "href",
      "https://github.com",
    );
  });

  it("opens the anchor in a new tab", async () => {
    const item = new AnchorDropdownItemModel(
      "3",
      "",
      "GitHub",
      "https://github.com",
    );
    await render(DropdownItemComponent, { inputs: { dropdownItem: item } });
    expect(screen.getByRole("menuitem", { name: "GitHub" })).toHaveAttribute(
      "target",
      "_blank",
    );
  });
});

describe("DropdownItemComponent — accessibility", () => {
  function inMenuContext(container: HTMLElement): HTMLElement {
    const menu = document.createElement("ul");
    menu.setAttribute("role", "menu");
    menu.innerHTML = container.innerHTML;
    return menu;
  }

  it("has no violations for a clickable item", async () => {
    const item = new ClickableDropdownItemModel("1", "", "Delete", jest.fn());
    const { container } = await render(DropdownItemComponent, {
      inputs: { dropdownItem: item },
    });
    expect(await axe(inMenuContext(container))).toHaveNoViolations();
  });

  it("has no violations for an anchor item", async () => {
    const item = new AnchorDropdownItemModel(
      "3",
      "",
      "GitHub",
      "https://github.com",
    );
    const { container } = await render(DropdownItemComponent, {
      inputs: { dropdownItem: item },
    });
    expect(await axe(inMenuContext(container))).toHaveNoViolations();
  });
});
