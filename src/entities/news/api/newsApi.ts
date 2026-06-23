import axios from 'axios';
import { queryOptions } from '@tanstack/react-query';
import { axiosInstance, ApiError, authAwareRetry } from '@/shared/api';
import type { NewsListResponse, NewsPost } from '../model/types';

/**
 * 어드민 뉴스 관련 TanStack Query 키의 단일 출처(팩토리).
 * `invalidateQueries`는 prefix 부분 일치로 동작하므로,
 * 목록 전체 무효화는 `adminNewsKeys.all`만으로 충분하다.
 */
export const adminNewsKeys = {
  all: ['admin-news'] as const,
  list: (page: number, limit: number) =>
    [...adminNewsKeys.all, { page, limit }] as const,
};

/**
 * 어드민 뉴스 API 호출 실패를 나타내는 에러.
 * 공통 판별(`isAuthError` 등)은 베이스 {@link ApiError}에서 제공한다.
 */
export class AdminNewsApiError extends ApiError {}

export async function getNewsList(
  page: number = 1,
  limit: number = 10,
): Promise<NewsListResponse> {
  try {
    const { data } = await axiosInstance.get<NewsListResponse>('/news', {
      params: { page, limit },
    });
    return data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      throw new AdminNewsApiError(
        err.response?.status ?? 0,
        '뉴스 목록을 불러오는 데 실패했습니다.',
      );
    }
    throw new AdminNewsApiError(0, '네트워크 오류');
  }
}

/**
 * 어드민 뉴스 목록을 브라우저에서 직접 호출한다.
 * axiosInstance는 withCredentials: true이므로 쿠키가 자동 전송된다.
 * 실패 시 상태코드를 담은 {@link AdminNewsApiError}를 throw한다.
 * (클라이언트 컴포넌트 전용 — 서버에서 호출하지 않는다.)
 */
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

/**
 * 어드민 뉴스 목록 TanStack Query 옵션.
 * 인증 의존 데이터이므로 staleTime을 0으로 두고, 인증 실패(401/403)는 재시도하지 않는다.
 */
export function adminNewsQueryOptions(page: number = 1, limit: number = 100) {
  return queryOptions({
    queryKey: adminNewsKeys.list(page, limit),
    queryFn: () => getAdminNewsList(page, limit),
    staleTime: 0,
    retry: authAwareRetry,
  });
}

export async function getNewsPost(id: string): Promise<NewsPost> {
  try {
    const { data } = await axiosInstance.get<NewsPost>(`/news/${id}`);
    return data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      throw new AdminNewsApiError(
        err.response?.status ?? 0,
        '뉴스 상세를 불러오는 데 실패했습니다.',
      );
    }
    throw new AdminNewsApiError(0, '네트워크 오류');
  }
}
