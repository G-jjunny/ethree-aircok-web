import { queryOptions } from '@tanstack/react-query';
import { axiosInstance, ApiError, authAwareRetry } from '@/shared/api';
import type { CoreValue } from '../model/types';

/**
 * 핵심가치 API 호출 실패를 나타내는 도메인 에러.
 * 공통 판별(`isAuthError` 등)은 베이스 {@link ApiError}에서 제공한다.
 */
export class CoreValueApiError extends ApiError {}

/**
 * 핵심가치 관련 TanStack Query 키 팩토리(단일 출처).
 */
export const coreValueKeys = {
  all: ['core-values'] as const,
};

/**
 * 핵심가치 목록을 가져온다.
 * GET /core-values — 공개 엔드포인트, order ASC, createdAt ASC 정렬.
 */
export async function getCoreValueList(): Promise<CoreValue[]> {
  const { data } = await axiosInstance.get<CoreValue[]>('/core-values');
  return data;
}

/**
 * 핵심가치 목록 TanStack Query 옵션.
 * staleTime 5분.
 */
export function coreValueListQueryOptions() {
  return queryOptions({
    queryKey: coreValueKeys.all,
    queryFn: getCoreValueList,
    staleTime: 1000 * 60 * 5,
    retry: authAwareRetry,
  });
}
