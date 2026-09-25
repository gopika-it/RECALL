import { query } from '../../config/db.js';
import { AppError } from '../../middleware/errorHandler.js';
import { retrieveChunks } from '../retrieval/retrievalService.js';
import { generateGroundedAnswer } from '../rag/ragService.js';
import { generateQuiz } from '../quiz/quizService.js';

export async function sendChat(params: {
  userId: string;
  materialId: string;
  conversationId?: string;
  question: string;
  action?: string;
  conceptId?: string;
}) {
  const material = await query<{ id: string; title: string; original_filename: string }>(
    'SELECT id, title, original_filename FROM materials WHERE id = $1 AND user_id = $2',
    [params.materialId, params.userId]
  );
  if (!material.rowCount) {
    throw new AppError(404, 'MATERIAL_NOT_FOUND', 'Material not found');
  }

  let conversationId = params.conversationId;
  if (conversationId) {
    const existing = await query(
      'SELECT id FROM conversations WHERE id = $1 AND user_id = $2 AND material_id = $3',
      [conversationId, params.userId, params.materialId]
    );
    if (!existing.rowCount) {
      throw new AppError(404, 'CONVERSATION_NOT_FOUND', 'Conversation not found');
    }
  } else {
    const created = await query<{ id: string }>(
      `INSERT INTO conversations (user_id, material_id, concept_id)
       VALUES ($1,$2,$3) RETURNING id`,
      [params.userId, params.materialId, params.conceptId || null]
    );
    conversationId = created.rows[0].id;
  }

  if (params.action === 'generate_quiz') {
    const quiz = await generateQuiz({
      userId: params.userId,
      materialId: params.materialId,
      conceptId: params.conceptId,
      numberOfQuestions: 5,
      type: 'concept',
    });
    const content = `I created a ${quiz.questions.length}-question quiz from this material. Open Quiz to start it.`;
    await persistMessages(conversationId!, params.userId, params.question, params.action, content, []);
    return {
      conversationId,
      quizId: quiz.quizId,
      message: {
        id: 'quiz-handoff',
        role: 'assistant',
        content,
        sources: [],
        quizId: quiz.quizId,
        questions: quiz.questions,
      },
    };
  }

  const history = await query<{ role: string; content: string }>(
    `SELECT role, content FROM messages WHERE conversation_id = $1 AND user_id = $2 ORDER BY created_at ASC`,
    [conversationId, params.userId]
  );

  const chunks = await retrieveChunks({
    userId: params.userId,
    materialId: params.materialId,
    query: params.question,
    k: 6,
  });

  const rag = await generateGroundedAnswer({
    question: params.question,
    action: params.action,
    materialTitle: material.rows[0].original_filename || material.rows[0].title,
    history: history.rows,
    chunks,
  });

  const stored = await persistMessages(
    conversationId!,
    params.userId,
    params.question,
    params.action,
    rag.answer,
    rag.sources
  );

  return {
    conversationId,
    message: {
      id: stored.assistantId,
      role: 'assistant',
      content: rag.answer,
      sources: rag.sources,
    },
  };
}

async function persistMessages(
  conversationId: string,
  userId: string,
  question: string,
  action: string | undefined,
  answer: string,
  sources: unknown
) {
  await query(
    `INSERT INTO messages (conversation_id, user_id, role, content, action, sources)
     VALUES ($1,$2,'user',$3,$4,'[]'::jsonb)`,
    [conversationId, userId, question, action || null]
  );
  const assistant = await query<{ id: string }>(
    `INSERT INTO messages (conversation_id, user_id, role, content, action, sources)
     VALUES ($1,$2,'assistant',$3,$4,$5::jsonb)
     RETURNING id`,
    [conversationId, userId, answer, action || null, JSON.stringify(sources)]
  );
  await query(`UPDATE conversations SET updated_at = NOW() WHERE id = $1 AND user_id = $2`, [
    conversationId,
    userId,
  ]);
  return { assistantId: assistant.rows[0].id };
}

export async function getConversation(userId: string, conversationId: string) {
  const convo = await query(
    'SELECT id, material_id, concept_id FROM conversations WHERE id = $1 AND user_id = $2',
    [conversationId, userId]
  );
  if (!convo.rowCount) throw new AppError(404, 'CONVERSATION_NOT_FOUND', 'Conversation not found');
  const messages = await query(
    `SELECT id, role, content, sources, created_at
     FROM messages WHERE conversation_id = $1 AND user_id = $2
     ORDER BY created_at ASC`,
    [conversationId, userId]
  );
  return { ...convo.rows[0], messages: messages.rows };
}
