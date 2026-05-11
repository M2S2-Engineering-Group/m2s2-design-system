import { DropdownItem } from './dropdown.model';

export interface NavbarConfig {
  brand: string;
  brandLogo?: string;
  /** Path the brand name/logo links to */
  brandPath: string;
  isFixed: boolean;
  buttons: NavbarButton[];
  loginButton?: NavbarLoginButton;
}

export interface NavbarButton {
  id: string;
  /** External URL — use a framework-specific extension for internal routing */
  href?: string;
  requiresAuth?: boolean;
  title: string;
  isDropdown?: boolean;
  dropdownItems?: DropdownItem[];
}

export interface NavbarLoginButton {
  dropdownItems: DropdownItem[];
  profileImageUrl?: string;
  userName?: string;
}
