import apiClient from '@/shared/lib/axios';

export interface AdminUser {
  id: string;
  username: string;
}

export interface LoginBody {
  username: string;
  password: string;
}

export const adminLogin = (body: LoginBody) =>
  apiClient.post<{ user: AdminUser }>('/api/auth/login', body).then((r) => r.data);

export const adminLogout = () =>
  apiClient.post<void>('/api/auth/logout').then((r) => r.data);

export const adminMe = () =>
  apiClient.get<{ user: AdminUser }>('/api/auth/me').then((r) => r.data);
