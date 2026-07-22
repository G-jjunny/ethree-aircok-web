import { axiosInstance } from '@/shared/api';

export interface AdminUser {
  id: string;
  username: string;
}

export interface LoginBody {
  username: string;
  password: string;
}

export const adminLogin = (body: LoginBody) =>
  axiosInstance.post<{ user: AdminUser }>('/auth/login', body).then((r) => r.data);

export const adminLogout = () =>
  axiosInstance.post<void>('/auth/logout').then((r) => r.data);

export const adminMe = () =>
  axiosInstance.get<{ user: AdminUser }>('/auth/me').then((r) => r.data);
