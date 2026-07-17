import axios from 'axios';
import { queryOptions } from '@tanstack/react-query';
import { axiosInstance, ApiError, authAwareRetry } from '@/shared/api';
import type { ServiceReview } from '../model/types';
import { serviceReviewKeys } from './serviceReviewKeys';

// NOTE: 서버 페처(getServiceReviewListServer)는 'use cache'(next/cache)를 사용하는
// 서버 전용 모듈에서만 노출한다. 이 모듈은 클라이언트 배럴(index.ts)로 re-export되므로
// 여기서 재노출하면 next/cache가 클라이언트 번들로 끌려온다(PR #119 회귀).

/** 진단 서비스 후기 API 에러. 베이스 {@link ApiError}를 상속만 한다(공통 판별은 베이스 제공). */
export class ServiceReviewApiError extends ApiError {}

/**
 * 진단 서비스 후기 공개 목록을 가져온다(클라이언트 소비용).
 * GET /service-reviews — published === true·order ASC로 백엔드가 정렬해 반환한다.
 */
export async function getServiceReviewList(): Promise<ServiceReview[]> {
  try {
    const { data } =
      await axiosInstance.get<ServiceReview[]>('/service-reviews');
    return data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status ?? 0;
      throw new ServiceReviewApiError(
        status,
        status === 0
          ? '네트워크 오류로 진단 후기를 불러오지 못했습니다.'
          : '진단 후기를 불러오는 데 실패했습니다.',
      );
    }
    throw new ServiceReviewApiError(
      0,
      '네트워크 오류로 진단 후기를 불러오지 못했습니다.',
    );
  }
}

/**
 * 진단 서비스 후기 목록 TanStack Query 옵션.
 * 데이터 페칭의 주 경로는 서버(server.ts)이며, 이 옵션은 클라이언트 소비 경로용이다.
 */
export function serviceReviewListQueryOptions() {
  return queryOptions({
    queryKey: serviceReviewKeys.all,
    queryFn: getServiceReviewList,
    staleTime: 1000 * 60 * 5, // 5분
    retry: authAwareRetry,
  });
}

/**
 * 어드민 진단 후기 목록을 브라우저에서 직접 호출한다(미공개 포함 전체).
 * GET /service-reviews/admin — JWT 필요. axiosInstance는 withCredentials이므로 쿠키가 자동 전송된다.
 * 공개 GET과 필드 구성이 동일하므로 반환 타입도 ServiceReview[]로 같다(차이는 행 필터뿐).
 * 어드민 화면(클라이언트 컴포넌트) 전용 — 서버에서 호출하지 않는다.
 */
export async function getAdminServiceReviewList(): Promise<ServiceReview[]> {
  try {
    const { data } = await axiosInstance.get<ServiceReview[]>(
      '/service-reviews/admin',
    );
    return data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status ?? 0;
      const message =
        status === 401 || status === 403
          ? '로그인이 필요합니다.'
          : status === 0
            ? '네트워크 오류로 진단 후기를 불러오지 못했습니다.'
            : '진단 후기를 불러오는 데 실패했습니다.';
      throw new ServiceReviewApiError(status, message);
    }
    throw new ServiceReviewApiError(
      0,
      '네트워크 오류로 진단 후기를 불러오지 못했습니다.',
    );
  }
}

/**
 * 어드민 진단 후기 목록 TanStack Query 옵션.
 * 인증 의존 데이터이므로 staleTime을 0으로 두고, 인증 실패(401/403)는 재시도하지 않는다.
 */
export function adminServiceReviewListQueryOptions() {
  return queryOptions({
    queryKey: serviceReviewKeys.admin,
    queryFn: getAdminServiceReviewList,
    staleTime: 0,
    retry: authAwareRetry,
  });
}
