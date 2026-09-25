import type { Response } from 'express';

export function ok(res: Response, data: unknown, message: string, status = 200) {
  return res.status(status).json({ success: true, data, message });
}

export function fail(res: Response, status: number, code: string, message: string) {
  return res.status(status).json({
    success: false,
    error: { code, message },
  });
}
