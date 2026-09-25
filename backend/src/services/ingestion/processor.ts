import fs from 'node:fs/promises';
import path from 'node:path';
import { query } from '../../config/db.js';
import { env } from '../../config/env.js';
import { extractFromFile } from './extractor.js';
import { chunkText } from './chunker.js';
import { embedTexts, toVectorLiteral } from '../embeddings/embeddingService.js';
import { extractKnowledge } from '../knowledge/knowledgeService.js';

const jobs = new Set<string>();

export function startProcessing(materialId: string) {
  if (jobs.has(materialId)) return;
  jobs.add(materialId);
  setImmediate(() => {
    processMaterial(materialId)
      .catch(async (err) => {
        const message = err instanceof Error ? err.message : 'Processing failed';
        await query(
          `UPDATE materials SET status = 'failed', error_message = $2, updated_at = NOW() WHERE id = $1`,
          [materialId, message]
        );
        console.error('Material processing failed', materialId, err);
      })
      .finally(() => jobs.delete(materialId));
  });
}

async function setStatus(id: string, status: string) {
  await query(`UPDATE materials SET status = $2, updated_at = NOW() WHERE id = $1`, [id, status]);
}

async function processMaterial(materialId: string) {
  const result = await query<{
    id: string;
    user_id: string;
    title: string;
    original_filename: string;
    file_type: string;
    storage_path: string | null;
  }>('SELECT * FROM materials WHERE id = $1', [materialId]);
  const material = result.rows[0];
  if (!material) return;

  await setStatus(materialId, 'processing');

  if (!material.storage_path) {
    throw new Error('Uploaded file is missing');
  }

  await setStatus(materialId, 'extracting');
  const pages = await extractFromFile(
    path.resolve(env.uploadDir, path.basename(material.storage_path)),
    material.file_type,
    material.original_filename
  );

  await setStatus(materialId, 'chunking');
  await query('DELETE FROM chunks WHERE material_id = $1 AND user_id = $2', [
    materialId,
    material.user_id,
  ]);

  const chunks = pages.flatMap((page) =>
    chunkText(page.text, {
      pageNumber: page.pageNumber,
      source: material.original_filename,
    })
  );

  if (!chunks.length) {
    throw new Error('No text chunks could be created from this material');
  }

  let globalPosition = 0;
  const insertedIds: string[] = [];
  const insertedTexts: string[] = [];
  for (const chunk of chunks) {
    const inserted = await query<{ id: string }>(
      `INSERT INTO chunks (user_id, material_id, text, page_number, source, position, token_count)
       VALUES ($1,$2,$3,$4,$5,$6,$7)
       RETURNING id`,
      [
        material.user_id,
        materialId,
        chunk.text,
        chunk.pageNumber,
        chunk.source,
        globalPosition,
        chunk.text.split(/\s+/).length,
      ]
    );
    insertedIds.push(inserted.rows[0].id);
    insertedTexts.push(chunk.text);
    globalPosition += 1;
  }

  await query(
    `UPDATE materials SET chunk_count = $2, page_count = $3, updated_at = NOW() WHERE id = $1`,
    [materialId, insertedIds.length, pages.length]
  );

  await setStatus(materialId, 'embedding');
  const batchSize = 8;
  for (let i = 0; i < insertedTexts.length; i += batchSize) {
    const slice = insertedTexts.slice(i, i + batchSize);
    const ids = insertedIds.slice(i, i + batchSize);
    const vectors = await embedTexts(slice);
    for (let j = 0; j < ids.length; j += 1) {
      await query(`UPDATE chunks SET embedding = $2::vector WHERE id = $1 AND user_id = $3`, [
        ids[j],
        toVectorLiteral(vectors[j]),
        material.user_id,
      ]);
    }
  }

  await setStatus(materialId, 'generating_knowledge');
  const sampleText = insertedTexts.slice(0, 12).join('\n\n');
  try {
    await extractKnowledge({
      userId: material.user_id,
      materialId,
      title: material.title,
      sampleText,
    });
  } catch (err) {
    console.error('Knowledge extraction failed; material remains searchable', err);
  }

  const summarySource = pages
    .map((p) => p.text)
    .join(' ')
    .slice(0, 400);
  await query(
    `UPDATE materials
     SET status = 'completed', summary = COALESCE(NULLIF(summary, ''), $2), error_message = NULL, updated_at = NOW()
     WHERE id = $1`,
    [materialId, summarySource]
  );
}

export async function saveUploadedFile(file: Express.Multer.File): Promise<string> {
  await fs.mkdir(env.uploadDir, { recursive: true });
  return file.filename;
}
