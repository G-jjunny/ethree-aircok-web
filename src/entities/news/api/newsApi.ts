import axios from 'axios';
import { queryOptions } from '@tanstack/react-query';
import { axiosInstance, ApiError, authAwareRetry } from '@/shared/api';
import type { NewsListResponse, NewsPost } from '../model/types';

/**
 * 서버/클라이언트 환경에 따라 API baseURL을 반환한다.
 * 서버 컴포넌트에서는 상대 URL을 사용할 수 없으므로 절대 URL이 필요하다.
 */
function getApiBaseUrl(): string {
  if (typeof window === 'undefined') {
    // 서버 사이드: 절대 URL 필요
    return process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/api';
  }
  // 클라이언트 사이드: 상대 URL 가능
  return '/api';
}

/**
 * 공개 뉴스 API 호출 실패를 나타내는 에러.
 * 공통 판별(`isAuthError` 등)은 베이스 {@link ApiError}에서 제공한다.
 */
export class NewsApiError extends ApiError {}

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
 * 공개 뉴스 관련 TanStack Query 키 팩토리.
 */
export const newsKeys = {
  all: ['news'] as const,
  list: (page: number, limit: number) =>
    [...newsKeys.all, { page, limit }] as const,
  detail: (id: string) => [...newsKeys.all, id] as const,
};

/**
 * 어드민 뉴스 API 호출 실패를 나타내는 에러.
 * 공통 판별(`isAuthError` 등)은 베이스 {@link ApiError}에서 제공한다.
 */
export class AdminNewsApiError extends ApiError {}

/**
 * 공개 뉴스 목록을 가져온다.
 * 서버 컴포넌트와 클라이언트 컴포넌트 모두에서 호출 가능하다.
 * 서버에서는 절대 URL을, 클라이언트에서는 상대 URL을 사용한다.
 */
export async function getNewsList(
  page: number = 1,
  limit: number = 10,
): Promise<NewsListResponse> {
  try {
    const { data } = await axios.get<NewsListResponse>(
      `${getApiBaseUrl()}/news`,
      { params: { page, limit }, timeout: 10000 },
    );
    return data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      throw new NewsApiError(
        err.response?.status ?? 0,
        '뉴스 목록을 불러오는 데 실패했습니다.',
      );
    }
    throw new NewsApiError(0, '네트워크 오류');
  }
}

/**
 * 공개 뉴스 목록 TanStack Query 옵션.
 * 클라이언트 컴포넌트에서 useQuery와 함께 사용한다.
 */
export function newsListQueryOptions(page: number = 1, limit: number = 10) {
  return queryOptions({
    queryKey: newsKeys.list(page, limit),
    queryFn: () => getNewsList(page, limit),
    staleTime: 1000 * 60 * 5, // 5분
  });
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

/**
 * 공개 뉴스 상세를 가져온다.
 * 서버 컴포넌트와 클라이언트 컴포넌트 모두에서 호출 가능하다.
 * 서버에서는 절대 URL을, 클라이언트에서는 상대 URL을 사용한다.
 */
export async function getNewsPost(id: string): Promise<NewsPost> {
  try {
    const { data } = await axios.get<NewsPost>(
      `${getApiBaseUrl()}/news/${id}`,
      { timeout: 10000 },
    );
    return data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      throw new NewsApiError(
        err.response?.status ?? 0,
        '뉴스 상세를 불러오는 데 실패했습니다.',
      );
    }
    throw new NewsApiError(0, '네트워크 오류');
  }
}
