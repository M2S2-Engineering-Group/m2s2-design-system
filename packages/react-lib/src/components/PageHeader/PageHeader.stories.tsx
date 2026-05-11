import type { Meta, StoryObj } from '@storybook/react';
import { PageHeader } from './PageHeader';

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
      title: 'Our Services',
      subtitle: 'End-to-end software consulting from architecture to deployment.',
    },
  },
};

export const ShortSubtitle: Story = {
  args: {
    config: {
      title: 'About Us',
      subtitle: 'We build software that scales.',
    },
  },
};
