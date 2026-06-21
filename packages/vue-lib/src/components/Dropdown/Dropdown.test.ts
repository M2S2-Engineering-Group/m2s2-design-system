import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import { axe } from 'jest-axe';
import Dropdown from './Dropdown.vue';

const items = [
  { id: '1', text: 'Profile', href: '/profile' },
  { id: '2', text: 'Settings', href: '/settings' },
];

describe('Dropdown', () => {
  it('renders the trigger slot', () => {
    const wrapper = mount(Dropdown, {
      props: { items },
      slots: { default: '<span class="trigger-btn">Open</span>' },
    });
    expect(wrapper.find('.trigger-btn').exists()).toBe(true);
  });

  it('menu is closed by default', () => {
    const wrapper = mount(Dropdown, { props: { items } });
    expect(wrapper.find('.m2s2-dropdown__menu').exists()).toBe(false);
  });

  it('opens the menu on trigger click', async () => {
    const wrapper = mount(Dropdown, { props: { items } });
    await wrapper.find('.m2s2-dropdown__trigger').trigger('click');
    expect(wrapper.find('.m2s2-dropdown__menu').exists()).toBe(true);
  });

  it('closes the menu on second trigger click', async () => {
    const wrapper = mount(Dropdown, { props: { items } });
    await wrapper.find('.m2s2-dropdown__trigger').trigger('click');
    await wrapper.find('.m2s2-dropdown__trigger').trigger('click');
    expect(wrapper.find('.m2s2-dropdown__menu').exists()).toBe(false);
  });

  it('renders all items in the menu', async () => {
    const wrapper = mount(Dropdown, { props: { items } });
    await wrapper.find('.m2s2-dropdown__trigger').trigger('click');
    expect(wrapper.findAll('.m2s2-dropdown__item')).toHaveLength(2);
  });

  describe('accessibility', () => {
    it('has no violations when closed', async () => {
      const wrapper = mount(Dropdown, {
        props: { items },
        slots: { default: '<span>Menu</span>' },
      });
      expect(await axe(wrapper.element)).toHaveNoViolations();
    });

    it('has no violations when open', async () => {
      const wrapper = mount(Dropdown, {
        props: { items },
        slots: { default: '<span>Menu</span>' },
      });
      await wrapper.find('.m2s2-dropdown__trigger').trigger('click');
      expect(await axe(wrapper.element)).toHaveNoViolations();
    });
  });
});
