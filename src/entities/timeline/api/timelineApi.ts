import { queryOptions } from '@tanstack/react-query';
import { axiosInstance, ApiError, authAwareRetry } from '@/shared/api';
import type { TimelineItem } from '../model/types';

/**
 * 연혁(타임라인) API 호출 실패를 나타내는 도메인 에러.
 * 공통 판별(`isAuthError` 등)은 베이스 {@link ApiError}에서 제공한다.
 */
export class TimelineApiError extends ApiError {}

/**
 * 연혁(타임라인) 관련 TanStack Query 키 팩토리(단일 출처).
 */
export const timelineKeys = {
  all: ['timelines'] as const,
};

/**
 * 연혁 목록을 가져온다.
 * GET /timelines — 공개 엔드포인트, year desc → month desc → createdAt desc 서버 정렬.
 */
export async function getTimelineList(): Promise<TimelineItem[]> {
  const { data } = await axiosInstance.get<TimelineItem[]>('/timelines');
  return data;
}

/**
 * 연혁 목록 TanStack Query 옵션.
 * staleTime 5분.
 */
export function timelineListQueryOptions() {
  return queryOptions({
    queryKey: timelineKeys.all,
    queryFn: getTimelineList,
    staleTime: 1000 * 60 * 5,
    retry: authAwareRetry,
  });
}
