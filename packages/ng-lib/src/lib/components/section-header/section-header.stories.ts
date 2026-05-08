import type { Meta, StoryObj } from '@storybook/angular';
import { SectionHeaderComponent } from './section-header.component';

const meta: Meta<SectionHeaderComponent> = {
  title: 'Components/SectionHeader',
  component: SectionHeaderComponent,
  tags: ['autodocs'],
  render: (args) => ({
    props: args,
    template: `<m2s2-section-header [config]="config" />`,
  }),
};
export default meta;
type Story = StoryObj<SectionHeaderComponent>;

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
