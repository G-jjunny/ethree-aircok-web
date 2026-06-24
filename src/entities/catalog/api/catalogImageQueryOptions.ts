// TODO(contract): backend-leader 카탈로그 API 계약 확정 후 엔드포인트/응답 형태 동기화
//   - 공개 목록:  GET /catalog/images           → { data: CatalogImage[] }
//   - 어드민 목록: GET /catalog/images/admin (잠정) → { data: CatalogImage[] }
import axios from 'axios';
import { queryOptions } from '@tanstack/react-query';
import { axiosInstance, ApiError, authAwareRetry } from '@/shared/api';
import type { CatalogImage, CatalogImageListResponse } from '../model/types';

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
 * `invalidateQueries`는 prefix 부분 일치로 동작한다.
 */
export const catalogKeys = {
  all: ['catalog-images'] as const,
  adminAll: ['admin-catalog-images'] as const,
};

/**
 * 공개 카탈로그 이미지 목록을 가져온다.
 * 서버 컴포넌트와 클라이언트 컴포넌트 모두에서 호출 가능하다.
 * 응답 `{ data: CatalogImage[] }`를 order 오름차순 정렬해 반환한다.
 */
export async function getCatalogImageList(): Promise<CatalogImage[]> {
  try {
    const { data } = await axios.get<CatalogImageListResponse>(
      `${getApiBaseUrl()}/catalog/images`,
      { timeout: 10000 },
    );
    return [...data.data].sort((a, b) => a.order - b.order);
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
 * 공개 카탈로그 이미지 목록 TanStack Query 옵션.
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

/**
 * 어드민 카탈로그 이미지 목록을 브라우저에서 직접 호출한다.
 * axiosInstance는 withCredentials: true이므로 쿠키가 자동 전송된다.
 * (클라이언트 컴포넌트 전용 — 서버에서 호출하지 않는다.)
 */
export async function getAdminCatalogImageList(): Promise<CatalogImage[]> {
  try {
    // TODO(contract): 어드민 전용 엔드포인트가 확정되면 경로 교정.
    const { data } = await axiosInstance.get<CatalogImageListResponse>(
      '/catalog/images/admin',
    );
    return [...data.data].sort((a, b) => a.order - b.order);
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status ?? 0;
      const message =
        status === 401 || status === 403
          ? '로그인이 필요합니다.'
          : status === 0
            ? '네트워크 오류로 카탈로그 이미지를 불러오지 못했습니다.'
            : '어드민 카탈로그 이미지를 불러오는 데 실패했습니다.';
      throw new CatalogApiError(status, message);
    }
    throw new CatalogApiError(0, '네트워크 오류로 카탈로그 이미지를 불러오지 못했습니다.');
  }
}

/**
 * 어드민 카탈로그 이미지 목록 TanStack Query 옵션.
 * 인증 의존 데이터이므로 staleTime을 0으로 두고, 인증 실패(401/403)는 재시도하지 않는다.
 */
export function adminCatalogImageListQueryOptions() {
  return queryOptions({
    queryKey: catalogKeys.adminAll,
    queryFn: getAdminCatalogImageList,
    staleTime: 0,
    retry: authAwareRetry,
  });
}
