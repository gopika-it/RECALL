import { apiRequest } from './api';
import { UserProfile } from '../types';

export const authApi = {
  register: (body: { name: string; email: string; password: string }) =>
    apiRequest<{ token: string; user: { id: string; name: string; email: string } }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  login: (body: { email: string; password: string }) =>
    apiRequest<{ token: string; user: { id: string; name: string; email: string } }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  me: () => apiRequest<UserProfile>('/auth/me'),
};
