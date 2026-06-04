import {
  ChangeDetectorRef,
  Component,
  HostListener,
  inject,
  Input,
  OnDestroy,
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Subscription } from 'rxjs';
import { DropdownItemComponent } from '../dropdown';
import { NgNavbarButton, NgNavbarConfig } from '../../models/navbar/navbar-confing.model';
import { M2S2_AUTH_PROVIDER } from '../../services/auth/auth.provider';

@Component({
  selector: 'm2-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    DropdownItemComponent,
  ],
})
export class NavbarComponent implements OnDestroy {
  private static readonly SCROLL_THRESHOLD = 80;
  @Input() public navbarConfig: NgNavbarConfig = {
    brand: 'Brand',
    brandRouterOutlet: '',
    isFixed: false,
    buttons: [],
  };

  public isScrolled = false;
  public isHidden = false;
  public loggedIn = false;

  private readonly authProvider = inject(M2S2_AUTH_PROVIDER, { optional: true });
  private readonly changeDetRef = inject(ChangeDetectorRef);
  private readonly loggedInSubscription: Subscription;
  private lastScrollY = 0;

  constructor() {
    if (this.authProvider) {
      this.isAuthenticated().then(v => (this.loggedIn = v));
      this.loggedInSubscription = this.authProvider.loggedIn$.subscribe(v => {
        this.loggedIn = v;
        if (v) this.changeDetRef.detectChanges();
      });
    } else {
      this.loggedInSubscription = new Subscription();
    }
  }

  @HostListener('window:scroll')
  public onWindowScroll(): void {
    const currentY = window.scrollY;
    const delta = currentY - this.lastScrollY;
    this.isScrolled = currentY > NavbarComponent.SCROLL_THRESHOLD;
    if (currentY < NavbarComponent.SCROLL_THRESHOLD) {
      this.isHidden = false;
    } else if (delta > 4) {
      this.isHidden = true;
    } else if (delta < -4) {
      this.isHidden = false;
    }
    this.lastScrollY = currentY;
    this.changeDetRef.detectChanges();
  }

  public ngOnDestroy(): void {
    this.loggedInSubscription.unsubscribe();
  }

  public get navButtons(): NgNavbarButton[] {
    return this.navbarConfig?.buttons.filter(b => !b.isDropdown);
  }

  public get navDropdowns(): NgNavbarButton[] {
    return this.navbarConfig?.buttons.filter(b => b.isDropdown);
  }

  public isVisible(item: NgNavbarButton): boolean {
    return (!!item.requiresAuth && this.loggedIn) || !item.requiresAuth;
  }

  public isRouterLink(item: NgNavbarButton): boolean {
    return !!item.routerLink && !item.href;
  }

  public isAnchor(item: NgNavbarButton): boolean {
    return !!item.href && !item.routerLink;
  }

  public async isAuthenticated(): Promise<boolean> {
    const user = await this.authProvider?.getCurrentUser();
    return !!user;
  }
}
