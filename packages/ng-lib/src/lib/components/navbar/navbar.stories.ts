import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig } from '@storybook/angular';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { NavbarComponent } from './navbar.component';
import { AuthService } from '../../services/auth/auth.service';
import { NgNavbarConfig } from '../../models/navbar/navbar-confing.model';
import { RouterLinkDropdownModel } from '../../models/dropdown/item/dropdown-item.model';

const mockAuthService = (loggedIn: boolean): Partial<AuthService> => ({
  loggedIn$: new BehaviorSubject(loggedIn),
  getCurrentUser: () => Promise.resolve(loggedIn ? { username: 'demo-user', userId: '1', signInDetails: undefined } as any : undefined),
  getCurrentSession: () => Promise.resolve(undefined),
  signOut: () => {},
});

const publicConfig: NgNavbarConfig = {
  brand:             'M²S²',
  brandRouterOutlet: 'home',
  isFixed:           false,
  buttons: [
    { id: 'home',      title: 'Home',      routerLink: '/home'      },
    { id: 'services',  title: 'Services',  routerLink: '/services'  },
    { id: 'blog',      title: 'Blog',      routerLink: '/blog'      },
    { id: 'contact',   title: 'Contact',   routerLink: '/contact'   },
    { id: 'dashboard', title: 'Dashboard', routerLink: '/dashboard', requiresAuth: true },
  ],
  loginButton: {
    dropdownItems: [
      new RouterLinkDropdownModel('dashboard', '', 'Dashboard', '/dashboard'),
      new RouterLinkDropdownModel('signout',   '', 'Sign Out',  '/login'),
    ],
  },
};

const sharedProviders = [provideAnimationsAsync(), provideRouter([])];

const meta: Meta<NavbarComponent> = {
  title:     'Components/Navbar',
  component: NavbarComponent,
  tags:      ['autodocs'],
  decorators: [
    applicationConfig({ providers: sharedProviders }),
  ],
  parameters: { layout: 'fullscreen' },
  render: (args) => ({
    props: args,
    template: `
      <div style="min-height: 200px;">
        <m2-navbar [navbarConfig]="navbarConfig"></m2-navbar>
      </div>
    `,
  }),
};

export default meta;
type Story = StoryObj<NavbarComponent>;

export const LoggedOut: Story = {
  name: 'Logged out',
  decorators: [
    applicationConfig({ providers: [...sharedProviders, { provide: AuthService, useValue: mockAuthService(false) }] }),
  ],
  args: { navbarConfig: publicConfig },
};

export const LoggedIn: Story = {
  name: 'Logged in',
  decorators: [
    applicationConfig({ providers: [...sharedProviders, { provide: AuthService, useValue: mockAuthService(true) }] }),
  ],
  args: {
    navbarConfig: {
      ...publicConfig,
      loginButton: {
        userName: 'Jane Smith',
        dropdownItems: [
          new RouterLinkDropdownModel('dashboard', '', 'Dashboard', '/dashboard'),
          new RouterLinkDropdownModel('signout',   '', 'Sign Out',  '/login'),
        ],
      },
    },
  },
};

export const WithLogo: Story = {
  name: 'With logo image',
  decorators: [
    applicationConfig({ providers: [...sharedProviders, { provide: AuthService, useValue: mockAuthService(false) }] }),
  ],
  args: {
    navbarConfig: {
      ...publicConfig,
      brandLogo: 'assets/M2S2-logo-only.png',
    },
  },
};

export const WithAvatar: Story = {
  name: 'With profile avatar',
  decorators: [
    applicationConfig({ providers: [...sharedProviders, { provide: AuthService, useValue: mockAuthService(true) }] }),
  ],
  args: {
    navbarConfig: {
      ...publicConfig,
      loginButton: {
        userName:        'Jane Smith',
        profileImageUrl: 'assets/founder.png',
        dropdownItems: [
          new RouterLinkDropdownModel('dashboard', '', 'Dashboard', '/dashboard'),
          new RouterLinkDropdownModel('signout',   '', 'Sign Out',  '/login'),
        ],
      },
    },
  },
};
