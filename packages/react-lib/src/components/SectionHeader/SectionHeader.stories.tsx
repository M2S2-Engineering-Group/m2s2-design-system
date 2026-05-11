import type { Meta, StoryObj } from '@storybook/react';
import { SectionHeader } from './SectionHeader';

const meta: Meta<typeof SectionHeader> = {
  title: 'Components/SectionHeader',
  component: SectionHeader,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof SectionHeader>;

export const WithSubtitle: Story = {
  args: {
    config: {
      label: 'What We Do',
      subtitle: 'We partner with teams to design, build, and scale software products.',
    },
  },
};

export const LabelOnly: Story = {
  args: {
    config: { label: 'Our Work' },
  },
};
