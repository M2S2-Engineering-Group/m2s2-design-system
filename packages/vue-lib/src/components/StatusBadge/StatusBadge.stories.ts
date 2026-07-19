import type { Meta, StoryObj } from "@storybook/vue3";
import StatusBadge from "./StatusBadge.vue";

const meta: Meta<typeof StatusBadge> = {
  title: "Components/StatusBadge",
  component: StatusBadge,
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "select", options: ["badge", "pill"] },
  },
};
export default meta;
type Story = StoryObj<typeof StatusBadge>;

export const Received: Story = {
  args: { status: "received", variant: "badge" },
};
export const Reviewing: Story = {
  args: { status: "reviewing", variant: "badge" },
};
export const InConversation: Story = {
  args: { status: "in_conversation", variant: "badge" },
};
export const Closed: Story = { args: { status: "closed", variant: "badge" } };
export const Cancelled: Story = {
  args: { status: "cancelled", variant: "badge" },
};
export const ResumePending: Story = {
  args: { status: "resume-pending", variant: "badge" },
};
export const ResumeApproved: Story = {
  args: { status: "resume-approved", variant: "badge" },
};
export const ResumeDeclined: Story = {
  args: { status: "resume-declined", variant: "badge" },
};

export const PillVariant: Story = {
  render: () => ({
    components: { StatusBadge },
    template: `
      <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center">
        <StatusBadge status="received"        variant="pill" />
        <StatusBadge status="reviewing"       variant="pill" />
        <StatusBadge status="in_conversation" variant="pill" />
        <StatusBadge status="closed"          variant="pill" />
        <StatusBadge status="resume-approved" variant="pill" />
        <StatusBadge status="resume-declined" variant="pill" />
      </div>
    `,
  }),
};

export const AllStatuses: Story = {
  render: () => ({
    components: { StatusBadge },
    template: `
      <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center">
        <StatusBadge status="received" />
        <StatusBadge status="reviewing" />
        <StatusBadge status="in_conversation" />
        <StatusBadge status="closed" />
        <StatusBadge status="cancelled" />
        <StatusBadge status="resume-pending" />
        <StatusBadge status="resume-approved" />
        <StatusBadge status="resume-declined" />
        <StatusBadge status="auth" />
        <StatusBadge status="signup" />
        <StatusBadge status="verified" />
        <StatusBadge status="unverified" />
      </div>
    `,
  }),
};

export const CustomLabel: Story = {
  args: { status: "in_conversation", label: "Active", variant: "badge" },
};
