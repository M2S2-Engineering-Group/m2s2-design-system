import type { Meta, StoryObj } from '@storybook/vue3';
import RankedBarChart from './RankedBarChart.vue';

const meta: Meta<typeof RankedBarChart> = {
  title: 'Components/RankedBarChart',
  component: RankedBarChart,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof RankedBarChart>;

export const TopPages: Story = {
  args: {
    data: [
      { label: '/blog', value: 420 },
      { label: '/', value: 310 },
      { label: '/about', value: 180 },
      { label: '/contact', value: 95 },
      { label: '/tools', value: 60 },
    ],
  },
};

export const TopReferrers: Story = {
  args: {
    data: [
      { label: 'google.com', value: 512 },
      { label: 'Direct', value: 240 },
      { label: 'linkedin.com', value: 88 },
    ],
  },
};
