import { mount, flushPromises } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { axe } from 'jest-axe';
import Chat from './Chat.vue';

const noopSend = vi.fn().mockResolvedValue('Hello from AI');

const mountChat = (overrides: Record<string, unknown> = {}) =>
  mount(Chat, { props: { sendMessage: noopSend, ...overrides } });

describe('Chat', () => {
  beforeEach(() => {
    noopSend.mockClear();
  });

  describe('open / close toggle', () => {
    it('renders the toggle button and panel is hidden initially', () => {
      const wrapper = mountChat();
      expect(wrapper.find('button[aria-label="Open chat"]').exists()).toBe(true);
      expect(wrapper.find('[role="dialog"]').exists()).toBe(false);
    });

    it('opens the panel when the toggle button is clicked', async () => {
      const wrapper = mountChat();
      await wrapper.find('button[aria-label="Open chat"]').trigger('click');
      expect(wrapper.find('[role="dialog"]').exists()).toBe(true);
    });

    it('closes the panel when the toggle is clicked again', async () => {
      const wrapper = mountChat();
      await wrapper.find('button[aria-label="Open chat"]').trigger('click');
      expect(wrapper.find('[role="dialog"]').exists()).toBe(true);
      await wrapper.find('button[aria-label="Close chat"]').trigger('click');
      expect(wrapper.find('[role="dialog"]').exists()).toBe(false);
    });
  });

  describe('title and subtitle', () => {
    it('renders the custom title in the panel header', async () => {
      const wrapper = mountChat({ title: 'My Assistant' });
      await wrapper.find('button[aria-label="Open chat"]').trigger('click');
      expect(wrapper.find('.chat-header__title').text()).toBe('My Assistant');
    });

    it('renders the subtitle when no messages exist', async () => {
      const wrapper = mountChat({ subtitle: 'Ask me anything' });
      await wrapper.find('button[aria-label="Open chat"]').trigger('click');
      expect(wrapper.find('.chat-header__subtitle').text()).toBe('Ask me anything');
    });
  });

  describe('sending messages', () => {
    it('calls sendMessage with the message history on submit via button', async () => {
      const sendMessage = vi.fn().mockResolvedValue('Reply');
      const wrapper = mountChat({ sendMessage });
      await wrapper.find('button[aria-label="Open chat"]').trigger('click');

      await wrapper.find('textarea').setValue('What is CQRS?');
      await wrapper.find('button[aria-label="Send"]').trigger('click');

      await flushPromises();
      expect(sendMessage).toHaveBeenCalledOnce();
      const [messages] = sendMessage.mock.calls[0];
      expect(messages).toContainEqual({ role: 'user', content: 'What is CQRS?' });
    });

    it('calls sendMessage when Enter is pressed without Shift', async () => {
      const sendMessage = vi.fn().mockResolvedValue('Reply');
      const wrapper = mountChat({ sendMessage });
      await wrapper.find('button[aria-label="Open chat"]').trigger('click');

      await wrapper.find('textarea').setValue('Hello?');
      await wrapper.find('textarea').trigger('keydown', { key: 'Enter', shiftKey: false });

      await flushPromises();
      expect(sendMessage).toHaveBeenCalledOnce();
    });

    it('does not submit on Shift+Enter', async () => {
      const sendMessage = vi.fn().mockResolvedValue('Reply');
      const wrapper = mountChat({ sendMessage });
      await wrapper.find('button[aria-label="Open chat"]').trigger('click');

      await wrapper.find('textarea').setValue('Hello?');
      await wrapper.find('textarea').trigger('keydown', { key: 'Enter', shiftKey: true });

      expect(sendMessage).not.toHaveBeenCalled();
    });

    it('renders the assistant message after sendMessage resolves', async () => {
      const sendMessage = vi.fn().mockResolvedValue('CQRS stands for Command Query Responsibility Segregation.');
      const wrapper = mountChat({ sendMessage });
      await wrapper.find('button[aria-label="Open chat"]').trigger('click');

      await wrapper.find('textarea').setValue('What is CQRS?');
      await wrapper.find('button[aria-label="Send"]').trigger('click');
      await flushPromises();

      const messages = wrapper.findAll('.chat-message--assistant .chat-message__text');
      expect(messages.some(m => m.text() === 'CQRS stands for Command Query Responsibility Segregation.')).toBe(true);
    });
  });

  describe('typing indicator', () => {
    it('shows the typing indicator while awaiting a response', async () => {
      let resolve!: (v: string) => void;
      const sendMessage = vi.fn().mockReturnValue(new Promise<string>(r => { resolve = r; }));
      const wrapper = mountChat({ sendMessage });
      await wrapper.find('button[aria-label="Open chat"]').trigger('click');

      await wrapper.find('textarea').setValue('Hello?');
      await wrapper.find('button[aria-label="Send"]').trigger('click');
      await wrapper.vm.$nextTick();

      expect(wrapper.find('.chat-typing').exists()).toBe(true);

      resolve('Done');
      await flushPromises();
    });

    it('hides the typing indicator after the response arrives', async () => {
      const sendMessage = vi.fn().mockResolvedValue('Done');
      const wrapper = mountChat({ sendMessage });
      await wrapper.find('button[aria-label="Open chat"]').trigger('click');

      await wrapper.find('textarea').setValue('Hello?');
      await wrapper.find('button[aria-label="Send"]').trigger('click');
      await flushPromises();

      expect(wrapper.find('.chat-typing').exists()).toBe(false);
    });
  });

  describe('error state', () => {
    it('shows an error message when sendMessage rejects', async () => {
      const sendMessage = vi.fn().mockRejectedValue(new Error('fail'));
      const wrapper = mountChat({ sendMessage });
      await wrapper.find('button[aria-label="Open chat"]').trigger('click');

      await wrapper.find('textarea').setValue('Will this fail?');
      await wrapper.find('button[aria-label="Send"]').trigger('click');
      await flushPromises();

      expect(wrapper.find('.chat-error').text()).toBe('Something went wrong — please try again.');
    });
  });

  describe('accessibility', () => {
    it('has no violations in closed state', async () => {
      const wrapper = mountChat();
      expect(await axe(wrapper.element)).toHaveNoViolations();
    });

    it('has no violations in open state', async () => {
      const wrapper = mountChat();
      await wrapper.find('button[aria-label="Open chat"]').trigger('click');
      expect(await axe(wrapper.element)).toHaveNoViolations();
    });
  });
});
