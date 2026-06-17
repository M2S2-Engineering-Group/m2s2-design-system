import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import Footer from './Footer.vue';
import { makeFooterConfig, makeFooterSocialLink } from '@m2s2/utils/testing';

describe('Footer', () => {
  it('renders brand name in copyright', () => {
    const wrapper = mount(Footer, { props: { config: makeFooterConfig({ brandName: 'Acme Corp' }) } });
    expect(wrapper.find('.footer-copy').text()).toContain('Acme Corp');
  });

  it('renders current year in copyright', () => {
    const wrapper = mount(Footer, { props: { config: makeFooterConfig() } });
    expect(wrapper.find('.footer-copy').text()).toContain(String(new Date().getFullYear()));
  });

  it('renders a github link', () => {
    const config = makeFooterConfig({
      links: [makeFooterSocialLink({ type: 'github', href: 'https://github.com/test' })],
    });
    const wrapper = mount(Footer, { props: { config } });
    const link = wrapper.find('a.social-link');
    expect(link.exists()).toBe(true);
    expect(link.attributes('href')).toBe('https://github.com/test');
  });

  it('renders nothing in the social nav when links is empty', () => {
    const wrapper = mount(Footer, { props: { config: makeFooterConfig({ links: [] }) } });
    expect(wrapper.findAll('a.social-link')).toHaveLength(0);
  });
});
