# RECALL Backend

Node.js + Express RAG backend for the existing RECALL React app.

```text
Existing RECALL UI  →  REST API  →  Express
                                    →  PostgreSQL + pgvector
                                    →  Extract → Chunk → Embed → Retrieve → LLM
```

## 1. Architecture

- Auth: JWT, bcrypt
- Upload: multer, user-scoped files
- Ingestion: PDF (pdfjs), TXT/MD, optional Gemini image OCR
- Embeddings: Gemini `text-embedding-004` or OpenAI embeddings
- Retrieval: cosine distance via pgvector, always filtered by `user_id` and optionally `material_id`
- RAG: grounded answers with sources
- Knowledge: LLM concept extraction into `concepts` / relationships / cards
- Quiz: grounded generation + evaluation into performance tables
- Progress: mastery only after at least 3 attempts

## 2. Requirements

- Node.js 20+
- Docker (recommended) or local PostgreSQL 16 with pgvector
- Gemini or OpenAI API key for embeddings + LLM

## 3. PostgreSQL + pgvector

From `backend/`:

```bash
docker compose up -d
```

This starts `pgvector/pgvector:pg16` as database `recall` on port `5432`.

Manual install:

1. Install PostgreSQL 16
2. Install [pgvector](https://github.com/pgvector/pgvector)
3. `CREATE DATABASE recall;`
4. Backend startup runs `migrations/001_init.sql` (`CREATE EXTENSION vector`)

## 4. Environment

Copy `.env.example` to `.env`:

```env
PORT=5000
CLIENT_URL=http://localhost:3000
DATABASE_URL=postgres://recall:recall@localhost:5432/recall
JWT_SECRET=change-this-to-a-long-random-secret
LLM_PROVIDER=gemini
LLM_API_KEY=
LLM_MODEL=gemini-2.0-flash
EMBEDDING_MODEL=text-embedding-004
EMBEDDING_DIMENSIONS=768
ALLOW_GENERAL_FALLBACK=false
UPLOAD_DIR=./uploads
MAX_UPLOAD_MB=50
```

`GEMINI_API_KEY` is accepted as an alias for `LLM_API_KEY`.

Never commit `.env`.

## 5. Install and run

```bash
cd backend
npm install
cp .env.example .env
# put your LLM key in .env
npm run dev
```

Health:

```bash
curl http://localhost:5000/api/health
```

Expected:

```json
{
  "success": true,
  "data": { "status": "ok", "database": { "connected": true, "pgvector": true } },
  "message": "RECALL backend is running"
}
```

## 6. Frontend

From the repo root:

```bash
npm install
```

Create `.env.local`:

```env
VITE_API_URL=http://localhost:5000/api
```

```bash
npm run dev
```

Vite runs on port 3000.

## 7. API

All successful responses:

```json
{ "success": true, "data": {}, "message": "..." }
```

Errors:

```json
{ "success": false, "error": { "code": "MATERIAL_NOT_FOUND", "message": "Material not found" } }
```

| Method | Path | Auth | Purpose |
|---|---|---|---|
| GET | `/api/health` | no | Liveness + DB |
| POST | `/api/auth/register` | no | Create user |
| POST | `/api/auth/login` | no | JWT |
| GET | `/api/auth/me` | yes | Profile stats |
| POST | `/api/materials/upload` | yes | `multipart/form-data` field `file` |
| POST | `/api/materials/notes` | yes | `{ title, content }` |
| GET | `/api/materials` | yes | User materials |
| GET | `/api/materials/:id` | yes | One material |
| GET | `/api/materials/:id/status` | yes | Processing status |
| DELETE | `/api/materials/:id` | yes | Delete |
| POST | `/api/chat` | yes | RAG tutor |
| GET | `/api/chat/:conversationId` | yes | History |
| POST | `/api/search` | yes | Vector search |
| POST | `/api/knowledge/generate` | yes | Re-run extraction |
| GET | `/api/knowledge/:materialId` | yes | Cards + relationships |
| GET | `/api/concepts` | yes | All concepts |
| GET | `/api/concepts/:id` | yes | One concept |
| GET | `/api/concepts/:id/related` | yes | Related |
| POST | `/api/quiz/generate` | yes | Quiz |
| POST | `/api/quiz/evaluate` | yes | Score + mastery |
| GET | `/api/progress` | yes | Memory analysis |
| GET | `/api/revision` | yes | Focused revision |
| POST | `/api/revision/rate` | yes | Remembered / unsure |

### Upload

`POST /api/materials/upload` with `file`.

Statuses: `uploaded`, `processing`, `extracting`, `chunking`, `embedding`, `generating_knowledge`, `completed`, `failed`.

Poll `GET /api/materials/:id/status`.

### Chat

```json
{
  "materialId": "...",
  "conversationId": "...",
  "question": "Explain deadlock simply",
  "action": "explain_simply"
}
```

Actions: `explain_simply`, `give_example`, `compare`, `why`, `summarize`, `generate_quiz`.

`generate_quiz` calls the quiz generator rather than faking a quiz in chat text.

### Quiz

```json
{
  "materialId": "...",
  "concept": "Deadlock",
  "numberOfQuestions": 5,
  "difficulty": "medium",
  "type": "concept"
}
```

Evaluate:

```json
{
  "quizId": "...",
  "answers": [{ "questionId": "...", "selectedIndex": 1 }]
}
```

## 8. Schema

See `migrations/001_init.sql`.

Core chain: `users → materials → chunks (embedding) → concepts → concept_relationships`.

Learning: `conversations/messages`, `quizzes/questions`, `quiz_results/question_results`, `concept_performance`, `revision_items`.

Every data query includes `user_id`. Material-specific RAG also filters `material_id`.

## 9. Pipelines

Upload: validate → store file → material row → extract → clean → chunk (page metadata) → embed → pgvector → extract concepts.

RAG: question → embed → top-k chunks for that user/material → prompt → LLM → sources → persist messages.

Mastery: `null` until 3 recorded attempts. No random percentages.

## 10. Testing checklist

1. `npm run dev` in `backend/`
2. `GET /api/health`
3. Docker Postgres + pgvector
4. Register two users; confirm isolation
5. Upload a PDF
6. Poll status to `completed`
7. Ask a question that is in the PDF; confirm page sources
8. Ask something absent; confirm the model does not pretend it is in the file
9. Upload a second PDF and chat with material A; B chunks must not appear
10. Generate and evaluate a quiz
11. New user sees empty Home / Knowledge / Quiz / Profile zeros
12. Browser back through Capture → Processing → Knowledge

## 11. Troubleshooting

**Database connection failed**  
Start `docker compose up -d` and check `DATABASE_URL`.

**pgvector missing**  
Use the `pgvector/pgvector:pg16` image, not vanilla Postgres.

**LLM_NOT_CONFIGURED**  
Set `LLM_API_KEY` or `GEMINI_API_KEY`.

**Empty PDF**  
Scanned PDFs need OCR. Upload a text PDF, or an image with OCR enabled and Gemini configured.

**Embeddings dimension error**  
`EMBEDDING_DIMENSIONS` must stay 768 unless you change the migration vector size.
