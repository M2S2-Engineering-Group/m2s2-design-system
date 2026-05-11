import { NavbarConfig, NavbarButton, NavbarLoginButton } from '@m2s2/models';
import { DropdownItemModel } from '../dropdown/item/dropdown-item.model';

export type { NavbarConfig, NavbarLoginButton };

/** Angular-specific NavbarButton — adds routerLink and matIcon. */
export interface NgNavbarButton extends NavbarButton {
  routerLink?: string;
  matIcon?: string;
  dropdownItems?: DropdownItemModel[];
}

/** Angular-specific NavbarConfig — uses NgNavbarButton and brandRouterOutlet. */
export interface NgNavbarConfig extends Omit<NavbarConfig, 'buttons' | 'brandPath'> {
  brandRouterOutlet: string;
  buttons: NgNavbarButton[];
}
