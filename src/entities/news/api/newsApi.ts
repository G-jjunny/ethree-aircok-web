'use client';

import axios from 'axios';
import { queryOptions } from '@tanstack/react-query';
import { axiosInstance, authAwareRetry } from '@/shared/api';
import type { NewsListResponse } from '../model/types';
import { NewsApiError, getNewsList, getNewsPost } from './newsServerFetch';

export { NewsApiError, getNewsList, getNewsPost };

export class AdminNewsApiError extends NewsApiError {}

export const adminNewsKeys = {
  all: ['admin-news'] as const,
  list: (page: number, limit: number) =>
    [...adminNewsKeys.all, { page, limit }] as const,
};

export const newsKeys = {
  all: ['news'] as const,
  list: (page: number, limit: number) =>
    [...newsKeys.all, { page, limit }] as const,
  detail: (id: string) => [...newsKeys.all, id] as const,
};

export function newsListQueryOptions(page: number = 1, limit: number = 10) {
  return queryOptions({
    queryKey: newsKeys.list(page, limit),
    queryFn: () => getNewsList(page, limit),
    staleTime: 1000 * 60 * 5,
  });
}

export async function getAdminNewsList(
  page: number = 1,
  limit: number = 100,
): Promise<NewsListResponse> {
  try {
    const { data } = await axiosInstance.get<NewsListResponse>('/news/admin', {
      params: { page, limit },
    });
    return data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status ?? 0;
      const message =
        status === 401 || status === 403
          ? '로그인이 필요합니다.'
          : status === 0
            ? '네트워크 오류로 뉴스 목록을 불러오지 못했습니다.'
            : '어드민 뉴스 목록을 불러오는 데 실패했습니다.';
      throw new AdminNewsApiError(status, message);
    }
    throw new AdminNewsApiError(0, '네트워크 오류로 뉴스 목록을 불러오지 못했습니다.');
  }
}

export function adminNewsQueryOptions(page: number = 1, limit: number = 100) {
  return queryOptions({
    queryKey: adminNewsKeys.list(page, limit),
    queryFn: () => getAdminNewsList(page, limit),
    staleTime: 0,
    retry: authAwareRetry,
  });
}
