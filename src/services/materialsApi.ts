import { apiRequest } from './api';
import { ProcessingStatus, Resource } from '../types';

export const materialsApi = {
  upload: (file: File) => {
    const form = new FormData();
    form.append('file', file);
    return apiRequest<Resource>('/materials/upload', { method: 'POST', body: form, timeoutMs: 180000 });
  },
  uploadNotes: (title: string, content: string) =>
    apiRequest<Resource>('/materials/notes', {
      method: 'POST',
      body: JSON.stringify({ title, content }),
    }),
  list: () => apiRequest<Resource[]>('/materials'),
  get: (id: string) => apiRequest<Resource & { conceptTitles?: string[] }>(`/materials/${id}`),
  status: (id: string) => apiRequest<ProcessingStatus>(`/materials/${id}/status`),
  remove: (id: string) => apiRequest<{ id: string }>(`/materials/${id}`, { method: 'DELETE' }),
};
