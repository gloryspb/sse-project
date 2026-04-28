import { apiRequest } from '@/api/client';
import type { AuthFormValues, AuthResponse, User } from '@/types/auth';

export function register(payload: AuthFormValues) {
  return apiRequest<AuthResponse>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function login(payload: AuthFormValues) {
  return apiRequest<AuthResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function getCurrentUser() {
  return apiRequest<User>('/api/auth/me');
}

export function logout() {
  return apiRequest<{ message: string }>('/api/auth/logout', {
    method: 'POST',
  });
}
