import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import {
  AnchorDropdownItemModel,
  ClickableDropdownItemModel,
  DropdownItemModel,
  RouterLinkDropdownModel,
} from '../../../models/dropdown/item/dropdown-item.model';

@Component({
  selector: 'm2-dropdown-item',
  templateUrl: './dropdown-item.component.html',
  styleUrls: ['./dropdown-item.component.scss'],
  standalone: true,
  imports: [RouterLink, MatMenuModule, MatIconModule],
})
export class DropdownItemComponent {
  @Input() dropdownItem: DropdownItemModel = new DropdownItemModel('', '', '');

  public isAnchor = (): boolean => this.dropdownItem instanceof AnchorDropdownItemModel;
  public getAnchor = (): AnchorDropdownItemModel => this.dropdownItem as AnchorDropdownItemModel;
  public isRouterLink = (): boolean => this.dropdownItem instanceof RouterLinkDropdownModel;
  public getRouterLink = (): RouterLinkDropdownModel => this.dropdownItem as RouterLinkDropdownModel;
  public isClickable = (): boolean => this.dropdownItem instanceof ClickableDropdownItemModel;
  public getClickable = (): ClickableDropdownItemModel => this.dropdownItem as ClickableDropdownItemModel;
}
