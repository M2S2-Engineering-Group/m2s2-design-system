import type { Meta, StoryObj } from '@storybook/angular';
import { StatRowComponent } from './stat-row.component';

const meta: Meta<StatRowComponent> = {
  title: 'Components/StatRow',
  component: StatRowComponent,
  tags: ['autodocs'],
  render: (args) => ({
    props: args,
    template: `<m2s2-stat-row [stats]="stats" />`,
  }),
};
export default meta;
type Story = StoryObj<StatRowComponent>;

export const Default: Story = {
  args: {
    stats: [
      { value: '15+', label: 'Years of experience' },
      { value: '50+', label: 'Engineers led' },
      { value: '30+', label: 'Products shipped' },
      { value: '5',   label: 'Industries served' },
    ],
  },
};

export const TwoStats: Story = {
  args: {
    stats: [
      { value: '$2M+', label: 'Cost savings delivered' },
      { value: '99.9%', label: 'Uptime achieved' },
    ],
  },
};
