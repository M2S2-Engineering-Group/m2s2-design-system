import type { Meta, StoryObj } from '@storybook/vue3';
import CtaSection from './CtaSection.vue';

const meta: Meta<typeof CtaSection> = {
  title: 'Components/CtaSection',
  component: CtaSection,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof CtaSection>;

export const Default: Story = {
  args: {
    config: {
      title: 'Ready to ship something great?',
      body: "Let's talk about your next platform, team challenge, or architecture problem.",
      label: 'Start a Conversation',
      route: '/contact',
    },
  },
};

export const ExternalLink: Story = {
  args: {
    config: {
      title: 'Read the latest from the engineering blog',
      body: 'Practical guides on distributed systems, team leadership, and shipping at scale.',
      label: 'Browse Articles',
      route: '/blog',
    },
  },
};
