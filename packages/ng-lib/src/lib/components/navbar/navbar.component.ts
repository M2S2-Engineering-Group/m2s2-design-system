import {
  ChangeDetectorRef,
  Component,
  HostListener,
  inject,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { DropdownItemComponent } from '../dropdown';
import { NavbarButton, NavbarConfig } from '../../models/navbar/navbar-confing.model';
import { AuthService } from '../../services/auth/auth.service';
import { Subscription } from 'rxjs';

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
export class NavbarComponent implements OnInit, OnDestroy {
  @Input() public navbarConfig: NavbarConfig = {
    brand: 'Brand',
    brandRouterOutlet: 'home',
    isFixed: false,
    buttons: [],
  };

  public isScrolled = false;
  public isHidden = false;
  public loggedIn = false;

  private readonly authService = inject(AuthService);
  private readonly changeDetRef = inject(ChangeDetectorRef);
  private readonly loggedInSubscription: Subscription;
  private sentinel: HTMLElement | null = null;
  private observer: IntersectionObserver | null = null;
  private lastScrollY = 0;

  constructor() {
    this.isAuthenticated().then(v => (this.loggedIn = v));
    this.loggedInSubscription = this.authService.loggedIn$.subscribe(v => {
      this.loggedIn = v;
      if (v) this.changeDetRef.detectChanges();
    });
  }

  public ngOnInit(): void {
    this.sentinel = document.createElement('div');
    this.sentinel.style.cssText =
      'position:absolute;top:15vh;height:1px;width:1px;pointer-events:none;';
    document.body.insertBefore(this.sentinel, document.body.firstChild);

    this.observer = new IntersectionObserver(
      ([entry]) => {
        this.isScrolled = !entry.isIntersecting;
        this.changeDetRef.detectChanges();
      },
      { threshold: 0 }
    );
    this.observer.observe(this.sentinel);
  }

  @HostListener('window:scroll')
  public onWindowScroll(): void {
    const currentY = window.scrollY;
    const delta = currentY - this.lastScrollY;
    if (currentY < 80) {
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
    this.observer?.disconnect();
    this.sentinel?.remove();
  }

  public get navButtons(): NavbarButton[] {
    return this.navbarConfig?.buttons.filter(b => !b.isDropdown);
  }

  public get navDropdowns(): NavbarButton[] {
    return this.navbarConfig?.buttons.filter(b => b.isDropdown);
  }

  public isVisible(item: NavbarButton): boolean {
    return (!!item.requiresAuth && this.loggedIn) || !item.requiresAuth;
  }

  public isRouterLink(item: NavbarButton): boolean {
    return !!item.routerLink && !item.href;
  }

  public isAnchor(item: NavbarButton): boolean {
    return !!item.href && !item.routerLink;
  }

  public async isAuthenticated(): Promise<boolean> {
    const user = await this.authService.getCurrentUser();
    return !!user;
  }
}
