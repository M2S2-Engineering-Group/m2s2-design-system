import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import { axe } from 'jest-axe';
import Panel from './Panel.vue';
import { makeM2S2PanelData } from '@m2s2/utils/testing';

const mountPanel = (open: boolean, overrides = {}) =>
  mount(Panel, {
    props: { data: makeM2S2PanelData(overrides), open },
    attachTo: document.body,
    global: { stubs: { teleport: true } },
  });

describe('Panel', () => {
  it('is not visible when open=false', () => {
    const wrapper = mountPanel(false);
    expect(wrapper.find('.m2s2-panel-content').exists()).toBe(false);
  });

  it('renders the title when open=true', () => {
    const wrapper = mountPanel(true, { title: 'User Details' });
    expect(wrapper.find('.panel-title').text()).toBe('User Details');
  });

  it('emits action with the action value on button click', async () => {
    const wrapper = mountPanel(true, {
      actions: [{ label: 'Save', value: 'save', variant: 'primary' }],
    });
    await wrapper.find('.panel-btn').trigger('click');
    expect(wrapper.emitted('action')?.[0]).toEqual(['save']);
  });

  it('emits close when close button is clicked', async () => {
    const wrapper = mountPanel(true, { modal: false });
    await wrapper.find('.panel-close').trigger('click');
    expect(wrapper.emitted('close')).toBeTruthy();
  });

  it('does not show close button on a modal panel', () => {
    const wrapper = mountPanel(true, { modal: true });
    expect(wrapper.find('.panel-close').exists()).toBe(false);
  });

  describe('accessibility', () => {
    it('has no violations when closed', async () => {
      const wrapper = mountPanel(false);
      expect(await axe(wrapper.element)).toHaveNoViolations();
    });

    it('has no violations when open', async () => {
      const wrapper = mountPanel(true, { title: 'User Details' });
      expect(await axe(wrapper.element)).toHaveNoViolations();
    });
  });
});
