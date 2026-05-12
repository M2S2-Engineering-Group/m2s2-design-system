import type { Meta, StoryObj } from '@storybook/react';
import { SubscribeForm } from './SubscribeForm';

const meta: Meta<typeof SubscribeForm> = {
  title: 'Components/SubscribeForm',
  component: SubscribeForm,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};
export default meta;
type Story = StoryObj<typeof SubscribeForm>;

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const AnonMode: Story = {
  args: {
    mode: 'anon',
    subscribeAnon: async (email, name) => {
      await delay(1200);
      console.log('subscribeAnon', { email, name });
    },
  },
};

export const AnonError: Story = {
  args: {
    mode: 'anon',
    subscribeAnon: async () => {
      await delay(800);
      throw new Error('Server error');
    },
  },
};

export const AnonDone: Story = {
  args: {
    mode: 'anon',
    initialState: 'done',
    subscribeAnon: async () => {},
  },
};

export const AuthMode: Story = {
  args: {
    mode: 'auth',
    subscribeAuth: async () => { await delay(1000); },
    unsubscribeAuth: async () => { await delay(800); },
  },
};
