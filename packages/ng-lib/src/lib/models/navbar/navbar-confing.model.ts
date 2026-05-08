import { DropdownItemModel } from '../dropdown/item/dropdown-item.model';

export interface NavbarConfig {
  brand: string;
  brandLogo?: string;
  brandRouterOutlet: string;
  isFixed: boolean;
  buttons: NavbarButton[];
  loginButton?: NavbarLoginButton;
}

export interface NavbarButton {
  id: string;
  routerLink?: string;
  href?: string;
  matIcon?: string;
  requiresAuth?: boolean;
  title: string;
  isDropdown?: boolean;
  dropdownItems?: DropdownItemModel[];
}

export interface NavbarLoginButton {
  dropdownItems:   DropdownItemModel[];
  profileImageUrl?: string;
  userName?:        string;
}
