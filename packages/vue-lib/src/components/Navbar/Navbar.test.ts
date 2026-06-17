import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import { makeNavbarConfig, makeNavbarButton } from '@m2s2/utils/testing';
import Navbar from './Navbar.vue';

const mountNavbar = (props: Record<string, unknown> = {}) =>
  mount(Navbar, {
    props: { config: makeNavbarConfig(), ...props },
    attachTo: document.body,
  });

describe('Navbar', () => {
  it('renders the brand name', () => {
    const wrapper = mountNavbar({ config: makeNavbarConfig({ brand: 'Acme Corp' }) });
    expect(wrapper.find('.navbar-brand-text').text()).toBe('Acme Corp');
    wrapper.unmount();
  });

  it('renders nav buttons that do not require auth', () => {
    const wrapper = mountNavbar({
      config: makeNavbarConfig({
        buttons: [makeNavbarButton({ id: '1', title: 'Home', requiresAuth: false })],
      }),
    });
    expect(wrapper.find('.navbar-nav-btn').text()).toBe('Home');
    wrapper.unmount();
  });

  it('hides buttons that require auth when loggedIn is false', () => {
    const wrapper = mountNavbar({
      config: makeNavbarConfig({
        buttons: [makeNavbarButton({ id: '1', title: 'Dashboard', requiresAuth: true })],
      }),
      loggedIn: false,
    });
    expect(wrapper.findAll('.navbar-nav-btn')).toHaveLength(0);
    wrapper.unmount();
  });

  it('shows buttons that require auth when loggedIn is true', () => {
    const wrapper = mountNavbar({
      config: makeNavbarConfig({
        buttons: [makeNavbarButton({ id: '1', title: 'Dashboard', requiresAuth: true })],
      }),
      loggedIn: true,
    });
    expect(wrapper.find('.navbar-nav-btn').text()).toBe('Dashboard');
    wrapper.unmount();
  });

  it('renders the mobile hamburger button', () => {
    const wrapper = mountNavbar();
    expect(wrapper.find('.navbar-mobile-btn').exists()).toBe(true);
    wrapper.unmount();
  });
});
