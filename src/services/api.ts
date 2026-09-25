const TOKEN_KEY = 'recall_token';

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string | null) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

export class ApiError extends Error {
  code: string;
  status: number;
  constructor(message: string, code = 'API_ERROR', status = 500) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

interface Envelope<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: { code: string; message: string };
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit & { timeoutMs?: number } = {}
): Promise<T> {
  const token = getToken();
  const headers = new Headers(options.headers);
  if (!(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  if (token) headers.set('Authorization', `Bearer ${token}`);

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), options.timeoutMs || 120000);

  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers,
      signal: controller.signal,
    });
  } catch (err) {
    clearTimeout(timer);
    throw new ApiError('Cannot reach the RECALL backend. Is it running?', 'NETWORK_ERROR', 0);
  }
  clearTimeout(timer);

  const json = (await response.json().catch(() => null)) as Envelope<T> | null;
  if (!json) {
    throw new ApiError('Unexpected response from the server', 'INVALID_RESPONSE', response.status);
  }
  if (!json.success) {
    throw new ApiError(json.error?.message || 'Request failed', json.error?.code || 'API_ERROR', response.status);
  }
  return json.data;
}
