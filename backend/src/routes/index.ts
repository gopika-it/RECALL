import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { migrate, verifyDatabase } from '../config/db.js';
import { ok } from '../utils/response.js';
import { requireAuth } from '../middleware/auth.js';
import * as auth from '../controllers/authController.js';
import * as materials from '../controllers/materialsController.js';
import * as learning from '../controllers/learningController.js';
import * as quiz from '../controllers/quizController.js';

export const router = Router();

router.get(
  '/health',
  asyncHandler(async (_req, res) => {
    let db = { connected: false, pgvector: false };
    try {
      db = await verifyDatabase();
    } catch {
      db = { connected: false, pgvector: false };
    }
    return ok(
      res,
      { status: 'ok', database: db },
      'RECALL backend is running'
    );
  })
);

router.post('/auth/register', auth.register);
router.post('/auth/login', auth.login);
router.get('/auth/me', requireAuth, auth.me);

router.post('/materials/upload', requireAuth, materials.uploadMiddleware.single('file'), materials.uploadMaterial);
router.post('/materials/notes', requireAuth, materials.uploadNotes);
router.get('/materials', requireAuth, materials.listMaterials);
router.get('/materials/:id', requireAuth, materials.getMaterial);
router.get('/materials/:id/status', requireAuth, materials.getMaterialStatus);
router.delete('/materials/:id', requireAuth, materials.deleteMaterial);

router.post('/chat', requireAuth, learning.chat);
router.get('/chat/:conversationId', requireAuth, learning.conversation);
router.post('/search', requireAuth, learning.search);

router.post('/knowledge/generate', requireAuth, learning.generateKnowledge);
router.get('/knowledge/:materialId', requireAuth, learning.knowledgeForMaterial);
router.get('/concepts', requireAuth, learning.listConcepts);
router.get('/concepts/:id', requireAuth, learning.getConcept);
router.get('/concepts/:id/related', requireAuth, learning.relatedConcepts);

router.post('/quiz/generate', requireAuth, quiz.createQuiz);
router.post('/quiz/evaluate', requireAuth, quiz.evaluate);

router.get('/progress', requireAuth, quiz.progress);
router.get('/revision', requireAuth, quiz.revision);
router.post('/revision/rate', requireAuth, quiz.revisionRate);

void migrate;
