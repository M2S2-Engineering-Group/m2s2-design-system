import { render, screen } from '@testing-library/react';
import { makeNavbarConfig, makeNavbarButton } from '@m2s2/utils/testing';
import { Navbar } from './Navbar';

const renderNavbar = (props: Partial<React.ComponentProps<typeof Navbar>> = {}) =>
  render(
    <Navbar
      config={makeNavbarConfig()}
      {...props}
    />
  );

describe('Navbar', () => {
  it('renders the brand name', () => {
    renderNavbar({ config: makeNavbarConfig({ brand: 'Acme Corp' }) });
    expect(screen.getByText('Acme Corp')).toBeInTheDocument();
  });

  it('renders nav buttons that do not require auth', () => {
    renderNavbar({
      config: makeNavbarConfig({
        buttons: [makeNavbarButton({ id: '1', title: 'Home', requiresAuth: false })],
      }),
    });
    expect(screen.getByText('Home')).toBeInTheDocument();
  });

  it('hides buttons that require auth when loggedIn is false', () => {
    renderNavbar({
      config: makeNavbarConfig({
        buttons: [makeNavbarButton({ id: '1', title: 'Dashboard', requiresAuth: true })],
      }),
      loggedIn: false,
    });
    expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
  });

  it('shows buttons that require auth when loggedIn is true', () => {
    renderNavbar({
      config: makeNavbarConfig({
        buttons: [makeNavbarButton({ id: '1', title: 'Dashboard', requiresAuth: true })],
      }),
      loggedIn: true,
    });
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('renders the mobile hamburger button', () => {
    renderNavbar();
    expect(screen.getByRole('button', { name: 'Open navigation menu' })).toBeInTheDocument();
  });
});
