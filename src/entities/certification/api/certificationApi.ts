import axios from 'axios';
import { queryOptions } from '@tanstack/react-query';
import { axiosInstance, ApiError, authAwareRetry } from '@/shared/api';
import type { Certification } from '../model/types';
import { certificationKeys } from './certificationKeys';

// NOTE: 서버 페처(getCertificationListServer)는 'use cache'(next/cache)를 사용하는
// 서버 전용 모듈에서만 노출한다. 이 모듈은 클라이언트 배럴(index.ts)로 re-export되므로
// 여기서 재노출하면 next/cache가 클라이언트 번들로 끌려온다(PR #119 회귀).

/** 인증서·특허증 API 에러. 베이스 {@link ApiError}를 상속만 한다(공통 판별은 베이스 제공). */
export class CertificationApiError extends ApiError {}

/**
 * 인증서·특허증 공개 목록을 가져온다(클라이언트 소비용).
 * GET /certifications — order ASC로 백엔드가 정렬해 반환한다.
 */
export async function getCertificationList(): Promise<Certification[]> {
  try {
    const { data } =
      await axiosInstance.get<Certification[]>('/certifications');
    return data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status ?? 0;
      throw new CertificationApiError(
        status,
        status === 0
          ? '네트워크 오류로 인증 정보를 불러오지 못했습니다.'
          : '인증 정보를 불러오는 데 실패했습니다.',
      );
    }
    throw new CertificationApiError(
      0,
      '네트워크 오류로 인증 정보를 불러오지 못했습니다.',
    );
  }
}

/**
 * 인증서·특허증 목록 TanStack Query 옵션.
 * 데이터 페칭의 주 경로는 서버(server.ts)이며, 이 옵션은 클라이언트 소비 경로용이다.
 */
export function certificationListQueryOptions() {
  return queryOptions({
    queryKey: certificationKeys.all,
    queryFn: getCertificationList,
    staleTime: 1000 * 60 * 5, // 5분
    retry: authAwareRetry,
  });
}

/**
 * 어드민 인증서·특허증 목록을 브라우저에서 직접 호출한다.
 *
 * admin 전용 엔드포인트(GET /certifications/admin, JWT 보호)를 사용한다. 이 엔드포인트는
 * 백엔드가 `Cache-Control: no-store`로 응답하므로 어드민이 이미지를 삭제(204)·추가(201)한
 * 직후 다시 요청해도 브라우저 HTTP 캐시를 거치지 않고 항상 최신 목록을 반환한다.
 * (공개 GET /certifications는 max-age=60 캐시가 걸려 낡은 목록을 돌려줄 수 있어 별도 경로를 쓴다.)
 *
 * 응답 형태는 공개 목록과 동일한 Certification[](order ASC 정렬)이다.
 * 어드민 화면(클라이언트 컴포넌트) 전용 — 서버에서 호출하지 않는다.
 */
export async function getAdminCertificationList(): Promise<Certification[]> {
  try {
    const { data } =
      await axiosInstance.get<Certification[]>('/certifications/admin');
    return data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status ?? 0;
      const message =
        status === 401 || status === 403
          ? '로그인이 필요합니다.'
          : status === 0
            ? '네트워크 오류로 인증 정보를 불러오지 못했습니다.'
            : '인증 정보를 불러오는 데 실패했습니다.';
      throw new CertificationApiError(status, message);
    }
    throw new CertificationApiError(
      0,
      '네트워크 오류로 인증 정보를 불러오지 못했습니다.',
    );
  }
}

/**
 * 어드민 인증서·특허증 목록 TanStack Query 옵션.
 * 삭제/추가 직후 항상 최신 목록을 보여야 하므로 staleTime을 0으로 둔다.
 * queryFn이 admin 전용 엔드포인트(GET /certifications/admin, no-store)를 호출해 항상 최신을 반환한다.
 */
export function adminCertificationListQueryOptions() {
  return queryOptions({
    queryKey: certificationKeys.admin,
    queryFn: getAdminCertificationList,
    staleTime: 0,
    retry: authAwareRetry,
  });
}
