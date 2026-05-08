import type { Meta, StoryObj } from '@storybook/angular';
import { StatusBadgeComponent } from './status-badge.component';

const meta: Meta<StatusBadgeComponent> = {
  title: 'Components/StatusBadge',
  component: StatusBadgeComponent,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['badge', 'pill'] },
  },
  render: (args) => ({
    props: args,
    template: `<m2s2-status-badge [status]="status" [label]="label" [variant]="variant" />`,
  }),
};
export default meta;
type Story = StoryObj<StatusBadgeComponent>;

// ── Inquiry statuses ──────────────────────────────────────────────────────────
export const Received: Story        = { args: { status: 'received',        variant: 'badge' } };
export const Reviewing: Story       = { args: { status: 'reviewing',       variant: 'badge' } };
export const InConversation: Story  = { args: { status: 'in_conversation', variant: 'badge' } };
export const Closed: Story          = { args: { status: 'closed',          variant: 'badge' } };
export const Cancelled: Story       = { args: { status: 'cancelled',       variant: 'badge' } };

// ── Resume statuses ───────────────────────────────────────────────────────────
export const ResumePending: Story   = { args: { status: 'resume-pending',  variant: 'badge' } };
export const ResumeApproved: Story  = { args: { status: 'resume-approved', variant: 'badge' } };
export const ResumeDeclined: Story  = { args: { status: 'resume-declined', variant: 'badge' } };

// ── Pill variant ──────────────────────────────────────────────────────────────
export const PillVariant: Story = {
  render: () => ({
    template: `
      <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center">
        <m2s2-status-badge status="received"        variant="pill" />
        <m2s2-status-badge status="reviewing"       variant="pill" />
        <m2s2-status-badge status="in_conversation" variant="pill" />
        <m2s2-status-badge status="closed"          variant="pill" />
        <m2s2-status-badge status="resume-approved" variant="pill" />
        <m2s2-status-badge status="resume-declined" variant="pill" />
      </div>
    `,
  }),
};

// ── All badge statuses ────────────────────────────────────────────────────────
export const AllStatuses: Story = {
  render: () => ({
    template: `
      <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center">
        <m2s2-status-badge status="received" />
        <m2s2-status-badge status="reviewing" />
        <m2s2-status-badge status="in_conversation" />
        <m2s2-status-badge status="closed" />
        <m2s2-status-badge status="cancelled" />
        <m2s2-status-badge status="resume-pending" />
        <m2s2-status-badge status="resume-approved" />
        <m2s2-status-badge status="resume-declined" />
        <m2s2-status-badge status="auth" />
        <m2s2-status-badge status="signup" />
        <m2s2-status-badge status="verified" />
        <m2s2-status-badge status="unverified" />
      </div>
    `,
  }),
};

// ── Custom label override ─────────────────────────────────────────────────────
export const CustomLabel: Story = {
  args: { status: 'in_conversation', label: 'Active', variant: 'badge' },
};
