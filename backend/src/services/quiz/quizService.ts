import { query } from '../../config/db.js';
import { AppError } from '../../middleware/errorHandler.js';
import { generateText, parseJsonFromLlm } from '../llm/llmService.js';
import { retrieveChunks } from '../retrieval/retrievalService.js';
import { computeMastery } from '../progress/mastery.js';

const TYPE_MAP: Record<string, string> = {
  concept: 'concept',
  quick: 'quick_recall',
  quick_recall: 'quick_recall',
  deep: 'deep_practice',
  deep_practice: 'deep_practice',
  weak: 'weak_area',
  weak_area: 'weak_area',
  mixed: 'mixed',
};

export async function generateQuiz(params: {
  userId: string;
  materialId?: string;
  conceptId?: string;
  concept?: string;
  numberOfQuestions?: number;
  difficulty?: string;
  type?: string;
}) {
  const type = TYPE_MAP[params.type || 'concept'] || 'concept';
  const count = Math.min(10, Math.max(3, params.numberOfQuestions || 5));
  const difficulty = (params.difficulty || 'medium').toLowerCase();

  let materialId = params.materialId;
  let conceptTitle = params.concept || '';
  let conceptId = params.conceptId || null;

  if (conceptId) {
    const concept = await query<{ title: string; material_id: string }>(
      'SELECT title, material_id FROM concepts WHERE id = $1 AND user_id = $2',
      [conceptId, params.userId]
    );
    if (!concept.rowCount) throw new AppError(404, 'CONCEPT_NOT_FOUND', 'Concept not found');
    conceptTitle = concept.rows[0].title;
    materialId = materialId || concept.rows[0].material_id;
  }

  if (!materialId && type !== 'mixed' && type !== 'weak_area') {
    const latest = await query<{ id: string }>(
      `SELECT id FROM materials WHERE user_id = $1 AND status = 'completed' ORDER BY created_at DESC LIMIT 1`,
      [params.userId]
    );
    materialId = latest.rows[0]?.id;
  }

  if (!materialId && type !== 'mixed' && type !== 'weak_area') {
    throw new AppError(400, 'NO_MATERIAL', 'Upload a study material before generating a quiz');
  }

  if (type === 'weak_area' && !conceptTitle) {
    const weak = await query<{ id: string; title: string; material_id: string }>(
      `SELECT c.id, c.title, c.material_id
       FROM concepts c
       LEFT JOIN concept_performance p ON p.concept_id = c.id AND p.user_id = c.user_id
       WHERE c.user_id = $1 AND COALESCE(p.attempts, c.attempts, 0) >= 3
         AND (COALESCE(p.correct, c.correct_count, 0)::float / GREATEST(COALESCE(p.attempts, c.attempts, 1),1)) < 0.6
       ORDER BY COALESCE(p.last_result_at, c.last_reviewed_at) ASC NULLS FIRST
       LIMIT 1`,
      [params.userId]
    );
    if (weak.rowCount) {
      conceptId = weak.rows[0].id;
      conceptTitle = weak.rows[0].title;
      materialId = weak.rows[0].material_id;
    }
  }

  const queryText = conceptTitle || 'Generate practice questions from the core ideas in this material';
  const chunks = await retrieveChunks({
    userId: params.userId,
    query: queryText,
    materialId: type === 'mixed' ? undefined : materialId,
    k: 8,
  });

  if (!chunks.length) {
    throw new AppError(422, 'QUIZ_CONTEXT_EMPTY', 'Not enough indexed material to generate a quiz');
  }

  const context = chunks.map((c, i) => `[${i + 1} p.${c.pageNumber ?? '?'}] ${c.text}`).join('\n\n');
  const prompt = `Create ${count} multiple-choice questions from this study material.
Quiz type: ${type}. Difficulty: ${difficulty}. Focus concept: ${conceptTitle || 'mixed topics from the material'}.
Return JSON only:
{
  "questions": [
    {
      "question": "",
      "options": ["A","B","C","D"],
      "correctIndex": 0,
      "explanation": "",
      "conceptTitle": ""
    }
  ]
}
Rules:
- Use only the provided context.
- Exactly 4 options.
- correctIndex is 0-3.
Context:
${context}`;

  const parsed = parseJsonFromLlm<{
    questions: Array<{
      question: string;
      options: string[];
      correctIndex: number;
      explanation: string;
      conceptTitle?: string;
    }>;
  }>(await generateText(prompt));

  const questions = (parsed.questions || []).slice(0, count);
  if (questions.length < 1) {
    throw new AppError(502, 'QUIZ_GENERATION_FAILED', 'The model did not return quiz questions');
  }

  const quiz = await query<{ id: string }>(
    `INSERT INTO quizzes (user_id, material_id, concept_id, type, difficulty, status)
     VALUES ($1,$2,$3,$4,$5,'ready') RETURNING id`,
    [params.userId, materialId || null, conceptId, type, difficulty]
  );
  const quizId = quiz.rows[0].id;

  const saved = [];
  for (let i = 0; i < questions.length; i += 1) {
    const q = questions[i];
    const options = (q.options || []).slice(0, 4);
    while (options.length < 4) options.push('None of the above');
    const correctIndex = Math.min(3, Math.max(0, Number(q.correctIndex) || 0));
    const inserted = await query<{ id: string }>(
      `INSERT INTO questions (quiz_id, concept_id, question, options, correct_index, correct_answer, explanation, source, difficulty, position)
       VALUES ($1,$2,$3,$4::jsonb,$5,$6,$7,$8::jsonb,$9,$10)
       RETURNING id`,
      [
        quizId,
        conceptId,
        q.question,
        JSON.stringify(options),
        correctIndex,
        options[correctIndex],
        q.explanation || '',
        JSON.stringify({
          materialId,
          page: chunks[0]?.pageNumber ?? null,
          chunkId: chunks[0]?.id,
        }),
        difficulty,
        i,
      ]
    );
    saved.push({
      questionId: inserted.rows[0].id,
      question: q.question,
      options,
      correctAnswer: options[correctIndex],
      correctIndex,
      explanation: q.explanation || '',
      conceptId,
      conceptTitle: q.conceptTitle || conceptTitle,
      source: { materialId, page: chunks[0]?.pageNumber ?? null },
      difficulty,
    });
  }

  if (materialId) {
    await query(
      `UPDATE materials SET quiz_count = quiz_count + 1, updated_at = NOW() WHERE id = $1 AND user_id = $2`,
      [materialId, params.userId]
    );
  }

  return { quizId, questions: saved };
}

