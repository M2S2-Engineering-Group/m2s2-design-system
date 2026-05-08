import type { Meta, StoryObj } from '@storybook/angular';
import { CtaSectionComponent } from './cta-section.component';

const meta: Meta<CtaSectionComponent> = {
  title: 'Components/CtaSection',
  component: CtaSectionComponent,
  tags: ['autodocs'],
  render: (args) => ({
    props: args,
    template: `<m2s2-cta-section [config]="config" />`,
  }),
};
export default meta;
type Story = StoryObj<CtaSectionComponent>;

export const Default: Story = {
  args: {
    config: {
      title: 'Ready to ship something great?',
      body: 'Let\'s talk about your next platform, team challenge, or architecture problem.',
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
