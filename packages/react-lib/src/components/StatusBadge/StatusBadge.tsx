import { STATUS_LABELS, StatusBadgeVariant } from "@m2s2/models";
import "./StatusBadge.scss";

interface StatusBadgeProps {
  status: string;
  label?: string;
  variant?: StatusBadgeVariant;
}

export function StatusBadge({
  status,
  label,
  variant = "badge",
}: StatusBadgeProps) {
  const displayLabel = label ?? STATUS_LABELS[status] ?? status;
  return (
    <span
      role="status"
      className="m2s2-status-badge"
      data-status={status}
      data-variant={variant}
    >
      {displayLabel}
    </span>
  );
}
