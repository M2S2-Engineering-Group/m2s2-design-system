import type { Meta, StoryObj } from "@storybook/vue3";
import Toast from "./Toast.vue";
import StatusRowList from "../StatusRowList/StatusRowList.vue";

const meta: Meta<typeof Toast> = {
  title: "Components/Toast",
  component: Toast,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof Toast>;

export const Info: Story = {
  args: { kind: "info" },
  render: (args) => ({
    components: { Toast },
    setup: () => ({ args }),
    template: `<Toast v-bind="args">Publishing…</Toast>`,
  }),
};

export const Success: Story = {
  args: { kind: "success" },
  render: (args) => ({
    components: { Toast },
    setup: () => ({ args }),
    template: `<Toast v-bind="args">Post published successfully.</Toast>`,
  }),
};

export const WithProjectedStatusRowList: Story = {
  args: { kind: "error" },
  render: (args) => ({
    components: { Toast, StatusRowList },
    setup: () => ({
      args,
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
          detail: "no prior DEV.to article to update",
        },
      ],
    }),
    template: `<Toast v-bind="args"><StatusRowList :rows="rows" /></Toast>`,
  }),
};
