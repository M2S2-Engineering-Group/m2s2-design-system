import { render, screen } from "@testing-library/angular";
import { axe } from "jest-axe";
import { provideRouter } from "@angular/router";
import { Subject } from "rxjs";
import { NavbarComponent } from "./navbar.component";
import { M2S2_AUTH_PROVIDER } from "../../services/auth/auth.provider";
import { NgNavbarConfig } from "../../models/navbar/navbar-confing.model";

class IntersectionObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
Object.defineProperty(window, "IntersectionObserver", {
  writable: true,
  configurable: true,
  value: IntersectionObserverStub,
});

const authServiceStub = {
  loggedIn$: new Subject<boolean>(),
  getCurrentUser: () => Promise.resolve(undefined),
};

const renderNavbar = (config: Partial<NgNavbarConfig> = {}) =>
  render(NavbarComponent, {
    inputs: {
      navbarConfig: {
        brand: "Acme",
        brandRouterOutlet: "/",
        isFixed: false,
        buttons: [],
        ...config,
      },
    },
    providers: [
      provideRouter([]),
      { provide: M2S2_AUTH_PROVIDER, useValue: authServiceStub },
    ],
  });

describe("NavbarComponent", () => {
  it("renders the brand name", async () => {
    await renderNavbar({ brand: "My Brand" });
    expect(screen.getByText("My Brand")).toBeInTheDocument();
  });

  it("renders nav buttons that do not require auth", async () => {
    await renderNavbar({
      buttons: [
        { id: "1", title: "Home", routerLink: "/", requiresAuth: false },
      ],
    });
    expect(screen.getByText("Home")).toBeInTheDocument();
  });

  it("hides buttons that require auth when the user is not logged in", async () => {
    await renderNavbar({
      buttons: [
        {
          id: "1",
          title: "Dashboard",
          routerLink: "/dashboard",
          requiresAuth: true,
        },
      ],
    });
    expect(screen.queryByText("Dashboard")).not.toBeInTheDocument();
  });

  it("filters navButtons to exclude dropdowns", async () => {
    const { fixture } = await renderNavbar({
      buttons: [
        { id: "1", title: "Home", routerLink: "/", isDropdown: false },
        { id: "2", title: "More", isDropdown: true, dropdownItems: [] },
      ],
    });
    expect(fixture.componentInstance.navButtons.length).toBe(1);
    expect(fixture.componentInstance.navButtons[0].title).toBe("Home");
  });

  it("isVisible returns true for items that do not require auth", async () => {
    const { fixture } = await renderNavbar();
    const item = { id: "1", title: "Home", requiresAuth: false };
    expect(fixture.componentInstance.isVisible(item)).toBe(true);
  });

  it("isVisible returns false for auth-required items when not logged in", async () => {
    const { fixture } = await renderNavbar();
    fixture.componentInstance.loggedIn = false;
    const item = { id: "1", title: "Profile", requiresAuth: true };
    expect(fixture.componentInstance.isVisible(item)).toBe(false);
  });

  describe("accessibility", () => {
    it("has no violations with brand only", async () => {
      const { container } = await renderNavbar({ brand: "Acme" });
      expect(await axe(container)).toHaveNoViolations();
    });

    it("has no violations with nav buttons", async () => {
      const { container } = await renderNavbar({
        brand: "Acme",
        buttons: [
          { id: "1", title: "Home", routerLink: "/", requiresAuth: false },
          {
            id: "2",
            title: "About",
            routerLink: "/about",
            requiresAuth: false,
          },
        ],
      });
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
