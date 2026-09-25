import { query } from '../../config/db.js';
import { AppError } from '../../middleware/errorHandler.js';
import { embedQuery, toVectorLiteral } from '../embeddings/embeddingService.js';

export interface RetrievedChunk {
  id: string;
  materialId: string;
  text: string;
  pageNumber: number | null;
  source: string;
  position: number;
  distance: number;
}

export async function retrieveChunks(params: {
  userId: string;
  query: string;
  materialId?: string;
  k?: number;
}): Promise<RetrievedChunk[]> {
  const vector = await embedQuery(params.query);
  const k = params.k ?? 6;

  const filters = ['c.user_id = $1', 'c.embedding IS NOT NULL'];
  const values: unknown[] = [params.userId, toVectorLiteral(vector), k];
  if (params.materialId) {
    filters.push('c.material_id = $4');
    values.push(params.materialId);
  }

  const result = await query<{
    id: string;
    material_id: string;
    text: string;
    page_number: number | null;
    source: string;
    position: number;
    distance: number;
  }>(
    `
      SELECT
        c.id,
        c.material_id,
        c.text,
        c.page_number,
        c.source,
        c.position,
        (c.embedding <=> $2::vector) AS distance
      FROM chunks c
      WHERE ${filters.join(' AND ')}
      ORDER BY c.embedding <=> $2::vector
      LIMIT $3
    `,
    values
  );

  if (!result.rows.length && params.materialId) {
    const owned = await query('SELECT id FROM materials WHERE id = $1 AND user_id = $2', [
      params.materialId,
      params.userId,
    ]);
    if (!owned.rowCount) {
      throw new AppError(404, 'MATERIAL_NOT_FOUND', 'Material not found');
    }
  }

  return result.rows.map((row) => ({
    id: row.id,
    materialId: row.material_id,
    text: row.text,
    pageNumber: row.page_number,
    source: row.source,
    position: row.position,
    distance: Number(row.distance),
  }));
}
