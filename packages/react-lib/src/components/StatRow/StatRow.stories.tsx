import type { Meta, StoryObj } from '@storybook/react';
import { StatRow } from './StatRow';

const meta: Meta<typeof StatRow> = {
  title: 'Components/StatRow',
  component: StatRow,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof StatRow>;

export const Default: Story = {
  args: {
    stats: [
      { value: '50+', label: 'Projects Delivered' },
      { value: '12', label: 'Years Experience' },
      { value: '98%', label: 'Client Satisfaction' },
      { value: '24/7', label: 'Support Available' },
    ],
  },
};

export const ThreeStats: Story = {
  args: {
    stats: [
      { value: '$2M+', label: 'Revenue Generated' },
      { value: '30+', label: 'Team Members' },
      { value: '5★', label: 'Average Rating' },
    ],
  },
};
