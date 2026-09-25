import { apiRequest } from './api';
import { QuizQuestion, QuizResultSummary } from '../types';

export const quizApi = {
  generate: (body: {
    materialId?: string;
    conceptId?: string;
    concept?: string;
    numberOfQuestions?: number;
    difficulty?: string;
    type?: string;
  }) =>
    apiRequest<{
      quizId: string;
      questions: Array<{
        questionId: string;
        question: string;
        options: string[];
        correctIndex: number;
        explanation: string;
        conceptId: string | null;
        conceptTitle: string;
      }>;
    }>('/quiz/generate', { method: 'POST', body: JSON.stringify(body), timeoutMs: 180000 }),
  evaluate: (quizId: string, answers: Array<{ questionId: string; selectedIndex: number }>) =>
    apiRequest<QuizResultSummary>('/quiz/evaluate', {
      method: 'POST',
      body: JSON.stringify({ quizId, answers }),
    }),
};

export function mapQuizQuestions(
  questions: Array<{
    questionId: string;
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
    conceptId: string | null;
    conceptTitle: string;
  }>
): QuizQuestion[] {
  return questions.map((q) => ({
    id: q.questionId,
    question: q.question,
    options: q.options,
    correctIndex: q.correctIndex,
    explanation: q.explanation,
    conceptId: q.conceptId || '',
    conceptTitle: q.conceptTitle || '',
  }));
}
