import type { Request, Response } from 'express';
import { generateQuiz, evaluateQuiz } from '../services/quiz/quizService.js';
import { getProgress, getRevision, recordRevisionRating } from '../services/progress/progressService.js';
import { AppError } from '../middleware/errorHandler.js';
import { ok } from '../utils/response.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const createQuiz = asyncHandler(async (req: Request, res: Response) => {
  const data = await generateQuiz({
    userId: req.user!.id,
    materialId: req.body.materialId,
    conceptId: req.body.conceptId,
    concept: req.body.concept,
    numberOfQuestions: req.body.numberOfQuestions,
    difficulty: req.body.difficulty,
    type: req.body.type,
  });
  return ok(res, data, 'Quiz generated successfully');
});

export const evaluate = asyncHandler(async (req: Request, res: Response) => {
  const quizId = String(req.body.quizId || '');
  const answers = Array.isArray(req.body.answers) ? req.body.answers : [];
  if (!quizId) throw new AppError(400, 'INVALID_INPUT', 'quizId is required');
  const data = await evaluateQuiz({
    userId: req.user!.id,
    quizId,
    answers,
  });
  return ok(res, data, 'Quiz evaluated');
});

export const progress = asyncHandler(async (req: Request, res: Response) => {
  const data = await getProgress(req.user!.id);
  return ok(res, data, 'Progress loaded');
});

export const revision = asyncHandler(async (req: Request, res: Response) => {
  const data = await getRevision(req.user!.id);
  return ok(res, data, 'Revision loaded');
});

export const revisionRate = asyncHandler(async (req: Request, res: Response) => {
  const conceptId = String(req.body.conceptId || '');
  if (!conceptId) throw new AppError(400, 'INVALID_INPUT', 'conceptId is required');
  await recordRevisionRating(req.user!.id, conceptId, Boolean(req.body.remembered));
  return ok(res, { conceptId }, 'Revision recorded');
});
