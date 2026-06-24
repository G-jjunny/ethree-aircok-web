import axios from 'axios';
import { queryOptions } from '@tanstack/react-query';
import { ApiError, authAwareRetry } from '@/shared/api';
import type { CatalogImage } from '../model/types';

/**
 * 서버/클라이언트 환경에 따라 API baseURL을 반환한다.
 *
 * Next.js rewrites는 브라우저 → Next.js 인바운드 요청에만 적용되므로,
 * 서버 컴포넌트에서는 NestJS를 직접 가리키는 절대 URL을 사용한다.
 * (News의 getApiBaseUrl 패턴과 동일.)
 */
function getApiBaseUrl(): string {
  if (typeof window === 'undefined') {
    return process.env.API_URL ?? 'http://localhost:3001/api';
  }
  return '/api';
}

/**
 * 카탈로그 API 호출 실패를 나타내는 도메인 에러.
 * 공통 판별(`isAuthError` 등)은 베이스 {@link ApiError}에서 제공한다.
 */
export class CatalogApiError extends ApiError {}

/**
 * 카탈로그 이미지 관련 TanStack Query 키 팩토리(단일 출처).
 * 공개/어드민 모두 동일 GET /catalog 엔드포인트를 사용하므로 단일 키로 통일한다.
 * `invalidateQueries`는 prefix 부분 일치로 동작한다.
 */
export const catalogKeys = {
  all: ['catalog'] as const,
};

/**
 * 카탈로그 이미지 목록을 가져온다.
 * 공개/어드민 공용 — 동일 GET /catalog 엔드포인트(배열 직접 반환).
 * 서버 컴포넌트와 클라이언트 컴포넌트 모두에서 호출 가능하다.
 * order 오름차순, 동순위는 createdAt 오름차순으로 정렬해 반환한다.
 */
export async function getCatalogImageList(): Promise<CatalogImage[]> {
  try {
    const { data } = await axios.get<CatalogImage[]>(
      `${getApiBaseUrl()}/catalog`,
      { timeout: 10000 },
    );
    return [...data].sort(
      (a, b) =>
        a.order - b.order || (a.createdAt ?? '').localeCompare(b.createdAt ?? ''),
    );
  } catch (err) {
    if (axios.isAxiosError(err)) {
      throw new CatalogApiError(
        err.response?.status ?? 0,
        '카탈로그 이미지를 불러오는 데 실패했습니다.',
      );
    }
    throw new CatalogApiError(0, '네트워크 오류');
  }
}

/**
 * 카탈로그 이미지 목록 TanStack Query 옵션(공개/어드민 공용).
 * 서버/클라이언트 양쪽에서 호출 가능. staleTime 5분.
 */
export function catalogImageListQueryOptions() {
  return queryOptions({
    queryKey: catalogKeys.all,
    queryFn: getCatalogImageList,
    staleTime: 1000 * 60 * 5, // 5분
    retry: authAwareRetry,
  });
}
