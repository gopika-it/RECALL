import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(here, '../../.env') });

export const env = {
  port: Number(process.env.PORT || 5000),
  clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
  databaseUrl: process.env.DATABASE_URL || '',
  jwtSecret: process.env.JWT_SECRET || 'dev-only-change-me',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  llmProvider: (process.env.LLM_PROVIDER || 'gemini').toLowerCase(),
  llmApiKey: process.env.LLM_API_KEY || process.env.GEMINI_API_KEY || '',
  llmModel: process.env.LLM_MODEL || 'gemini-2.0-flash',
  embeddingModel: process.env.EMBEDDING_MODEL || 'text-embedding-004',
  embeddingDimensions: Number(process.env.EMBEDDING_DIMENSIONS || 768),
  allowGeneralFallback: process.env.ALLOW_GENERAL_FALLBACK === 'true',
  uploadDir: process.env.UPLOAD_DIR || path.resolve(here, '../../uploads'),
  maxUploadMb: Number(process.env.MAX_UPLOAD_MB || 50),
  ocrEnabled: process.env.OCR_ENABLED !== 'false',
};
