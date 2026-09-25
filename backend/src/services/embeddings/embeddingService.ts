import { GoogleGenAI } from '@google/genai';
import { env } from '../../config/env.js';
import { AppError } from '../../middleware/errorHandler.js';

function requireKey() {
  if (!env.llmApiKey) {
    throw new AppError(500, 'LLM_NOT_CONFIGURED', 'LLM_API_KEY is not configured');
  }
}

export async function embedTexts(texts: string[]): Promise<number[][]> {
  requireKey();
  if (env.llmProvider === 'openai') {
    return embedOpenAI(texts);
  }
  return embedGemini(texts);
}

export async function embedQuery(text: string): Promise<number[]> {
  const [vec] = await embedTexts([text]);
  return vec;
}

async function embedGemini(texts: string[]): Promise<number[][]> {
  const ai = new GoogleGenAI({ apiKey: env.llmApiKey });
  const vectors: number[][] = [];
  for (const text of texts) {
    const result = await ai.models.embedContent({
      model: env.embeddingModel,
      contents: text.slice(0, 8000),
    });
    const values = result.embeddings?.[0]?.values;
    if (!values?.length) {
      throw new AppError(502, 'EMBEDDING_FAILED', 'Embedding provider returned an empty vector');
    }
    vectors.push(padOrTrim(values, env.embeddingDimensions));
  }
  return vectors;
}

async function embedOpenAI(texts: string[]): Promise<number[][]> {
  const response = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.llmApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: env.embeddingModel || 'text-embedding-3-small',
      input: texts.map((t) => t.slice(0, 8000)),
    }),
  });
  if (!response.ok) {
    throw new AppError(502, 'EMBEDDING_FAILED', `OpenAI embeddings failed: ${await response.text()}`);
  }
  const json = (await response.json()) as { data: Array<{ embedding: number[] }> };
  return json.data.map((item) => padOrTrim(item.embedding, env.embeddingDimensions));
}

function padOrTrim(values: number[], dim: number): number[] {
  if (values.length === dim) return values;
  if (values.length > dim) return values.slice(0, dim);
  return [...values, ...Array(dim - values.length).fill(0)];
}

export function toVectorLiteral(values: number[]): string {
  return `[${values.join(',')}]`;
}
