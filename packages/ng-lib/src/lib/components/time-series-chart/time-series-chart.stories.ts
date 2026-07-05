import type { Meta, StoryObj } from '@storybook/angular';
import { TimeSeriesChartComponent } from './time-series-chart.component';

const meta: Meta<TimeSeriesChartComponent> = {
  title: 'Components/TimeSeriesChart',
  component: TimeSeriesChartComponent,
  tags: ['autodocs'],
  render: (args) => ({
    props: args,
    template: `<m2s2-time-series-chart [data]="data" [type]="type" />`,
  }),
};
export default meta;
type Story = StoryObj<TimeSeriesChartComponent>;

const sampleData = [
  { date: '2026-06-28', values: { Visits: 120, 'Page Views': 340 } },
  { date: '2026-06-29', values: { Visits: 98, 'Page Views': 260 } },
  { date: '2026-06-30', values: { Visits: 145, 'Page Views': 410 } },
  { date: '2026-07-01', values: { Visits: 132, 'Page Views': 380 } },
  { date: '2026-07-02', values: { Visits: 160, 'Page Views': 455 } },
];

export const Line: Story = {
  args: { data: sampleData, type: 'line' },
};

export const Bar: Story = {
  args: { data: sampleData, type: 'bar' },
};

export const SingleSeries: Story = {
  args: {
    data: sampleData.map((d) => ({ date: d.date, values: { Visits: d.values['Visits'] } })),
    type: 'line',
  },
};
