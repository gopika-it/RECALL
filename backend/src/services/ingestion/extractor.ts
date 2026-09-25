import fs from 'node:fs/promises';
import path from 'node:path';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';
import { env } from '../../config/env.js';
import { AppError } from '../../middleware/errorHandler.js';
import { transcribeImage } from '../llm/llmService.js';
import { cleanText } from './chunker.js';

export interface ExtractedPage {
  pageNumber: number | null;
  text: string;
  source: string;
}

export async function extractFromFile(filePath: string, mimeType: string, originalName: string): Promise<ExtractedPage[]> {
  const ext = path.extname(originalName).toLowerCase();
  const buffer = await fs.readFile(filePath);

  if (ext === '.pdf' || mimeType === 'application/pdf') {
    return extractPdf(buffer, originalName);
  }
  if (['.txt', '.md', '.markdown'].includes(ext) || mimeType.startsWith('text/')) {
    return [{ pageNumber: 1, text: cleanText(buffer.toString('utf8')), source: originalName }];
  }
  if (mimeType.startsWith('image/') || ['.png', '.jpg', '.jpeg', '.webp'].includes(ext)) {
    if (!env.ocrEnabled) {
      throw new AppError(400, 'OCR_DISABLED', 'Image OCR is disabled on this server');
    }
    const text = await transcribeImage(buffer, mimeType || 'image/png');
    if (!text) {
      throw new AppError(422, 'OCR_EMPTY', 'Could not extract text from this image');
    }
    return [{ pageNumber: 1, text: cleanText(text), source: originalName }];
  }

  throw new AppError(415, 'UNSUPPORTED_FILE', 'Supported formats: PDF, TXT, MD, and images');
}

async function extractPdf(buffer: Buffer, source: string): Promise<ExtractedPage[]> {
  const loadingTask = getDocument({
    data: new Uint8Array(buffer),
    useSystemFonts: true,
    disableWorker: true,
  });
  const pdf = await loadingTask.promise;
  const pages: ExtractedPage[] = [];
  for (let i = 1; i <= pdf.numPages; i += 1) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const text = cleanText(
      content.items
        .map((item) => ('str' in item ? item.str : ''))
        .join(' ')
    );
    if (text) {
      pages.push({ pageNumber: i, text, source });
    }
  }
  if (!pages.length) {
    throw new AppError(422, 'EMPTY_DOCUMENT', 'No extractable text was found in this PDF');
  }
  return pages;
}
