import { apiRequest } from './api';
import { Concept } from '../types';

export const knowledgeApi = {
  listConcepts: () => apiRequest<Concept[]>('/concepts'),
  getConcept: (id: string) => apiRequest<Concept>(`/concepts/${id}`),
  forMaterial: (materialId: string) =>
    apiRequest<{
      concepts: Concept[];
      relationships: Array<{
        conceptId: string;
        relatedConceptId: string;
        relationshipType: string;
        materialId: string;
      }>;
    }>(`/knowledge/${materialId}`),
};
