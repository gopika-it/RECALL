import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import { router } from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';
import { fail } from './utils/response.js';

export const app = express();

app.use(
  cors({
    origin: env.clientUrl.split(',').map((s) => s.trim()),
    credentials: true,
  })
);
app.use(express.json({ limit: '2mb' }));
app.use('/api', router);
app.use((_req, res) => fail(res, 404, 'NOT_FOUND', 'Endpoint not found'));
app.use(errorHandler);
