import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig } from '@storybook/angular';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { NavbarComponent } from './navbar.component';
import { AuthService } from '../../services/auth/auth.service';
import { NavbarConfig } from '../../models/navbar/navbar-confing.model';
import { RouterLinkDropdownModel } from '../../models/dropdown/item/dropdown-item.model';

const mockAuthService = (loggedIn: boolean): Partial<AuthService> => ({
  loggedIn$: new BehaviorSubject(loggedIn),
  getCurrentUser: () => Promise.resolve(loggedIn ? { username: 'demo-user', userId: '1', signInDetails: undefined } as any : undefined),
  getCurrentSession: () => Promise.resolve(undefined),
  signOut: () => {},
});

const publicConfig: NavbarConfig = {
  brand:            'M²S²',
  brandLogo:        'assets/M2S2-logo-only.png',
  brandRouterOutlet: 'home',
  isFixed:          false,
  buttons: [
    { id: 'home',     title: 'Home',     routerLink: '/home'     },
    { id: 'about',    title: 'About',    routerLink: '/about'    },
    { id: 'services', title: 'Services', routerLink: '/services' },
    { id: 'blog',     title: 'Blog',     routerLink: '/blog'     },
    { id: 'contact',  title: 'Contact',  routerLink: '/contact'  },
    { id: 'dashboard', title: 'Dashboard', routerLink: '/dashboard', requiresAuth: true },
  ],
  loginButton: {
    dropdownItems: [
      new RouterLinkDropdownModel('dashboard', '', 'Dashboard', '/dashboard'),
      new RouterLinkDropdownModel('signout',   '', 'Sign Out',  '/login'),
    ],
  },
};

const meta: Meta<NavbarComponent> = {
  title:     'Components/Navbar',
  component: NavbarComponent,
  tags:      ['autodocs'],
  decorators: [
    applicationConfig({
      providers: [
        provideAnimationsAsync(),
        provideRouter([]),
      ],
    }),
  ],
  parameters: {
    layout: 'fullscreen',
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="min-height: 200px; position: relative;">
        <m2-navbar [navbarConfig]="navbarConfig"></m2-navbar>
      </div>
    `,
  }),
};

export default meta;
type Story = StoryObj<NavbarComponent>;

export const LoggedOut: Story = {
  name: 'Logged Out',
  decorators: [
    applicationConfig({
      providers: [
        provideAnimationsAsync(),
        provideRouter([]),
        { provide: AuthService, useValue: mockAuthService(false) },
      ],
    }),
  ],
  args: { navbarConfig: publicConfig },
};

export const LoggedIn: Story = {
  name: 'Logged In',
  decorators: [
    applicationConfig({
      providers: [
        provideAnimationsAsync(),
        provideRouter([]),
        { provide: AuthService, useValue: mockAuthService(true) },
      ],
    }),
  ],
  args: {
    navbarConfig: {
      ...publicConfig,
      loginButton: {
        userName:        'Michael Masterson',
        profileImageUrl: 'assets/founder.png',
        dropdownItems: [
          new RouterLinkDropdownModel('dashboard', '', 'Dashboard', '/dashboard'),
          new RouterLinkDropdownModel('signout',   '', 'Sign Out',  '/login'),
        ],
      },
    },
  },
};

export const AdminLoggedIn: Story = {
  name: 'Admin Logged In',
  decorators: [
    applicationConfig({
      providers: [
        provideAnimationsAsync(),
        provideRouter([]),
        { provide: AuthService, useValue: mockAuthService(true) },
      ],
    }),
  ],
  args: {
    navbarConfig: {
      ...publicConfig,
      buttons: [
        ...publicConfig.buttons,
        { id: 'admin', title: 'Admin', routerLink: '/admin', requiresAuth: true },
      ],
      loginButton: {
        userName:        'Michael Masterson',
        profileImageUrl: 'assets/founder.png',
        dropdownItems: [
          new RouterLinkDropdownModel('admin',     '', 'Admin',     '/admin'),
          new RouterLinkDropdownModel('dashboard', '', 'Dashboard', '/dashboard'),
          new RouterLinkDropdownModel('signout',   '', 'Sign Out',  '/login'),
        ],
      },
    },
  },
};
