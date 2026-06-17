import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import CtaSection from './CtaSection.vue';
import { makeCtaConfig } from '@m2s2/utils/testing';

describe('CtaSection', () => {
  it('renders the title', () => {
    const wrapper = mount(CtaSection, { props: { config: makeCtaConfig({ title: 'Join Us' }) } });
    expect(wrapper.find('.cta-title').text()).toBe('Join Us');
  });

  it('renders the body', () => {
    const wrapper = mount(CtaSection, { props: { config: makeCtaConfig({ body: 'We help you ship.' }) } });
    expect(wrapper.find('.cta-body').text()).toBe('We help you ship.');
  });

  it('renders the link label', () => {
    const wrapper = mount(CtaSection, { props: { config: makeCtaConfig({ label: 'Get Started' }) } });
    expect(wrapper.find('a.cta-btn').text()).toBe('Get Started');
  });

  it('link href matches config.route', () => {
    const wrapper = mount(CtaSection, { props: { config: makeCtaConfig({ route: '/contact' }) } });
    expect(wrapper.find('a.cta-btn').attributes('href')).toBe('/contact');
  });
});
