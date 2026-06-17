import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import PageHeader from './PageHeader.vue';
import { makePageHeaderConfig } from '@m2s2/utils/testing';

describe('PageHeader', () => {
  it('renders h1 with the title', () => {
    const wrapper = mount(PageHeader, { props: { config: makePageHeaderConfig({ title: 'About Us' }) } });
    expect(wrapper.find('h1.page-title').text()).toBe('About Us');
  });

  it('renders the subtitle in a paragraph', () => {
    const wrapper = mount(PageHeader, {
      props: { config: makePageHeaderConfig({ subtitle: 'We build things.' }) },
    });
    expect(wrapper.find('p.page-subtitle').text()).toBe('We build things.');
  });
});
