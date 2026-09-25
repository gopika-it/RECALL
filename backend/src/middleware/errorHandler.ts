import type { NextFunction, Request, Response } from 'express';
import { fail } from '../utils/response.js';

export class AppError extends Error {
  status: number;
  code: string;

  constructor(status: number, code: string, message: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof AppError) {
    return fail(res, err.status, err.code, err.message);
  }

  const message = err instanceof Error ? err.message : 'Unexpected server error';
  console.error(err);
  return fail(res, 500, 'INTERNAL_ERROR', message);
}
