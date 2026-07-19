import type { Meta, StoryObj } from "@storybook/react";
import { StatRow } from "./StatRow";

const meta: Meta<typeof StatRow> = {
  title: "Components/StatRow",
  component: StatRow,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof StatRow>;

export const Default: Story = {
  args: {
    stats: [
      { value: "15+", label: "Years of experience" },
      { value: "50+", label: "Engineers led" },
      { value: "30+", label: "Products shipped" },
      { value: "5", label: "Industries served" },
    ],
  },
};

export const TwoStats: Story = {
  args: {
    stats: [
      { value: "$2M+", label: "Cost savings delivered" },
      { value: "99.9%", label: "Uptime achieved" },
    ],
  },
};
