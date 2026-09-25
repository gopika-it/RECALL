import { computeMastery, masteryStatus } from '../progress/mastery.js';

export function mapMaterial(row: Record<string, unknown>) {
  return {
    id: row.id,
    title: row.title,
    type: mapFileType(String(row.file_type || row.original_filename || '')),
    originalFilename: row.original_filename,
    fileType: row.file_type,
    fileSize: formatSize(Number(row.file_size || 0)),
    status: row.status,
    conceptCount: row.concept_count || 0,
    quizCount: row.quiz_count || 0,
    chunkCount: row.chunk_count || 0,
    pageCount: row.page_count || 0,
    uploadDate: row.created_at,
    summary: row.summary || '',
    errorMessage: row.error_message || null,
    conceptIds: row.concept_ids || [],
  };
}

export function mapConcept(row: Record<string, unknown>, relatedIds: string[] = []) {
  const attempts = Number(row.perf_attempts ?? row.attempts ?? 0);
  const correct = Number(row.perf_correct ?? row.correct_count ?? 0);
  const mastery = computeMastery(attempts, correct);
  return {
    id: row.id,
    title: row.title,
    topic: row.topic || '',
    resourceId: row.material_id,
    resourceTitle: row.resource_title || row.original_filename || '',
    summary: row.summary || '',
    keyPoints: row.key_points || [],
    simpleExample: row.simple_example || '',
    relatedConceptIds: relatedIds,
    quickRecallQuestion: row.quick_recall_question || '',
    quickRecallAnswer: row.quick_recall_answer || '',
    mastery,
    status: masteryStatus(mastery),
    lastReviewed: row.last_reviewed_at || null,
    category: row.category || '',
    attempts,
  };
}

function mapFileType(value: string): 'pdf' | 'notes' | 'web' | 'audio' {
  const lower = value.toLowerCase();
  if (lower.includes('pdf')) return 'pdf';
  if (lower.includes('image') || lower.includes('png') || lower.includes('jpg')) return 'notes';
  if (lower.includes('text') || lower.includes('md')) return 'notes';
  return 'pdf';
}

function formatSize(bytes: number): string {
  if (!bytes) return '0 KB';
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
