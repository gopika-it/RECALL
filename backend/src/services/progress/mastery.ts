export function computeMastery(attempts: number, correct: number): number | null {
  if (attempts < 3) return null;
  return Math.round((correct / attempts) * 100);
}

export function masteryLabel(value: number | null): string {
  if (value === null) return 'Not enough data';
  return `${value}%`;
}

export function masteryStatus(value: number | null): 'strong' | 'needs_practice' | 'forgetting_soon' | 'unknown' {
  if (value === null) return 'unknown';
  if (value >= 75) return 'strong';
  if (value < 45) return 'forgetting_soon';
  return 'needs_practice';
}
