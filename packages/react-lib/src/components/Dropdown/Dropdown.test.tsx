import { render, screen, fireEvent } from "@testing-library/react";
import { axe } from "jest-axe";
import { Dropdown } from "./Dropdown";

const anchorItem = { id: "item-1", text: "Profile", href: "/profile" };
const clickableItem = { id: "item-2", text: "Logout", onClick: () => {} };

describe("Dropdown", () => {
  it("is closed by default", () => {
    render(<Dropdown trigger={<span>Menu</span>} items={[anchorItem]} />);
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("opens when the trigger is clicked", () => {
    render(<Dropdown trigger={<span>Menu</span>} items={[anchorItem]} />);
    fireEvent.click(screen.getByText("Menu"));
    expect(screen.getByRole("menu")).toBeInTheDocument();
  });

  it("renders anchor items in the menu", () => {
    render(<Dropdown trigger={<span>Menu</span>} items={[anchorItem]} />);
    fireEvent.click(screen.getByText("Menu"));
    expect(
      screen.getByRole("menuitem", { name: "Profile" }),
    ).toBeInTheDocument();
  });

  it("renders button items in the menu", () => {
    render(<Dropdown trigger={<span>Menu</span>} items={[clickableItem]} />);
    fireEvent.click(screen.getByText("Menu"));
    expect(
      screen.getByRole("menuitem", { name: "Logout" }),
    ).toBeInTheDocument();
  });

  it("closes when Escape is pressed", () => {
    render(<Dropdown trigger={<span>Menu</span>} items={[anchorItem]} />);
    fireEvent.click(screen.getByText("Menu"));
    expect(screen.getByRole("menu")).toBeInTheDocument();
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("closes when clicking outside", () => {
    render(
      <div>
        <Dropdown trigger={<span>Menu</span>} items={[anchorItem]} />
        <div data-testid="outside">Outside</div>
      </div>,
    );
    fireEvent.click(screen.getByText("Menu"));
    expect(screen.getByRole("menu")).toBeInTheDocument();
    fireEvent.mouseDown(screen.getByTestId("outside"));
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("toggles closed when trigger is clicked again", () => {
    render(<Dropdown trigger={<span>Menu</span>} items={[anchorItem]} />);
    fireEvent.click(screen.getByText("Menu"));
    fireEvent.click(screen.getByText("Menu"));
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  describe("keyboard accessibility", () => {
    const twoItems = [anchorItem, clickableItem];

    it('trigger has role="button" and aria-haspopup="menu"', () => {
      render(<Dropdown trigger={<span>Menu</span>} items={twoItems} />);
      const trigger = screen.getByRole("button", { name: /Menu/i });
      expect(trigger).toHaveAttribute("aria-haspopup", "menu");
    });

    it("opens when Enter is pressed on the trigger", () => {
      render(<Dropdown trigger={<span>Menu</span>} items={twoItems} />);
      const trigger = screen.getByRole("button", { name: /Menu/i });
      fireEvent.keyDown(trigger, { key: "Enter" });
      expect(screen.getByRole("menu")).toBeInTheDocument();
    });

    it("opens when Space is pressed on the trigger", () => {
      render(<Dropdown trigger={<span>Menu</span>} items={twoItems} />);
      const trigger = screen.getByRole("button", { name: /Menu/i });
      fireEvent.keyDown(trigger, { key: " " });
      expect(screen.getByRole("menu")).toBeInTheDocument();
    });

    it("navigates to next item on ArrowDown", () => {
      render(<Dropdown trigger={<span>Menu</span>} items={twoItems} />);
      fireEvent.click(screen.getByRole("button", { name: /Menu/i }));
      const [first, second] = screen.getAllByRole("menuitem");
      first.focus();
      fireEvent.keyDown(screen.getByRole("menu"), { key: "ArrowDown" });
      expect(document.activeElement).toBe(second);
    });

    it("navigates to previous item on ArrowUp", () => {
      render(<Dropdown trigger={<span>Menu</span>} items={twoItems} />);
      fireEvent.click(screen.getByRole("button", { name: /Menu/i }));
      const [, second] = screen.getAllByRole("menuitem");
      second.focus();
      fireEvent.keyDown(screen.getByRole("menu"), { key: "ArrowUp" });
      expect(document.activeElement).toBe(screen.getAllByRole("menuitem")[0]);
    });

    it("focuses first item on Home key", () => {
      render(<Dropdown trigger={<span>Menu</span>} items={twoItems} />);
      fireEvent.click(screen.getByRole("button", { name: /Menu/i }));
      const [first, second] = screen.getAllByRole("menuitem");
      second.focus();
      fireEvent.keyDown(screen.getByRole("menu"), { key: "Home" });
      expect(document.activeElement).toBe(first);
    });

    it("focuses last item on End key", () => {
      render(<Dropdown trigger={<span>Menu</span>} items={twoItems} />);
      fireEvent.click(screen.getByRole("button", { name: /Menu/i }));
      const items = screen.getAllByRole("menuitem");
      items[0].focus();
      fireEvent.keyDown(screen.getByRole("menu"), { key: "End" });
      expect(document.activeElement).toBe(items[items.length - 1]);
    });
  });

  describe("accessibility", () => {
    it("has no violations (closed)", async () => {
      const { container } = render(
        <Dropdown
          trigger={<span>Menu</span>}
          items={[anchorItem, clickableItem]}
        />,
      );
      expect(await axe(container)).toHaveNoViolations();
    });

    it("has no violations (open)", async () => {
      const { container } = render(
        <Dropdown
          trigger={<span>Menu</span>}
          items={[anchorItem, clickableItem]}
        />,
      );
      fireEvent.click(screen.getByText("Menu"));
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
