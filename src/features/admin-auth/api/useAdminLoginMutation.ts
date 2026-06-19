'use client';
import { useMutation } from '@tanstack/react-query';
import { adminLogin } from '@/entities/admin-auth';
import type { LoginBody } from '@/entities/admin-auth';

export const useAdminLoginMutation = () =>
  useMutation({
    mutationFn: (body: LoginBody) => adminLogin(body),
  });
