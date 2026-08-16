import type { Meta, StoryObj } from "@storybook/vue3";
import StatusRowList from "./StatusRowList.vue";

const meta: Meta<typeof StatusRowList> = {
  title: "Components/StatusRowList",
  component: StatusRowList,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof StatusRowList>;

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
        detail:
          "no prior DEV.to article to update — a successful Publish must happen first",
      },
    ],
  },
};
