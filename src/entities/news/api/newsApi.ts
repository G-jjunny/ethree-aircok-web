'use client';

import axios from 'axios';
import { queryOptions } from '@tanstack/react-query';
import { axiosInstance, ApiError, authAwareRetry } from '@/shared/api';
import type { NewsListResponse } from '../model/types';

// NOTE: 서버 페처(getNewsList/getNewsPost)는 'use cache'(next/cache)를 사용하는 서버 전용
// 모듈(newsServerFetch)에서만 노출한다. 이 'use client' 모듈에서 재노출하면 next/cache가
// 클라이언트 번들로 끌려오므로 재노출하지 않는다(FE-4).

/** 어드민 뉴스 API 에러. 베이스 {@link ApiError}를 상속만 한다. */
export class AdminNewsApiError extends ApiError {}

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
    // 클라이언트 소비용 — 공개 목록 GET을 axiosInstance로 호출한다.
    // (서버 컴포넌트는 newsServerFetch의 'use cache' getNewsList를 사용)
    queryFn: async () => {
      const { data } = await axiosInstance.get<NewsListResponse>('/news', {
        params: { page, limit },
      });
      return data;
    },
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
