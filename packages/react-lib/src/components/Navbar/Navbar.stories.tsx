import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Navbar } from './Navbar';
import type { NavbarConfig, AnchorDropdownItem, ClickableDropdownItem } from '@m2s2/models';

const BASE_CONFIG: NavbarConfig = {
  brand: 'M²S²',
  brandPath: '/',
  isFixed: false,
  buttons: [
    { id: 'home',     title: 'Home',     href: '/' },
    { id: 'services', title: 'Services', href: '/services' },
    {
      id: 'resources',
      title: 'Resources',
      isDropdown: true,
      dropdownItems: [
        { id: 'blog',   text: 'Blog',          href: '/blog' }                                     as AnchorDropdownItem,
        { id: 'docs',   text: 'Documentation', href: '/docs' }                                     as AnchorDropdownItem,
        { id: 'github', text: 'GitHub',        href: 'https://github.com/M2S2-Engineering-Group' } as AnchorDropdownItem,
      ],
    },
    { id: 'contact', title: 'Contact', href: '/contact' },
  ],
  loginButton: {
    dropdownItems: [
      { id: 'login',   text: 'Sign in',  requiresAuth: false, onClick: () => alert('login')  } as ClickableDropdownItem,
      { id: 'logout',  text: 'Sign out', requiresAuth: true,  onClick: () => alert('logout') } as ClickableDropdownItem,
      { id: 'profile', text: 'Profile',  requiresAuth: true,  href: '/profile' }               as AnchorDropdownItem,
    ],
  },
};

function NavbarDemo({ loggedIn: initial = false }) {
  const [loggedIn, setLoggedIn] = useState(initial);
  const config: NavbarConfig = {
    ...BASE_CONFIG,
    loginButton: {
      userName: loggedIn ? 'Jane Smith' : undefined,
      dropdownItems: [
        { id: 'login',   text: 'Sign in',  requiresAuth: false, onClick: () => setLoggedIn(true)  } as ClickableDropdownItem,
        { id: 'logout',  text: 'Sign out', requiresAuth: true,  onClick: () => setLoggedIn(false) } as ClickableDropdownItem,
        { id: 'profile', text: 'Profile',  requiresAuth: true,  href: '/profile' }                  as AnchorDropdownItem,
      ],
    },
  };
  return (
    <div style={{ minHeight: '200px' }}>
      <Navbar config={config} loggedIn={loggedIn} />
      <div style={{ padding: '24px', color: 'var(--color-on-surface-muted)', fontSize: '0.875rem' }}>
        {loggedIn ? 'Logged in as Jane Smith. Click "Sign out" in the account menu.' : 'Logged out. Click the account icon → Sign in.'}
      </div>
    </div>
  );
}

const meta: Meta = {
  title: 'Components/Navbar',
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};
export default meta;

export const LoggedOut: StoryObj = {
  name: 'Logged out',
  render: () => <NavbarDemo loggedIn={false} />,
};

export const LoggedIn: StoryObj = {
  name: 'Logged in',
  render: () => <NavbarDemo loggedIn={true} />,
};

export const WithLogo: StoryObj = {
  name: 'With logo image',
  render: () => (
    <div style={{ minHeight: '200px' }}>
      <Navbar
        config={{
          ...BASE_CONFIG,
          brandLogo: '/assets/logo-placeholder.svg',
        }}
        loggedIn={false}
      />
    </div>
  ),
};

export const WithAvatar: StoryObj = {
  name: 'With profile avatar',
  render: () => (
    <div style={{ minHeight: '200px' }}>
      <Navbar
        config={{
          ...BASE_CONFIG,
          loginButton: {
            userName: 'Jane Smith',
            profileImageUrl: '/assets/avatar-placeholder.svg',
            dropdownItems: [
              { id: 'logout',  text: 'Sign out', requiresAuth: true,  onClick: () => alert('logout') } as ClickableDropdownItem,
              { id: 'profile', text: 'Profile',  requiresAuth: true,  href: '/profile' }               as AnchorDropdownItem,
            ],
          },
        }}
        loggedIn={true}
      />
    </div>
  ),
};
