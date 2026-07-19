import { ReactNode, useEffect, useRef, useState } from "react";
import type {
  AnchorDropdownItem,
  ClickableDropdownItem,
  DropdownItem,
} from "@m2s2/models";
import "./Dropdown.scss";

type DropdownItemConfig = DropdownItem &
  (
    | Pick<AnchorDropdownItem, "href">
    | Pick<ClickableDropdownItem, "onClick">
    | Record<string, never>
  );

export interface DropdownProps {
  trigger: ReactNode;
  items: DropdownItemConfig[];
  align?: "left" | "right";
}

function isAnchor(
  item: DropdownItemConfig,
): item is DropdownItem & Pick<AnchorDropdownItem, "href"> {
  return "href" in item;
}

function isClickable(
  item: DropdownItemConfig,
): item is DropdownItem & Pick<ClickableDropdownItem, "onClick"> {
  return "onClick" in item;
}

export function Dropdown({ trigger, items, align = "left" }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);

  function getMenuItems(): HTMLElement[] {
    return Array.from(
      menuRef.current?.querySelectorAll(
        '[role="menuitem"]:not([aria-disabled="true"])',
      ) ?? [],
    ) as HTMLElement[];
  }

  function openMenu() {
    setOpen(true);
  }

  function closeMenu() {
    setOpen(false);
    triggerRef.current?.focus();
  }

  // Focus first menu item after menu renders.
  useEffect(() => {
    if (open) getMenuItems()[0]?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;

    function handleOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") closeMenu();
    }

    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  function onTriggerKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (open) {
        closeMenu();
      } else {
        openMenu();
      }
    }
  }

  function onMenuKeyDown(e: React.KeyboardEvent) {
    const menuItems = getMenuItems();
    const idx = menuItems.indexOf(document.activeElement as HTMLElement);

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        menuItems[(idx + 1) % menuItems.length]?.focus();
        break;
      case "ArrowUp":
        e.preventDefault();
        menuItems[(idx - 1 + menuItems.length) % menuItems.length]?.focus();
        break;
      case "Home":
        e.preventDefault();
        menuItems[0]?.focus();
        break;
      case "End":
        e.preventDefault();
        menuItems[menuItems.length - 1]?.focus();
        break;
      case "Tab":
        setOpen(false);
        break;
    }
  }

  return (
    <div className="m2s2-dropdown" ref={ref}>
      <div
        ref={triggerRef}
        className="m2s2-dropdown__trigger"
        tabIndex={0}
        role="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => (open ? closeMenu() : openMenu())}
        onKeyDown={onTriggerKeyDown}
      >
        {trigger}
      </div>

      {open && (
        <ul
          ref={menuRef}
          className={`m2s2-dropdown__menu m2s2-dropdown__menu--${align}`}
          role="menu"
          onKeyDown={onMenuKeyDown}
        >
          {items.map((item) => (
            <li key={item.id} className="m2s2-dropdown__item" role="none">
              {isAnchor(item) ? (
                <a
                  href={(item as AnchorDropdownItem).href}
                  className="m2s2-dropdown__link"
                  role="menuitem"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                >
                  {item.imgSrc && (
                    <img src={item.imgSrc} alt="" aria-hidden="true" />
                  )}
                  {item.text}
                </a>
              ) : isClickable(item) ? (
                <button
                  className="m2s2-dropdown__link"
                  role="menuitem"
                  onClick={() => {
                    (item as ClickableDropdownItem).onClick();
                    setOpen(false);
                  }}
                >
                  {item.imgSrc && (
                    <img src={item.imgSrc} alt="" aria-hidden="true" />
                  )}
                  {item.text}
                </button>
              ) : (
                <span
                  className="m2s2-dropdown__link m2s2-dropdown__link--disabled"
                  role="menuitem"
                  aria-disabled="true"
                >
                  {item.imgSrc && (
                    <img src={item.imgSrc} alt="" aria-hidden="true" />
                  )}
                  {item.text}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
