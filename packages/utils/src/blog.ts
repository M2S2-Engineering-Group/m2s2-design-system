/** Format an ISO date string (YYYY-MM-DD) for display (e.g. "June 16, 2026"). */
export function formatBlogDate(iso: string): string {
  const [year, month, day] = iso.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/** Return today's date as an ISO 8601 date string (YYYY-MM-DD). */
export function todayAsIsoDate(): string {
  return new Date().toISOString().split('T')[0];
}

/** Convert a title string to a URL-safe slug. */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

/** Estimate reading time in minutes at 200 words per minute (minimum 1). */
export function calcReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}
