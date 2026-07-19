import type { Meta, StoryObj } from "@storybook/angular";
import { RankedBarChartComponent } from "./ranked-bar-chart.component";

const meta: Meta<RankedBarChartComponent> = {
  title: "Components/RankedBarChart",
  component: RankedBarChartComponent,
  tags: ["autodocs"],
  render: (args) => ({
    props: args,
    template: `<m2s2-ranked-bar-chart [data]="data" />`,
  }),
};
export default meta;
type Story = StoryObj<RankedBarChartComponent>;

export const TopPages: Story = {
  args: {
    data: [
      { label: "/blog", value: 420 },
      { label: "/", value: 310 },
      { label: "/about", value: 180 },
      { label: "/contact", value: 95 },
      { label: "/tools", value: 60 },
    ],
  },
};

export const TopReferrers: Story = {
  args: {
    data: [
      { label: "google.com", value: 512 },
      { label: "Direct", value: 240 },
      { label: "linkedin.com", value: 88 },
    ],
  },
};
