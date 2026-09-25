import { apiRequest } from './api';
import { Concept, RevisionItem, UserProfile } from '../types';

export const progressApi = {
  get: () =>
    apiRequest<{
      overallProgress: number | null;
      conceptCount: number;
      strong: Concept[];
      needsPractice: Concept[];
      forgettingSoon: Concept[];
      insufficientData: Concept[];
    }>('/progress'),
  revision: () =>
    apiRequest<{ concepts: RevisionItem[]; count: number; estimatedMinutes: number }>('/revision'),
  rate: (conceptId: string, remembered: boolean) =>
    apiRequest('/revision/rate', {
      method: 'POST',
      body: JSON.stringify({ conceptId, remembered }),
    }),
  me: () => apiRequest<UserProfile>('/auth/me'),
};
