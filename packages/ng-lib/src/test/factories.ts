import { makeNavbarConfig } from '@m2s2/utils/testing';
import type { NgNavbarButton, NgNavbarConfig, NgNavbarLoginButton } from '../lib/models/navbar/navbar-confing.model';
import { DropdownItemModel, RouterLinkDropdownModel } from '../lib/models/dropdown/item/dropdown-item.model';

export * from '@m2s2/utils/testing';

export const makeNgNavbarButton = (overrides?: Partial<NgNavbarButton>): NgNavbarButton => ({
  id: 'btn-1',
  title: 'Home',
  routerLink: '/',
  requiresAuth: false,
  isDropdown: false,
  ...overrides,
});

export const makeNgNavbarLoginButton = (overrides?: Partial<NgNavbarLoginButton>): NgNavbarLoginButton => ({
  dropdownItems: [new DropdownItemModel('1', '', 'Profile')],
  ...overrides,
});

export const makeNgNavbarConfig = (overrides?: Partial<NgNavbarConfig>): NgNavbarConfig => {
  const base = makeNavbarConfig();
  return {
    brand: base.brand,
    brandLogo: base.brandLogo,
    brandRouterOutlet: '/',
    isFixed: false,
    buttons: [],
    ...overrides,
  };
};

export { RouterLinkDropdownModel, DropdownItemModel };
