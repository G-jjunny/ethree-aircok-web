import { queryOptions } from '@tanstack/react-query';
import { axiosInstance, ApiError, authAwareRetry } from '@/shared/api';
import type { SiteInfo } from '../model/types';

/**
 * 사이트 정보 API 호출 실패를 나타내는 도메인 에러.
 * 공통 판별(`isAuthError` 등)은 베이스 {@link ApiError}에서 제공한다.
 */
export class SiteInfoApiError extends ApiError {}

/**
 * 사이트 정보 관련 TanStack Query 키 팩토리(단일 출처).
 */
export const siteInfoKeys = {
  all: ['site-info'] as const,
};

/**
 * 사이트 기본 정보를 가져온다.
 * GET /site-info — 공개 엔드포인트.
 */
export async function getSiteInfo(): Promise<SiteInfo> {
  const { data } = await axiosInstance.get<SiteInfo>('/site-info');
  return data;
}

/**
 * 사이트 정보 TanStack Query 옵션.
 * staleTime 5분.
 */
export function siteInfoQueryOptions() {
  return queryOptions({
    queryKey: siteInfoKeys.all,
    queryFn: getSiteInfo,
    staleTime: 1000 * 60 * 5,
    retry: authAwareRetry,
  });
}
