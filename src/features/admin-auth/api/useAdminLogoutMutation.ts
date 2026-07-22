'use client';
import { useMutation } from '@tanstack/react-query';
import { adminLogout } from '@/entities/admin-auth';

export const useAdminLogoutMutation = () =>
  useMutation({
    mutationFn: adminLogout,
  });
