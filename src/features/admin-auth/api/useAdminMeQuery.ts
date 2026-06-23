'use client';
import { queryOptions, useQuery } from '@tanstack/react-query';
import { adminMe } from '@/entities/admin-auth';

export const adminMeQueryOptions = () =>
  queryOptions({
    queryKey: ['admin-me'] as const,
    queryFn: adminMe,
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

export const useAdminMeQuery = (options?: { enabled?: boolean }) =>
  useQuery({ ...adminMeQueryOptions(), ...options });
