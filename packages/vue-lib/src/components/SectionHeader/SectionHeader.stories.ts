import type { Meta, StoryObj } from '@storybook/vue3';
import SectionHeader from './SectionHeader.vue';

const meta: Meta<typeof SectionHeader> = {
  title: 'Components/SectionHeader',
  component: SectionHeader,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof SectionHeader>;

export const LabelOnly: Story = {
  args: {
    config: { label: 'What We Do' },
  },
};

export const WithSubtitle: Story = {
  args: {
    config: {
      label: 'Core Expertise',
      subtitle: 'The disciplines we bring to every engagement, refined over 15 years of shipping production software.',
    },
  },
};
