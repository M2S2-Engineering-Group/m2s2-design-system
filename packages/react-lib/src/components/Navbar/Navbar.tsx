import { useState, useEffect, useRef } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import type {
  NavbarConfig,
  NavbarButton,
  DropdownItem,
  AnchorDropdownItem,
  ClickableDropdownItem,
} from "@m2s2/models";
import "./Navbar.scss";

interface NavbarProps {
  config: NavbarConfig;
  loggedIn?: boolean;
  children?: React.ReactNode;
}

export function Navbar({ config, loggedIn = false, children }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [mobileOpen, setMobile] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    function onScroll() {
      const y = window.scrollY;
      const delta = y - lastScrollY.current;
      setScrolled(y > 80);
      if (y < 80) setHidden(false);
      else if (delta > 4) setHidden(true);
      else if (delta < -4) setHidden(false);
      lastScrollY.current = y;
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    function onResize() {
      if (window.innerWidth > 991) setMobile(false);
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  function isVisible(item: NavbarButton | DropdownItem) {
    return !item.requiresAuth || loggedIn;
  }

  const navButtons = config.buttons.filter((b) => !b.isDropdown);
  const navDropdowns = config.buttons.filter((b) => b.isDropdown);

  const cls = [
    "navbar",
    scrolled ? "navbar--scrolled" : "",
    hidden ? "navbar--hidden" : "",
    config.isFixed ? "navbar--fixed" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      <header className={cls}>
        <a className="navbar-brand" href={config.brandPath}>
          {config.brandLogo ? (
            <img
              src={config.brandLogo}
              alt={config.brand}
              className="navbar-brand-logo"
            />
          ) : (
            <span className="navbar-brand-text">{config.brand}</span>
          )}
        </a>

        <span className="navbar-spacer" />

        {/* Desktop nav */}
        <nav className="navbar-desktop" aria-label="Main navigation">
          {navButtons
            .filter((b) => isVisible(b))
            .map((btn) => (
              <a
                key={btn.id}
                className="navbar-nav-btn"
                href={btn.href}
                {...(btn.href?.startsWith("http")
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
              >
                {btn.title}
              </a>
            ))}

          {navDropdowns
            .filter((b) => isVisible(b))
            .map((btn) => (
              <DropdownMenu.Root key={btn.id}>
                <DropdownMenu.Trigger asChild>
                  <button className="navbar-nav-btn navbar-nav-btn--dropdown">
                    {btn.title}{" "}
                    <span className="navbar-chevron" aria-hidden>
                      ▾
                    </span>
                  </button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Portal>
                  <DropdownMenu.Content
                    className="navbar-dropdown-content"
                    align="end"
                    sideOffset={4}
                  >
                    {btn.dropdownItems?.map((item) => (
                      <DropdownNavItem key={item.id} item={item} />
                    ))}
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>
            ))}
        </nav>

        {/* Account menu */}
        {config.loginButton && (
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button className="navbar-icon-btn" aria-label="Account menu">
                {config.loginButton.profileImageUrl ? (
                  <img
                    src={config.loginButton.profileImageUrl}
                    alt="Profile"
                    className="navbar-avatar"
                  />
                ) : (
                  <AccountIcon />
                )}
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content
                className="navbar-dropdown-content"
                align="end"
                sideOffset={4}
              >
                {config.loginButton.userName && loggedIn && (
                  <div className="navbar-dropdown-user">
                    {config.loginButton.userName}
                  </div>
                )}
                {config.loginButton.dropdownItems
                  .filter((item) => isVisible(item))
                  .map((item) => (
                    <DropdownNavItem key={item.id} item={item} />
                  ))}
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        )}

        {children}

        {/* Mobile hamburger */}
        <button
          className="navbar-mobile-btn"
          aria-label={
            mobileOpen ? "Close navigation menu" : "Open navigation menu"
          }
          aria-expanded={mobileOpen}
          onClick={() => setMobile((v) => !v)}
        >
          <span
            className={`navbar-hamburger${mobileOpen ? " navbar-hamburger--open" : ""}`}
          />
        </button>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div
          className="navbar-mobile-menu"
          role="navigation"
          aria-label="Mobile navigation"
        >
          {config.buttons
            .filter((b) => isVisible(b))
            .flatMap((btn) => {
              if (btn.isDropdown) {
                return (btn.dropdownItems ?? [])
                  .filter((item) => isVisible(item))
                  .map((item) => (
                    <MobileNavItem
                      key={item.id}
                      item={item}
                      onClose={() => setMobile(false)}
                    />
                  ));
              }
              return [
                <a
                  key={btn.id}
                  className="navbar-mobile-link"
                  href={btn.href}
                  onClick={() => setMobile(false)}
                  {...(btn.href?.startsWith("http")
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                >
                  {btn.title}
                </a>,
              ];
            })}
          {config.loginButton?.dropdownItems
            .filter((item) => isVisible(item))
            .map((item) => (
              <MobileNavItem
                key={item.id}
                item={item}
                onClose={() => setMobile(false)}
              />
            ))}
        </div>
      )}
    </>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function DropdownNavItem({ item }: { item: DropdownItem }) {
  if ("href" in item) {
    const a = item as AnchorDropdownItem;
    return (
      <DropdownMenu.Item asChild>
        <a
          className="navbar-dropdown-item"
          href={a.href}
          {...(a.href.startsWith("http")
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
        >
          <ItemContent item={item} />
        </a>
      </DropdownMenu.Item>
    );
  }
  if ("onClick" in item) {
    const c = item as ClickableDropdownItem;
    return (
      <DropdownMenu.Item asChild>
        <button className="navbar-dropdown-item" onClick={c.onClick}>
          <ItemContent item={item} />
        </button>
      </DropdownMenu.Item>
    );
  }
  return null;
}

function MobileNavItem({
  item,
  onClose,
}: {
  item: DropdownItem;
  onClose: () => void;
}) {
  if ("href" in item) {
    const a = item as AnchorDropdownItem;
    return (
      <a
        className="navbar-mobile-link"
        href={a.href}
        onClick={onClose}
        {...(a.href.startsWith("http")
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
      >
        <ItemContent item={item} />
      </a>
    );
  }
  if ("onClick" in item) {
    const c = item as ClickableDropdownItem;
    return (
      <button
        className="navbar-mobile-link"
        onClick={() => {
          c.onClick();
          onClose();
        }}
      >
        <ItemContent item={item} />
      </button>
    );
  }
  return null;
}

function ItemContent({ item }: { item: DropdownItem }) {
  return (
    <>
      {item.imgSrc && (
        <img src={item.imgSrc} alt="" className="navbar-dropdown-img" />
      )}
      {item.text}
    </>
  );
}

function AccountIcon() {
  return (
    <svg
      className="navbar-account-icon"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
    </svg>
  );
}
