import { GoogleGenAI } from '@google/genai';
import { env } from '../../config/env.js';
import { AppError } from '../../middleware/errorHandler.js';

export async function generateText(prompt: string): Promise<string> {
  if (!env.llmApiKey) {
    throw new AppError(500, 'LLM_NOT_CONFIGURED', 'LLM_API_KEY is not configured');
  }
  if (env.llmProvider === 'openai') {
    return generateOpenAI(prompt);
  }
  return generateGemini(prompt);
}

async function generateGemini(prompt: string): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: env.llmApiKey });
  const result = await ai.models.generateContent({
    model: env.llmModel,
    contents: prompt,
  });
  const text = result.text?.trim();
  if (!text) {
    throw new AppError(502, 'LLM_FAILED', 'The language model returned an empty response');
  }
  return text;
}

async function generateOpenAI(prompt: string): Promise<string> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.llmApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: env.llmModel || 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.2,
    }),
  });
  if (!response.ok) {
    throw new AppError(502, 'LLM_FAILED', `OpenAI request failed: ${await response.text()}`);
  }
  const json = (await response.json()) as {
    choices: Array<{ message: { content: string } }>;
  };
  const text = json.choices?.[0]?.message?.content?.trim();
  if (!text) {
    throw new AppError(502, 'LLM_FAILED', 'The language model returned an empty response');
  }
  return text;
}

export function parseJsonFromLlm<T>(raw: string): T {
  const cleaned = raw.replace(/```json/gi, '```').replace(/```/g, '').trim();
  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');
  const slice = start >= 0 && end > start ? cleaned.slice(start, end + 1) : cleaned;
  return JSON.parse(slice) as T;
}

export async function transcribeImage(buffer: Buffer, mimeType: string): Promise<string> {
  if (!env.llmApiKey) {
    throw new AppError(500, 'LLM_NOT_CONFIGURED', 'OCR requires LLM_API_KEY');
  }
  if (env.llmProvider !== 'gemini') {
    throw new AppError(400, 'OCR_UNAVAILABLE', 'Image OCR currently requires the Gemini provider');
  }
  const ai = new GoogleGenAI({ apiKey: env.llmApiKey });
  const result = await ai.models.generateContent({
    model: env.llmModel,
    contents: [
      {
        role: 'user',
        parts: [
          {
            text: 'Extract every readable word from this study material image. Preserve headings and lists. Return plain text only.',
          },
          {
            inlineData: {
              mimeType,
              data: buffer.toString('base64'),
            },
          },
        ],
      },
    ],
  });
  return result.text?.trim() || '';
}
