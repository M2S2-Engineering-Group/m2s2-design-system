import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import StatRow from './StatRow.vue';
import { makeStatItems } from '@m2s2/utils/testing';

describe('StatRow', () => {
  it('renders each stat value', () => {
    const stats = makeStatItems(3);
    const wrapper = mount(StatRow, { props: { stats } });
    const values = wrapper.findAll('.sr-value');
    expect(values).toHaveLength(3);
    stats.forEach((stat, i) => expect(values[i].text()).toBe(stat.value));
  });

  it('renders each stat label', () => {
    const stats = makeStatItems(3);
    const wrapper = mount(StatRow, { props: { stats } });
    const labels = wrapper.findAll('.sr-label');
    expect(labels).toHaveLength(3);
    stats.forEach((stat, i) => expect(labels[i].text()).toBe(stat.label));
  });

  it('renders dividers between stats but not after the last', () => {
    const stats = makeStatItems(3);
    const wrapper = mount(StatRow, { props: { stats } });
    expect(wrapper.findAll('.sr-divider')).toHaveLength(2);
  });
});
