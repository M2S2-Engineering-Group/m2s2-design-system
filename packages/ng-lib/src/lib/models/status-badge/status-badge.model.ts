export type StatusBadgeVariant = 'badge' | 'pill';

export const STATUS_LABELS: Record<string, string> = {
  // Inquiry statuses
  received:          'Received',
  reviewing:         'Reviewing',
  in_conversation:   'In Conversation',
  closed:            'Closed',
  cancelled:         'Cancelled',
  // Resume statuses (prefixed)
  'resume-received': 'Received',
  'resume-pending':  'Pending',
  'resume-approved': 'Approved',
  'resume-declined': 'Declined',
  // Subscriber source
  auth:              'Google',
  signup:            'Email',
  // Subscriber verification
  verified:          'Verified',
  unverified:        'Pending',
};
