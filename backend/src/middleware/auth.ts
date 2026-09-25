import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { fail } from '../utils/response.js';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  if (!token) {
    return fail(res, 401, 'UNAUTHORIZED', 'Authentication required');
  }

  try {
    const payload = jwt.verify(token, env.jwtSecret) as AuthUser & { sub?: string };
    req.user = {
      id: payload.id || payload.sub || '',
      email: payload.email,
      name: payload.name,
    };
    if (!req.user.id) {
      return fail(res, 401, 'UNAUTHORIZED', 'Invalid token');
    }
    next();
  } catch {
    return fail(res, 401, 'UNAUTHORIZED', 'Invalid or expired token');
  }
}

export function signToken(user: AuthUser): string {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn as jwt.SignOptions['expiresIn'] }
  );
}
