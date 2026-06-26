import { queryOptions } from '@tanstack/react-query';
import { axiosInstance, ApiError, authAwareRetry } from '@/shared/api';
import type { TeamImage } from '../model/types';

/**
 * 팀 이미지 API 호출 실패를 나타내는 도메인 에러.
 * 공통 판별(`isAuthError` 등)은 베이스 {@link ApiError}에서 제공한다.
 */
export class TeamImageApiError extends ApiError {}

/**
 * 팀 이미지 관련 TanStack Query 키 팩토리(단일 출처).
 */
export const teamImageKeys = {
  all: ['team-images'] as const,
};

/**
 * 팀 이미지 목록을 가져온다.
 * GET /team-images — 공개 엔드포인트, order ASC 정렬.
 */
export async function getTeamImageList(): Promise<TeamImage[]> {
  const { data } = await axiosInstance.get<TeamImage[]>('/team-images');
  return data;
}

/**
 * 팀 이미지 목록 TanStack Query 옵션.
 * staleTime 5분.
 */
export function teamImageListQueryOptions() {
  return queryOptions({
    queryKey: teamImageKeys.all,
    queryFn: getTeamImageList,
    staleTime: 1000 * 60 * 5,
    retry: authAwareRetry,
  });
}
