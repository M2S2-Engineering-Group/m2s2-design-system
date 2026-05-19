import type { Meta, StoryObj } from '@storybook/vue3';
import SubscribeForm from './SubscribeForm.vue';

const delay = (ms: number) => new Promise<void>(res => setTimeout(res, ms));

const meta: Meta<typeof SubscribeForm> = {
  title: 'Components/SubscribeForm',
  component: SubscribeForm,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  decorators: [
    () => ({
      template: `
        <div style="
          max-width: 480px;
          margin: 48px auto;
          padding: 32px;
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: 16px;
        ">
          <story />
        </div>
      `,
    }),
  ],
};
export default meta;
type Story = StoryObj<typeof SubscribeForm>;

export const Anonymous: Story = {
  name: 'Anonymous — email + name form',
  args: {
    mode: 'anon',
    subscribeAnon: async (email: string, name: string) => {
      await delay(1200);
      console.log('subscribeAnon', { email, name });
    },
  },
};

export const AnonymousError: Story = {
  name: 'Anonymous — API error state',
  args: {
    mode: 'anon',
    subscribeAnon: async () => {
      await delay(800);
      throw new Error('Server error');
    },
  },
};

export const Authenticated: Story = {
  name: 'Authenticated — one-click subscribe',
  args: {
    mode: 'auth',
    subscribeAuth: async () => { await delay(1000); },
    unsubscribeAuth: async () => { await delay(800); },
  },
};

export const AuthenticatedError: Story = {
  name: 'Authenticated — API error state',
  args: {
    mode: 'auth',
    subscribeAuth: async () => { await delay(600); throw new Error('Server error'); },
    unsubscribeAuth: async () => { await delay(600); throw new Error('Server error'); },
  },
};
