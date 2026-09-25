export function formatMastery(value: number | null | undefined): string {
  if (value === null || value === undefined) return 'N/A';
  return `${value}%`;
}

export function relativeTime(value?: string | null): string {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  const diff = Date.now() - date.getTime();
  const mins = Math.round(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  return `${days}d ago`;
}

export function greetingName(name: string): string {
  return name.split(' ')[0] || 'there';
}
