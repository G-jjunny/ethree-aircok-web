import { queryOptions } from '@tanstack/react-query';
import { axiosInstance, ApiError, authAwareRetry } from '@/shared/api';
import type { Partner } from '../model/types';

/**
 * 파트너 API 호출 실패를 나타내는 도메인 에러.
 * 공통 판별(`isAuthError` 등)은 베이스 {@link ApiError}에서 제공한다.
 */
export class PartnerApiError extends ApiError {}

/**
 * 파트너 관련 TanStack Query 키 팩토리(단일 출처).
 */
export const partnerKeys = {
  all: ['partners'] as const,
};

/**
 * 파트너 목록을 가져온다.
 * GET /partners — 공개 엔드포인트, order ASC 정렬.
 */
export async function getPartnerList(): Promise<Partner[]> {
  const { data } = await axiosInstance.get<Partner[]>('/partners');
  return data;
}

/**
 * 파트너 목록 TanStack Query 옵션.
 * staleTime 5분.
 */
export function partnerListQueryOptions() {
  return queryOptions({
    queryKey: partnerKeys.all,
    queryFn: getPartnerList,
    staleTime: 1000 * 60 * 5,
    retry: authAwareRetry,
  });
}
