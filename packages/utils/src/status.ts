/**
 * Resolve a status key to its display label.
 * 'all' always returns 'All'. Unknown keys fall back to the raw status string.
 */
export function getStatusLabel(
  status: string,
  labels: Record<string, string>,
): string {
  if (status === "all") return "All";
  return labels[status] ?? status;
}
