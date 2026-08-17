import type { Meta, StoryObj } from "@storybook/angular";
import { StatusRowListComponent } from "./status-row-list.component";

const meta: Meta<StatusRowListComponent> = {
  title: "Components/StatusRowList",
  component: StatusRowListComponent,
  tags: ["autodocs"],
  render: (args) => ({
    props: args,
    template: `<m2s2-status-row-list [rows]="rows" />`,
  }),
};
export default meta;
type Story = StoryObj<StatusRowListComponent>;

export const AllSucceeded: Story = {
  args: {
    rows: [
      {
        id: "m2s2site",
        label: "m2s2site",
        status: "succeeded",
        link: { label: "View →", href: "https://m2s2.io/blog/example" },
      },
      {
        id: "devto",
        label: "devto",
        status: "succeeded",
        link: { label: "View →", href: "https://dev.to/m2s2/example" },
      },
    ],
  },
};

export const MixedOutcome: Story = {
  args: {
    rows: [
      {
        id: "m2s2site",
        label: "m2s2site",
        status: "succeeded",
        link: { label: "View →", href: "https://m2s2.io/blog/example" },
      },
      {
        id: "devto",
        label: "devto",
        status: "failed",
        detail: "no prior DEV.to article to update — a successful Publish must happen first",
      },
    ],
  },
};
