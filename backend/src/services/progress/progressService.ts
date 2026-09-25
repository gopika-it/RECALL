import { query } from '../../config/db.js';
import { computeMastery, masteryStatus } from './mastery.js';

export async function getProgress(userId: string) {
  const concepts = await query<{
    id: string;
    title: string;
    topic: string;
    material_id: string;
    attempts: number;
    correct_count: number;
    last_reviewed_at: string | null;
    perf_attempts: number | null;
    perf_correct: number | null;
  }>(
    `SELECT c.id, c.title, c.topic, c.material_id, c.attempts, c.correct_count, c.last_reviewed_at,
            p.attempts AS perf_attempts, p.correct AS perf_correct
     FROM concepts c
     LEFT JOIN concept_performance p ON p.concept_id = c.id AND p.user_id = c.user_id
     WHERE c.user_id = $1
     ORDER BY c.created_at DESC`,
    [userId]
  );

  const mapped = concepts.rows.map((c) => {
    const attempts = c.perf_attempts ?? c.attempts;
    const correct = c.perf_correct ?? c.correct_count;
    const mastery = computeMastery(attempts, correct);
    return {
      id: c.id,
      title: c.title,
      topic: c.topic,
      materialId: c.material_id,
      attempts,
      mastery,
      status: masteryStatus(mastery),
      lastReviewed: c.last_reviewed_at,
    };
  });

  const withData = mapped.filter((c) => c.mastery !== null);
  const overall = withData.length
    ? Math.round(withData.reduce((sum, c) => sum + (c.mastery || 0), 0) / withData.length)
    : null;

  return {
    overallProgress: overall,
    conceptCount: mapped.length,
    strong: mapped.filter((c) => c.status === 'strong'),
    needsPractice: mapped.filter((c) => c.status === 'needs_practice'),
    forgettingSoon: mapped.filter((c) => c.status === 'forgetting_soon'),
    insufficientData: mapped.filter((c) => c.status === 'unknown'),
  };
}

export async function getRevision(userId: string) {
  const progress = await getProgress(userId);
  const due = [...progress.forgettingSoon, ...progress.needsPractice].slice(0, 8);
  return {
    concepts: due,
    count: due.length,
    estimatedMinutes: Math.max(0, due.length * 2),
  };
}

export async function getProfileStats(userId: string) {
  const user = await query<{
    name: string;
    email: string;
    xp: number;
    streak_days: number;
  }>('SELECT name, email, xp, streak_days FROM users WHERE id = $1', [userId]);
  const concepts = await query('SELECT COUNT(*)::int AS n FROM concepts WHERE user_id = $1', [userId]);
  const quizzes = await query('SELECT COUNT(*)::int AS n FROM quiz_results WHERE user_id = $1', [userId]);
  const progress = await getProgress(userId);
  return {
    name: user.rows[0]?.name || '',
    email: user.rows[0]?.email || '',
    conceptsCount: concepts.rows[0]?.n || 0,
    quizzesCount: quizzes.rows[0]?.n || 0,
    xp: user.rows[0]?.xp || 0,
    streakDays: user.rows[0]?.streak_days || 0,
    retentionRate: progress.overallProgress,
  };
}

export async function recordRevisionRating(userId: string, conceptId: string, remembered: boolean) {
  const owned = await query('SELECT id FROM concepts WHERE id = $1 AND user_id = $2', [conceptId, userId]);
  if (!owned.rowCount) return;
  await query(
    `INSERT INTO concept_performance (user_id, concept_id, attempts, correct, incorrect, last_result_at)
     VALUES ($1,$2,1,$3,$4,NOW())
     ON CONFLICT (user_id, concept_id)
     DO UPDATE SET
       attempts = concept_performance.attempts + 1,
       correct = concept_performance.correct + EXCLUDED.correct,
       incorrect = concept_performance.incorrect + EXCLUDED.incorrect,
       last_result_at = NOW()`,
    [userId, conceptId, remembered ? 1 : 0, remembered ? 0 : 1]
  );
  await query(
    `UPDATE concepts
     SET attempts = attempts + 1, correct_count = correct_count + $3, last_reviewed_at = NOW(), updated_at = NOW()
     WHERE id = $1 AND user_id = $2`,
    [conceptId, userId, remembered ? 1 : 0]
  );
  await query(
    `UPDATE users SET
       last_activity_date = CURRENT_DATE,
       streak_days = CASE
         WHEN last_activity_date = CURRENT_DATE THEN streak_days
         WHEN last_activity_date = CURRENT_DATE - 1 THEN streak_days + 1
         ELSE 1
       END
     WHERE id = $1`,
    [userId]
  );
}
