import type { Meta, StoryObj } from '@storybook/vue3';
import PageHeader from './PageHeader.vue';

const meta: Meta<typeof PageHeader> = {
  title: 'Components/PageHeader',
  component: PageHeader,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof PageHeader>;

export const Default: Story = {
  args: {
    config: {
      title: 'Get in Touch',
      subtitle: "Have a project in mind or just want to chat? We'd love to hear from you.",
    },
  },
};

export const ShortSubtitle: Story = {
  args: {
    config: {
      title: 'Admin',
      subtitle: 'Manage inquiries and subscribers.',
    },
  },
};
