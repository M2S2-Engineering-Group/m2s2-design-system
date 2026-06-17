import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import SocialIcon from './SocialIcon.vue';

describe('SocialIcon', () => {
  it('renders an svg for github', () => {
    const wrapper = mount(SocialIcon, { props: { type: 'github' } });
    expect(wrapper.find('svg').exists()).toBe(true);
  });

  it('renders an svg for linkedin', () => {
    const wrapper = mount(SocialIcon, { props: { type: 'linkedin' } });
    expect(wrapper.find('svg').exists()).toBe(true);
  });

  it('renders an svg for twitter', () => {
    const wrapper = mount(SocialIcon, { props: { type: 'twitter' } });
    expect(wrapper.find('svg').exists()).toBe(true);
  });

  it('renders an svg for email', () => {
    const wrapper = mount(SocialIcon, { props: { type: 'email' } });
    expect(wrapper.find('svg').exists()).toBe(true);
  });

  it('renders only one svg at a time', () => {
    const wrapper = mount(SocialIcon, { props: { type: 'github' } });
    expect(wrapper.findAll('svg')).toHaveLength(1);
  });
});
