import { mount, flushPromises } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import { axe } from 'jest-axe';
import SubscribeForm from './SubscribeForm.vue';

describe('SubscribeForm — anon mode', () => {
  it('renders email and name inputs', () => {
    const wrapper = mount(SubscribeForm);
    expect(wrapper.find('input[placeholder="your@email.com"]').exists()).toBe(true);
    expect(wrapper.find('input[placeholder="Your name (optional)"]').exists()).toBe(true);
  });

  it('renders a disabled subscribe button when email is empty', () => {
    const wrapper = mount(SubscribeForm);
    const btn = wrapper.find('button');
    expect((btn.element as HTMLButtonElement).disabled).toBe(true);
  });

  it('enables the button when a valid email is entered', async () => {
    const wrapper = mount(SubscribeForm);
    await wrapper.find('input[type="email"]').setValue('test@example.com');
    const btn = wrapper.find('button');
    expect((btn.element as HTMLButtonElement).disabled).toBe(false);
  });

  it('keeps the button disabled for an invalid email', async () => {
    const wrapper = mount(SubscribeForm);
    await wrapper.find('input[type="email"]').setValue('not-an-email');
    const btn = wrapper.find('button');
    expect((btn.element as HTMLButtonElement).disabled).toBe(true);
  });

  it('calls subscribeAnon with trimmed email and name on submit', async () => {
    const subscribeAnon = vi.fn().mockResolvedValue(undefined);
    const wrapper = mount(SubscribeForm, { props: { subscribeAnon } });
    await wrapper.find('input[placeholder="Your name (optional)"]').setValue('Jane');
    await wrapper.find('input[type="email"]').setValue('jane@example.com');
    await wrapper.find('button').trigger('click');
    await flushPromises();
    expect(subscribeAnon).toHaveBeenCalledWith('jane@example.com', 'Jane');
  });

  it('shows a success message after a successful submit', async () => {
    const subscribeAnon = vi.fn().mockResolvedValue(undefined);
    const wrapper = mount(SubscribeForm, { props: { subscribeAnon } });
    await wrapper.find('input[type="email"]').setValue('test@example.com');
    await wrapper.find('button').trigger('click');
    await flushPromises();
    expect(wrapper.find('.sub-success').exists()).toBe(true);
    expect(wrapper.text()).toMatch(/check your email/i);
  });

  it('shows an error message when subscribeAnon rejects', async () => {
    const subscribeAnon = vi.fn().mockRejectedValue(new Error('Network error'));
    const wrapper = mount(SubscribeForm, { props: { subscribeAnon } });
    await wrapper.find('input[type="email"]').setValue('test@example.com');
    await wrapper.find('button').trigger('click');
    await flushPromises();
    expect(wrapper.find('.sub-feedback--error').exists()).toBe(true);
    expect(wrapper.text()).toMatch(/something went wrong/i);
  });

  describe('accessibility', () => {
    it('has no violations in default state', async () => {
      const wrapper = mount(SubscribeForm);
      expect(await axe(wrapper.element)).toHaveNoViolations();
    });
  });
});

describe('SubscribeForm — auth mode', () => {
  it('renders a subscribe button', () => {
    const wrapper = mount(SubscribeForm, { props: { mode: 'auth' } });
    const btn = wrapper.find('button');
    expect(btn.exists()).toBe(true);
    expect(btn.text()).toMatch(/subscribe to blog updates/i);
  });

  it('does not render email or name inputs', () => {
    const wrapper = mount(SubscribeForm, { props: { mode: 'auth' } });
    expect(wrapper.find('input[type="email"]').exists()).toBe(false);
    expect(wrapper.find('input[placeholder="Your name (optional)"]').exists()).toBe(false);
  });

  it('calls subscribeAuth when subscribe is clicked', async () => {
    const subscribeAuth = vi.fn().mockResolvedValue(undefined);
    const wrapper = mount(SubscribeForm, { props: { mode: 'auth', subscribeAuth } });
    await wrapper.find('button').trigger('click');
    await flushPromises();
    expect(subscribeAuth).toHaveBeenCalledTimes(1);
  });

  it('shows subscribed label after successful subscribe', async () => {
    const subscribeAuth = vi.fn().mockResolvedValue(undefined);
    const wrapper = mount(SubscribeForm, { props: { mode: 'auth', subscribeAuth } });
    await wrapper.find('button').trigger('click');
    await flushPromises();
    expect(wrapper.text()).toMatch(/subscribed to blog updates/i);
  });

  it('shows an unsubscribe button after subscribing', async () => {
    const subscribeAuth = vi.fn().mockResolvedValue(undefined);
    const wrapper = mount(SubscribeForm, { props: { mode: 'auth', subscribeAuth } });
    await wrapper.find('button').trigger('click');
    await flushPromises();
    expect(wrapper.find('.sub-btn--unsub').exists()).toBe(true);
    expect(wrapper.find('.sub-btn--unsub').text()).toMatch(/unsubscribe/i);
  });

  it('calls unsubscribeAuth when unsubscribe is clicked', async () => {
    const subscribeAuth = vi.fn().mockResolvedValue(undefined);
    const unsubscribeAuth = vi.fn().mockResolvedValue(undefined);
    const wrapper = mount(SubscribeForm, { props: { mode: 'auth', subscribeAuth, unsubscribeAuth } });
    await wrapper.find('button').trigger('click');
    await flushPromises();
    await wrapper.find('.sub-btn--unsub').trigger('click');
    await flushPromises();
    expect(unsubscribeAuth).toHaveBeenCalledTimes(1);
  });

  it('shows an error message when subscribeAuth rejects', async () => {
    const subscribeAuth = vi.fn().mockRejectedValue(new Error('fail'));
    const wrapper = mount(SubscribeForm, { props: { mode: 'auth', subscribeAuth } });
    await wrapper.find('button').trigger('click');
    await flushPromises();
    expect(wrapper.find('.sub-feedback--error').exists()).toBe(true);
    expect(wrapper.text()).toMatch(/something went wrong/i);
  });

  describe('accessibility', () => {
    it('has no violations in auth mode', async () => {
      const wrapper = mount(SubscribeForm, { props: { mode: 'auth' } });
      expect(await axe(wrapper.element)).toHaveNoViolations();
    });
  });
});
