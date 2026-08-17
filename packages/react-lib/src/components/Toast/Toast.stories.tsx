import type { Meta, StoryObj } from "@storybook/react";
import { Toast } from "./Toast";
import { StatusRowList } from "../StatusRowList/StatusRowList";

const meta: Meta<typeof Toast> = {
  title: "Components/Toast",
  component: Toast,
  tags: ["autodocs"],
  args: { onDismiss: () => {} },
};
export default meta;
type Story = StoryObj<typeof Toast>;

export const Info: Story = {
  args: { kind: "info", children: "Publishing…" },
};

export const Success: Story = {
  args: { kind: "success", children: "Post published successfully." },
};

export const WithProjectedStatusRowList: Story = {
  args: {
    kind: "error",
    children: (
      <StatusRowList
        rows={[
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
        ]}
      />
    ),
  },
};
