import fs from 'node:fs';
import path from 'node:path';
import type { Request, Response } from 'express';
import multer from 'multer';
import { v4 as uuid } from 'uuid';
import { env } from '../config/env.js';
import { query } from '../config/db.js';
import { AppError } from '../middleware/errorHandler.js';
import { startProcessing } from '../services/ingestion/processor.js';
import { mapMaterial } from '../utils/mappers.js';
import { ok } from '../utils/response.js';
import { asyncHandler } from '../utils/asyncHandler.js';

fs.mkdirSync(env.uploadDir, { recursive: true });

const allowed = new Set([
  'application/pdf',
  'text/plain',
  'text/markdown',
  'image/png',
  'image/jpeg',
  'image/webp',
]);

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, env.uploadDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase().replace(/[^\w.]/g, '');
    cb(null, `${uuid()}${ext}`);
  },
});

export const uploadMiddleware = multer({
  storage,
  limits: { fileSize: env.maxUploadMb * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const okExt = ['.pdf', '.txt', '.md', '.markdown', '.png', '.jpg', '.jpeg', '.webp'].includes(ext);
    if (allowed.has(file.mimetype) || okExt) cb(null, true);
    else cb(new AppError(415, 'UNSUPPORTED_FILE', 'Supported formats: PDF, TXT, MD, PNG, JPG, WEBP'));
  },
});

export const uploadMaterial = asyncHandler(async (req: Request, res: Response) => {
  const file = req.file;
  if (!file) throw new AppError(400, 'FILE_REQUIRED', 'Choose a study material to upload');
  const safeName = path.basename(file.originalname).replace(/[^\w.\- ()]/g, '_');
  const created = await query(
    `INSERT INTO materials (user_id, title, original_filename, file_type, file_size, storage_path, status)
     VALUES ($1,$2,$3,$4,$5,$6,'uploaded')
     RETURNING *`,
    [
      req.user!.id,
      path.parse(safeName).name,
      safeName,
      file.mimetype || path.extname(safeName),
      file.size,
      file.filename,
    ]
  );
  startProcessing(created.rows[0].id);
  return ok(res, mapMaterial(created.rows[0]), 'Material uploaded and processing started', 201);
});

export const uploadNotes = asyncHandler(async (req: Request, res: Response) => {
  const title = String(req.body.title || 'Untitled notes').trim();
  const content = String(req.body.content || '').trim();
  if (!content) throw new AppError(400, 'EMPTY_NOTES', 'Paste some notes first');
  fs.mkdirSync(env.uploadDir, { recursive: true });
  const filename = `${uuid()}.txt`;
  fs.writeFileSync(path.join(env.uploadDir, filename), content, 'utf8');
  const created = await query(
    `INSERT INTO materials (user_id, title, original_filename, file_type, file_size, storage_path, status)
     VALUES ($1,$2,$3,'text/plain',$4,$5,'uploaded')
     RETURNING *`,
    [req.user!.id, title, `${title}.txt`, Buffer.byteLength(content), filename]
  );
  startProcessing(created.rows[0].id);
  return ok(res, mapMaterial(created.rows[0]), 'Notes uploaded and processing started', 201);
});

export const listMaterials = asyncHandler(async (req: Request, res: Response) => {
  const result = await query(
    `SELECT m.*, COALESCE(array_agg(c.id) FILTER (WHERE c.id IS NOT NULL), '{}') AS concept_ids
     FROM materials m
     LEFT JOIN concepts c ON c.material_id = m.id AND c.user_id = m.user_id
     WHERE m.user_id = $1
     GROUP BY m.id
     ORDER BY m.created_at DESC`,
    [req.user!.id]
  );
  return ok(res, result.rows.map(mapMaterial), 'Materials loaded');
});

export const getMaterial = asyncHandler(async (req: Request, res: Response) => {
  const result = await query(
    `SELECT m.*, COALESCE(array_agg(c.id) FILTER (WHERE c.id IS NOT NULL), '{}') AS concept_ids
     FROM materials m
     LEFT JOIN concepts c ON c.material_id = m.id AND c.user_id = m.user_id
     WHERE m.id = $1 AND m.user_id = $2
     GROUP BY m.id`,
    [req.params.id, req.user!.id]
  );
  if (!result.rowCount) throw new AppError(404, 'MATERIAL_NOT_FOUND', 'Material not found');
  const concepts = await query(
    `SELECT title FROM concepts WHERE material_id = $1 AND user_id = $2 ORDER BY created_at`,
    [req.params.id, req.user!.id]
  );
  return ok(
    res,
    { ...mapMaterial(result.rows[0]), conceptTitles: concepts.rows.map((c) => c.title) },
    'Material loaded'
  );
});

export const getMaterialStatus = asyncHandler(async (req: Request, res: Response) => {
  const result = await query(
    `SELECT id, status, error_message, chunk_count, concept_count, page_count, title, original_filename
     FROM materials WHERE id = $1 AND user_id = $2`,
    [req.params.id, req.user!.id]
  );
  if (!result.rowCount) throw new AppError(404, 'MATERIAL_NOT_FOUND', 'Material not found');
  const row = result.rows[0];
  const titles = await query(`SELECT title FROM concepts WHERE material_id = $1 AND user_id = $2`, [
    req.params.id,
    req.user!.id,
  ]);
  return ok(
    res,
    {
      id: row.id,
      status: row.status,
      errorMessage: row.error_message,
      chunkCount: row.chunk_count,
      conceptCount: row.concept_count,
      pageCount: row.page_count,
      title: row.title,
      filename: row.original_filename,
      conceptTitles: titles.rows.map((c) => c.title),
    },
    'Status loaded'
  );
});

export const deleteMaterial = asyncHandler(async (req: Request, res: Response) => {
  const result = await query(
    `DELETE FROM materials WHERE id = $1 AND user_id = $2 RETURNING storage_path`,
    [req.params.id, req.user!.id]
  );
  if (!result.rowCount) throw new AppError(404, 'MATERIAL_NOT_FOUND', 'Material not found');
  const stored = result.rows[0].storage_path;
  if (stored) {
    const full = path.join(env.uploadDir, path.basename(stored));
    fs.rmSync(full, { force: true });
  }
  return ok(res, { id: req.params.id }, 'Material deleted');
});
