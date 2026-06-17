import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import FeatureCard from './FeatureCard.vue';
import { makeFeatureCardConfig } from '@m2s2/utils/testing';

describe('FeatureCard', () => {
  it('renders the title', () => {
    const wrapper = mount(FeatureCard, { props: { config: makeFeatureCardConfig({ title: 'Fast Deploys' }) } });
    expect(wrapper.find('.fc-title').text()).toBe('Fast Deploys');
  });

  it('renders the body', () => {
    const wrapper = mount(FeatureCard, { props: { config: makeFeatureCardConfig({ body: 'Deploy in seconds.' }) } });
    expect(wrapper.find('.fc-body').text()).toBe('Deploy in seconds.');
  });

  it('renders items list when provided', () => {
    const wrapper = mount(FeatureCard, {
      props: { config: makeFeatureCardConfig({ items: ['Item A', 'Item B'] }) },
    });
    const items = wrapper.findAll('.fc-list li');
    expect(items).toHaveLength(2);
    expect(items[0].text()).toBe('Item A');
    expect(items[1].text()).toBe('Item B');
  });

  it('does not render items list when items is absent', () => {
    const wrapper = mount(FeatureCard, { props: { config: makeFeatureCardConfig() } });
    expect(wrapper.find('.fc-list').exists()).toBe(false);
  });

  it('renders the note when provided', () => {
    const wrapper = mount(FeatureCard, {
      props: { config: makeFeatureCardConfig({ note: 'Requires Pro plan.' }) },
    });
    expect(wrapper.find('.fc-note').text()).toBe('Requires Pro plan.');
  });

  it('does not render a note element when note is absent', () => {
    const wrapper = mount(FeatureCard, { props: { config: makeFeatureCardConfig() } });
    expect(wrapper.find('.fc-note').exists()).toBe(false);
  });
});
