import { queryOptions } from '@tanstack/react-query';
import type { NewsListResponse, NewsPost } from '../model/types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

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
 * `status`로 인증 실패(401/403)와 일반 실패를 구분한다.
 */
export class AdminNewsApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'AdminNewsApiError';
    this.status = status;
  }

  /** 인증/인가 실패 여부 (로그인 필요) */
  get isAuthError(): boolean {
    return this.status === 401 || this.status === 403;
  }
}

export async function getNewsList(
  page: number = 1,
  limit: number = 10,
): Promise<NewsListResponse> {
  const res = await fetch(
    `${API_BASE}/api/news?page=${page}&limit=${limit}`,
    { cache: 'no-store' },
  );
  if (!res.ok) throw new Error('뉴스 목록을 불러오는 데 실패했습니다.');
  return res.json() as Promise<NewsListResponse>;
}

/**
 * 어드민 뉴스 목록을 브라우저에서 직접 호출한다.
 * `credentials: 'include'`로 access_token 쿠키를 전송하며,
 * 실패 시 상태코드를 담은 {@link AdminNewsApiError}를 throw한다.
 * (클라이언트 컴포넌트 전용 — 서버에서 호출하지 않는다.)
 */
export async function getAdminNewsList(
  page: number = 1,
  limit: number = 100,
): Promise<NewsListResponse> {
  let res: Response;
  try {
    res = await fetch(
      `${API_BASE}/api/news/admin?page=${page}&limit=${limit}`,
      {
        cache: 'no-store',
        credentials: 'include',
      },
    );
  } catch {
    // 네트워크 단절 등 fetch 자체 실패
    throw new AdminNewsApiError(0, '네트워크 오류로 뉴스 목록을 불러오지 못했습니다.');
  }

  if (!res.ok) {
    const message =
      res.status === 401 || res.status === 403
        ? '로그인이 필요합니다.'
        : '어드민 뉴스 목록을 불러오는 데 실패했습니다.';
    throw new AdminNewsApiError(res.status, message);
  }

  return res.json() as Promise<NewsListResponse>;
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
    retry: (failureCount, error) => {
      if (error instanceof AdminNewsApiError && error.isAuthError) return false;
      return failureCount < 1;
    },
  });
}

export async function getNewsPost(id: string): Promise<NewsPost> {
  const res = await fetch(`${API_BASE}/api/news/${id}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('뉴스 상세를 불러오는 데 실패했습니다.');
  return res.json() as Promise<NewsPost>;
}
