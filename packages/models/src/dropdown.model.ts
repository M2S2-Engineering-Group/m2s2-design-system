export interface DropdownItem {
  id: string;
  imgSrc?: string;
  text: string;
  requiresAuth?: boolean;
}

export interface AnchorDropdownItem extends DropdownItem {
  href: string;
}

export interface ClickableDropdownItem extends DropdownItem {
  onClick: () => void;
}
