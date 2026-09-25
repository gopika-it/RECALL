import bcrypt from 'bcryptjs';
import type { Request, Response } from 'express';
import { query } from '../config/db.js';
import { signToken } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';
import { getProfileStats } from '../services/progress/progressService.js';
import { ok } from '../utils/response.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const register = asyncHandler(async (req: Request, res: Response) => {
  const name = String(req.body.name || '').trim();
  const email = String(req.body.email || '').trim().toLowerCase();
  const password = String(req.body.password || '');
  if (!name || !email || password.length < 6) {
    throw new AppError(400, 'INVALID_INPUT', 'Name, email, and a password of at least 6 characters are required');
  }
  const existing = await query('SELECT id FROM users WHERE email = $1', [email]);
  if (existing.rowCount) {
    throw new AppError(409, 'EMAIL_TAKEN', 'An account with this email already exists');
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const created = await query<{ id: string; name: string; email: string }>(
    `INSERT INTO users (name, email, password_hash) VALUES ($1,$2,$3) RETURNING id, name, email`,
    [name, email, passwordHash]
  );
  const user = created.rows[0];
  const token = signToken(user);
  return ok(res, { token, user }, 'Account created', 201);
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const email = String(req.body.email || '').trim().toLowerCase();
  const password = String(req.body.password || '');
  const found = await query<{ id: string; name: string; email: string; password_hash: string }>(
    'SELECT id, name, email, password_hash FROM users WHERE email = $1',
    [email]
  );
  if (!found.rowCount) {
    throw new AppError(401, 'INVALID_CREDENTIALS', 'Invalid email or password');
  }
  const user = found.rows[0];
  const matches = await bcrypt.compare(password, user.password_hash);
  if (!matches) {
    throw new AppError(401, 'INVALID_CREDENTIALS', 'Invalid email or password');
  }
  const token = signToken({ id: user.id, name: user.name, email: user.email });
  return ok(res, { token, user: { id: user.id, name: user.name, email: user.email } }, 'Signed in');
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  const stats = await getProfileStats(req.user!.id);
  return ok(res, stats, 'Profile loaded');
});
