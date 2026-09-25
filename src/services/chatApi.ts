import { apiRequest } from './api';
import { ChatSource } from '../types';

export const chatApi = {
  send: (body: {
    materialId: string;
    conversationId?: string | null;
    question: string;
    action?: string;
    conceptId?: string;
  }) =>
    apiRequest<{
      conversationId: string;
      quizId?: string;
      message: {
        id: string;
        role: string;
        content: string;
        sources: ChatSource[];
        quizId?: string;
      };
    }>('/chat', { method: 'POST', body: JSON.stringify(body), timeoutMs: 180000 }),
  get: (conversationId: string) =>
    apiRequest<{
      id: string;
      material_id: string;
      messages: Array<{ id: string; role: string; content: string; sources: ChatSource[]; created_at: string }>;
    }>(`/chat/${conversationId}`),
};
