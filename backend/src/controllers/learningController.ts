import type { Request, Response } from 'express';
import { query } from '../config/db.js';
import { AppError } from '../middleware/errorHandler.js';
import { sendChat, getConversation } from '../services/rag/chatService.js';
import { retrieveChunks } from '../services/retrieval/retrievalService.js';
import { extractKnowledge } from '../services/knowledge/knowledgeService.js';
import { mapConcept } from '../utils/mappers.js';
import { ok } from '../utils/response.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const chat = asyncHandler(async (req: Request, res: Response) => {
  const materialId = String(req.body.materialId || '');
  const question = String(req.body.question || '').trim();
  if (!materialId || !question) {
    throw new AppError(400, 'INVALID_INPUT', 'materialId and question are required');
  }
  const data = await sendChat({
    userId: req.user!.id,
    materialId,
    conversationId: req.body.conversationId,
    question,
    action: req.body.action,
    conceptId: req.body.conceptId,
  });
  return ok(res, data, 'Response generated successfully');
});

export const conversation = asyncHandler(async (req: Request, res: Response) => {
  const data = await getConversation(req.user!.id, req.params.conversationId);
  return ok(res, data, 'Conversation loaded');
});

export const search = asyncHandler(async (req: Request, res: Response) => {
  const q = String(req.body.query || req.body.question || '').trim();
  if (!q) throw new AppError(400, 'INVALID_INPUT', 'query is required');
  const chunks = await retrieveChunks({
    userId: req.user!.id,
    query: q,
    materialId: req.body.materialId,
    k: req.body.k || 6,
  });
  return ok(res, { chunks }, 'Search completed');
});

export const generateKnowledge = asyncHandler(async (req: Request, res: Response) => {
  const materialId = String(req.body.materialId || req.params.materialId || '');
  const material = await query<{ id: string; title: string; user_id: string }>(
    'SELECT id, title, user_id FROM materials WHERE id = $1 AND user_id = $2',
    [materialId, req.user!.id]
  );
  if (!material.rowCount) throw new AppError(404, 'MATERIAL_NOT_FOUND', 'Material not found');
  const chunks = await query<{ text: string }>(
    'SELECT text FROM chunks WHERE material_id = $1 AND user_id = $2 ORDER BY position LIMIT 12',
    [materialId, req.user!.id]
  );
  const data = await extractKnowledge({
    userId: req.user!.id,
    materialId,
    title: material.rows[0].title,
    sampleText: chunks.rows.map((c) => c.text).join('\n\n'),
  });
  return ok(res, data, 'Knowledge generated');
});

export const knowledgeForMaterial = asyncHandler(async (req: Request, res: Response) => {
  const materialId = req.params.materialId;
  const owned = await query('SELECT id FROM materials WHERE id = $1 AND user_id = $2', [
    materialId,
    req.user!.id,
  ]);
  if (!owned.rowCount) throw new AppError(404, 'MATERIAL_NOT_FOUND', 'Material not found');

  const concepts = await query(
    `SELECT c.*, m.title AS resource_title, m.original_filename,
            p.attempts AS perf_attempts, p.correct AS perf_correct
     FROM concepts c
     JOIN materials m ON m.id = c.material_id
     LEFT JOIN concept_performance p ON p.concept_id = c.id AND p.user_id = c.user_id
     WHERE c.user_id = $1 AND c.material_id = $2
     ORDER BY c.created_at`,
    [req.user!.id, materialId]
  );
  const rels = await query<{ concept_id: string; related_concept_id: string; relationship_type: string }>(
    `SELECT concept_id, related_concept_id, relationship_type
     FROM concept_relationships WHERE user_id = $1 AND material_id = $2`,
    [req.user!.id, materialId]
  );
  const mapped = concepts.rows.map((row) =>
    mapConcept(
      row,
      rels.rows.filter((r) => r.concept_id === row.id).map((r) => r.related_concept_id)
    )
  );
  return ok(
    res,
    {
      concepts: mapped,
      relationships: rels.rows.map((r) => ({
        conceptId: r.concept_id,
        relatedConceptId: r.related_concept_id,
        relationshipType: r.relationship_type,
        materialId,
      })),
    },
    'Knowledge loaded'
  );
});

export const listConcepts = asyncHandler(async (req: Request, res: Response) => {
  const concepts = await query(
    `SELECT c.*, m.title AS resource_title, m.original_filename,
            p.attempts AS perf_attempts, p.correct AS perf_correct
     FROM concepts c
     JOIN materials m ON m.id = c.material_id
     LEFT JOIN concept_performance p ON p.concept_id = c.id AND p.user_id = c.user_id
     WHERE c.user_id = $1
     ORDER BY c.created_at DESC`,
    [req.user!.id]
  );
  const rels = await query<{ concept_id: string; related_concept_id: string }>(
    'SELECT concept_id, related_concept_id FROM concept_relationships WHERE user_id = $1',
    [req.user!.id]
  );
  const mapped = concepts.rows.map((row) =>
    mapConcept(
      row,
      rels.rows.filter((r) => r.concept_id === row.id).map((r) => r.related_concept_id)
    )
  );
  return ok(res, mapped, 'Concepts loaded');
});

export const getConcept = asyncHandler(async (req: Request, res: Response) => {
  const result = await query(
    `SELECT c.*, m.title AS resource_title, m.original_filename,
            p.attempts AS perf_attempts, p.correct AS perf_correct
     FROM concepts c
     JOIN materials m ON m.id = c.material_id
     LEFT JOIN concept_performance p ON p.concept_id = c.id AND p.user_id = c.user_id
     WHERE c.id = $1 AND c.user_id = $2`,
    [req.params.id, req.user!.id]
  );
  if (!result.rowCount) throw new AppError(404, 'CONCEPT_NOT_FOUND', 'Concept not found');
  const rels = await query<{ related_concept_id: string }>(
    'SELECT related_concept_id FROM concept_relationships WHERE concept_id = $1 AND user_id = $2',
    [req.params.id, req.user!.id]
  );
  return ok(
    res,
    mapConcept(
      result.rows[0],
      rels.rows.map((r) => r.related_concept_id)
    ),
    'Concept loaded'
  );
});

export const relatedConcepts = asyncHandler(async (req: Request, res: Response) => {
  const rels = await query(
    `SELECT c.*, m.title AS resource_title
     FROM concept_relationships r
     JOIN concepts c ON c.id = r.related_concept_id
     JOIN materials m ON m.id = c.material_id
     WHERE r.concept_id = $1 AND r.user_id = $2`,
    [req.params.id, req.user!.id]
  );
  return ok(res, rels.rows.map((row) => mapConcept(row)), 'Related concepts loaded');
});
