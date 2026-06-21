import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import { axe } from 'jest-axe';
import ProcessSteps from './ProcessSteps.vue';
import { makeProcessSteps } from '@m2s2/utils/testing';

describe('ProcessSteps', () => {
  it('renders each step number', () => {
    const steps = makeProcessSteps(3);
    const wrapper = mount(ProcessSteps, { props: { steps } });
    const nums = wrapper.findAll('.ps-num');
    expect(nums).toHaveLength(3);
    steps.forEach((step, i) => expect(nums[i].text()).toBe(step.num));
  });

  it('renders each step name', () => {
    const steps = makeProcessSteps(3);
    const wrapper = mount(ProcessSteps, { props: { steps } });
    const names = wrapper.findAll('.ps-name');
    expect(names).toHaveLength(3);
    steps.forEach((step, i) => expect(names[i].text()).toBe(step.name));
  });

  it('renders each step description', () => {
    const steps = makeProcessSteps(3);
    const wrapper = mount(ProcessSteps, { props: { steps } });
    const descs = wrapper.findAll('.ps-desc');
    expect(descs).toHaveLength(3);
    steps.forEach((step, i) => expect(descs[i].text()).toBe(step.desc));
  });

  describe('accessibility', () => {
    it('has no violations', async () => {
      const wrapper = mount(ProcessSteps, { props: { steps: makeProcessSteps(3) } });
      expect(await axe(wrapper.element)).toHaveNoViolations();
    });
  });
});
