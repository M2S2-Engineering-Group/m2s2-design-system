import type { Meta, StoryObj } from "@storybook/angular";
import { PageHeaderComponent } from "./page-header.component";

const meta: Meta<PageHeaderComponent> = {
  title: "Components/PageHeader",
  component: PageHeaderComponent,
  tags: ["autodocs"],
  render: (args) => ({
    props: args,
    template: `<m2s2-page-header [config]="config" />`,
  }),
};
export default meta;
type Story = StoryObj<PageHeaderComponent>;

export const Default: Story = {
  args: {
    config: {
      title: "Get in Touch",
      subtitle:
        "Have a project in mind or just want to chat? We'd love to hear from you.",
    },
  },
};

export const ShortSubtitle: Story = {
  args: {
    config: {
      title: "Admin",
      subtitle: "Manage inquiries and subscribers.",
    },
  },
};
