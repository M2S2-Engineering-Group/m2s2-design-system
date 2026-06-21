import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import { axe } from 'jest-axe';
import StatusBadge from './StatusBadge.vue';

describe('StatusBadge', () => {
  it('renders a span element', () => {
    const wrapper = mount(StatusBadge, { props: { status: 'unknown' } });
    expect(wrapper.find('span').exists()).toBe(true);
  });

  it('applies the m2s2-status-badge class', () => {
    const wrapper = mount(StatusBadge, { props: { status: 'received' } });
    expect(wrapper.find('span').element).toHaveClass('m2s2-status-badge');
  });

  it('sets data-status attribute', () => {
    const wrapper = mount(StatusBadge, { props: { status: 'received' } });
    expect(wrapper.find('span').attributes('data-status')).toBe('received');
  });

  it('maps known status values via STATUS_LABELS', () => {
    const wrapper = mount(StatusBadge, { props: { status: 'received' } });
    expect(wrapper.find('span').text()).toBe('Received');
  });

  it('falls back to the status string for unknown statuses', () => {
    const wrapper = mount(StatusBadge, { props: { status: 'custom-status' } });
    expect(wrapper.find('span').text()).toBe('custom-status');
  });

  it('uses an explicit label over STATUS_LABELS', () => {
    const wrapper = mount(StatusBadge, { props: { status: 'received', label: 'Override' } });
    expect(wrapper.find('span').text()).toBe('Override');
  });

  it('defaults variant to badge', () => {
    const wrapper = mount(StatusBadge, { props: { status: 'received' } });
    expect(wrapper.find('span').attributes('data-variant')).toBe('badge');
  });

  it('applies the pill variant', () => {
    const wrapper = mount(StatusBadge, { props: { status: 'received', variant: 'pill' } });
    expect(wrapper.find('span').attributes('data-variant')).toBe('pill');
  });

  describe('accessibility', () => {
    it('has no violations with default badge variant', async () => {
      const wrapper = mount(StatusBadge, { props: { status: 'received' } });
      expect(await axe(wrapper.element)).toHaveNoViolations();
    });

    it('has no violations with pill variant', async () => {
      const wrapper = mount(StatusBadge, { props: { status: 'received', variant: 'pill' } });
      expect(await axe(wrapper.element)).toHaveNoViolations();
    });
  });
});
