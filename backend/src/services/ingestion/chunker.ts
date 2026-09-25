export function cleanText(input: string): string {
  return input
    .replace(/\r/g, '\n')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/\u0000/g, '')
    .trim();
}

export function chunkText(
  text: string,
  options?: { size?: number; overlap?: number; pageNumber?: number | null; source?: string }
): Array<{ text: string; pageNumber: number | null; source: string; position: number }> {
  const size = options?.size ?? 900;
  const overlap = options?.overlap ?? 150;
  const pageNumber = options?.pageNumber ?? null;
  const source = options?.source ?? 'document';
  const normalized = cleanText(text);
  if (!normalized) return [];

  const chunks: Array<{ text: string; pageNumber: number | null; source: string; position: number }> = [];
  let start = 0;
  let position = 0;
  while (start < normalized.length) {
    const end = Math.min(normalized.length, start + size);
    const slice = normalized.slice(start, end).trim();
    if (slice) {
      chunks.push({
        text: slice,
        pageNumber,
        source,
        position,
      });
      position += 1;
    }
    if (end >= normalized.length) break;
    start = Math.max(end - overlap, start + 1);
  }
  return chunks;
}