export async function evaluateQuiz(params: {
  userId: string;
  quizId: string;
  answers: Array<{ questionId: string; selectedIndex: number; timeMs?: number }>;
}) {
  const quiz = await query<{ id: string; material_id: string | null }>(
    'SELECT id, material_id FROM quizzes WHERE id = $1 AND user_id = $2',
    [params.quizId, params.userId]
  );
  if (!quiz.rowCount) throw new AppError(404, 'QUIZ_NOT_FOUND', 'Quiz not found');

  const questions = await query<{
    id: string;
    concept_id: string | null;
    correct_index: number;
    question: string;
    explanation: string;
  }>('SELECT id, concept_id, correct_index, question, explanation FROM questions WHERE quiz_id = $1 ORDER BY position', [
    params.quizId,
  ]);

  const answerMap = new Map(params.answers.map((a) => [a.questionId, a]));
  let score = 0;
  const questionResults: Array<{
    questionId: string;
    conceptId: string | null;
    isCorrect: boolean;
    selectedIndex: number;
  }> = [];

  for (const question of questions.rows) {
    const answer = answerMap.get(question.id);
    const selectedIndex = answer?.selectedIndex ?? -1;
    const isCorrect = selectedIndex === question.correct_index;
    if (isCorrect) score += 1;
    questionResults.push({
      questionId: question.id,
      conceptId: question.concept_id,
      isCorrect,
      selectedIndex,
    });
  }

  const total = questions.rowCount;
  const percentage = total ? Math.round((score / total) * 100) : 0;
  const result = await query<{ id: string }>(
    `INSERT INTO quiz_results (quiz_id, user_id, score, total, percentage)
     VALUES ($1,$2,$3,$4,$5) RETURNING id`,
    [params.quizId, params.userId, score, total, percentage]
  );

  const known: string[] = [];
  const review: string[] = [];

  for (const item of questionResults) {
    const q = questions.rows.find((row) => row.id === item.questionId);
    await query(
      `INSERT INTO question_results (quiz_result_id, question_id, concept_id, selected_index, is_correct, time_ms)
       VALUES ($1,$2,$3,$4,$5,$6)`,
      [
        result.rows[0].id,
        item.questionId,
        item.conceptId,
        item.selectedIndex,
        item.isCorrect,
        answerMap.get(item.questionId)?.timeMs ?? null,
      ]
    );
    if (item.conceptId) {
      await query(
        `INSERT INTO concept_performance (user_id, concept_id, attempts, correct, incorrect, last_result_at)
         VALUES ($1,$2,1,$3,$4,NOW())
         ON CONFLICT (user_id, concept_id)
         DO UPDATE SET
           attempts = concept_performance.attempts + 1,
           correct = concept_performance.correct + EXCLUDED.correct,
           incorrect = concept_performance.incorrect + EXCLUDED.incorrect,
           last_result_at = NOW()`,
        [params.userId, item.conceptId, item.isCorrect ? 1 : 0, item.isCorrect ? 0 : 1]
      );
      await query(
        `UPDATE concepts
         SET attempts = attempts + 1,
             correct_count = correct_count + $3,
             last_reviewed_at = NOW(),
             updated_at = NOW()
         WHERE id = $1 AND user_id = $2`,
        [item.conceptId, params.userId, item.isCorrect ? 1 : 0]
      );
    }
    if (item.isCorrect) known.push(q?.question.slice(0, 48) || 'Correct item');
    else review.push(q?.question.slice(0, 48) || 'Needs review');
  }

  await query(
    `UPDATE users SET
       xp = xp + $2,
       streak_days = CASE
         WHEN last_activity_date = CURRENT_DATE THEN streak_days
         WHEN last_activity_date = CURRENT_DATE - 1 THEN streak_days + 1
         ELSE 1
       END,
       last_activity_date = CURRENT_DATE,
       updated_at = NOW()
     WHERE id = $1`,
    [params.userId, score * 20]
  );

  const firstConcept = questionResults.find((r) => r.conceptId)?.conceptId;
  let masteryBefore: number | null = null;
  let masteryAfter: number | null = null;
  let conceptTitle = '';
  if (firstConcept) {
    const perf = await query<{ attempts: number; correct: number; title: string }>(
      `SELECT p.attempts, p.correct, c.title
       FROM concept_performance p
       JOIN concepts c ON c.id = p.concept_id
       WHERE p.user_id = $1 AND p.concept_id = $2`,
      [params.userId, firstConcept]
    );
    if (perf.rowCount) {
      conceptTitle = perf.rows[0].title;
      masteryAfter = computeMastery(perf.rows[0].attempts, perf.rows[0].correct);
      masteryBefore = computeMastery(Math.max(0, perf.rows[0].attempts - 1), Math.max(0, perf.rows[0].correct - (questionResults.find((r) => r.conceptId === firstConcept)?.isCorrect ? 1 : 0)));
    }
  }

  await query(`UPDATE quizzes SET status = 'completed' WHERE id = $1 AND user_id = $2`, [
    params.quizId,
    params.userId,
  ]);

  return {
    resultId: result.rows[0].id,
    score,
    total,
    percentage,
    masteryBefore,
    masteryAfter,
    conceptId: firstConcept || null,
    conceptTitle,
    whatYouKnow: known.slice(0, 4),
    needsReview: review.slice(0, 4),
  };
}
