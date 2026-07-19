import { NavbarConfig, NavbarButton, NavbarLoginButton } from "@m2s2/models";
import { DropdownItemModel } from "../dropdown/item/dropdown-item.model";

export type { NavbarConfig };

/** Angular-specific NavbarButton — adds routerLink and matIcon. */
export interface NgNavbarButton extends NavbarButton {
  routerLink?: string;
  matIcon?: string;
  dropdownItems?: DropdownItemModel[];
}

/** Angular-specific NavbarLoginButton — uses DropdownItemModel[]. */
export interface NgNavbarLoginButton extends Omit<
  NavbarLoginButton,
  "dropdownItems"
> {
  dropdownItems: DropdownItemModel[];
}

/** Angular-specific NavbarConfig — uses NgNavbarButton, NgNavbarLoginButton, and brandRouterOutlet. */
export interface NgNavbarConfig extends Omit<
  NavbarConfig,
  "buttons" | "brandPath" | "loginButton"
> {
  brandRouterOutlet: string;
  buttons: NgNavbarButton[];
  loginButton?: NgNavbarLoginButton;
}
