import { env } from '../../config/env.js';
import { generateText } from '../llm/llmService.js';
import type { RetrievedChunk } from '../retrieval/retrievalService.js';

export const CHAT_ACTIONS = [
  'explain_simply',
  'give_example',
  'compare',
  'why',
  'summarize',
  'generate_quiz',
] as const;

export type ChatAction = (typeof CHAT_ACTIONS)[number];

const ACTION_INSTRUCTIONS: Record<string, string> = {
  explain_simply: 'Explain in beginner-friendly language using short sentences and a simple analogy if helpful.',
  give_example: 'Give a concrete example grounded in the retrieved material.',
  compare: 'Compare the requested ideas using only the retrieved material. If only one idea is present, say so.',
  why: 'Explain the reasoning or cause using the retrieved material.',
  summarize: 'Summarize the relevant retrieved material clearly and briefly.',
};

export interface RagSource {
  materialId: string;
  materialName: string;
  page: number | null;
  chunkId: string;
}

export async function generateGroundedAnswer(params: {
  question: string;
  action?: string;
  materialTitle: string;
  history: Array<{ role: string; content: string }>;
  chunks: RetrievedChunk[];
}): Promise<{ answer: string; sources: RagSource[]; grounded: boolean }> {
  const context = params.chunks
    .map((chunk, i) => {
      const page = chunk.pageNumber ? `page ${chunk.pageNumber}` : 'page unknown';
      return `[Source ${i + 1} | ${chunk.source} | ${page} | chunk ${chunk.id}]\n${chunk.text}`;
    })
    .join('\n\n');

  const historyText = params.history
    .slice(-8)
    .map((m) => `${m.role === 'user' ? 'User' : 'RECALL'}: ${m.content}`)
    .join('\n');

  const actionNote = ACTION_INSTRUCTIONS[params.action || ''] || 'Answer the user question directly.';

  const prompt = `You are RECALL, a personal learning tutor.
You must answer using the retrieved study material for "${params.materialTitle}".

Rules:
1. Prioritize retrieved material. Do not invent facts from the document.
2. If the answer is not in the retrieved context, say that clearly.
3. Do not invent citations, page numbers, or source names.
4. Only cite sources that appear in the context block.
5. Distinguish document-grounded information from general knowledge.
6. ${env.allowGeneralFallback ? 'If the document does not contain the answer, you MAY add a short general explanation prefixed with "General explanation:".' : 'If the document does not contain the answer, do not provide a general-knowledge answer.'}
7. ${actionNote}

Retrieved context:
${context || '(no matching chunks)'}

Conversation so far:
${historyText || '(none)'}

User question:
${params.question}

Write the answer for the learner. Do not output JSON.`;

  const answer = await generateText(prompt);
  const grounded = params.chunks.length > 0 && !/couldn't find|could not find|not (enough )?information|not present in/i.test(answer);

  const sources: RagSource[] = params.chunks.slice(0, 4).map((chunk) => ({
    materialId: chunk.materialId,
    materialName: chunk.source,
    page: chunk.pageNumber,
    chunkId: chunk.id,
  }));

  return { answer, sources: grounded ? sources : [], grounded };
}
