export class DropdownItemModel {
  id: string = '';
  imgSrc: string = '';
  matIcon: string = '';
  text: string = '';
  requiresAuth: boolean = false;

  constructor(id: string, imgSrc: string, text: string) {
    this.id = id;
    this.imgSrc = imgSrc;
    this.text = text;
  }
}

export class AnchorDropdownItemModel extends DropdownItemModel {
  hrefAddr: string = '';

  constructor(id: string, imgSrc: string, text: string, hrefAddr: string) {
    super(id, imgSrc, text);
    this.hrefAddr = hrefAddr;
  }
}

export class ClickableDropdownItemModel extends DropdownItemModel {
  click: () => void = () => {};

  constructor(id: string, imgSrc: string, text: string, click: () => void) {
    super(id, imgSrc, text);
    this.click = click;
  }
}

export class RouterLinkDropdownModel extends DropdownItemModel {
  routerLink: string = '';

  constructor(id: string, imgSrc: string, text: string, routerLink: string) {
    super(id, imgSrc, text);
    this.routerLink = routerLink;
  }
}
