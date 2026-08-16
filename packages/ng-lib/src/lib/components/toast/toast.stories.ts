import type { Meta, StoryObj } from "@storybook/angular";
import { ToastComponent } from "./toast.component";
import { StatusRowListComponent } from "../status-row-list/status-row-list.component";
import { StatusRowItem } from "../../models/status-row-list/status-row-list.model";

const meta: Meta<ToastComponent> = {
  title: "Components/Toast",
  component: ToastComponent,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<ToastComponent>;

export const Info: Story = {
  render: (args) => ({
    props: args,
    template: `<m2s2-toast [kind]="kind">Publishing…</m2s2-toast>`,
  }),
  args: { kind: "info" },
};

export const Success: Story = {
  render: (args) => ({
    props: args,
    template: `<m2s2-toast [kind]="kind">Post published successfully.</m2s2-toast>`,
  }),
  args: { kind: "success" },
};

type StoryWithRows = StoryObj<ToastComponent & { rows: StatusRowItem[] }>;

export const WithProjectedStatusRowList: StoryWithRows = {
  render: (args) => ({
    props: args,
    moduleMetadata: { imports: [StatusRowListComponent] },
    template: `<m2s2-toast [kind]="kind"><m2s2-status-row-list [rows]="rows" /></m2s2-toast>`,
  }),
  args: {
    kind: "error",
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
  },
};
