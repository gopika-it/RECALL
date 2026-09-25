import { query } from '../../config/db.js';
import { generateText, parseJsonFromLlm } from '../llm/llmService.js';

interface ExtractedConcept {
  title: string;
  topic?: string;
  summary: string;
  keyPoints: string[];
  simpleExample?: string;
  quickRecallQuestion?: string;
  quickRecallAnswer?: string;
  category?: string;
  relatedTitles?: string[];
}

export async function extractKnowledge(params: {
  userId: string;
  materialId: string;
  title: string;
  sampleText: string;
}): Promise<{ conceptCount: number; titles: string[] }> {
  const prompt = `Extract the actual concepts taught in this study material titled "${params.title}".
Return JSON only:
{
  "concepts": [
    {
      "title": "",
      "topic": "",
      "summary": "",
      "keyPoints": ["", ""],
      "simpleExample": "",
      "quickRecallQuestion": "",
      "quickRecallAnswer": "",
      "category": "",
      "relatedTitles": [""]
    }
  ]
}
Rules:
- Only include concepts that appear in the material.
- 4 to 12 concepts unless the material is very short.
- Do not invent unrelated topics.

Material excerpt:
${params.sampleText.slice(0, 14000)}`;

  const raw = await generateText(prompt);
  const parsed = parseJsonFromLlm<{ concepts: ExtractedConcept[] }>(raw);
  const concepts = (parsed.concepts || []).filter((c) => c.title && c.summary).slice(0, 16);

  await query('DELETE FROM concept_relationships WHERE material_id = $1 AND user_id = $2', [
    params.materialId,
    params.userId,
  ]);
  await query('DELETE FROM knowledge_cards WHERE material_id = $1 AND user_id = $2', [
    params.materialId,
    params.userId,
  ]);
  await query('DELETE FROM concepts WHERE material_id = $1 AND user_id = $2', [
    params.materialId,
    params.userId,
  ]);

  const inserted: Array<{ id: string; title: string; relatedTitles: string[] }> = [];
  for (const concept of concepts) {
    const result = await query<{ id: string }>(
      `INSERT INTO concepts (
        user_id, material_id, title, topic, summary, key_points, simple_example,
        quick_recall_question, quick_recall_answer, category
      ) VALUES ($1,$2,$3,$4,$5,$6::jsonb,$7,$8,$9,$10)
      RETURNING id`,
      [
        params.userId,
        params.materialId,
        concept.title,
        concept.topic || params.title,
        concept.summary,
        JSON.stringify(concept.keyPoints || []),
        concept.simpleExample || '',
        concept.quickRecallQuestion || '',
        concept.quickRecallAnswer || '',
        concept.category || concept.topic || 'General',
      ]
    );
    const id = result.rows[0].id;
    inserted.push({ id, title: concept.title, relatedTitles: concept.relatedTitles || [] });
    await query(
      `INSERT INTO knowledge_cards (user_id, material_id, concept_id, title, body)
       VALUES ($1,$2,$3,$4,$5::jsonb)`,
      [
        params.userId,
        params.materialId,
        id,
        concept.title,
        JSON.stringify({
          summary: concept.summary,
          keyPoints: concept.keyPoints || [],
          simpleExample: concept.simpleExample || '',
        }),
      ]
    );
  }

  for (const concept of inserted) {
    for (const relatedTitle of concept.relatedTitles) {
      const related = inserted.find(
        (other) => other.id !== concept.id && other.title.toLowerCase() === relatedTitle.toLowerCase()
      );
      if (!related) continue;
      await query(
        `INSERT INTO concept_relationships (user_id, material_id, concept_id, related_concept_id, relationship_type)
         VALUES ($1,$2,$3,$4,'related')
         ON CONFLICT DO NOTHING`,
        [params.userId, params.materialId, concept.id, related.id]
      );
    }
  }

  await query('UPDATE materials SET concept_count = $1, updated_at = NOW() WHERE id = $2 AND user_id = $3', [
    inserted.length,
    params.materialId,
    params.userId,
  ]);

  return { conceptCount: inserted.length, titles: inserted.map((c) => c.title) };
}
