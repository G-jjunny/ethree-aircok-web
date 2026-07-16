import axios from 'axios';
import { ApiError } from '@/shared/api';
import type { TimelineItem } from '../model/types';

/**
 * 서버 컴포넌트 전용 연혁(타임라인) 조회 실패 에러.
 * 공통 판별(`isAuthError` 등)은 베이스 {@link ApiError}에서 제공한다.
 */
export class TimelineServerApiError extends ApiError {}

/** 연혁 캐시 태그. 어드민 연혁 편집 뮤테이션 후 updateTag로 무효화한다. */
export const TIMELINE_CACHE_TAG = 'timeline';

/**
 * 서버/클라이언트 환경에 따라 API baseURL을 반환한다.
 * 서버 컴포넌트에서는 NestJS를 직접 가리키는 절대 URL을 사용한다(news 패턴).
 */
function getApiBaseUrl(): string {
  if (typeof window === 'undefined') {
    return process.env.API_URL ?? 'http://localhost:3001/api';
  }
  return '/api';
}

/**
 * 연혁 목록을 가져온다(서버 컴포넌트 안전).
 * GET /timelines — year desc → month desc → createdAt desc 서버 정렬.
 */
export async function getTimelineListServer(): Promise<TimelineItem[]> {
  try {
    const { data } = await axios.get<TimelineItem[]>(
      `${getApiBaseUrl()}/timelines`,
      { timeout: 10000 },
    );
    return data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      throw new TimelineServerApiError(
        err.response?.status ?? 0,
        '연혁 목록을 불러오는 데 실패했습니다.',
      );
    }
    throw new TimelineServerApiError(0, '네트워크 오류');
  }
}
