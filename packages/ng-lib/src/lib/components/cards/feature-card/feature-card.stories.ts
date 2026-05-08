import type { Meta, StoryObj } from '@storybook/angular';
import { FeatureCardComponent } from './feature-card.component';

const meta: Meta<FeatureCardComponent> = {
  title: 'Cards/FeatureCard',
  component: FeatureCardComponent,
  tags: ['autodocs'],
  render: (args) => ({
    props: args,
    template: `<m2s2-feature-card [config]="config" style="display:block;max-width:360px" />`,
  }),
};
export default meta;
type Story = StoryObj<FeatureCardComponent>;

export const Default: Story = {
  args: {
    config: {
      icon: '🚀',
      title: 'Ship Faster',
      body: 'Accelerate your delivery pipeline with battle-tested engineering practices and tooling.',
    },
  },
};

export const Featured: Story = {
  args: {
    config: {
      icon: '⭐',
      title: 'Featured Capability',
      body: 'This card is highlighted to draw attention to a key offering.',
      featured: true,
    },
  },
};

export const WithItems: Story = {
  args: {
    config: {
      icon: '🛠️',
      title: 'Platform Engineering',
      body: 'End-to-end platform work covering:',
      items: ['CI/CD pipelines', 'Infrastructure as code', 'Observability stack', 'Developer tooling'],
    },
  },
};

export const WithNote: Story = {
  args: {
    config: {
      icon: '📋',
      title: 'Advisory Retainer',
      body: 'Ongoing strategic guidance for engineering leadership.',
      note: 'Limited availability — contact for details.',
    },
  },
};

export const NoIcon: Story = {
  args: {
    config: {
      title: 'No Icon Variant',
      body: 'Some cards may not have an icon — just a title and body.',
    },
  },
};
