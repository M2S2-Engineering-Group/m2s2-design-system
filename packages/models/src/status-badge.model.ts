export type StatusBadgeVariant = "badge" | "pill";

export const STATUS_LABELS: Record<string, string> = {
  received: "Received",
  reviewing: "Reviewing",
  in_conversation: "In Conversation",
  closed: "Closed",
  cancelled: "Cancelled",
  "resume-received": "Received",
  "resume-pending": "Pending",
  "resume-approved": "Approved",
  "resume-declined": "Declined",
  auth: "Google",
  signup: "Email",
  verified: "Verified",
  unverified: "Pending",
};
