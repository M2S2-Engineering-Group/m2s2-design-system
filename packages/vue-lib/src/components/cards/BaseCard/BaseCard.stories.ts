import type { Meta, StoryObj } from '@storybook/vue3';
import BaseCard from './BaseCard.vue';

const meta: Meta<typeof BaseCard> = {
  title: 'Cards/BaseCard',
  component: BaseCard,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['default', 'raised', 'accent'] },
    featured: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<typeof BaseCard>;

const defaultSlot = `
  <h3 style="margin:0;font-size:1.1rem">Card Title</h3>
  <p style="margin:0;color:var(--color-on-surface-muted)">
    This is the projected content slot. Any markup can go here.
  </p>
`;

export const Default: Story = {
  args: { variant: 'default', featured: false },
  render: (args) => ({
    components: { BaseCard },
    setup: () => ({ args }),
    template: `<BaseCard v-bind="args">${defaultSlot}</BaseCard>`,
  }),
};

export const Raised: Story = {
  args: { variant: 'raised', featured: false },
  render: Default.render,
};

export const Accent: Story = {
  args: { variant: 'accent', featured: false },
  render: Default.render,
};

export const Featured: Story = {
  args: { variant: 'default', featured: true },
  render: Default.render,
};
